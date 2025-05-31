-- Create usage_tracking table for monitoring user activity and quotas
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Usage type and details
    usage_type VARCHAR(50) NOT NULL CHECK (usage_type IN ('api_call', 'file_upload', 'processing', 'storage', 'download', 'template_generation')),
    resource_type VARCHAR(50), -- 'image', 'video', 'document', etc.
    
    -- Quantitative metrics
    quantity INTEGER NOT NULL DEFAULT 1,
    size_bytes BIGINT DEFAULT 0,
    processing_time_seconds INTEGER DEFAULT 0,
    
    -- API specific tracking
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    response_time_ms INTEGER,
    
    -- File specific tracking
    file_id UUID,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size_bytes BIGINT,
    
    -- Processing specific tracking
    operation VARCHAR(100), -- 'watermark_add', 'resize', 'compress', etc.
    input_format VARCHAR(50),
    output_format VARCHAR(50),
    quality_setting VARCHAR(20),
    
    -- Billing period tracking
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    
    -- Cost and pricing
    cost_credits DECIMAL(10,4) DEFAULT 0.0000,
    cost_usd DECIMAL(10,4) DEFAULT 0.0000,
    
    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    
    -- Geographic data
    country_code VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Error tracking
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance and analytics
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_subscription_id ON usage_tracking(subscription_id);
CREATE INDEX idx_usage_tracking_usage_type ON usage_tracking(usage_type);
CREATE INDEX idx_usage_tracking_created_at ON usage_tracking(created_at);
CREATE INDEX idx_usage_tracking_billing_period ON usage_tracking(billing_period_start, billing_period_end);

-- Composite indexes for common queries
CREATE INDEX idx_usage_tracking_user_type_date ON usage_tracking(user_id, usage_type, created_at);
CREATE INDEX idx_usage_tracking_user_billing_period ON usage_tracking(user_id, billing_period_start, billing_period_end);
CREATE INDEX idx_usage_tracking_endpoint_date ON usage_tracking(endpoint, created_at) WHERE endpoint IS NOT NULL;

-- Partial indexes for specific usage types
CREATE INDEX idx_usage_tracking_api_calls ON usage_tracking(user_id, created_at, response_time_ms) WHERE usage_type = 'api_call';
CREATE INDEX idx_usage_tracking_file_uploads ON usage_tracking(user_id, created_at, file_size_bytes) WHERE usage_type = 'file_upload';
CREATE INDEX idx_usage_tracking_processing ON usage_tracking(user_id, created_at, processing_time_seconds) WHERE usage_type = 'processing';

-- Index for error tracking and monitoring
CREATE INDEX idx_usage_tracking_errors ON usage_tracking(created_at, error_code) WHERE error_code IS NOT NULL;

-- Create materialized view for monthly usage aggregation
CREATE MATERIALIZED VIEW monthly_usage_summary AS
SELECT 
    user_id,
    subscription_id,
    usage_type,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_count,
    SUM(quantity) as total_quantity,
    SUM(size_bytes) as total_size_bytes,
    SUM(processing_time_seconds) as total_processing_seconds,
    SUM(cost_credits) as total_cost_credits,
    SUM(cost_usd) as total_cost_usd,
    AVG(response_time_ms) as avg_response_time_ms,
    COUNT(*) FILTER (WHERE error_code IS NOT NULL) as error_count
FROM usage_tracking
GROUP BY user_id, subscription_id, usage_type, DATE_TRUNC('month', created_at);

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_monthly_usage_summary_unique 
ON monthly_usage_summary(user_id, usage_type, month);

-- Create indexes on materialized view
CREATE INDEX idx_monthly_usage_summary_user_month ON monthly_usage_summary(user_id, month);
CREATE INDEX idx_monthly_usage_summary_month ON monthly_usage_summary(month);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_monthly_usage_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_usage_summary;
END;
$$ LANGUAGE plpgsql;

-- Create daily usage aggregation view
CREATE VIEW daily_usage_summary AS
SELECT 
    user_id,
    subscription_id,
    usage_type,
    DATE_TRUNC('day', created_at) as day,
    COUNT(*) as total_count,
    SUM(quantity) as total_quantity,
    SUM(size_bytes) as total_size_bytes,
    SUM(processing_time_seconds) as total_processing_seconds,
    SUM(cost_credits) as total_cost_credits,
    SUM(cost_usd) as total_cost_usd,
    AVG(response_time_ms) as avg_response_time_ms,
    COUNT(*) FILTER (WHERE error_code IS NOT NULL) as error_count
FROM usage_tracking
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id, subscription_id, usage_type, DATE_TRUNC('day', created_at);

-- Create function to get current billing period usage
CREATE OR REPLACE FUNCTION get_current_period_usage(p_user_id UUID, p_usage_type VARCHAR DEFAULT NULL)
RETURNS TABLE (
    usage_type VARCHAR,
    total_count BIGINT,
    total_quantity BIGINT,
    total_size_bytes BIGINT,
    total_processing_seconds BIGINT,
    total_cost_credits DECIMAL,
    total_cost_usd DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.usage_type,
        COUNT(*)::BIGINT as total_count,
        SUM(ut.quantity)::BIGINT as total_quantity,
        SUM(ut.size_bytes)::BIGINT as total_size_bytes,
        SUM(ut.processing_time_seconds)::BIGINT as total_processing_seconds,
        SUM(ut.cost_credits) as total_cost_credits,
        SUM(ut.cost_usd) as total_cost_usd
    FROM usage_tracking ut
    JOIN subscriptions s ON ut.user_id = s.user_id
    WHERE ut.user_id = p_user_id
    AND ut.created_at >= s.current_period_start
    AND ut.created_at < s.current_period_end
    AND s.status IN ('active', 'trialing')
    AND (p_usage_type IS NULL OR ut.usage_type = p_usage_type)
    GROUP BY ut.usage_type;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user has exceeded quota
CREATE OR REPLACE FUNCTION check_usage_quota(p_user_id UUID, p_usage_type VARCHAR)
RETURNS TABLE (
    current_usage BIGINT,
    quota_limit INTEGER,
    percentage_used DECIMAL,
    quota_exceeded BOOLEAN
) AS $$
DECLARE
    v_current_usage BIGINT;
    v_quota_limit INTEGER;
BEGIN
    -- Get current usage
    SELECT COALESCE(SUM(quantity), 0) INTO v_current_usage
    FROM usage_tracking ut
    JOIN subscriptions s ON ut.user_id = s.user_id
    WHERE ut.user_id = p_user_id
    AND ut.usage_type = p_usage_type
    AND ut.created_at >= s.current_period_start
    AND ut.created_at < s.current_period_end
    AND s.status IN ('active', 'trialing');
    
    -- Get quota limit based on usage type
    SELECT 
        CASE p_usage_type
            WHEN 'api_call' THEN s.monthly_api_calls_limit
            WHEN 'file_upload' THEN s.monthly_file_uploads_limit
            WHEN 'processing' THEN s.monthly_processing_minutes_limit
            ELSE 0
        END INTO v_quota_limit
    FROM subscriptions s
    WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing');
    
    RETURN QUERY SELECT 
        v_current_usage,
        v_quota_limit,
        CASE WHEN v_quota_limit > 0 THEN (v_current_usage::DECIMAL / v_quota_limit * 100) ELSE 0 END,
        v_current_usage >= v_quota_limit;
END;
$$ LANGUAGE plpgsql; 