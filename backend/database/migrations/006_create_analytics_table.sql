-- Create analytics table for user behavior and feature usage tracking
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID,
    
    -- Event classification
    event_category VARCHAR(50) NOT NULL, -- 'user_action', 'system_event', 'performance', 'error'
    event_action VARCHAR(100) NOT NULL, -- 'login', 'upload', 'download', 'template_select', etc.
    event_label VARCHAR(255), -- Additional context
    event_value INTEGER, -- Numeric value associated with event
    
    -- Page/Feature tracking
    page_url TEXT,
    page_title VARCHAR(255),
    feature_name VARCHAR(100),
    component_name VARCHAR(100),
    
    -- User interaction details
    interaction_type VARCHAR(50), -- 'click', 'scroll', 'hover', 'form_submit', etc.
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    element_text TEXT,
    
    -- Performance metrics
    page_load_time_ms INTEGER,
    api_response_time_ms INTEGER,
    processing_time_ms INTEGER,
    
    -- A/B Testing and experiments
    experiment_id VARCHAR(100),
    variant_id VARCHAR(100),
    
    -- Conversion tracking
    conversion_goal VARCHAR(100), -- 'signup', 'subscription', 'file_upload', etc.
    conversion_value DECIMAL(10,2),
    funnel_step VARCHAR(100),
    
    -- Technical details
    browser_name VARCHAR(100),
    browser_version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    screen_resolution VARCHAR(20),
    
    -- Geographic data
    ip_address INET,
    country_code VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(50),
    
    -- Referral tracking
    referrer_url TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    
    -- Error tracking
    error_type VARCHAR(100),
    error_message TEXT,
    error_stack TEXT,
    
    -- Custom dimensions and metrics
    custom_dimension_1 VARCHAR(255),
    custom_dimension_2 VARCHAR(255),
    custom_dimension_3 VARCHAR(255),
    custom_metric_1 DECIMAL(10,4),
    custom_metric_2 DECIMAL(10,4),
    custom_metric_3 DECIMAL(10,4),
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics queries
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
CREATE INDEX idx_analytics_event_category ON analytics(event_category);
CREATE INDEX idx_analytics_event_action ON analytics(event_action);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_analytics_event_timestamp ON analytics(event_timestamp);

-- Composite indexes for common analytics queries
CREATE INDEX idx_analytics_user_category_action ON analytics(user_id, event_category, event_action);
CREATE INDEX idx_analytics_category_action_date ON analytics(event_category, event_action, created_at);
CREATE INDEX idx_analytics_feature_date ON analytics(feature_name, created_at) WHERE feature_name IS NOT NULL;
CREATE INDEX idx_analytics_conversion_date ON analytics(conversion_goal, created_at) WHERE conversion_goal IS NOT NULL;

-- Partial indexes for specific event types
CREATE INDEX idx_analytics_user_actions ON analytics(user_id, event_action, created_at) WHERE event_category = 'user_action';
CREATE INDEX idx_analytics_performance ON analytics(page_load_time_ms, api_response_time_ms, created_at) WHERE event_category = 'performance';
CREATE INDEX idx_analytics_errors ON analytics(error_type, created_at) WHERE event_category = 'error';

-- Geographic and device indexes
CREATE INDEX idx_analytics_country_date ON analytics(country_code, created_at) WHERE country_code IS NOT NULL;
CREATE INDEX idx_analytics_device_date ON analytics(device_type, created_at) WHERE device_type IS NOT NULL;

-- UTM tracking indexes
CREATE INDEX idx_analytics_utm_source ON analytics(utm_source, created_at) WHERE utm_source IS NOT NULL;
CREATE INDEX idx_analytics_utm_campaign ON analytics(utm_campaign, created_at) WHERE utm_campaign IS NOT NULL;

-- Create materialized view for daily analytics summary
CREATE MATERIALIZED VIEW daily_analytics_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as day,
    event_category,
    event_action,
    feature_name,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(page_load_time_ms) as avg_page_load_time,
    AVG(api_response_time_ms) as avg_api_response_time,
    COUNT(*) FILTER (WHERE conversion_goal IS NOT NULL) as conversions,
    SUM(conversion_value) as total_conversion_value
FROM analytics
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at), event_category, event_action, feature_name;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_daily_analytics_summary_unique 
ON daily_analytics_summary(day, event_category, event_action, COALESCE(feature_name, ''));

-- Create indexes on materialized view
CREATE INDEX idx_daily_analytics_summary_day ON daily_analytics_summary(day);
CREATE INDEX idx_daily_analytics_summary_category ON daily_analytics_summary(event_category, day);

-- Create user behavior analysis view
CREATE VIEW user_behavior_analysis AS
SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as week,
    COUNT(*) as total_events,
    COUNT(DISTINCT event_action) as unique_actions,
    COUNT(DISTINCT feature_name) as features_used,
    COUNT(*) FILTER (WHERE event_category = 'user_action') as user_actions,
    COUNT(*) FILTER (WHERE event_category = 'error') as errors,
    AVG(page_load_time_ms) as avg_page_load_time,
    COUNT(*) FILTER (WHERE conversion_goal IS NOT NULL) as conversions,
    SUM(conversion_value) as total_conversion_value,
    MAX(created_at) as last_activity
FROM analytics
WHERE user_id IS NOT NULL
AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id, DATE_TRUNC('week', created_at);

-- Create feature usage analysis view
CREATE VIEW feature_usage_analysis AS
SELECT 
    feature_name,
    DATE_TRUNC('day', created_at) as day,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(*) FILTER (WHERE error_type IS NOT NULL) as error_count,
    (COUNT(*) FILTER (WHERE error_type IS NOT NULL)::DECIMAL / COUNT(*) * 100) as error_rate
FROM analytics
WHERE feature_name IS NOT NULL
AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY feature_name, DATE_TRUNC('day', created_at);

-- Create conversion funnel analysis function
CREATE OR REPLACE FUNCTION analyze_conversion_funnel(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    funnel_step VARCHAR,
    step_order INTEGER,
    users_count BIGINT,
    conversion_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH funnel_steps AS (
        SELECT 
            a.funnel_step,
            ROW_NUMBER() OVER (ORDER BY MIN(a.created_at)) as step_order,
            COUNT(DISTINCT a.user_id) as users_count
        FROM analytics a
        WHERE a.funnel_step IS NOT NULL
        AND a.created_at BETWEEN p_start_date AND p_end_date
        GROUP BY a.funnel_step
    ),
    first_step AS (
        SELECT users_count as total_users
        FROM funnel_steps
        WHERE step_order = 1
    )
    SELECT 
        fs.funnel_step,
        fs.step_order::INTEGER,
        fs.users_count,
        CASE 
            WHEN first_step.total_users > 0 
            THEN (fs.users_count::DECIMAL / first_step.total_users * 100)
            ELSE 0 
        END as conversion_rate
    FROM funnel_steps fs
    CROSS JOIN first_step
    ORDER BY fs.step_order;
END;
$$ LANGUAGE plpgsql;

-- Create user cohort analysis function
CREATE OR REPLACE FUNCTION analyze_user_cohorts(
    p_cohort_period VARCHAR DEFAULT 'month' -- 'week', 'month', 'quarter'
)
RETURNS TABLE (
    cohort_period TEXT,
    cohort_size BIGINT,
    period_number INTEGER,
    users_returned BIGINT,
    retention_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH user_cohorts AS (
        SELECT 
            user_id,
            DATE_TRUNC(p_cohort_period, MIN(created_at)) as cohort_period
        FROM analytics
        WHERE user_id IS NOT NULL
        GROUP BY user_id
    ),
    cohort_data AS (
        SELECT 
            uc.cohort_period,
            COUNT(DISTINCT uc.user_id) as cohort_size
        FROM user_cohorts uc
        GROUP BY uc.cohort_period
    ),
    user_activities AS (
        SELECT 
            a.user_id,
            uc.cohort_period,
            DATE_TRUNC(p_cohort_period, a.created_at) as activity_period
        FROM analytics a
        JOIN user_cohorts uc ON a.user_id = uc.user_id
        WHERE a.user_id IS NOT NULL
        GROUP BY a.user_id, uc.cohort_period, DATE_TRUNC(p_cohort_period, a.created_at)
    ),
    retention_data AS (
        SELECT 
            ua.cohort_period,
            cd.cohort_size,
            EXTRACT(EPOCH FROM (ua.activity_period - ua.cohort_period)) / 
            CASE p_cohort_period
                WHEN 'week' THEN 604800
                WHEN 'month' THEN 2592000
                WHEN 'quarter' THEN 7776000
                ELSE 2592000
            END as period_number,
            COUNT(DISTINCT ua.user_id) as users_returned
        FROM user_activities ua
        JOIN cohort_data cd ON ua.cohort_period = cd.cohort_period
        GROUP BY ua.cohort_period, cd.cohort_size, period_number
    )
    SELECT 
        rd.cohort_period::TEXT,
        rd.cohort_size,
        rd.period_number::INTEGER,
        rd.users_returned,
        (rd.users_returned::DECIMAL / rd.cohort_size * 100) as retention_rate
    FROM retention_data rd
    WHERE rd.period_number >= 0
    ORDER BY rd.cohort_period, rd.period_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to refresh analytics materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics_summary;
END;
$$ LANGUAGE plpgsql; 