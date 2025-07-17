# Production Environment Setup Guide

## 🚀 Your Production Configuration

### Website URL
Your production website: `https://interviewcoderr.vercel.app`

### Desktop Authentication Route
Your desktop app should redirect users to: `https://interviewcoderr.vercel.app/login/auth/desktop`

## 🔐 Environment Variables for Production

### 1. DESKTOP_AUTH_SECRET Generation

Generate a secure 64-character secret for production:

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL (if available)
openssl rand -hex 32

# Method 3: Online generator (use a trusted source)
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
# Select: 256-bit (32 bytes) Hex
```

**Example output**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

### 2. JWT_SECRET (Supabase JWT Secret)

Since you're using Supabase JWT, you have two options:

#### Option A: Use Supabase JWT Secret (Recommended)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `stiwqolzjvrvxrytbbbv`
3. Go to **Settings** → **API**
4. Copy the **JWT Secret** (it's different from the anon key)

#### Option B: Generate Custom JWT Secret (if needed)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📝 Complete .env.local File for Production

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://stiwqolzjvrvxrytbbbv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aXdxb2x6anZydnhyeXRiYmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Mzg3NzYsImV4cCI6MjA2ODIxNDc3Nn0.6ITpFb2aP_ZQP5imPE4WQ4-lSQOfYe8g2hva939lFJ0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aXdxb2x6anZydnhyeXRiYmJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYzODc3NiwiZXhwIjoyMDY4MjE0Nzc2fQ.InR-6CrM2pIrAycxGnET7LgOJPvjuhS-PMZEgj4JHaI

# Website Configuration for Desktop Authentication
NEXT_PUBLIC_SITE_URL=https://interviewcoderr.vercel.app
NEXT_PUBLIC_DESKTOP_AUTH_ENABLED=true

# Desktop App Configuration
DESKTOP_APP_URL_SCHEME=interviewcoder
DESKTOP_AUTH_SESSION_TIMEOUT=600000
DESKTOP_AUTH_CLEANUP_INTERVAL=300000

# Security Configuration
DESKTOP_AUTH_SECRET=REPLACE_WITH_GENERATED_SECRET_FROM_STEP_1
JWT_SECRET=REPLACE_WITH_SUPABASE_JWT_SECRET_FROM_DASHBOARD

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_ADZ8Tty5OXnX11
RAZORPAY_KEY_SECRET=5GdHhNroWNwKfbq8B9oXEH4m
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ADZ8Tty5OXnX11
```

## 🔧 Vercel Environment Variables Setup

### Method 1: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://interviewcoderr.vercel.app

vercel env add DESKTOP_AUTH_SECRET
# Enter: your-generated-secret-from-step-1

vercel env add JWT_SECRET
# Enter: your-supabase-jwt-secret

vercel env add NEXT_PUBLIC_DESKTOP_AUTH_ENABLED
# Enter: true

vercel env add DESKTOP_APP_URL_SCHEME
# Enter: interviewcoder

vercel env add DESKTOP_AUTH_SESSION_TIMEOUT
# Enter: 600000

vercel env add DESKTOP_AUTH_CLEANUP_INTERVAL
# Enter: 300000
```

### Method 2: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: `interviewcoderr`
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://interviewcoderr.vercel.app` | Production |
| `DESKTOP_AUTH_SECRET` | `your-generated-secret` | Production |
| `JWT_SECRET` | `your-supabase-jwt-secret` | Production |
| `NEXT_PUBLIC_DESKTOP_AUTH_ENABLED` | `true` | Production |
| `DESKTOP_APP_URL_SCHEME` | `interviewcoder` | Production |
| `DESKTOP_AUTH_SESSION_TIMEOUT` | `600000` | Production |
| `DESKTOP_AUTH_CLEANUP_INTERVAL` | `300000` | Production |

## 🔍 How to Get Supabase JWT Secret

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on your project: `stiwqolzjvrvxrytbbbv`

3. **Navigate to API Settings**
   - In the left sidebar, click **Settings**
   - Click **API**

4. **Find JWT Secret**
   - Scroll down to the **JWT Settings** section
   - Look for **JWT Secret** (not the anon key)
   - It will be a long string starting with something like: `your-jwt-secret-here`

5. **Copy the Secret**
   - Click the copy button next to the JWT Secret
   - This is what you'll use for `JWT_SECRET`

### Visual Guide:
```
Supabase Dashboard → Your Project → Settings → API → JWT Settings → JWT Secret
```

## 🧪 Testing Your Configuration

### 1. Local Testing
```bash
# Update your .env.local with production values
# Test locally first
npm run dev

# Test the desktop auth endpoint
curl -X POST https://interviewcoderr.vercel.app/api/auth/desktop \
  -H "Content-Type: application/json" \
  -d '{"action": "initiate"}'
```

### 2. Production Testing
```bash
# Deploy to Vercel
vercel --prod

# Test production endpoint
curl -X POST https://interviewcoderr.vercel.app/api/auth/desktop \
  -H "Content-Type: application/json" \
  -d '{"action": "initiate"}'
```

## 🔒 Security Checklist

- [ ] Generated secure `DESKTOP_AUTH_SECRET` (32+ characters)
- [ ] Retrieved correct `JWT_SECRET` from Supabase dashboard
- [ ] Updated `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] All environment variables added to Vercel
- [ ] Tested authentication flow in production
- [ ] Verified HTTPS is working
- [ ] Confirmed desktop app redirects to correct URL

## 🚨 Important Notes

1. **Never commit secrets** to your repository
2. **Use different secrets** for development and production
3. **Test thoroughly** before distributing your desktop app
4. **Monitor logs** for any authentication errors
5. **Keep secrets secure** and rotate them periodically

## 📱 Desktop App Configuration

Update your desktop app to use the production URL:

```typescript
const config = {
  development: {
    websiteUrl: 'http://localhost:3000'
  },
  production: {
    websiteUrl: 'https://interviewcoderr.vercel.app'
  }
};

const baseUrl = process.env.NODE_ENV === 'production' 
  ? config.production.websiteUrl 
  : config.development.websiteUrl;
```

## 🎯 Final Steps

1. Generate `DESKTOP_AUTH_SECRET` using the command above
2. Get `JWT_SECRET` from your Supabase dashboard
3. Add all environment variables to Vercel
4. Deploy your application
5. Test the complete authentication flow
6. Update your desktop app with production URL

Your desktop app should now redirect to: `https://interviewcoderr.vercel.app/login/auth/desktop`
