-- Migration: Create plugin-related tables
-- Version: 006
-- Description: Plugin architecture and marketplace database schema

-- Plugins table - stores installed plugin metadata
CREATE TABLE IF NOT EXISTS plugins (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    author_url VARCHAR(500),
    
    -- Plugin classification
    type VARCHAR(20) NOT NULL CHECK (type IN ('processor', 'connector', 'analyzer', 'utility')),
    category VARCHAR(30) NOT NULL CHECK (category IN ('file-processing', 'data-analysis', 'integration', 'security', 'reporting', 'automation', 'other')),
    
    -- Plugin files and structure
    main_file VARCHAR(100) DEFAULT 'index.js',
    file_path TEXT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    file_size BIGINT NOT NULL,
    
    -- Plugin metadata
    keywords TEXT[], -- Array of keywords
    license VARCHAR(50),
    homepage VARCHAR(500),
    repository_type VARCHAR(10),
    repository_url VARCHAR(500),
    
    -- Security and trust
    trusted BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    security_scan_passed BOOLEAN DEFAULT FALSE,
    security_scan_date TIMESTAMP,
    security_issues TEXT[],
    
    -- Resource limits
    memory_limit INTEGER DEFAULT 50, -- MB
    cpu_limit DECIMAL(3,1) DEFAULT 1.0, -- CPU cores
    timeout_limit INTEGER DEFAULT 10000, -- milliseconds
    request_limit INTEGER DEFAULT 100, -- per minute
    
    -- Installation metadata
    installed_by INTEGER REFERENCES users(id),
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'installed' CHECK (status IN ('installed', 'active', 'disabled', 'error')),
    last_loaded TIMESTAMP,
    load_count INTEGER DEFAULT 0,
    error_message TEXT,
    
    -- Compatibility
    proofpix_version VARCHAR(20) NOT NULL,
    node_version VARCHAR(20),
    
    -- Marketplace data
    marketplace_id VARCHAR(100),
    marketplace_version VARCHAR(20),
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(2,1),
    price VARCHAR(50),
    
    UNIQUE(name, version)
);

-- Plugin permissions table - stores plugin permission requirements
CREATE TABLE IF NOT EXISTS plugin_permissions (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT FALSE,
    granted_by INTEGER REFERENCES users(id),
    granted_at TIMESTAMP,
    
    UNIQUE(plugin_id, permission)
);

-- Plugin hooks table - stores plugin hook implementations
CREATE TABLE IF NOT EXISTS plugin_hooks (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    hook_name VARCHAR(100) NOT NULL,
    function_name VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 100,
    enabled BOOLEAN DEFAULT TRUE,
    
    UNIQUE(plugin_id, hook_name)
);

-- Plugin configurations table - stores plugin-specific configurations
CREATE TABLE IF NOT EXISTS plugin_configurations (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB,
    config_type VARCHAR(20) DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'object', 'array')),
    encrypted BOOLEAN DEFAULT FALSE,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(plugin_id, config_key)
);

-- Plugin metrics table - stores plugin performance and usage metrics
CREATE TABLE IF NOT EXISTS plugin_metrics (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    metric_date DATE DEFAULT CURRENT_DATE,
    
    -- Usage metrics
    calls_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    total_execution_time BIGINT DEFAULT 0, -- milliseconds
    avg_execution_time DECIMAL(10,2) DEFAULT 0,
    max_execution_time INTEGER DEFAULT 0,
    
    -- Resource metrics
    memory_usage_avg DECIMAL(10,2) DEFAULT 0, -- MB
    memory_usage_max DECIMAL(10,2) DEFAULT 0, -- MB
    cpu_usage_avg DECIMAL(5,2) DEFAULT 0, -- percentage
    cpu_usage_max DECIMAL(5,2) DEFAULT 0, -- percentage
    
    -- Network metrics (for plugins making HTTP requests)
    http_requests_count INTEGER DEFAULT 0,
    http_requests_failed INTEGER DEFAULT 0,
    http_bytes_sent BIGINT DEFAULT 0,
    http_bytes_received BIGINT DEFAULT 0,
    
    -- Storage metrics
    storage_reads INTEGER DEFAULT 0,
    storage_writes INTEGER DEFAULT 0,
    storage_bytes_read BIGINT DEFAULT 0,
    storage_bytes_written BIGINT DEFAULT 0,
    
    UNIQUE(plugin_id, metric_date)
);

-- Plugin events table - stores plugin lifecycle and execution events
CREATE TABLE IF NOT EXISTS plugin_events (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warn', 'error', 'critical')),
    message TEXT,
    stack_trace TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_plugin_events_plugin_id (plugin_id),
    INDEX idx_plugin_events_created_at (created_at),
    INDEX idx_plugin_events_severity (severity)
);

-- Plugin dependencies table - stores plugin dependency relationships
CREATE TABLE IF NOT EXISTS plugin_dependencies (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    dependency_name VARCHAR(100) NOT NULL,
    dependency_version VARCHAR(20) NOT NULL,
    dependency_type VARCHAR(20) DEFAULT 'npm' CHECK (dependency_type IN ('npm', 'plugin', 'system')),
    required BOOLEAN DEFAULT TRUE,
    installed BOOLEAN DEFAULT FALSE,
    
    UNIQUE(plugin_id, dependency_name)
);

-- Plugin marketplace cache table - caches marketplace data
CREATE TABLE IF NOT EXISTS plugin_marketplace_cache (
    id SERIAL PRIMARY KEY,
    marketplace_id VARCHAR(100) UNIQUE NOT NULL,
    plugin_data JSONB NOT NULL,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    INDEX idx_marketplace_cache_expires (expires_at)
);

-- Plugin storage table - provides key-value storage for plugins
CREATE TABLE IF NOT EXISTS plugin_storage (
    id SERIAL PRIMARY KEY,
    plugin_id VARCHAR(50) REFERENCES plugins(id) ON DELETE CASCADE,
    storage_key VARCHAR(255) NOT NULL,
    storage_value JSONB,
    encrypted BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(plugin_id, storage_key),
    INDEX idx_plugin_storage_expires (expires_at)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plugins_status ON plugins(status);
CREATE INDEX IF NOT EXISTS idx_plugins_type ON plugins(type);
CREATE INDEX IF NOT EXISTS idx_plugins_category ON plugins(category);
CREATE INDEX IF NOT EXISTS idx_plugins_installed_at ON plugins(installed_at);
CREATE INDEX IF NOT EXISTS idx_plugins_trusted ON plugins(trusted);
CREATE INDEX IF NOT EXISTS idx_plugins_verified ON plugins(verified);

CREATE INDEX IF NOT EXISTS idx_plugin_permissions_plugin_id ON plugin_permissions(plugin_id);
CREATE INDEX IF NOT EXISTS idx_plugin_permissions_permission ON plugin_permissions(permission);

CREATE INDEX IF NOT EXISTS idx_plugin_hooks_plugin_id ON plugin_hooks(plugin_id);
CREATE INDEX IF NOT EXISTS idx_plugin_hooks_hook_name ON plugin_hooks(hook_name);
CREATE INDEX IF NOT EXISTS idx_plugin_hooks_enabled ON plugin_hooks(enabled);

CREATE INDEX IF NOT EXISTS idx_plugin_configurations_plugin_id ON plugin_configurations(plugin_id);

CREATE INDEX IF NOT EXISTS idx_plugin_metrics_plugin_id ON plugin_metrics(plugin_id);
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_date ON plugin_metrics(metric_date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plugins_updated_at 
    BEFORE UPDATE ON plugins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_configurations_updated_at 
    BEFORE UPDATE ON plugin_configurations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_storage_updated_at 
    BEFORE UPDATE ON plugin_storage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default plugin permissions
INSERT INTO plugin_permissions (plugin_id, permission, granted) VALUES
('system', 'http', TRUE),
('system', 'crypto', TRUE),
('system', 'storage', TRUE),
('system', 'files', TRUE),
('system', 'analytics', TRUE),
('system', 'webhooks', TRUE),
('system', 'oauth', TRUE),
('system', 'security', TRUE)
ON CONFLICT (plugin_id, permission) DO NOTHING; 