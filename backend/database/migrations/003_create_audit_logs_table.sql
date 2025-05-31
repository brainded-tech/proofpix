-- Create audit_logs table for security monitoring and compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    
    -- Event details
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL, -- auth, user_management, data_access, system, security
    event_description TEXT,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    
    -- Request details
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_path TEXT,
    request_body JSONB,
    response_status INTEGER,
    
    -- Security context
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    is_suspicious BOOLEAN DEFAULT FALSE,
    security_flags TEXT[],
    
    -- Metadata
    metadata JSONB,
    tags TEXT[],
    
    -- Compliance fields
    retention_period INTERVAL DEFAULT INTERVAL '7 years',
    is_sensitive BOOLEAN DEFAULT FALSE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance and compliance queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_category ON audit_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_logs_is_suspicious ON audit_logs(is_suspicious);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

-- Create GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_metadata ON audit_logs USING GIN (metadata);

-- Create partial index for high-risk events
CREATE INDEX IF NOT EXISTS idx_audit_logs_high_risk ON audit_logs(created_at) 
WHERE risk_level IN ('high', 'critical') OR is_suspicious = TRUE; 