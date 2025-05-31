-- Create files table for uploaded files metadata and processing
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- File identification
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    
    -- File properties
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10),
    
    -- File categorization
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'audio', 'archive', 'other')),
    category VARCHAR(100), -- 'profile_picture', 'template_image', 'watermark', etc.
    
    -- Image/Video specific metadata
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    frame_rate DECIMAL(5,2),
    bit_rate INTEGER,
    color_space VARCHAR(20),
    has_transparency BOOLEAN DEFAULT FALSE,
    
    -- Processing status
    status VARCHAR(20) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'failed', 'deleted')),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    processing_error TEXT,
    
    -- Storage information
    storage_provider VARCHAR(50) DEFAULT 'local', -- 'local', 's3', 'gcs', 'azure'
    storage_bucket VARCHAR(255),
    storage_key VARCHAR(500),
    storage_url TEXT,
    
    -- CDN and optimization
    cdn_url TEXT,
    optimized_versions JSONB DEFAULT '{}', -- Different sizes/formats
    thumbnail_url TEXT,
    
    -- Security and access
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    access_token VARCHAR(255), -- For secure access to private files
    download_count INTEGER NOT NULL DEFAULT 0,
    
    -- Watermarking and processing history
    has_watermark BOOLEAN DEFAULT FALSE,
    watermark_settings JSONB DEFAULT '{}',
    processing_history JSONB DEFAULT '[]',
    
    -- File relationships
    parent_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    template_id UUID, -- Reference to template used
    
    -- Expiration and cleanup
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_delete_after_days INTEGER,
    
    -- Metadata and tags
    title VARCHAR(255),
    description TEXT,
    tags TEXT[], -- Array of tags
    metadata JSONB DEFAULT '{}',
    exif_data JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Soft delete support
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_files_stored_filename ON files(stored_filename);
CREATE INDEX idx_files_storage_key ON files(storage_key);

-- Composite indexes for common queries
CREATE INDEX idx_files_user_status ON files(user_id, status);
CREATE INDEX idx_files_user_type_date ON files(user_id, file_type, created_at);
CREATE INDEX idx_files_user_category ON files(user_id, category) WHERE category IS NOT NULL;

-- Partial indexes for active files
CREATE INDEX idx_files_active ON files(user_id, created_at) WHERE is_deleted = FALSE;
CREATE INDEX idx_files_public ON files(is_public, created_at) WHERE is_public = TRUE AND is_deleted = FALSE;

-- Index for file cleanup
CREATE INDEX idx_files_expired ON files(expires_at) WHERE expires_at IS NOT NULL AND is_deleted = FALSE;
CREATE INDEX idx_files_auto_delete ON files(created_at, auto_delete_after_days) WHERE auto_delete_after_days IS NOT NULL AND is_deleted = FALSE;

-- Full-text search index for file search
CREATE INDEX idx_files_search ON files USING gin(to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(original_filename, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '')
)) WHERE is_deleted = FALSE;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_files_updated_at();

-- Create function for soft delete
CREATE OR REPLACE FUNCTION soft_delete_file(p_file_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_affected_rows INTEGER;
BEGIN
    UPDATE files 
    SET 
        is_deleted = TRUE,
        deleted_at = CURRENT_TIMESTAMP,
        status = 'deleted'
    WHERE id = p_file_id 
    AND user_id = p_user_id 
    AND is_deleted = FALSE;
    
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    RETURN v_affected_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to get file storage statistics
CREATE OR REPLACE FUNCTION get_user_storage_stats(p_user_id UUID)
RETURNS TABLE (
    total_files BIGINT,
    total_size_bytes BIGINT,
    total_size_mb DECIMAL,
    total_size_gb DECIMAL,
    files_by_type JSONB,
    storage_by_type JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_files,
        SUM(f.file_size_bytes)::BIGINT as total_size_bytes,
        ROUND((SUM(f.file_size_bytes) / 1024.0 / 1024.0)::DECIMAL, 2) as total_size_mb,
        ROUND((SUM(f.file_size_bytes) / 1024.0 / 1024.0 / 1024.0)::DECIMAL, 3) as total_size_gb,
        jsonb_object_agg(f.file_type, type_counts.file_count) as files_by_type,
        jsonb_object_agg(f.file_type, type_counts.total_size) as storage_by_type
    FROM files f
    JOIN (
        SELECT 
            file_type,
            COUNT(*) as file_count,
            SUM(file_size_bytes) as total_size
        FROM files
        WHERE user_id = p_user_id AND is_deleted = FALSE
        GROUP BY file_type
    ) type_counts ON f.file_type = type_counts.file_type
    WHERE f.user_id = p_user_id AND f.is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup expired files
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER := 0;
BEGIN
    -- Mark expired files as deleted
    UPDATE files 
    SET 
        is_deleted = TRUE,
        deleted_at = CURRENT_TIMESTAMP,
        status = 'deleted'
    WHERE (
        (expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP)
        OR 
        (auto_delete_after_days IS NOT NULL AND created_at < CURRENT_TIMESTAMP - (auto_delete_after_days || ' days')::INTERVAL)
    )
    AND is_deleted = FALSE;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create view for file analytics
CREATE VIEW file_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as day,
    file_type,
    COUNT(*) as files_uploaded,
    SUM(file_size_bytes) as total_bytes,
    AVG(file_size_bytes) as avg_file_size,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE status = 'processed') as processed_files,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_files,
    AVG(EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at))) as avg_processing_time
FROM files
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
AND is_deleted = FALSE
GROUP BY DATE_TRUNC('day', created_at), file_type;

-- Create function to search files
CREATE OR REPLACE FUNCTION search_files(
    p_user_id UUID,
    p_search_query TEXT,
    p_file_type VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    original_filename VARCHAR,
    file_type VARCHAR,
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    thumbnail_url TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.original_filename,
        f.file_type,
        f.file_size_bytes,
        f.created_at,
        f.thumbnail_url,
        ts_rank(
            to_tsvector('english', 
                COALESCE(f.title, '') || ' ' || 
                COALESCE(f.description, '') || ' ' || 
                COALESCE(f.original_filename, '') || ' ' ||
                COALESCE(array_to_string(f.tags, ' '), '')
            ),
            plainto_tsquery('english', p_search_query)
        ) as rank
    FROM files f
    WHERE f.user_id = p_user_id
    AND f.is_deleted = FALSE
    AND (p_file_type IS NULL OR f.file_type = p_file_type)
    AND to_tsvector('english', 
        COALESCE(f.title, '') || ' ' || 
        COALESCE(f.description, '') || ' ' || 
        COALESCE(f.original_filename, '') || ' ' ||
        COALESCE(array_to_string(f.tags, ' '), '')
    ) @@ plainto_tsquery('english', p_search_query)
    ORDER BY rank DESC, f.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql; 