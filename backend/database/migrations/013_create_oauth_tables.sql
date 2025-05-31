-- OAuth Applications Table
CREATE TABLE IF NOT EXISTS oauth_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    application_name VARCHAR(255) NOT NULL,
    description TEXT,
    redirect_uris JSONB NOT NULL,
    scopes JSONB DEFAULT '[]'::jsonb,
    application_type VARCHAR(50) DEFAULT 'web',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Authorization Codes Table
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_applications(client_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redirect_uri TEXT NOT NULL,
    scope TEXT,
    state TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Access Tokens Table
CREATE TABLE IF NOT EXISTS oauth_access_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_applications(client_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Refresh Tokens Table
CREATE TABLE IF NOT EXISTS oauth_refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    access_token_id INTEGER NOT NULL REFERENCES oauth_access_tokens(id) ON DELETE CASCADE,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_applications(client_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Collaboration Sessions Table
CREATE TABLE IF NOT EXISTS oauth_collaboration_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    access_token_id INTEGER NOT NULL REFERENCES oauth_access_tokens(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_oauth_applications_user_id ON oauth_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_applications_client_id ON oauth_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_client_id ON oauth_authorization_codes(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_user_id ON oauth_authorization_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_expires_at ON oauth_authorization_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_client_id ON oauth_access_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_user_id ON oauth_access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_expires_at ON oauth_access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_client_id ON oauth_refresh_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_user_id ON oauth_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_tokens_expires_at ON oauth_refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_collaboration_sessions_user_id ON oauth_collaboration_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_collaboration_sessions_team_id ON oauth_collaboration_sessions(team_id);
CREATE INDEX IF NOT EXISTS idx_oauth_collaboration_sessions_expires_at ON oauth_collaboration_sessions(expires_at);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_oauth_applications_updated_at 
    BEFORE UPDATE ON oauth_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_collaboration_sessions_updated_at 
    BEFORE UPDATE ON oauth_collaboration_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default OAuth scopes
INSERT INTO oauth_scopes (scope, description, category) VALUES
    ('read:files', 'Read uploaded files', 'file_access'),
    ('write:files', 'Process and modify files', 'file_access'),
    ('read:exif', 'Read EXIF metadata', 'metadata'),
    ('write:exif', 'Modify EXIF data', 'metadata'),
    ('read:webhooks', 'View webhook configurations', 'integrations'),
    ('write:webhooks', 'Configure webhooks', 'integrations'),
    ('read:profile', 'Read user preferences', 'profile'),
    ('write:profile', 'Update user preferences', 'profile'),
    ('collaboration:create', 'Create collaboration sessions', 'collaboration'),
    ('collaboration:join', 'Join existing sessions', 'collaboration'),
    ('collaboration:manage', 'Manage team collaborations', 'collaboration'),
    ('team:read', 'View team information', 'team'),
    ('team:write', 'Create/edit teams', 'team'),
    ('team:manage', 'Full team administration', 'team'),
    ('ephemeral:process', 'Use ephemeral processing', 'ephemeral'),
    ('ephemeral:share', 'Share ephemeral results', 'ephemeral')
ON CONFLICT (scope) DO NOTHING;

-- Create OAuth scopes table if it doesn't exist
CREATE TABLE IF NOT EXISTS oauth_scopes (
    id SERIAL PRIMARY KEY,
    scope VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Re-insert scopes after table creation
INSERT INTO oauth_scopes (scope, description, category) VALUES
    ('read:files', 'Read uploaded files', 'file_access'),
    ('write:files', 'Process and modify files', 'file_access'),
    ('read:exif', 'Read EXIF metadata', 'metadata'),
    ('write:exif', 'Modify EXIF data', 'metadata'),
    ('read:webhooks', 'View webhook configurations', 'integrations'),
    ('write:webhooks', 'Configure webhooks', 'integrations'),
    ('read:profile', 'Read user preferences', 'profile'),
    ('write:profile', 'Update user preferences', 'profile'),
    ('collaboration:create', 'Create collaboration sessions', 'collaboration'),
    ('collaboration:join', 'Join existing sessions', 'collaboration'),
    ('collaboration:manage', 'Manage team collaborations', 'collaboration'),
    ('team:read', 'View team information', 'team'),
    ('team:write', 'Create/edit teams', 'team'),
    ('team:manage', 'Full team administration', 'team'),
    ('ephemeral:process', 'Use ephemeral processing', 'ephemeral'),
    ('ephemeral:share', 'Share ephemeral results', 'ephemeral')
ON CONFLICT (scope) DO NOTHING; 