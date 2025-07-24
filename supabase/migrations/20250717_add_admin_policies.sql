-- Fix function syntax issues
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_remaining_credits() CASCADE;
DROP FUNCTION IF EXISTS public.use_credits(UUID, INTEGER, TEXT) CASCADE;

-- Create function to handle new user creation with default credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_credits INTEGER := 0;
BEGIN
  -- Insert the new profile with default values
  INSERT INTO public.profiles (
    id, 
    email, 
    subscription_plan_id,
    total_credits,
    used_credits,
    remaining_credits,
    created_at, 
    updated_at
  )
  VALUES (
    new.id, 
    new.email, 
    1, -- Free plan ID
    default_credits,
    0,
    default_credits,
    now(), 
    now()
  );
  
  -- Only record credit transaction if credits > 0
  IF default_credits > 0 THEN
    INSERT INTO public.credit_transactions (
      profile_id,
      amount,
      transaction_type,
      description,
      balance_after
    )
    VALUES (
      new.id,
      default_credits,
      'credit',
      'Initial free credits',
      default_credits
    );
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update remaining credits when used_credits changes
CREATE OR REPLACE FUNCTION public.update_remaining_credits() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.remaining_credits := NEW.total_credits - NEW.used_credits;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update remaining credits
DROP TRIGGER IF EXISTS update_remaining_credits_trigger ON public.profiles;
CREATE TRIGGER update_remaining_credits_trigger
  BEFORE UPDATE OF used_credits, total_credits ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_remaining_credits();

-- Create function to handle credit usage
CREATE OR REPLACE FUNCTION public.use_credits(
  user_id UUID,
  credits_to_use INTEGER,
  description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  current_remaining INTEGER;
BEGIN
  -- Get current remaining credits
  SELECT remaining_credits INTO current_remaining
  FROM public.profiles
  WHERE id = user_id;
  
  -- Check if user has enough credits
  IF current_remaining < credits_to_use THEN
    RETURN FALSE;
  END IF;
  
  -- Update profile credits
  UPDATE public.profiles
  SET 
    used_credits = used_credits + credits_to_use,
    updated_at = now()
  WHERE id = user_id;
  
  -- Record the transaction
  INSERT INTO public.credit_transactions (
    profile_id,
    amount,
    transaction_type,
    description,
    balance_after
  )
  VALUES (
    user_id,
    credits_to_use,
    'debit',
    description,
    current_remaining - credits_to_use
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create additional tables for admin functionality

-- Create settings table for application configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'info', 'warning', 'error', 'success'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  feedback_type TEXT NOT NULL, -- 'bug', 'feature', 'general'
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create promo codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed', 'credits'
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create promo code redemptions table
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  promo_code_id INTEGER REFERENCES public.promo_codes(id) NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  credits_added INTEGER,
  discount_applied DECIMAL(10, 2)
);

-- Enable RLS on new tables
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM public.profiles p
  JOIN public.user_roles r ON p.role_id = r.id
  WHERE p.id = user_id;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user is a moderator or admin
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM public.profiles p
  JOIN public.user_roles r ON p.role_id = r.id
  WHERE p.id = user_id;
  
  RETURN user_role IN ('admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action TEXT,
  entity TEXT,
  entity_id TEXT,
  details JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity,
    entity_id,
    details,
    ip_address
  )
  VALUES (
    auth.uid(),
    action,
    entity,
    entity_id,
    details,
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies to all tables

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Admin policies for credit transactions
CREATE POLICY "Admins can view all credit transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert credit transactions" 
  ON public.credit_transactions 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Admin policies for interview sessions
CREATE POLICY "Admins can view all interview sessions" 
  ON public.interview_sessions 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all interview sessions" 
  ON public.interview_sessions 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete interview sessions" 
  ON public.interview_sessions 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Admin policies for app settings
CREATE POLICY "Admins can manage app settings" 
  ON public.app_settings 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view public app settings" 
  ON public.app_settings 
  FOR SELECT 
  USING (is_public = true);

-- Admin policies for audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Admin policies for admin notifications
CREATE POLICY "Admins can view notifications" 
  ON public.admin_notifications 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update notifications" 
  ON public.admin_notifications 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Admin policies for user feedback
CREATE POLICY "Users can insert feedback" 
  ON public.user_feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can view own feedback" 
  ON public.user_feedback 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can view all feedback" 
  ON public.user_feedback 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update feedback" 
  ON public.user_feedback 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Admin policies for promo codes
CREATE POLICY "Admins can manage promo codes" 
  ON public.promo_codes 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active promo codes" 
  ON public.promo_codes 
  FOR SELECT 
  USING (is_active = true);

-- Admin policies for promo redemptions
CREATE POLICY "Users can view own redemptions" 
  ON public.promo_redemptions 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can view all redemptions" 
  ON public.promo_redemptions 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Admin policies for user roles
CREATE POLICY "Admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view user roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (true);

-- Admin policies for subscription plans
CREATE POLICY "Admins can manage subscription plans" 
  ON public.subscription_plans 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (is_active = true);

-- Create admin dashboard views for easier querying

-- User statistics view
CREATE OR REPLACE VIEW public.admin_user_stats AS
SELECT
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE p.created_at >= NOW() - INTERVAL '30 days') AS new_users_last_30_days,
  COUNT(*) FILTER (WHERE p.last_login >= NOW() - INTERVAL '7 days') AS active_users_last_7_days,
  COUNT(*) FILTER (WHERE p.subscription_status = 'active') AS active_subscribers,
  ROUND(AVG(p.total_interviews)::numeric, 2) AS avg_interviews_per_user,
  ROUND(SUM(p.total_spent)::numeric, 2) AS total_revenue
FROM
  public.profiles p;

-- Subscription statistics view
CREATE OR REPLACE VIEW public.admin_subscription_stats AS
SELECT
  sp.name,
  sp.tag,
  COUNT(p.id) AS user_count,
  ROUND(SUM(p.total_spent)::numeric, 2) AS total_revenue
FROM
  public.subscription_plans sp
LEFT JOIN
  public.profiles p ON sp.id = p.subscription_plan_id
GROUP BY
  sp.id, sp.name, sp.tag
ORDER BY
  user_count DESC;

-- Recent activity view
CREATE OR REPLACE VIEW public.admin_recent_activity AS
SELECT
  'interview' AS activity_type,
  i.id AS activity_id,
  p.email AS user_email,
  i.interview_type,
  i.problem_title,
  i.credits_used,
  i.created_at
FROM
  public.interview_sessions i
JOIN
  public.profiles p ON i.profile_id = p.id
UNION ALL
SELECT
  'subscription' AS activity_type,
  NULL AS activity_id,
  p.email AS user_email,
  p.subscription_status AS interview_type,
  sp.name || ' ' || sp.tag AS problem_title,
  NULL AS credits_used,
  p.subscription_start_date AS created_at
FROM
  public.profiles p
JOIN
  public.subscription_plans sp ON p.subscription_plan_id = sp.id
WHERE
  p.subscription_start_date IS NOT NULL
UNION ALL
SELECT
  'feedback' AS activity_type,
  f.id AS activity_id,
  p.email AS user_email,
  f.feedback_type AS interview_type,
  f.subject AS problem_title,
  NULL AS credits_used,
  f.created_at
FROM
  public.user_feedback f
JOIN
  public.profiles p ON f.profile_id = p.id
ORDER BY
  created_at DESC
LIMIT 100;

-- Insert default app settings
INSERT INTO public.app_settings (key, value, description, is_public)
VALUES
  ('site_maintenance', '{"enabled": false, "message": "Site is under maintenance. Please check back later."}', 'Site maintenance mode settings', true),
  ('credit_settings', '{"free_signup_credits": 50, "referral_bonus": 25, "monthly_reset_day": 1}', 'Credit allocation settings', false),
  ('email_templates', '{"welcome": {"subject": "Welcome to GhostCoder", "template_id": "welcome-template"}, "password_reset": {"subject": "Reset Your Password", "template_id": "password-reset-template"}}', 'Email template settings', false),
  ('feature_flags', '{"enable_referrals": true, "enable_promo_codes": true, "enable_social_login": true}', 'Feature flag settings', true);

-- Create a function to promote a user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID from the email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update the user's role to admin
  UPDATE public.profiles
  SET role_id = 1 -- Admin role ID
  WHERE id = target_user_id;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'promote_to_admin',
    'profiles',
    target_user_id::text,
    json_build_object('email', user_email)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to add credits to a user
CREATE OR REPLACE FUNCTION public.add_user_credits(user_email TEXT, credit_amount INTEGER, reason TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
  current_credits INTEGER;
BEGIN
  -- Find the user ID from the email
  SELECT id, total_credits INTO target_user_id, current_credits
  FROM public.profiles
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update the user's credits
  UPDATE public.profiles
  SET 
    total_credits = total_credits + credit_amount,
    updated_at = now()
  WHERE id = target_user_id;
  
  -- Record the transaction
  INSERT INTO public.credit_transactions (
    profile_id,
    amount,
    transaction_type,
    description,
    balance_after
  )
  VALUES (
    target_user_id,
    credit_amount,
    'credit',
    reason,
    current_credits + credit_amount
  );
  
  -- Log the action
  PERFORM public.log_admin_action(
    'add_credits',
    'profiles',
    target_user_id::text,
    json_build_object('email', user_email, 'amount', credit_amount, 'reason', reason)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;