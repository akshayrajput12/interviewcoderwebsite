-- Create payment_orders table to track Razorpay orders
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE, -- Razorpay order ID
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id INTEGER REFERENCES public.subscription_plans(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL, -- Amount in rupees
  currency TEXT DEFAULT 'INR' NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'cancelled')),
  payment_id TEXT, -- Razorpay payment ID (filled after successful payment)
  signature TEXT, -- Razorpay signature (filled after successful payment)
  razorpay_order_data JSONB, -- Store complete Razorpay order response
  razorpay_payment_data JSONB, -- Store complete Razorpay payment response
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS payment_orders_user_id_idx ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS payment_orders_order_id_idx ON public.payment_orders(order_id);
CREATE INDEX IF NOT EXISTS payment_orders_status_idx ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS payment_orders_created_at_idx ON public.payment_orders(created_at);

-- Enable RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own payment orders
CREATE POLICY "Users can view own payment orders" 
  ON public.payment_orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own payment orders (for API usage)
CREATE POLICY "Users can insert own payment orders" 
  ON public.payment_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment orders (for payment completion)
CREATE POLICY "Users can update own payment orders" 
  ON public.payment_orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_payment_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payment_orders_updated_at
  BEFORE UPDATE ON public.payment_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_orders_updated_at();

-- Create function to process successful payment (transaction)
CREATE OR REPLACE FUNCTION public.process_successful_payment(
  p_user_id UUID,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_signature TEXT,
  p_plan_id INTEGER,
  p_billing_cycle TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE,
  p_credits_to_add INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_credits INTEGER := 0;
BEGIN
  -- Get current credits
  SELECT COALESCE(remaining_credits, 0) INTO current_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- Update payment order status
  UPDATE public.payment_orders
  SET
    status = 'paid',
    payment_id = p_payment_id,
    signature = p_signature,
    paid_at = now(),
    updated_at = now()
  WHERE order_id = p_order_id;

  -- Update user profile with new subscription
  UPDATE public.profiles
  SET
    subscription_plan_id = p_plan_id,
    subscription_status = 'active',
    subscription_start_date = p_start_date,
    subscription_end_date = p_end_date,
    total_credits = p_credits_to_add,
    remaining_credits = current_credits + p_credits_to_add,
    updated_at = now()
  WHERE id = p_user_id;

  -- Add credit transaction record
  INSERT INTO public.credit_transactions (
    profile_id,
    transaction_type,
    amount,
    description,
    balance_after,
    created_at
  ) VALUES (
    p_user_id,
    'credit',
    p_credits_to_add,
    'Credits added for subscription plan',
    current_credits + p_credits_to_add,
    now()
  );
END;
$$ LANGUAGE plpgsql;
