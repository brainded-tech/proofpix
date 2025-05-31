-- Files Table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    upload_date TIMESTAMP DEFAULT NOW(),
    processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'virus_detected')),
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    processing_error TEXT,
    virus_scan_status VARCHAR(50) DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'scanning', 'clean', 'infected', 'error')),
    virus_scan_result TEXT,
    metadata JSONB,
    exif_data JSONB,
    thumbnail_path TEXT,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- File Processing Jobs Table
CREATE TABLE IF NOT EXISTS file_processing_jobs (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) UNIQUE NOT NULL,
    file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- 'exif_extraction', 'thumbnail_generation', 'virus_scan', etc.
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed', 'delayed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    data JSONB,
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]', -- Array of permissions
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    usage_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    ip_whitelist TEXT[], -- Array of allowed IP addresses
    webhook_url TEXT,
    webhook_secret VARCHAR(255)
);

-- API Usage Tracking Table
CREATE TABLE IF NOT EXISTS api_usage (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size BIGINT,
    response_size BIGINT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks Table
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    webhook_name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    events TEXT[] NOT NULL, -- Array of event types to listen for
    is_active BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    last_triggered_at TIMESTAMP,
    success_count BIGINT DEFAULT 0,
    failure_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Deliveries Table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed', 'retrying')),
    http_status_code INTEGER,
    response_body TEXT,
    response_headers JSONB,
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Batch Processing Jobs Table
CREATE TABLE IF NOT EXISTS batch_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_name VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- 'bulk_upload', 'bulk_process', 'bulk_export'
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    configuration JSONB,
    results JSONB,
    error_log TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- OAuth Applications Table (for third-party integrations)
CREATE TABLE IF NOT EXISTS oauth_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    app_description TEXT,
    redirect_uris TEXT[] NOT NULL,
    scopes TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Authorization Codes Table
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_applications(client_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scopes TEXT[] NOT NULL,
    redirect_uri TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Access Tokens Table
CREATE TABLE IF NOT EXISTS oauth_access_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_applications(client_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scopes TEXT[] NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit VARCHAR(20),
    tags JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_processing_status ON files(processing_status);
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON files(upload_date);
CREATE INDEX IF NOT EXISTS idx_files_file_hash ON files(file_hash);

CREATE INDEX IF NOT EXISTS idx_file_processing_jobs_file_id ON file_processing_jobs(file_id);
CREATE INDEX IF NOT EXISTS idx_file_processing_jobs_status ON file_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_file_processing_jobs_job_type ON file_processing_jobs(job_type);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

CREATE INDEX IF NOT EXISTS idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);

CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);

CREATE INDEX IF NOT EXISTS idx_batch_jobs_user_id ON batch_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_created_at ON batch_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_oauth_applications_client_id ON oauth_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_applications_user_id ON oauth_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_code ON oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_client_id ON oauth_authorization_codes(client_id);

CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_token ON oauth_access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_client_id ON oauth_access_tokens(client_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_files_updated_at 
    BEFORE UPDATE ON files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at 
    BEFORE UPDATE ON webhooks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_applications_updated_at 
    BEFORE UPDATE ON oauth_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 