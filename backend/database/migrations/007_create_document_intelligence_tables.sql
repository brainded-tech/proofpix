-- Migration: Create Document Intelligence Tables
-- Description: Tables for document processing, AI analysis, and billing tracking
-- Version: 007
-- Date: 2024-12-19

-- Document Intelligence Usage Tracking
CREATE TABLE IF NOT EXISTS document_intelligence_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    documents_processed INTEGER DEFAULT 1,
    template_used VARCHAR(100),
    ai_analysis_type VARCHAR(100),
    processing_time_seconds DECIMAL(10,3),
    confidence_score DECIMAL(3,2),
    billable_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_doc_intel_user_id (user_id),
    INDEX idx_doc_intel_timestamp (timestamp),
    INDEX idx_doc_intel_plan_type (plan_type),
    INDEX idx_doc_intel_document_id (document_id),
    INDEX idx_doc_intel_monthly (user_id, DATE_TRUNC('month', timestamp))
);

-- Document Processing Results Storage
CREATE TABLE IF NOT EXISTS document_processing_results (
    id SERIAL PRIMARY KEY,
    process_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_filename VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    document_type VARCHAR(100),
    
    -- Extracted metadata
    metadata JSONB,
    
    -- OCR results
    ocr_text TEXT,
    ocr_confidence DECIMAL(5,2),
    ocr_language VARCHAR(10),
    
    -- AI analysis results
    ai_insights JSONB,
    
    -- Template processing results
    template_results JSONB,
    template_name VARCHAR(100),
    
    -- Processing info
    processing_time_seconds DECIMAL(10,3),
    confidence_score DECIMAL(3,2),
    plan_type VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_doc_results_process_id (process_id),
    INDEX idx_doc_results_user_id (user_id),
    INDEX idx_doc_results_created_at (created_at),
    INDEX idx_doc_results_document_type (document_type),
    INDEX idx_doc_results_template (template_name)
);

-- Document Analysis History
CREATE TABLE IF NOT EXISTS document_analysis_history (
    id SERIAL PRIMARY KEY,
    process_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL,
    analysis_results JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    processing_time_seconds DECIMAL(10,3),
    billable_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    plan_type VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to processing results
    FOREIGN KEY (process_id) REFERENCES document_processing_results(process_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_doc_analysis_process_id (process_id),
    INDEX idx_doc_analysis_user_id (user_id),
    INDEX idx_doc_analysis_type (analysis_type),
    INDEX idx_doc_analysis_created_at (created_at)
);

-- Revenue Events for Document Intelligence
CREATE TABLE IF NOT EXISTS document_intelligence_revenue (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'document_processing', 'ai_analysis'
    source VARCHAR(100) NOT NULL DEFAULT 'document_intelligence',
    
    -- Related document info
    process_id VARCHAR(255),
    document_type VARCHAR(100),
    analysis_type VARCHAR(100),
    
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_doc_revenue_user_id (user_id),
    INDEX idx_doc_revenue_transaction_id (transaction_id),
    INDEX idx_doc_revenue_event_type (event_type),
    INDEX idx_doc_revenue_created_at (created_at),
    INDEX idx_doc_revenue_monthly (user_id, DATE_TRUNC('month', created_at))
);

-- Document Intelligence Templates Usage
CREATE TABLE IF NOT EXISTS document_template_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(100) NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    template_category VARCHAR(100),
    
    -- Usage stats
    times_used INTEGER DEFAULT 1,
    success_rate DECIMAL(5,2),
    average_confidence DECIMAL(5,2),
    
    -- Plan info
    plan_type VARCHAR(50) NOT NULL,
    
    first_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicates
    UNIQUE(user_id, template_id),
    
    -- Indexes
    INDEX idx_template_usage_user_id (user_id),
    INDEX idx_template_usage_template_id (template_id),
    INDEX idx_template_usage_category (template_category),
    INDEX idx_template_usage_last_used (last_used)
);

-- Document Intelligence Quotas and Limits
CREATE TABLE IF NOT EXISTS document_intelligence_quotas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    
    -- Monthly quotas
    monthly_document_limit INTEGER NOT NULL,
    monthly_documents_used INTEGER DEFAULT 0,
    monthly_ai_analysis_limit INTEGER,
    monthly_ai_analysis_used INTEGER DEFAULT 0,
    
    -- Current billing period
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    
    -- Overage tracking
    overage_documents INTEGER DEFAULT 0,
    overage_ai_analysis INTEGER DEFAULT 0,
    overage_charges DECIMAL(10,2) DEFAULT 0.00,
    
    -- Reset tracking
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_reset TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_quotas_user_id (user_id),
    INDEX idx_quotas_plan_type (plan_type),
    INDEX idx_quotas_billing_period (billing_period_start, billing_period_end)
);

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_document_intelligence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_document_processing_results_timestamp
    BEFORE UPDATE ON document_processing_results
    FOR EACH ROW EXECUTE FUNCTION update_document_intelligence_timestamp();

CREATE TRIGGER update_document_intelligence_quotas_timestamp
    BEFORE UPDATE ON document_intelligence_quotas
    FOR EACH ROW EXECUTE FUNCTION update_document_intelligence_timestamp();

-- Function to reset monthly quotas
CREATE OR REPLACE FUNCTION reset_monthly_document_quotas()
RETURNS void AS $$
BEGIN
    UPDATE document_intelligence_quotas 
    SET 
        monthly_documents_used = 0,
        monthly_ai_analysis_used = 0,
        overage_documents = 0,
        overage_ai_analysis = 0,
        overage_charges = 0.00,
        last_reset = CURRENT_TIMESTAMP,
        next_reset = DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month',
        billing_period_start = DATE_TRUNC('month', CURRENT_TIMESTAMP)::DATE,
        billing_period_end = (DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
    WHERE next_reset <= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_doc_intel_usage_monthly_stats 
ON document_intelligence_usage (user_id, plan_type, DATE_TRUNC('month', timestamp));

CREATE INDEX IF NOT EXISTS idx_doc_revenue_monthly_stats 
ON document_intelligence_revenue (user_id, plan_type, DATE_TRUNC('month', created_at));

-- Insert default quota records for existing users
INSERT INTO document_intelligence_quotas (
    user_id, 
    plan_type, 
    monthly_document_limit,
    monthly_ai_analysis_limit,
    billing_period_start,
    billing_period_end,
    next_reset
)
SELECT 
    u.id,
    COALESCE(u.subscription_tier, 'free') as plan_type,
    CASE 
        WHEN COALESCE(u.subscription_tier, 'free') = 'free' THEN 5
        WHEN COALESCE(u.subscription_tier, 'free') = 'professional' THEN 100
        WHEN COALESCE(u.subscription_tier, 'free') = 'enterprise' THEN 1000
        ELSE 5
    END as monthly_document_limit,
    CASE 
        WHEN COALESCE(u.subscription_tier, 'free') = 'free' THEN 0
        WHEN COALESCE(u.subscription_tier, 'free') = 'professional' THEN 50
        WHEN COALESCE(u.subscription_tier, 'free') = 'enterprise' THEN 500
        ELSE 0
    END as monthly_ai_analysis_limit,
    DATE_TRUNC('month', CURRENT_TIMESTAMP)::DATE as billing_period_start,
    (DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month' - INTERVAL '1 day')::DATE as billing_period_end,
    DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month' as next_reset
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM document_intelligence_quotas diq 
    WHERE diq.user_id = u.id
);

-- Comments for documentation
COMMENT ON TABLE document_intelligence_usage IS 'Tracks document processing usage for billing and analytics';
COMMENT ON TABLE document_processing_results IS 'Stores complete document processing results and metadata';
COMMENT ON TABLE document_analysis_history IS 'Tracks AI analysis operations and results';
COMMENT ON TABLE document_intelligence_revenue IS 'Revenue tracking for document intelligence features';
COMMENT ON TABLE document_template_usage IS 'Tracks usage of industry-specific templates';
COMMENT ON TABLE document_intelligence_quotas IS 'Manages user quotas and billing limits';

-- Grant permissions (adjust as needed for your user roles)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO proofpix_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO proofpix_app; 