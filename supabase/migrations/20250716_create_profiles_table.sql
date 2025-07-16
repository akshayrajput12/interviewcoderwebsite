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

-- Insert default subscription plans matching the pricing section
INSERT INTO public.subscription_plans (name, tag, description, price_monthly, price_yearly, credits_per_month, max_interviews_per_month, features, is_popular, highlight_text)
VALUES 
  (
    'Interview Coder',
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
    'Interview Coder', 
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
    'Interview Coder', 
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
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default roles
INSERT INTO public.user_roles (name, description, permissions)
VALUES 
  ('admin', 'Administrator with full access', '["read:all", "write:all", "delete:all", "manage:users", "manage:subscriptions", "manage:content", "manage:settings"]'),
  ('moderator', 'Moderator with limited admin access', '["read:all", "write:limited", "manage:content"]'),
  ('user', 'Standard user', '["read:own", "write:own"]'),
  ('premium', 'Premium user with additional features', '["read:own", "write:own", "access:premium"]');

-- Create profiles table with enhanced fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  job_title TEXT,
  company TEXT,
  website TEXT,
  github_username TEXT,
  linkedin_username TEXT,
  phone_number TEXT,
  country TEXT,
  timezone TEXT,
  preferred_language TEXT DEFAULT 'javascript',
  preferred_interview_type TEXT DEFAULT 'algorithm',
  experience_level TEXT DEFAULT 'intermediate',
  role_id INTEGER REFERENCES public.user_roles(id) DEFAULT 3, -- Default to 'user' role
  is_email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  subscription_plan_id INTEGER REFERENCES public.subscription_plans(id) DEFAULT 1,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_id TEXT,
  payment_method_id TEXT,
  payment_customer_id TEXT,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  total_credits INTEGER DEFAULT 50,
  used_credits INTEGER DEFAULT 0,
  remaining_credits INTEGER DEFAULT 50,
  bonus_credits INTEGER DEFAULT 0,
  last_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  next_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  interviews_this_month INTEGER DEFAULT 0,
  total_interviews INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  referral_code TEXT,
  referred_by UUID REFERENCES auth.users(id),
  referral_credits_earned INTEGER DEFAULT 0,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "marketing": false}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create credit transactions table to track credit usage
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'debit', 'credit', 'reset', 'bonus'
  description TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create interview sessions table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  interview_type TEXT NOT NULL, -- 'algorithm', 'system_design', 'behavioral'
  problem_id INTEGER,
  problem_title TEXT,
  problem_difficulty TEXT,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  credits_used INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  user_code TEXT,
  solution_quality TEXT, -- 'optimal', 'suboptimal', 'needs_improvement'
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Users can view their own credit transactions
CREATE POLICY "Users can view own credit transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (auth.uid() = profile_id);

-- Users can view their own interview sessions
CREATE POLICY "Users can view own interview sessions" 
  ON public.interview_sessions 
  FOR SELECT 
  USING (auth.uid() = profile_id);

-- Users can insert their own interview sessions
CREATE POLICY "Users can insert own interview sessions" 
  ON public.interview_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

-- Users can update their own interview sessions
CREATE POLICY "Users can update own interview sessions" 
  ON public.interview_sessions 
  FOR UPDATE 
  USING (auth.uid() = profile_id);

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
CREATE OR REPLACE TRIGGER on_auth_user_created
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

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE INDEX IF NOT EXISTS profiles_subscription_status_idx ON public.profiles (subscription_status);
CREATE INDEX IF NOT EXISTS credit_transactions_profile_id_idx ON public.credit_transactions (profile_id);
CREATE INDEX IF NOT EXISTS interview_sessions_profile_id_idx ON public.interview_sessions (profile_id);
CREATE INDEX IF NOT EXISTS interview_sessions_status_idx ON public.interview_sessions (status);