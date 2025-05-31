-- Create subscriptions table for plan management and billing
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Subscription details
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    plan_name VARCHAR(100) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    
    -- Pricing information
    price_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    -- Subscription status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused')),
    
    -- Billing dates
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment integration
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Plan limits and features
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    
    -- Usage quotas
    monthly_api_calls_limit INTEGER DEFAULT 1000,
    monthly_file_uploads_limit INTEGER DEFAULT 100,
    monthly_processing_minutes_limit INTEGER DEFAULT 60,
    storage_limit_gb INTEGER DEFAULT 5,
    
    -- Billing information
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    payment_method_id VARCHAR(255),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_created_at ON subscriptions(created_at);

-- Create partial indexes for active subscriptions
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id, status) WHERE status = 'active';
CREATE INDEX idx_subscriptions_trial ON subscriptions(user_id, trial_end) WHERE status = 'trialing';

-- Add constraint to ensure one active subscription per user
CREATE UNIQUE INDEX idx_subscriptions_user_active ON subscriptions(user_id) 
WHERE status IN ('active', 'trialing', 'past_due');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Insert default subscription plans
INSERT INTO subscriptions (user_id, plan_type, plan_name, billing_cycle, price_amount, current_period_end, features, limits) 
SELECT 
    id as user_id,
    'free' as plan_type,
    'Free Plan' as plan_name,
    'monthly' as billing_cycle,
    0.00 as price_amount,
    CURRENT_TIMESTAMP + INTERVAL '1 year' as current_period_end,
    '{"api_access": true, "basic_templates": true, "watermark": true}' as features,
    '{"monthly_api_calls": 1000, "monthly_uploads": 100, "storage_gb": 5}' as limits
FROM users 
WHERE subscription_tier = 'free' 
AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.user_id = users.id); 