# Supabase Authentication Setup Guide

This guide will help you set up authentication with Supabase for the Interview Coder application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Note your project URL and API keys (found in Project Settings > API)

## 2. Configure Environment Variables

Update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 3. Set Up Database Tables

Run the SQL migration script in the Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
```

## 4. Configure Authentication Providers

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider and configure settings as needed
3. Optionally enable OAuth providers like Google and GitHub

## 5. Set Up Email Templates

1. Go to Authentication > Email Templates
2. Customize the email templates for:
   - Confirmation email
   - Magic link email
   - Password reset email

## 6. Configure Site URL and Redirect URLs

1. Go to Authentication > URL Configuration
2. Set Site URL to your production URL (e.g., `https://your-domain.com`)
3. Add redirect URLs for local development (e.g., `http://localhost:3000`)

## 7. Testing Authentication

1. Run your application locally
2. Test signup, login, and password reset flows
3. Verify that user profiles are created automatically

## 8. Webhook Setup (Optional)

If you want to use webhooks for additional functionality:

1. Go to Database > Webhooks
2. Create a new webhook for auth events
3. Set the webhook URL to your API endpoint (e.g., `/api/webhooks/supabase`)
4. Select the events you want to trigger the webhook (e.g., `INSERT` on `auth.users`)