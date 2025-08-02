-- Migration to add one-time pro plan support
-- Run this migration after the complete_setup.sql

-- 1. Add new columns to profiles table for one-time pro tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_purchased_one_time_pro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS one_time_pro_purchase_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS one_time_credits_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS one_time_credits_used INTEGER DEFAULT 0;

-- 2. First, delete any existing free plan
DELETE FROM public.subscription_plans
WHERE (name = 'GhostCoder' AND tag = 'Free' AND price_monthly = 0)
   OR (tag = 'One-Time Pro');

-- 3. Insert the new one-time pro plan (NOT a subscription, it's a one-time purchase)
INSERT INTO public.subscription_plans (
  name,
  tag,
  description,
  price_monthly,
  price_yearly,
  credits_per_month,
  max_interviews_per_month,
  features,
  is_popular,
  highlight_text,
  is_active
) VALUES (
  'Interview Coder Pro',
  'One-Time Pro',
  'One-time upgrade with 5 credits - No monthly subscription needed',
  49,
  null,
  0, -- This is NOT monthly credits, it's a one-time credit grant
  10,
  '["5 one-time credits (not monthly)", "Pro plan features", "Advanced AI models", "Priority support", "Undetectable in all platforms", "One purchase per user only"]',
  false,
  'One-time offer - 5 credits for ₹49',
  true
);

-- 3. Update payment_orders table to support one-time billing cycle
ALTER TABLE public.payment_orders 
DROP CONSTRAINT IF EXISTS payment_orders_billing_cycle_check;

ALTER TABLE public.payment_orders 
ADD CONSTRAINT payment_orders_billing_cycle_check 
CHECK (billing_cycle IN ('monthly', 'yearly', 'one-time'));

-- 4. Create function to process one-time pro upgrade
CREATE OR REPLACE FUNCTION public.process_one_time_pro_upgrade(
  p_user_id UUID,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_signature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
  one_time_credits_to_add INTEGER := 5; -- Fixed 5 credits for one-time purchase
  pro_plan_id INTEGER;
BEGIN
  -- Check if user has already purchased one-time pro
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND has_purchased_one_time_pro = true
  ) THEN
    RAISE EXCEPTION 'User has already purchased the one-time pro upgrade. This offer is limited to one purchase per user.';
  END IF;

  -- Get current credits
  SELECT COALESCE(current_month_credits, 0) INTO current_credits
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
  WHERE order_id = p_order_id AND user_id = p_user_id;

  -- Get a Pro plan ID (prefer the 999 rupees plan as it's marked popular)
  SELECT id INTO pro_plan_id
  FROM public.subscription_plans
  WHERE tag = 'Pro' AND price_monthly = 999
  LIMIT 1;

  -- If no 999 plan found, get any Pro plan
  IF pro_plan_id IS NULL THEN
    SELECT id INTO pro_plan_id
    FROM public.subscription_plans
    WHERE tag = 'Pro'
    LIMIT 1;
  END IF;

  -- Update user profile with one-time pro upgrade
  UPDATE public.profiles
  SET
    has_purchased_one_time_pro = true,
    one_time_pro_purchase_date = now(),
    one_time_credits_total = 5, -- Total one-time credits received
    one_time_credits_used = 0,  -- Initially no credits used
    current_month_credits = COALESCE(current_month_credits, 0) + one_time_credits_to_add,
    total_lifetime_credits = COALESCE(total_lifetime_credits, 0) + one_time_credits_to_add,
    subscription_plan_id = pro_plan_id, -- Set user to Pro plan
    subscription_status = 'active', -- Set subscription as active
    updated_at = now()
  WHERE id = p_user_id;

  -- Add credit transaction record
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
    one_time_credits_to_add,
    'One-time Pro upgrade - 5 credits (₹49 one-time purchase)',
    to_char(now(), 'YYYY-MM'),
    current_credits + one_time_credits_to_add
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to check if user can purchase one-time pro
CREATE OR REPLACE FUNCTION public.can_purchase_one_time_pro(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND has_purchased_one_time_pro = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to get user's one-time pro status
CREATE OR REPLACE FUNCTION public.get_one_time_pro_status(p_user_id UUID)
RETURNS TABLE (
  has_purchased BOOLEAN,
  purchase_date TIMESTAMP WITH TIME ZONE,
  total_credits INTEGER,
  credits_used INTEGER,
  credits_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(p.has_purchased_one_time_pro, false) as has_purchased,
    p.one_time_pro_purchase_date as purchase_date,
    COALESCE(p.one_time_credits_total, 0) as total_credits,
    COALESCE(p.one_time_credits_used, 0) as credits_used,
    COALESCE(p.one_time_credits_total, 0) - COALESCE(p.one_time_credits_used, 0) as credits_remaining
  FROM public.profiles p
  WHERE p.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to use one-time pro credits
CREATE OR REPLACE FUNCTION public.use_one_time_pro_credit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  remaining_credits INTEGER;
BEGIN
  -- Check if user has one-time pro and remaining credits
  SELECT
    COALESCE(one_time_credits_total, 0) - COALESCE(one_time_credits_used, 0)
  INTO remaining_credits
  FROM public.profiles
  WHERE id = p_user_id AND has_purchased_one_time_pro = true;

  IF remaining_credits IS NULL OR remaining_credits <= 0 THEN
    RETURN FALSE; -- No credits available
  END IF;

  -- Use one credit
  UPDATE public.profiles
  SET
    one_time_credits_used = COALESCE(one_time_credits_used, 0) + 1,
    current_month_credits = GREATEST(0, COALESCE(current_month_credits, 0) - 1),
    updated_at = now()
  WHERE id = p_user_id;

  -- Log the credit usage
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
    'debit',
    1,
    'Used one-time pro credit',
    to_char(now(), 'YYYY-MM'),
    COALESCE((SELECT current_month_credits FROM public.profiles WHERE id = p_user_id), 0)
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS profiles_one_time_pro_idx ON public.profiles (has_purchased_one_time_pro);
CREATE INDEX IF NOT EXISTS profiles_one_time_credits_idx ON public.profiles (one_time_credits_total, one_time_credits_used);

-- 9. Add comments for documentation
COMMENT ON FUNCTION public.process_one_time_pro_upgrade(UUID, TEXT, TEXT, TEXT) IS 'Processes one-time pro upgrade payment and adds 5 credits to user account (one-time purchase only)';
COMMENT ON FUNCTION public.can_purchase_one_time_pro(UUID) IS 'Checks if user is eligible to purchase one-time pro upgrade (limited to one purchase per user)';
COMMENT ON FUNCTION public.get_one_time_pro_status(UUID) IS 'Returns user one-time pro purchase status and credit information';
COMMENT ON FUNCTION public.use_one_time_pro_credit(UUID) IS 'Uses one credit from user one-time pro purchase';

-- 10. Create a view for easy one-time pro tracking
CREATE OR REPLACE VIEW public.one_time_pro_users AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.has_purchased_one_time_pro,
  p.one_time_pro_purchase_date,
  p.one_time_credits_total,
  p.one_time_credits_used,
  (p.one_time_credits_total - p.one_time_credits_used) as credits_remaining,
  p.current_month_credits
FROM public.profiles p
WHERE p.has_purchased_one_time_pro = true;

-- Migration complete
DO $$
BEGIN
  RAISE NOTICE '=== ONE-TIME PRO PLAN MIGRATION COMPLETED ===';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes applied:';
  RAISE NOTICE '- Removed old free plan and created new one-time pro plan';
  RAISE NOTICE '- Price: ₹49 for 5 credits (ONE-TIME PURCHASE ONLY)';
  RAISE NOTICE '- Added tracking columns: has_purchased_one_time_pro, one_time_credits_total, one_time_credits_used';
  RAISE NOTICE '- Created functions for purchase processing and credit management';
  RAISE NOTICE '- Added purchase restriction: ONE purchase per user only';
  RAISE NOTICE '- Created view for tracking one-time pro users';
  RAISE NOTICE '';
  RAISE NOTICE 'Key Features:';
  RAISE NOTICE '- Users pay ₹49 once and get 5 credits';
  RAISE NOTICE '- Cannot purchase again after first purchase';
  RAISE NOTICE '- Credits are tracked separately from monthly subscriptions';
  RAISE NOTICE '- Complete audit trail of credit usage';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps: Update your frontend to handle one-time purchases!';
END $$;
