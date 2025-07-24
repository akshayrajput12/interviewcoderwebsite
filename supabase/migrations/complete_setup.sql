-- Complete SQL Setup for GhostCoder Platform
-- This script sets up the entire database structure with all features

-- Drop existing tables and functions if they exist (for clean setup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_remaining_credits_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_remaining_credits();
DROP FUNCTION IF EXISTS public.process_successful_payment(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.use_credits(UUID, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.renew_monthly_credits();

DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.payment_orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2),
  currency TEXT DEFAULT '₹',
  credits_per_month INTEGER NOT NULL,
  max_interviews_per_month INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  highlight_text TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert subscription plans
INSERT INTO public.subscription_plans (name, tag, description, price_monthly, price_yearly, credits_per_month, max_interviews_per_month, features, is_popular, highlight_text)
VALUES 
  (
    'GhostCoder', 
    'Free', 
    'Try it and see', 
    0, 
    0, 
    0, 
    5, 
    '["Test visibility in screen sharing", "Basic interface access", "No credits included", "Limited functionality"]',
    false,
    null
  ),
  (
    'GhostCoder', 
    'Pro', 
    'Most popular', 
    999, 
    11988, 
    150, 
    50, 
    '["150 credits per month", "Full access to all features", "Advanced AI models", "24/7 customer support", "Undetectable in all platforms"]',
    true,
    'Save ₹6,000 yearly'
  ),
  (
    'GhostCoder', 
    'Pro', 
    'Monthly subscription', 
    1499, 
    null, 
    100, 
    30, 
    '["100 credits per month", "Full access to all features", "Advanced AI models", "24/7 customer support", "Undetectable in all platforms"]',
    false,
    null
  );

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default roles
INSERT INTO public.user_roles (name, description, permissions) VALUES
('user', 'Regular user with basic permissions', '["read_profile", "update_profile", "use_credits"]'),
('admin', 'Administrator with full permissions', '["all"]');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role_id INTEGER REFERENCES public.user_roles(id) DEFAULT 1,
  subscription_plan_id INTEGER REFERENCES public.subscription_plans(id) DEFAULT 1,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'expired')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
  monthly_credit_limit INTEGER DEFAULT 0,        -- Max credits per month
  current_month_credits INTEGER DEFAULT 0,       -- Credits available this month
  current_month_used INTEGER DEFAULT 0,          -- Credits used this month
  credit_reset_date TIMESTAMP WITH TIME ZONE,    -- When credits reset next
  total_lifetime_credits INTEGER DEFAULT 0,      -- Total credits ever received
  total_lifetime_used INTEGER DEFAULT 0,         -- Total credits ever used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create credit transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'renewal', 'reset')),
  description TEXT,
  month_year TEXT,                               -- Track which month (e.g., '2025-01')
  credits_after INTEGER NOT NULL,                -- Credits remaining after transaction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create payment orders table
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id INTEGER REFERENCES public.subscription_plans(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'cancelled')),
  payment_id TEXT,
  signature TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  razorpay_order_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Subscription plans - readable by all
CREATE POLICY "Subscription plans are viewable by everyone" 
  ON public.subscription_plans FOR SELECT 
  USING (true);

-- User roles - readable by all
CREATE POLICY "User roles are viewable by everyone" 
  ON public.user_roles FOR SELECT 
  USING (true);

-- Profiles - users can view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Credit transactions - users can view their own transactions
CREATE POLICY "Users can view own credit transactions" 
  ON public.credit_transactions FOR SELECT 
  USING (auth.uid() = profile_id);

-- Payment orders - users can view their own orders
CREATE POLICY "Users can view own payment orders" 
  ON public.payment_orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin policies (users with role_id = 2 can access everything)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role_id = 2
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role_id = 2
    )
  );

CREATE POLICY "Admins can view all credit transactions" 
  ON public.credit_transactions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role_id = 2
    )
  );

CREATE POLICY "Admins can view all payment orders" 
  ON public.payment_orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role_id = 2
    )
  );

-- Function to handle new user creation (0 credits for free users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    subscription_plan_id,
    monthly_credit_limit,
    current_month_credits,
    current_month_used,
    total_lifetime_credits,
    total_lifetime_used,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    1, -- Free plan ID
    0, -- No monthly credit limit for free users
    0, -- No current month credits
    0, -- No credits used
    0, -- No lifetime credits
    0, -- No lifetime used
    now(),
    now()
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate next month's reset date
CREATE OR REPLACE FUNCTION public.calculate_next_reset_date(current_date TIMESTAMP WITH TIME ZONE)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  -- Reset on the same day next month at midnight
  RETURN date_trunc('day', current_date + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql;

-- Function to use credits (with monthly limits)
CREATE OR REPLACE FUNCTION public.use_credits(
  user_id UUID,
  credits_to_use INTEGER,
  description TEXT DEFAULT 'Credit usage'
)
RETURNS TABLE(success BOOLEAN, remaining_credits INTEGER, message TEXT) AS $$
DECLARE
  user_record RECORD;
  current_month TEXT;
  new_used INTEGER;
  new_remaining INTEGER;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(now(), 'YYYY-MM');

  -- Get user's current credit status
  SELECT
    p.current_month_credits,
    p.current_month_used,
    p.credit_reset_date,
    p.subscription_status
  INTO user_record
  FROM public.profiles p
  WHERE p.id = user_id;

  -- Check if user exists
  IF user_record IS NULL THEN
    RETURN QUERY SELECT false, 0, 'User not found';
    RETURN;
  END IF;

  -- Check if user has active subscription
  IF user_record.subscription_status != 'active' THEN
    RETURN QUERY SELECT false, 0, 'No active subscription';
    RETURN;
  END IF;

  -- Check if credits need to be reset (new month)
  IF user_record.credit_reset_date IS NULL OR now() >= user_record.credit_reset_date THEN
    -- Reset credits for new month
    PERFORM public.reset_monthly_credits(user_id);

    -- Refresh user record after reset
    SELECT
      p.current_month_credits,
      p.current_month_used
    INTO user_record
    FROM public.profiles p
    WHERE p.id = user_id;
  END IF;

  -- Calculate remaining credits for this month
  new_remaining := user_record.current_month_credits - user_record.current_month_used;

  -- Check if user has enough credits this month
  IF new_remaining < credits_to_use THEN
    RETURN QUERY SELECT false, new_remaining, 'Insufficient credits for this month';
    RETURN;
  END IF;

  -- Calculate new used amount
  new_used := user_record.current_month_used + credits_to_use;
  new_remaining := user_record.current_month_credits - new_used;

  -- Update user's monthly used credits
  UPDATE public.profiles
  SET
    current_month_used = new_used,
    total_lifetime_used = total_lifetime_used + credits_to_use,
    updated_at = now()
  WHERE id = user_id;

  -- Record the transaction
  INSERT INTO public.credit_transactions (
    profile_id,
    amount,
    transaction_type,
    description,
    month_year,
    credits_after
  )
  VALUES (
    user_id,
    -credits_to_use,
    'debit',
    description,
    current_month,
    new_remaining
  );

  RETURN QUERY SELECT true, new_remaining, 'Credits used successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly credits (called automatically)
CREATE OR REPLACE FUNCTION public.reset_monthly_credits(user_id UUID)
RETURNS VOID AS $$
DECLARE
  plan_record RECORD;
  current_month TEXT;
  next_reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');

  -- Get user's subscription plan details
  SELECT
    sp.credits_per_month,
    p.subscription_status,
    p.billing_cycle
  INTO plan_record
  FROM public.profiles p
  JOIN public.subscription_plans sp ON p.subscription_plan_id = sp.id
  WHERE p.id = user_id;

  -- Only reset for active subscriptions
  IF plan_record.subscription_status != 'active' THEN
    RETURN;
  END IF;

  -- Calculate next reset date (same day next month)
  next_reset_date := public.calculate_next_reset_date(now());

  -- Reset monthly credits (unused credits are lost)
  UPDATE public.profiles
  SET
    current_month_credits = plan_record.credits_per_month,
    current_month_used = 0,
    credit_reset_date = next_reset_date,
    total_lifetime_credits = total_lifetime_credits + plan_record.credits_per_month,
    updated_at = now()
  WHERE id = user_id;

  -- Record the reset transaction
  INSERT INTO public.credit_transactions (
    profile_id,
    amount,
    transaction_type,
    description,
    month_year,
    credits_after
  )
  VALUES (
    user_id,
    plan_record.credits_per_month,
    'reset',
    CASE
      WHEN plan_record.billing_cycle = 'yearly' THEN 'Monthly credit reset (yearly plan)'
      ELSE 'Monthly credit reset (monthly plan)'
    END,
    current_month,
    plan_record.credits_per_month
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process successful payment (updated for monthly limits)
CREATE OR REPLACE FUNCTION public.process_successful_payment(
  p_user_id UUID,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_signature TEXT,
  p_plan_id INTEGER,
  p_billing_cycle TEXT,
  p_start_date TEXT,
  p_end_date TEXT,
  p_credits_per_month INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_month TEXT;
  next_reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  next_reset_date := public.calculate_next_reset_date(now());

  -- Update payment order status
  UPDATE public.payment_orders
  SET
    status = 'paid',
    payment_id = p_payment_id,
    signature = p_signature,
    paid_at = now(),
    updated_at = now()
  WHERE order_id = p_order_id;

  -- Update user profile with new subscription and monthly credit system
  UPDATE public.profiles
  SET
    subscription_plan_id = p_plan_id,
    subscription_status = 'active',
    subscription_start_date = p_start_date::timestamp,
    subscription_end_date = p_end_date::timestamp,
    billing_cycle = p_billing_cycle,
    monthly_credit_limit = p_credits_per_month,
    current_month_credits = p_credits_per_month,
    current_month_used = 0,
    credit_reset_date = next_reset_date,
    total_lifetime_credits = total_lifetime_credits + p_credits_per_month,
    updated_at = now()
  WHERE id = p_user_id;

  -- Add initial credit transaction record
  INSERT INTO public.credit_transactions (
    profile_id,
    transaction_type,
    amount,
    description,
    month_year,
    credits_after
  )
  VALUES (
    p_user_id,
    'credit',
    p_credits_per_month,
    CASE
      WHEN p_billing_cycle = 'yearly' THEN 'Subscription activated - Monthly credits (yearly plan)'
      ELSE 'Subscription activated - Monthly credits (monthly plan)'
    END,
    current_month,
    p_credits_per_month
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process monthly credit resets (runs daily)
CREATE OR REPLACE FUNCTION public.process_monthly_credit_resets()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find all active subscribers who need credit reset
  FOR user_record IN
    SELECT p.id
    FROM public.profiles p
    WHERE p.subscription_status = 'active'
      AND p.subscription_end_date > now()
      AND (
        p.credit_reset_date IS NULL
        OR now() >= p.credit_reset_date
      )
  LOOP
    -- Reset monthly credits for this user
    PERFORM public.reset_monthly_credits(user_record.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run monthly credit resets daily
-- Note: This requires pg_cron extension to be enabled
-- You can also call this function manually or via a cron job outside the database

-- Example of how to set up the cron job (uncomment if pg_cron is available):
-- SELECT cron.schedule('monthly-credit-reset', '0 0 * * *', 'SELECT public.process_monthly_credit_resets();');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_cycle ON public.profiles(billing_cycle);
CREATE INDEX IF NOT EXISTS idx_profiles_credit_reset_date ON public.profiles(credit_reset_date);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_profile_id ON public.credit_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_month_year ON public.credit_transactions(month_year);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);

-- Insert admin user (optional - update with your admin email)
-- INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'admin@ghostcoder.com');
-- UPDATE public.profiles SET role_id = 2 WHERE email = 'admin@ghostcoder.com';

COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans with pricing and features';
COMMENT ON TABLE public.profiles IS 'User profiles with monthly credit limits and usage tracking';
COMMENT ON TABLE public.credit_transactions IS 'Log of all credit transactions (usage, resets, purchases) with monthly tracking';
COMMENT ON TABLE public.payment_orders IS 'Razorpay payment orders and their status';
COMMENT ON FUNCTION public.process_monthly_credit_resets() IS 'Resets monthly credits for all active subscribers - should be run daily via cron';
COMMENT ON FUNCTION public.reset_monthly_credits(UUID) IS 'Resets monthly credits for a specific user (unused credits are lost)';
COMMENT ON FUNCTION public.use_credits(UUID, INTEGER, TEXT) IS 'Uses credits with monthly limit enforcement';

-- Complete setup message
DO $$
BEGIN
  RAISE NOTICE 'GhostCoder database setup completed successfully!';
  RAISE NOTICE 'Features included:';
  RAISE NOTICE '- Free plan with 0 credits';
  RAISE NOTICE '- Pro yearly plan (₹999/month billed ₹11,988 annually) - 150 credits/month, no rollover';
  RAISE NOTICE '- Pro monthly plan (₹1,499/month) - 100 credits/month, no rollover';
  RAISE NOTICE '- Monthly credit limits with automatic reset (unused credits are lost)';
  RAISE NOTICE '- Complete payment processing with Razorpay integration';
  RAISE NOTICE '- Row Level Security enabled';
  RAISE NOTICE '';
  RAISE NOTICE 'Credit System:';
  RAISE NOTICE '- Yearly plan: 150 credits per month, resets monthly, no rollover';
  RAISE NOTICE '- Monthly plan: 100 credits per month, resets monthly, no rollover';
  RAISE NOTICE '- Unused credits are lost at month end (use it or lose it)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Set up pg_cron extension for automatic credit resets';
  RAISE NOTICE '2. Or call public.process_monthly_credit_resets() function daily via external cron';
  RAISE NOTICE '3. Update admin email in the script if needed';
  RAISE NOTICE '4. Update payment verification API to use new credit system';
END $$;
