-- Analytics and Export Tables Migration
-- This migration adds tables for analytics, filtering, and export functionality

-- Performance metrics table for system monitoring
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance metrics queries
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_timestamp 
ON performance_metrics(metric_name, timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp 
ON performance_metrics(timestamp);

-- Saved filters table for advanced filtering
CREATE TABLE IF NOT EXISTS saved_filters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filter_name VARCHAR(100) NOT NULL,
    description TEXT,
    filter_config JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_filter_name UNIQUE(user_id, filter_name)
);

-- Indexes for saved filters
CREATE INDEX IF NOT EXISTS idx_saved_filters_user_id ON saved_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_filters_public ON saved_filters(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_saved_filters_tags ON saved_filters USING GIN(tags);

-- Filter usage logs for analytics
CREATE TABLE IF NOT EXISTS filter_usage_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    filter_config JSONB NOT NULL,
    result_count INTEGER DEFAULT 0,
    execution_time INTEGER DEFAULT 0, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for filter usage analytics
CREATE INDEX IF NOT EXISTS idx_filter_usage_logs_user_created 
ON filter_usage_logs(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_filter_usage_logs_created 
ON filter_usage_logs(created_at);

-- Export jobs table for background export processing
CREATE TABLE IF NOT EXISTS export_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL, -- 'metrics', 'usage', 'queue', 'all'
    format VARCHAR(20) NOT NULL, -- 'csv', 'excel', 'json', 'pdf'
    time_range VARCHAR(10), -- '1h', '24h', '7d', '30d', '90d'
    filters JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    progress INTEGER DEFAULT 0, -- 0-100
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    download_count INTEGER DEFAULT 0,
    error_message TEXT,
    requested_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for export jobs
CREATE INDEX IF NOT EXISTS idx_export_jobs_user_id ON export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status ON export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_export_jobs_created ON export_jobs(created_at);

-- Dashboard configurations table for custom dashboards
CREATE TABLE IF NOT EXISTS dashboard_configurations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dashboard_name VARCHAR(100) NOT NULL,
    description TEXT,
    configuration JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_dashboard_name UNIQUE(user_id, dashboard_name)
);

-- Indexes for dashboard configurations
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_user_id ON dashboard_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_public ON dashboard_configurations(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_template ON dashboard_configurations(is_template) WHERE is_template = TRUE;

-- Search indexes table for search functionality
CREATE TABLE IF NOT EXISTS search_indexes (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    search_vector TSVECTOR,
    content JSONB,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_table_record UNIQUE(table_name, record_id)
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_search_indexes_vector ON search_indexes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_search_indexes_table ON search_indexes(table_name);

-- Search queries table for search analytics
CREATE TABLE IF NOT EXISTS search_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    result_count INTEGER DEFAULT 0,
    execution_time INTEGER DEFAULT 0, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for search analytics
CREATE INDEX IF NOT EXISTS idx_search_queries_user_created 
ON search_queries(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_search_queries_created 
ON search_queries(created_at);

-- User activity sessions table for detailed analytics
CREATE TABLE IF NOT EXISTS user_activity_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    page_views INTEGER DEFAULT 0,
    actions_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_session UNIQUE(user_id, session_id)
);

-- Indexes for user activity sessions
CREATE INDEX IF NOT EXISTS idx_user_activity_sessions_user_id ON user_activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_sessions_start_time ON user_activity_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_user_activity_sessions_session_id ON user_activity_sessions(session_id);

-- Real-time metrics cache table
CREATE TABLE IF NOT EXISTS real_time_metrics_cache (
    id SERIAL PRIMARY KEY,
    metric_key VARCHAR(100) NOT NULL UNIQUE,
    metric_value JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for real-time metrics cache
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_key ON real_time_metrics_cache(metric_key);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_expires ON real_time_metrics_cache(expires_at);

-- System alerts table for monitoring
CREATE TABLE IF NOT EXISTS system_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- 'performance', 'security', 'error', 'warning'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    acknowledged_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for system alerts
CREATE INDEX IF NOT EXISTS idx_system_alerts_type ON system_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_status ON system_alerts(status);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created ON system_alerts(created_at);

-- API rate limiting table for advanced rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL, -- IP, user_id, or API key
    identifier_type VARCHAR(20) NOT NULL, -- 'ip', 'user', 'api_key'
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_duration INTEGER DEFAULT 3600, -- in seconds
    limit_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_rate_limit_identifier UNIQUE(identifier, identifier_type, endpoint)
);

-- Indexes for API rate limiting
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_identifier ON api_rate_limits(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window ON api_rate_limits(window_start);

-- Data retention policies table
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL UNIQUE,
    retention_days INTEGER NOT NULL,
    archive_before_delete BOOLEAN DEFAULT TRUE,
    archive_location VARCHAR(255),
    last_cleanup TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data retention policies
INSERT INTO data_retention_policies (table_name, retention_days, archive_before_delete) VALUES
('audit_logs', 365, TRUE),
('api_usage', 90, TRUE),
('filter_usage_logs', 30, FALSE),
('search_queries', 30, FALSE),
('export_jobs', 7, FALSE),
('performance_metrics', 90, TRUE),
('user_activity_sessions', 180, TRUE),
('real_time_metrics_cache', 1, FALSE),
('system_alerts', 90, TRUE)
ON CONFLICT (table_name) DO NOTHING;

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_saved_filters_updated_at 
    BEFORE UPDATE ON saved_filters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_export_jobs_updated_at 
    BEFORE UPDATE ON export_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_configurations_updated_at 
    BEFORE UPDATE ON dashboard_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_real_time_metrics_cache_updated_at 
    BEFORE UPDATE ON real_time_metrics_cache 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_rate_limits_updated_at 
    BEFORE UPDATE ON api_rate_limits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at 
    BEFORE UPDATE ON data_retention_policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired real-time metrics cache
CREATE OR REPLACE FUNCTION cleanup_expired_metrics_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM real_time_metrics_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', COALESCE(NEW.content::text, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for search vector updates
CREATE TRIGGER update_search_indexes_vector 
    BEFORE INSERT OR UPDATE ON search_indexes 
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Create views for common analytics queries

-- Daily analytics summary view
CREATE OR REPLACE VIEW daily_analytics_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE action LIKE '%upload%') as file_uploads,
    COUNT(*) FILTER (WHERE action LIKE '%api%') as api_calls,
    COUNT(*) FILTER (WHERE action LIKE '%error%') as errors
FROM audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- User engagement metrics view
CREATE OR REPLACE VIEW user_engagement_metrics AS
SELECT 
    u.id as user_id,
    u.email,
    u.plan_type,
    COUNT(DISTINCT DATE(al.created_at)) as active_days_last_30,
    COUNT(al.id) as total_actions_last_30,
    MAX(al.created_at) as last_activity,
    COUNT(f.id) as total_files,
    COALESCE(SUM(f.file_size), 0) as total_storage_used
FROM users u
LEFT JOIN audit_logs al ON u.id = al.user_id AND al.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN files f ON u.id = f.user_id
GROUP BY u.id, u.email, u.plan_type;

-- System performance summary view
CREATE OR REPLACE VIEW system_performance_summary AS
SELECT 
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    COUNT(*) as sample_count,
    MAX(timestamp) as last_recorded
FROM performance_metrics
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY metric_name;

-- Grant permissions
GRANT SELECT ON daily_analytics_summary TO proofpix_user;
GRANT SELECT ON user_engagement_metrics TO proofpix_user;
GRANT SELECT ON system_performance_summary TO proofpix_user;

-- Add comments for documentation
COMMENT ON TABLE performance_metrics IS 'Stores system performance metrics for monitoring and analytics';
COMMENT ON TABLE saved_filters IS 'User-defined filter configurations for advanced data filtering';
COMMENT ON TABLE filter_usage_logs IS 'Tracks filter usage for analytics and optimization';
COMMENT ON TABLE export_jobs IS 'Background export job tracking and file management';
COMMENT ON TABLE dashboard_configurations IS 'Custom dashboard layouts and configurations';
COMMENT ON TABLE search_indexes IS 'Full-text search indexes for global search functionality';
COMMENT ON TABLE search_queries IS 'Search query logs for analytics and optimization';
COMMENT ON TABLE user_activity_sessions IS 'Detailed user session tracking for analytics';
COMMENT ON TABLE real_time_metrics_cache IS 'Cached real-time metrics for performance';
COMMENT ON TABLE system_alerts IS 'System monitoring alerts and notifications';
COMMENT ON TABLE api_rate_limits IS 'Advanced API rate limiting tracking';
COMMENT ON TABLE data_retention_policies IS 'Data retention and cleanup policies';

-- Migration completed successfully
SELECT 'Analytics tables migration completed successfully' as status; 