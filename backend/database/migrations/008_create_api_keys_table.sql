-- Create api_keys table for enterprise API access management
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Key identification
    name VARCHAR(255) NOT NULL,
    description TEXT,
    key_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed version of the actual key
    key_prefix VARCHAR(20) NOT NULL, -- First few characters for identification
    
    -- Key properties
    key_type VARCHAR(50) NOT NULL DEFAULT 'standard' CHECK (key_type IN ('standard', 'restricted', 'admin', 'webhook')),
    environment VARCHAR(20) NOT NULL DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
    
    -- Access control
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    permissions JSONB NOT NULL DEFAULT '[]', -- Array of allowed permissions
    allowed_origins TEXT[], -- CORS origins
    allowed_ips INET[], -- IP whitelist
    
    -- Rate limiting
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    
    -- Usage tracking
    total_requests BIGINT NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_used_ip INET,
    last_used_user_agent TEXT,
    
    -- Expiration and rotation
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_rotate_days INTEGER, -- Auto-rotate key every N days
    last_rotated_at TIMESTAMP WITH TIME ZONE,
    
    -- Security settings
    require_https BOOLEAN NOT NULL DEFAULT TRUE,
    webhook_secret VARCHAR(255), -- For webhook verification
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    revoked_reason TEXT
);

-- Create indexes for performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_key_type ON api_keys(key_type);
CREATE INDEX idx_api_keys_environment ON api_keys(environment);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX idx_api_keys_last_used_at ON api_keys(last_used_at);

-- Composite indexes for common queries
CREATE INDEX idx_api_keys_user_active ON api_keys(user_id, is_active);
CREATE INDEX idx_api_keys_user_type ON api_keys(user_id, key_type);
CREATE INDEX idx_api_keys_active_expires ON api_keys(is_active, expires_at) WHERE expires_at IS NOT NULL;

-- Partial index for active keys
CREATE INDEX idx_api_keys_active_keys ON api_keys(user_id, last_used_at) WHERE is_active = TRUE AND revoked_at IS NULL;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_api_keys_updated_at();

-- Create API key usage tracking table
CREATE TABLE IF NOT EXISTS api_key_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Request details
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    
    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    
    -- Usage metrics
    request_size_bytes INTEGER DEFAULT 0,
    response_size_bytes INTEGER DEFAULT 0,
    
    -- Error tracking
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Billing and cost
    cost_credits DECIMAL(10,4) DEFAULT 0.0000,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for API key usage
CREATE INDEX idx_api_key_usage_api_key_id ON api_key_usage(api_key_id);
CREATE INDEX idx_api_key_usage_user_id ON api_key_usage(user_id);
CREATE INDEX idx_api_key_usage_created_at ON api_key_usage(created_at);
CREATE INDEX idx_api_key_usage_endpoint ON api_key_usage(endpoint);

-- Composite indexes for usage analytics
CREATE INDEX idx_api_key_usage_key_date ON api_key_usage(api_key_id, created_at);
CREATE INDEX idx_api_key_usage_user_date ON api_key_usage(user_id, created_at);
CREATE INDEX idx_api_key_usage_endpoint_date ON api_key_usage(endpoint, created_at);

-- Create function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
    v_key TEXT;
    v_prefix TEXT := 'pk_';
    v_random_part TEXT;
BEGIN
    -- Generate random string (32 characters)
    v_random_part := encode(gen_random_bytes(24), 'base64');
    v_random_part := replace(replace(replace(v_random_part, '+', ''), '/', ''), '=', '');
    v_random_part := substr(v_random_part, 1, 32);
    
    v_key := v_prefix || v_random_part;
    RETURN v_key;
END;
$$ LANGUAGE plpgsql;

-- Create function to hash API key
CREATE OR REPLACE FUNCTION hash_api_key(p_key TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(p_key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to create new API key
CREATE OR REPLACE FUNCTION create_api_key(
    p_user_id UUID,
    p_name VARCHAR,
    p_description TEXT DEFAULT NULL,
    p_key_type VARCHAR DEFAULT 'standard',
    p_environment VARCHAR DEFAULT 'production',
    p_permissions JSONB DEFAULT '[]',
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    api_key TEXT,
    key_prefix VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_api_key TEXT;
    v_key_hash TEXT;
    v_key_prefix VARCHAR;
    v_key_id UUID;
    v_created_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate new API key
    v_api_key := generate_api_key();
    v_key_hash := hash_api_key(v_api_key);
    v_key_prefix := substr(v_api_key, 1, 8) || '...';
    
    -- Insert into database
    INSERT INTO api_keys (
        user_id, name, description, key_hash, key_prefix, 
        key_type, environment, permissions, expires_at
    ) VALUES (
        p_user_id, p_name, p_description, v_key_hash, v_key_prefix,
        p_key_type, p_environment, p_permissions, p_expires_at
    ) RETURNING api_keys.id, api_keys.created_at INTO v_key_id, v_created_at;
    
    RETURN QUERY SELECT v_key_id, v_api_key, v_key_prefix, v_created_at;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(p_api_key TEXT)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name VARCHAR,
    key_type VARCHAR,
    permissions JSONB,
    rate_limit_per_minute INTEGER,
    is_valid BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    v_key_hash TEXT;
    v_api_key_record RECORD;
BEGIN
    v_key_hash := hash_api_key(p_api_key);
    
    SELECT ak.* INTO v_api_key_record
    FROM api_keys ak
    WHERE ak.key_hash = v_key_hash;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            NULL::UUID, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::JSONB, 
            NULL::INTEGER, FALSE, 'Invalid API key';
        RETURN;
    END IF;
    
    -- Check if key is active
    IF NOT v_api_key_record.is_active THEN
        RETURN QUERY SELECT 
            v_api_key_record.id, v_api_key_record.user_id, v_api_key_record.name,
            v_api_key_record.key_type, v_api_key_record.permissions,
            v_api_key_record.rate_limit_per_minute,
            FALSE, 'API key is inactive';
        RETURN;
    END IF;
    
    -- Check if key is revoked
    IF v_api_key_record.revoked_at IS NOT NULL THEN
        RETURN QUERY SELECT 
            v_api_key_record.id, v_api_key_record.user_id, v_api_key_record.name,
            v_api_key_record.key_type, v_api_key_record.permissions,
            v_api_key_record.rate_limit_per_minute,
            FALSE, 'API key has been revoked';
        RETURN;
    END IF;
    
    -- Check if key is expired
    IF v_api_key_record.expires_at IS NOT NULL AND v_api_key_record.expires_at < CURRENT_TIMESTAMP THEN
        RETURN QUERY SELECT 
            v_api_key_record.id, v_api_key_record.user_id, v_api_key_record.name,
            v_api_key_record.key_type, v_api_key_record.permissions,
            v_api_key_record.rate_limit_per_minute,
            FALSE, 'API key has expired';
        RETURN;
    END IF;
    
    -- Key is valid
    RETURN QUERY SELECT 
        v_api_key_record.id, v_api_key_record.user_id, v_api_key_record.name,
        v_api_key_record.key_type, v_api_key_record.permissions,
        v_api_key_record.rate_limit_per_minute,
        TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create function to record API key usage
CREATE OR REPLACE FUNCTION record_api_key_usage(
    p_api_key_id UUID,
    p_user_id UUID,
    p_endpoint VARCHAR,
    p_method VARCHAR,
    p_status_code INTEGER,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_size_bytes INTEGER DEFAULT 0,
    p_response_size_bytes INTEGER DEFAULT 0,
    p_cost_credits DECIMAL DEFAULT 0.0000
)
RETURNS void AS $$
BEGIN
    -- Insert usage record
    INSERT INTO api_key_usage (
        api_key_id, user_id, endpoint, method, status_code,
        response_time_ms, ip_address, user_agent,
        request_size_bytes, response_size_bytes, cost_credits
    ) VALUES (
        p_api_key_id, p_user_id, p_endpoint, p_method, p_status_code,
        p_response_time_ms, p_ip_address, p_user_agent,
        p_request_size_bytes, p_response_size_bytes, p_cost_credits
    );
    
    -- Update API key last used information
    UPDATE api_keys 
    SET 
        total_requests = total_requests + 1,
        last_used_at = CURRENT_TIMESTAMP,
        last_used_ip = p_ip_address,
        last_used_user_agent = p_user_agent
    WHERE id = p_api_key_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get API key usage statistics
CREATE OR REPLACE FUNCTION get_api_key_usage_stats(
    p_api_key_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE + INTERVAL '1 day'
)
RETURNS TABLE (
    total_requests BIGINT,
    successful_requests BIGINT,
    error_requests BIGINT,
    avg_response_time_ms DECIMAL,
    total_cost_credits DECIMAL,
    requests_by_endpoint JSONB,
    requests_by_day JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_requests,
        COUNT(*) FILTER (WHERE status_code < 400)::BIGINT as successful_requests,
        COUNT(*) FILTER (WHERE status_code >= 400)::BIGINT as error_requests,
        AVG(response_time_ms) as avg_response_time_ms,
        SUM(cost_credits) as total_cost_credits,
        jsonb_object_agg(endpoint, endpoint_count) as requests_by_endpoint,
        jsonb_object_agg(day, day_count) as requests_by_day
    FROM (
        SELECT 
            aku.*,
            COUNT(*) OVER (PARTITION BY aku.endpoint) as endpoint_count,
            COUNT(*) OVER (PARTITION BY DATE_TRUNC('day', aku.created_at)) as day_count,
            DATE_TRUNC('day', aku.created_at) as day
        FROM api_key_usage aku
        WHERE aku.api_key_id = p_api_key_id
        AND aku.created_at BETWEEN p_start_date AND p_end_date
    ) usage_data;
END;
$$ LANGUAGE plpgsql;

-- Create function to revoke API key
CREATE OR REPLACE FUNCTION revoke_api_key(
    p_api_key_id UUID,
    p_revoked_by UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_affected_rows INTEGER;
BEGIN
    UPDATE api_keys 
    SET 
        is_active = FALSE,
        revoked_at = CURRENT_TIMESTAMP,
        revoked_by = p_revoked_by,
        revoked_reason = p_reason
    WHERE id = p_api_key_id 
    AND revoked_at IS NULL;
    
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    RETURN v_affected_rows > 0;
END;
$$ LANGUAGE plpgsql; 