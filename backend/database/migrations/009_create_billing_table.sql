-- Create billing table for invoices, payments, and transaction history
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Transaction identification
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('invoice', 'payment', 'refund', 'credit', 'adjustment', 'chargeback')),
    transaction_id VARCHAR(255) UNIQUE, -- External transaction ID (Stripe, etc.)
    invoice_number VARCHAR(100) UNIQUE,
    
    -- Financial details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and dates
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'disputed', 'canceled')),
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Billing period
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    
    -- Payment method and gateway
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'paypal', etc.
    payment_gateway VARCHAR(50) DEFAULT 'stripe', -- 'stripe', 'paypal', 'square', etc.
    gateway_transaction_id VARCHAR(255),
    gateway_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Card/Payment details (encrypted or tokenized)
    payment_method_id VARCHAR(255),
    last_four_digits VARCHAR(4),
    card_brand VARCHAR(20),
    
    -- Line items and details
    line_items JSONB DEFAULT '[]',
    usage_details JSONB DEFAULT '{}',
    
    -- Discounts and promotions
    coupon_code VARCHAR(100),
    promotion_id UUID,
    discount_type VARCHAR(20), -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10,2),
    
    -- Tax information
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_jurisdiction VARCHAR(100),
    tax_exempt BOOLEAN DEFAULT FALSE,
    
    -- Customer information (snapshot at time of billing)
    billing_name VARCHAR(255),
    billing_email VARCHAR(255),
    billing_address JSONB DEFAULT '{}',
    
    -- Retry and dunning management
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    dunning_level INTEGER DEFAULT 0,
    
    -- Refund information
    refund_reason TEXT,
    refunded_amount DECIMAL(10,2) DEFAULT 0.00,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes and metadata
    description TEXT,
    internal_notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_billing_user_id ON billing(user_id);
CREATE INDEX idx_billing_subscription_id ON billing(subscription_id);
CREATE INDEX idx_billing_transaction_type ON billing(transaction_type);
CREATE INDEX idx_billing_status ON billing(status);
CREATE INDEX idx_billing_created_at ON billing(created_at);
CREATE INDEX idx_billing_due_date ON billing(due_date);
CREATE INDEX idx_billing_paid_at ON billing(paid_at);
CREATE INDEX idx_billing_transaction_id ON billing(transaction_id);
CREATE INDEX idx_billing_invoice_number ON billing(invoice_number);

-- Composite indexes for common queries
CREATE INDEX idx_billing_user_status ON billing(user_id, status);
CREATE INDEX idx_billing_user_type_date ON billing(user_id, transaction_type, created_at);
CREATE INDEX idx_billing_subscription_period ON billing(subscription_id, period_start, period_end);

-- Partial indexes for specific statuses
CREATE INDEX idx_billing_pending ON billing(user_id, due_date) WHERE status = 'pending';
CREATE INDEX idx_billing_failed ON billing(user_id, next_retry_at) WHERE status = 'failed' AND next_retry_at IS NOT NULL;
CREATE INDEX idx_billing_overdue ON billing(user_id, due_date) WHERE status = 'pending' AND due_date < CURRENT_TIMESTAMP;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_billing_updated_at
    BEFORE UPDATE ON billing
    FOR EACH ROW
    EXECUTE FUNCTION update_billing_updated_at();

-- Create payment attempts table for tracking retry logic
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_id UUID NOT NULL REFERENCES billing(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attempt details
    attempt_number INTEGER NOT NULL,
    payment_method VARCHAR(50),
    payment_method_id VARCHAR(255),
    
    -- Gateway response
    gateway_response JSONB DEFAULT '{}',
    gateway_transaction_id VARCHAR(255),
    
    -- Result
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    failure_reason VARCHAR(255),
    failure_code VARCHAR(50),
    
    -- Amounts
    attempted_amount DECIMAL(10,2) NOT NULL,
    gateway_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Timestamps
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for payment attempts
CREATE INDEX idx_payment_attempts_billing_id ON payment_attempts(billing_id);
CREATE INDEX idx_payment_attempts_user_id ON payment_attempts(user_id);
CREATE INDEX idx_payment_attempts_status ON payment_attempts(status);
CREATE INDEX idx_payment_attempts_attempted_at ON payment_attempts(attempted_at);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_month TEXT;
    v_sequence INTEGER;
    v_invoice_number TEXT;
BEGIN
    v_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    v_month := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0');
    
    -- Get next sequence number for this month
    SELECT COALESCE(MAX(
        CASE 
            WHEN invoice_number ~ ('^INV-' || v_year || v_month || '-[0-9]+$')
            THEN SUBSTRING(invoice_number FROM '[0-9]+$')::INTEGER
            ELSE 0
        END
    ), 0) + 1 INTO v_sequence
    FROM billing
    WHERE invoice_number IS NOT NULL;
    
    v_invoice_number := 'INV-' || v_year || v_month || '-' || LPAD(v_sequence::TEXT, 4, '0');
    
    RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to create invoice
CREATE OR REPLACE FUNCTION create_invoice(
    p_user_id UUID,
    p_subscription_id UUID,
    p_amount DECIMAL,
    p_currency VARCHAR DEFAULT 'USD',
    p_description TEXT DEFAULT NULL,
    p_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_line_items JSONB DEFAULT '[]'
)
RETURNS UUID AS $$
DECLARE
    v_invoice_id UUID;
    v_invoice_number TEXT;
    v_due_date TIMESTAMP WITH TIME ZONE;
BEGIN
    v_invoice_number := generate_invoice_number();
    v_due_date := COALESCE(p_due_date, CURRENT_TIMESTAMP + INTERVAL '30 days');
    
    INSERT INTO billing (
        user_id, subscription_id, transaction_type, invoice_number,
        amount, currency, total_amount, status, due_date,
        description, line_items
    ) VALUES (
        p_user_id, p_subscription_id, 'invoice', v_invoice_number,
        p_amount, p_currency, p_amount, 'pending', v_due_date,
        p_description, p_line_items
    ) RETURNING id INTO v_invoice_id;
    
    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to process payment
CREATE OR REPLACE FUNCTION process_payment(
    p_billing_id UUID,
    p_payment_method VARCHAR,
    p_gateway_transaction_id VARCHAR,
    p_gateway_fee DECIMAL DEFAULT 0.00,
    p_gateway_response JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_billing_record RECORD;
    v_attempt_number INTEGER;
BEGIN
    -- Get billing record
    SELECT * INTO v_billing_record FROM billing WHERE id = p_billing_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Get next attempt number
    SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
    FROM payment_attempts WHERE billing_id = p_billing_id;
    
    -- Record payment attempt
    INSERT INTO payment_attempts (
        billing_id, user_id, attempt_number, payment_method,
        gateway_transaction_id, status, attempted_amount, gateway_fee,
        gateway_response, completed_at
    ) VALUES (
        p_billing_id, v_billing_record.user_id, v_attempt_number, p_payment_method,
        p_gateway_transaction_id, 'succeeded', v_billing_record.total_amount, p_gateway_fee,
        p_gateway_response, CURRENT_TIMESTAMP
    );
    
    -- Update billing record
    UPDATE billing 
    SET 
        status = 'paid',
        paid_at = CURRENT_TIMESTAMP,
        payment_method = p_payment_method,
        gateway_transaction_id = p_gateway_transaction_id,
        gateway_fee = p_gateway_fee
    WHERE id = p_billing_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle failed payment
CREATE OR REPLACE FUNCTION handle_failed_payment(
    p_billing_id UUID,
    p_failure_reason VARCHAR,
    p_failure_code VARCHAR DEFAULT NULL,
    p_gateway_response JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_billing_record RECORD;
    v_attempt_number INTEGER;
    v_next_retry TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get billing record
    SELECT * INTO v_billing_record FROM billing WHERE id = p_billing_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Get next attempt number
    SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
    FROM payment_attempts WHERE billing_id = p_billing_id;
    
    -- Record failed payment attempt
    INSERT INTO payment_attempts (
        billing_id, user_id, attempt_number, payment_method,
        status, attempted_amount, failure_reason, failure_code,
        gateway_response, completed_at
    ) VALUES (
        p_billing_id, v_billing_record.user_id, v_attempt_number, v_billing_record.payment_method,
        'failed', v_billing_record.total_amount, p_failure_reason, p_failure_code,
        p_gateway_response, CURRENT_TIMESTAMP
    );
    
    -- Calculate next retry time (exponential backoff)
    IF v_billing_record.retry_count < v_billing_record.max_retries THEN
        v_next_retry := CURRENT_TIMESTAMP + (INTERVAL '1 hour' * POWER(2, v_billing_record.retry_count));
        
        UPDATE billing 
        SET 
            status = 'failed',
            retry_count = retry_count + 1,
            next_retry_at = v_next_retry,
            dunning_level = CASE 
                WHEN retry_count >= max_retries THEN dunning_level + 1
                ELSE dunning_level
            END
        WHERE id = p_billing_id;
    ELSE
        -- Max retries reached
        UPDATE billing 
        SET 
            status = 'failed',
            retry_count = retry_count + 1,
            next_retry_at = NULL,
            dunning_level = dunning_level + 1
        WHERE id = p_billing_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get billing summary
CREATE OR REPLACE FUNCTION get_billing_summary(
    p_user_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE - INTERVAL '12 months',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE + INTERVAL '1 day'
)
RETURNS TABLE (
    total_invoiced DECIMAL,
    total_paid DECIMAL,
    total_pending DECIMAL,
    total_failed DECIMAL,
    total_refunded DECIMAL,
    invoice_count BIGINT,
    payment_count BIGINT,
    avg_payment_time_days DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(CASE WHEN transaction_type = 'invoice' THEN total_amount ELSE 0 END) as total_invoiced,
        SUM(CASE WHEN transaction_type IN ('payment', 'invoice') AND status = 'paid' THEN total_amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) as total_pending,
        SUM(CASE WHEN status = 'failed' THEN total_amount ELSE 0 END) as total_failed,
        SUM(CASE WHEN transaction_type = 'refund' THEN total_amount ELSE 0 END) as total_refunded,
        COUNT(*) FILTER (WHERE transaction_type = 'invoice')::BIGINT as invoice_count,
        COUNT(*) FILTER (WHERE transaction_type IN ('payment', 'invoice') AND status = 'paid')::BIGINT as payment_count,
        AVG(EXTRACT(EPOCH FROM (paid_at - created_at)) / 86400) as avg_payment_time_days
    FROM billing
    WHERE user_id = p_user_id
    AND created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Create view for overdue invoices
CREATE VIEW overdue_invoices AS
SELECT 
    b.*,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - b.due_date)) / 86400 as days_overdue,
    u.email as user_email,
    u.first_name,
    u.last_name
FROM billing b
JOIN users u ON b.user_id = u.id
WHERE b.status = 'pending'
AND b.transaction_type = 'invoice'
AND b.due_date < CURRENT_TIMESTAMP;

-- Create view for revenue analytics
CREATE VIEW revenue_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) FILTER (WHERE transaction_type = 'invoice') as invoices_created,
    COUNT(*) FILTER (WHERE transaction_type IN ('payment', 'invoice') AND status = 'paid') as payments_received,
    SUM(CASE WHEN transaction_type = 'invoice' THEN total_amount ELSE 0 END) as total_invoiced,
    SUM(CASE WHEN transaction_type IN ('payment', 'invoice') AND status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN transaction_type = 'refund' THEN total_amount ELSE 0 END) as total_refunds,
    AVG(CASE WHEN transaction_type = 'invoice' THEN total_amount END) as avg_invoice_amount,
    COUNT(DISTINCT user_id) as unique_customers
FROM billing
WHERE created_at >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC; 