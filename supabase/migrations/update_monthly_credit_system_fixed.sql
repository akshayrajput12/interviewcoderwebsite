-- Update Migration: Monthly Credit Limits with No Rollover (FIXED VERSION)
-- Run this AFTER the complete_setup.sql has been executed
-- This updates the existing database to implement monthly credit limits

-- Step 1: Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_credit_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_month_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_month_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_reset_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_lifetime_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_lifetime_used INTEGER DEFAULT 0;

-- Step 2: Update credit_transactions table structure
ALTER TABLE public.credit_transactions 
ADD COLUMN IF NOT EXISTS month_year TEXT,
ADD COLUMN IF NOT EXISTS credits_after INTEGER;

-- Update transaction_type constraint to include 'reset'
ALTER TABLE public.credit_transactions 
DROP CONSTRAINT IF EXISTS credit_transactions_transaction_type_check;

ALTER TABLE public.credit_transactions 
ADD CONSTRAINT credit_transactions_transaction_type_check 
CHECK (transaction_type IN ('credit', 'debit', 'renewal', 'reset'));

-- Step 3: Migrate existing users to new credit system
UPDATE public.profiles 
SET 
  monthly_credit_limit = CASE 
    WHEN subscription_plan_id = 2 AND billing_cycle = 'yearly' THEN 150
    WHEN subscription_plan_id = 3 AND billing_cycle = 'monthly' THEN 100
    ELSE 0
  END,
  current_month_credits = CASE 
    WHEN subscription_status = 'active' AND subscription_plan_id = 2 AND billing_cycle = 'yearly' THEN 150
    WHEN subscription_status = 'active' AND subscription_plan_id = 3 AND billing_cycle = 'monthly' THEN 100
    ELSE 0
  END,
  current_month_used = CASE 
    WHEN subscription_status = 'active' THEN LEAST(COALESCE(used_credits, 0), 
      CASE 
        WHEN subscription_plan_id = 2 AND billing_cycle = 'yearly' THEN 150
        WHEN subscription_plan_id = 3 AND billing_cycle = 'monthly' THEN 100
        ELSE 0
      END)
    ELSE 0
  END,
  credit_reset_date = CASE 
    WHEN subscription_status = 'active' THEN 
      CASE 
        WHEN billing_cycle = 'yearly' THEN COALESCE(subscription_start_date, now()) + INTERVAL '1 month'
        WHEN billing_cycle = 'monthly' THEN COALESCE(subscription_start_date, now()) + INTERVAL '1 month'
        ELSE NULL
      END
    ELSE NULL
  END,
  total_lifetime_credits = COALESCE(total_credits, 0),
  total_lifetime_used = COALESCE(used_credits, 0)
WHERE subscription_plan_id IS NOT NULL;

-- Step 4: Update existing credit_transactions with month_year and credits_after
UPDATE public.credit_transactions 
SET 
  month_year = to_char(created_at, 'YYYY-MM'),
  credits_after = COALESCE(balance_after, 0)
WHERE month_year IS NULL;

-- Step 5: Drop old functions and triggers (order matters!)
DROP TRIGGER IF EXISTS update_remaining_credits_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.update_remaining_credits() CASCADE;
DROP FUNCTION IF EXISTS public.use_credits(UUID, INTEGER, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.renew_monthly_credits() CASCADE;

-- Step 6: Create new function to calculate next month's reset date
CREATE OR REPLACE FUNCTION public.calculate_next_reset_date(input_date TIMESTAMP WITH TIME ZONE)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  -- Reset on the same day next month at midnight
  RETURN date_trunc('day', input_date + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create function to reset monthly credits
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
  IF plan_record IS NULL OR plan_record.subscription_status != 'active' THEN
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
    total_lifetime_credits = COALESCE(total_lifetime_credits, 0) + plan_record.credits_per_month,
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

-- Step 8: Update use_credits function for monthly limits
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
  new_remaining := COALESCE(user_record.current_month_credits, 0) - COALESCE(user_record.current_month_used, 0);

  -- Check if user has enough credits this month
  IF new_remaining < credits_to_use THEN
    RETURN QUERY SELECT false, new_remaining, 'Insufficient credits for this month';
    RETURN;
  END IF;

  -- Calculate new used amount
  new_used := COALESCE(user_record.current_month_used, 0) + credits_to_use;
  new_remaining := COALESCE(user_record.current_month_credits, 0) - new_used;

  -- Update user's monthly used credits
  UPDATE public.profiles
  SET
    current_month_used = new_used,
    total_lifetime_used = COALESCE(total_lifetime_used, 0) + credits_to_use,
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

-- Step 9: Drop and recreate process_successful_payment function for monthly credit system
DROP FUNCTION IF EXISTS public.process_successful_payment(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, INTEGER);

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
    total_lifetime_credits = COALESCE(total_lifetime_credits, 0) + p_credits_per_month,
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

-- Step 10: Create function to process monthly credit resets (runs daily)
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

-- Step 11: Update indexes for new columns
CREATE INDEX IF NOT EXISTS idx_profiles_credit_reset_date ON public.profiles(credit_reset_date);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_month_year ON public.credit_transactions(month_year);

-- Step 12: Old functions already dropped in Step 5

-- Step 13: Update comments
COMMENT ON FUNCTION public.process_monthly_credit_resets() IS 'Resets monthly credits for all active subscribers - should be run daily via cron';
COMMENT ON FUNCTION public.reset_monthly_credits(UUID) IS 'Resets monthly credits for a specific user (unused credits are lost)';
COMMENT ON FUNCTION public.use_credits(UUID, INTEGER, TEXT) IS 'Uses credits with monthly limit enforcement';

-- Step 14: Update cron job setup (uncomment if pg_cron is available)
-- SELECT cron.unschedule('monthly-credit-renewal'); -- Remove old job
-- SELECT cron.schedule('monthly-credit-reset', '0 0 * * *', 'SELECT public.process_monthly_credit_resets();');

-- Final success message
DO $$
BEGIN
  RAISE NOTICE 'Monthly Credit System Update completed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New Features:';
  RAISE NOTICE '- Monthly credit limits with no rollover';
  RAISE NOTICE '- Yearly plan: 150 credits/month, resets monthly';
  RAISE NOTICE '- Monthly plan: 100 credits/month, resets monthly';
  RAISE NOTICE '- Unused credits are lost at month end';
  RAISE NOTICE '';
  RAISE NOTICE 'Database Changes:';
  RAISE NOTICE '- Added monthly_credit_limit, current_month_credits, current_month_used columns';
  RAISE NOTICE '- Added credit_reset_date for automatic monthly resets';
  RAISE NOTICE '- Updated credit_transactions with month_year tracking';
  RAISE NOTICE '- Migrated existing users to new credit system';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Update your payment verification API to use new process_successful_payment function';
  RAISE NOTICE '2. Set up daily cron job: SELECT public.process_monthly_credit_resets();';
  RAISE NOTICE '3. Test the credit usage with: SELECT * FROM public.use_credits(user_id, credits, description);';
  RAISE NOTICE '';
  RAISE NOTICE 'API Changes Required:';
  RAISE NOTICE '- Update /api/payment/verify/route.ts to use p_credits_per_month instead of p_credits_to_add';
END $$;
