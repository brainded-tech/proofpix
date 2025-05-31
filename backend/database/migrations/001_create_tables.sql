-- Migration 001: Create tables for Product Hunt launch
-- Revenue-critical database schema

-- Document Intelligence Usage Tracking Table
CREATE TABLE IF NOT EXISTS document_intelligence_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    document_id UUID,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
    documents_processed INTEGER DEFAULT 1,
    template_used VARCHAR(100),
    ai_analysis_type VARCHAR(50),
    processing_time_seconds DECIMAL(5,2),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    billable_amount DECIMAL(10,2) DEFAULT 0.00,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    -- Indexes for performance
    CONSTRAINT idx_user_timestamp PRIMARY KEY (user_id, timestamp),
    INDEX idx_plan_type (plan_type),
    INDEX idx_billing_period (user_id, DATE(timestamp)),
    INDEX idx_template_usage (template_used),
    INDEX idx_ai_analysis (ai_analysis_type)
);

-- Revenue Events Table
CREATE TABLE IF NOT EXISTS revenue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('subscription', 'overage', 'upgrade', 'ai_analysis', 'document_processing')),
    source VARCHAR(100) NOT NULL CHECK (source IN ('document_intelligence', 'metadata_removal', 'batch_processing', 'subscription')),
    billing_period VARCHAR(20), -- Format: YYYY-MM
    transaction_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    
    -- Indexes for revenue analytics
    INDEX idx_user_revenue (user_id, timestamp),
    INDEX idx_plan_revenue (plan_type, timestamp),
    INDEX idx_source_revenue (source, timestamp),
    INDEX idx_billing_period (billing_period),
    INDEX idx_event_type (event_type, timestamp),
    
    -- Unique constraint for transaction IDs
    UNIQUE (transaction_id)
);

-- Analytics Events Table for Product Hunt Launch Tracking
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    timestamp TIMESTAMP NOT NULL,
    properties JSONB,
    session_id VARCHAR(100),
    source VARCHAR(50) DEFAULT 'web',
    user_agent TEXT,
    ip_address INET,
    revenue_impact DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for analytics queries
    INDEX idx_event_type_timestamp (event_type, timestamp),
    INDEX idx_user_events (user_id, timestamp),
    INDEX idx_source_events (source, timestamp),
    INDEX idx_session_events (session_id),
    INDEX idx_revenue_events (revenue_impact, timestamp),
    
    -- Partial index for Product Hunt events
    INDEX idx_product_hunt_events (timestamp) WHERE properties->>'source' = 'product_hunt'
);

-- User Plans Table (if not exists)
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'starter',
    monthly_quota INTEGER NOT NULL DEFAULT 10,
    features JSONB DEFAULT '{}',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    subscription_start DATE DEFAULT CURRENT_DATE,
    subscription_end DATE,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_plan (user_id),
    INDEX idx_plan_type_active (plan_type) WHERE subscription_end IS NULL OR subscription_end > CURRENT_DATE
);

-- Usage Quotas View for Real-time Checking
CREATE OR REPLACE VIEW user_usage_summary AS
SELECT 
    up.user_id,
    up.plan_type,
    up.monthly_quota,
    COALESCE(current_usage.documents_this_month, 0) as documents_this_month,
    COALESCE(current_usage.total_spent, 0) as total_spent_this_month,
    (up.monthly_quota - COALESCE(current_usage.documents_this_month, 0)) as remaining_quota,
    CASE 
        WHEN COALESCE(current_usage.documents_this_month, 0) >= up.monthly_quota THEN true 
        ELSE false 
    END as quota_exceeded
FROM user_plans up
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as documents_this_month,
        SUM(billable_amount) as total_spent
    FROM document_intelligence_usage 
    WHERE DATE_TRUNC('month', timestamp) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY user_id
) current_usage ON up.user_id = current_usage.user_id;

-- Revenue Summary View for Dashboard
CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    plan_type,
    source,
    COUNT(*) as transaction_count,
    SUM(amount) as daily_revenue,
    COUNT(DISTINCT user_id) as unique_users
FROM revenue_events
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp), plan_type, source
ORDER BY date DESC;

-- Product Hunt Launch Metrics View
CREATE OR REPLACE VIEW product_hunt_metrics AS
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    COUNT(*) FILTER (WHERE event_type = 'user_signup') as signups,
    COUNT(*) FILTER (WHERE event_type = 'user_signup' AND properties->>'planSelected' IS NOT NULL) as conversions,
    SUM(revenue_impact) FILTER (WHERE event_type = 'user_signup') as signup_revenue,
    COUNT(*) FILTER (WHERE event_type = 'document_processed') as documents_processed,
    SUM(revenue_impact) FILTER (WHERE event_type = 'document_processed') as processing_revenue
FROM analytics_events
WHERE properties->>'source' = 'product_hunt'
AND DATE(timestamp) = CURRENT_DATE
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour;

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_plans_updated_at 
    BEFORE UPDATE ON user_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default plan types
INSERT INTO user_plans (user_id, plan_type, monthly_quota, features) VALUES
('00000000-0000-0000-0000-000000000001', 'starter', 10, '{"aiAnalysis": false, "industryTemplates": false}'),
('00000000-0000-0000-0000-000000000002', 'professional', 100, '{"aiAnalysis": true, "industryTemplates": true}'),
('00000000-0000-0000-0000-000000000003', 'enterprise', 1000, '{"aiAnalysis": true, "industryTemplates": true, "customBranding": true}')
ON CONFLICT (user_id) DO NOTHING;

-- Create indexes for performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_usage_monthly 
ON document_intelligence_usage (user_id, DATE_TRUNC('month', timestamp));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_revenue_monthly 
ON revenue_events (user_id, DATE_TRUNC('month', timestamp));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_daily 
ON analytics_events (DATE_TRUNC('day', timestamp), event_type);

-- Grant permissions (adjust based on your user setup)
GRANT SELECT, INSERT, UPDATE ON document_intelligence_usage TO app_user;
GRANT SELECT, INSERT, UPDATE ON revenue_events TO app_user;
GRANT SELECT, INSERT, UPDATE ON analytics_events TO app_user;
GRANT SELECT, UPDATE ON user_plans TO app_user;
GRANT SELECT ON user_usage_summary TO app_user;
GRANT SELECT ON revenue_summary TO app_user;
GRANT SELECT ON product_hunt_metrics TO app_user;

-- Migration complete
SELECT 'Migration 001 completed successfully' as status; 