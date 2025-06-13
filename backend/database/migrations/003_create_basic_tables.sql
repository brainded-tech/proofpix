-- Migration: Create basic tables for API endpoints (without foreign keys)
-- Created: 2024-12-20
-- Purpose: Add basic database tables for testing without foreign key constraints

-- Create webhooks table first
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    webhook_name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL DEFAULT '{}',
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create export_jobs table for analytics export functionality
CREATE TABLE IF NOT EXISTS export_jobs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    export_type VARCHAR(50) NOT NULL CHECK (export_type IN ('metrics', 'usage', 'queue', 'all')),
    format VARCHAR(20) NOT NULL CHECK (format IN ('csv', 'excel', 'json', 'pdf')),
    time_range VARCHAR(20) NOT NULL,
    filters JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'processing', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    file_path TEXT,
    error_message TEXT,
    requested_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE
);

-- Create saved_filters table for advanced filtering functionality
CREATE TABLE IF NOT EXISTS saved_filters (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL DEFAULT '[]',
    base_table VARCHAR(50) NOT NULL DEFAULT 'files',
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook_deliveries table for webhook delivery tracking
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
    http_status_code INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,
    attempt_count INTEGER DEFAULT 1,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE
);

-- Add missing columns to files table for metadata functionality
ALTER TABLE files ADD COLUMN IF NOT EXISTS exif_data JSONB;
ALTER TABLE files ADD COLUMN IF NOT EXISTS image_width INTEGER;
ALTER TABLE files ADD COLUMN IF NOT EXISTS image_height INTEGER;
ALTER TABLE files ADD COLUMN IF NOT EXISTS color_profile VARCHAR(100);
ALTER TABLE files ADD COLUMN IF NOT EXISTS compression_type VARCHAR(50);
ALTER TABLE files ADD COLUMN IF NOT EXISTS image_quality INTEGER;
ALTER TABLE files ADD COLUMN IF NOT EXISTS has_watermark BOOLEAN DEFAULT FALSE;
ALTER TABLE files ADD COLUMN IF NOT EXISTS md5_hash VARCHAR(32);
ALTER TABLE files ADD COLUMN IF NOT EXISTS sha256_hash VARCHAR(64);
ALTER TABLE files ADD COLUMN IF NOT EXISTS processing_progress INTEGER DEFAULT 0;
ALTER TABLE files ADD COLUMN IF NOT EXISTS queue_position INTEGER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);

CREATE INDEX IF NOT EXISTS idx_export_jobs_user_id ON export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status ON export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_export_jobs_created_at ON export_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_saved_filters_user_id ON saved_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_filters_is_public ON saved_filters(is_public);
CREATE INDEX IF NOT EXISTS idx_saved_filters_base_table ON saved_filters(base_table);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type ON webhook_deliveries(event_type);

-- Create indexes on existing files table columns
CREATE INDEX IF NOT EXISTS idx_files_status ON files(status);
CREATE INDEX IF NOT EXISTS idx_files_user_id_status ON files(user_id, status);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);

-- Add trigger to update updated_at on saved_filters
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_saved_filters_updated_at ON saved_filters;
CREATE TRIGGER update_saved_filters_updated_at 
    BEFORE UPDATE ON saved_filters 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at 
    BEFORE UPDATE ON webhooks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 