-- Security Incidents Table
CREATE TABLE IF NOT EXISTS security_incidents (
    id SERIAL PRIMARY KEY,
    incident_id UUID UNIQUE NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    url TEXT NOT NULL,
    method VARCHAR(10) NOT NULL,
    threats JSONB NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'resolved', 'false_positive')),
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Blocked IPs Table
CREATE TABLE IF NOT EXISTS blocked_ips (
    id SERIAL PRIMARY KEY,
    ip_address INET UNIQUE NOT NULL,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    unblocked_reason TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rate Limit Overrides Table
CREATE TABLE IF NOT EXISTS rate_limit_overrides (
    id SERIAL PRIMARY KEY,
    ip_address INET UNIQUE NOT NULL,
    limit_factor DECIMAL(3,2) NOT NULL DEFAULT 1.0, -- 0.1 = 10% of normal limit, 2.0 = 200% of normal limit
    expires_at TIMESTAMP NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Monitoring Table
CREATE TABLE IF NOT EXISTS enhanced_monitoring (
    id SERIAL PRIMARY KEY,
    ip_address INET UNIQUE NOT NULL,
    monitoring_level VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (monitoring_level IN ('normal', 'high', 'critical')),
    expires_at TIMESTAMP NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Security Metrics Table (for storing aggregated security data)
CREATE TABLE IF NOT EXISTS security_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_value JSONB NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance Logs Table
CREATE TABLE IF NOT EXISTS compliance_logs (
    id SERIAL PRIMARY KEY,
    compliance_type VARCHAR(50) NOT NULL, -- 'gdpr', 'ccpa', 'hipaa', etc.
    action VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    data_subject_id VARCHAR(255), -- For GDPR data subject identification
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Data Retention Policies Table
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(100) NOT NULL,
    retention_period_days INTEGER NOT NULL,
    auto_delete BOOLEAN DEFAULT FALSE,
    legal_basis TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data Processing Activities Table (GDPR Article 30)
CREATE TABLE IF NOT EXISTS data_processing_activities (
    id SERIAL PRIMARY KEY,
    activity_name VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    legal_basis VARCHAR(100) NOT NULL,
    data_categories TEXT[],
    data_subjects TEXT[],
    recipients TEXT[],
    third_country_transfers BOOLEAN DEFAULT FALSE,
    retention_period VARCHAR(100),
    security_measures TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data Subject Requests Table (GDPR compliance)
CREATE TABLE IF NOT EXISTS data_subject_requests (
    id SERIAL PRIMARY KEY,
    request_id UUID UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    request_type VARCHAR(50) NOT NULL, -- 'access', 'rectification', 'erasure', 'portability'
    regulation VARCHAR(20) NOT NULL DEFAULT 'gdpr', -- 'gdpr', 'ccpa', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    request_details JSONB,
    response_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- User Consent Table (GDPR compliance)
CREATE TABLE IF NOT EXISTS user_consents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    consent_type VARCHAR(100) NOT NULL, -- 'marketing', 'analytics', 'cookies', etc.
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP DEFAULT NOW(),
    consent_method VARCHAR(50), -- 'explicit', 'implicit', 'opt-in', 'opt-out'
    consent_details JSONB,
    withdrawn_date TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_incidents_ip ON security_incidents(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON security_incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires_at ON blocked_ips(expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limit_overrides_ip ON rate_limit_overrides(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_overrides_expires_at ON rate_limit_overrides(expires_at);

CREATE INDEX IF NOT EXISTS idx_enhanced_monitoring_ip ON enhanced_monitoring(ip_address);
CREATE INDEX IF NOT EXISTS idx_enhanced_monitoring_expires_at ON enhanced_monitoring(expires_at);

CREATE INDEX IF NOT EXISTS idx_compliance_logs_user_id ON compliance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_type ON compliance_logs(compliance_type);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_created_at ON compliance_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consents_given ON user_consents(consent_given);

CREATE INDEX IF NOT EXISTS idx_data_subject_requests_user_id ON data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_type ON data_subject_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_status ON data_subject_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_regulation ON data_subject_requests(regulation);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_created_at ON data_subject_requests(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_security_incidents_updated_at 
    BEFORE UPDATE ON security_incidents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at 
    BEFORE UPDATE ON data_retention_policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_processing_activities_updated_at 
    BEFORE UPDATE ON data_processing_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data retention policies
INSERT INTO data_retention_policies (data_type, retention_period_days, auto_delete, legal_basis) VALUES
('audit_logs', 2555, TRUE, 'Legitimate interest - Security monitoring'), -- 7 years
('user_data', 2555, FALSE, 'Contract performance'), -- 7 years, manual review
('session_data', 30, TRUE, 'Legitimate interest - Security'), -- 30 days
('security_incidents', 2555, FALSE, 'Legitimate interest - Security monitoring'), -- 7 years
('compliance_logs', 2555, FALSE, 'Legal obligation - Compliance'), -- 7 years
('billing_data', 2555, FALSE, 'Legal obligation - Tax/Accounting'), -- 7 years
('usage_tracking', 1095, TRUE, 'Legitimate interest - Service improvement') -- 3 years
ON CONFLICT DO NOTHING;

-- Insert default data processing activities (GDPR Article 30)
INSERT INTO data_processing_activities (
    activity_name, purpose, legal_basis, data_categories, data_subjects, 
    recipients, third_country_transfers, retention_period, security_measures
) VALUES
(
    'User Account Management',
    'Providing user authentication and account management services',
    'Contract performance',
    ARRAY['Identity data', 'Contact data', 'Authentication data'],
    ARRAY['Customers', 'Prospects'],
    ARRAY['Internal staff', 'Cloud service providers'],
    TRUE,
    '7 years after account closure',
    'Encryption at rest and in transit, access controls, audit logging'
),
(
    'Payment Processing',
    'Processing subscription payments and billing',
    'Contract performance',
    ARRAY['Identity data', 'Financial data', 'Transaction data'],
    ARRAY['Customers'],
    ARRAY['Payment processors (Stripe)', 'Internal staff'],
    TRUE,
    '7 years for tax/accounting purposes',
    'PCI DSS compliance, encryption, tokenization'
),
(
    'Security Monitoring',
    'Detecting and preventing security threats',
    'Legitimate interest',
    ARRAY['Technical data', 'Usage data', 'Location data'],
    ARRAY['All users', 'Visitors'],
    ARRAY['Security team', 'Cloud service providers'],
    TRUE,
    '7 years for security analysis',
    'Access controls, encryption, anonymization where possible'
),
(
    'Service Analytics',
    'Improving service performance and user experience',
    'Legitimate interest',
    ARRAY['Usage data', 'Technical data'],
    ARRAY['Customers'],
    ARRAY['Analytics team', 'Cloud service providers'],
    TRUE,
    '3 years for trend analysis',
    'Pseudonymization, aggregation, access controls'
)
ON CONFLICT DO NOTHING; 