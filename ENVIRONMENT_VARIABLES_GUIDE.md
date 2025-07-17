# Environment Variables Configuration Guide

This guide explains all the environment variables needed for the desktop authentication system.

## 📋 Current Environment Variables

Your `.env.local` file has been updated with all necessary variables for desktop authentication:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://stiwqolzjvrvxrytbbbv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aXdxb2x6anZydnhyeXRiYmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Mzg3NzYsImV4cCI6MjA2ODIxNDc3Nn0.6ITpFb2aP_ZQP5imPE4WQ4-lSQOfYe8g2hva939lFJ0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aXdxb2x6anZydnhyeXRiYmJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYzODc3NiwiZXhwIjoyMDY4MjE0Nzc2fQ.InR-6CrM2pIrAycxGnET7LgOJPvjuhS-PMZEgj4JHaI

# Website Configuration for Desktop Authentication
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DESKTOP_AUTH_ENABLED=true

# Desktop App Configuration
DESKTOP_APP_URL_SCHEME=interviewcoder
DESKTOP_AUTH_SESSION_TIMEOUT=600000
DESKTOP_AUTH_CLEANUP_INTERVAL=300000

# Security Configuration
DESKTOP_AUTH_SECRET=your-super-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_ADZ8Tty5OXnX11
RAZORPAY_KEY_SECRET=5GdHhNroWNwKfbq8B9oXEH4m
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ADZ8Tty5OXnX11
```

## 🔧 Variable Explanations

### Core Supabase Variables
- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public anonymous key for client-side operations
- **`SUPABASE_SERVICE_ROLE_KEY`**: Server-side key for admin operations

### Desktop Authentication Variables
- **`NEXT_PUBLIC_SITE_URL`**: Base URL of your website (change for production)
- **`NEXT_PUBLIC_DESKTOP_AUTH_ENABLED`**: Feature flag to enable/disable desktop auth
- **`DESKTOP_APP_URL_SCHEME`**: Custom URL scheme for your desktop app
- **`DESKTOP_AUTH_SESSION_TIMEOUT`**: Session timeout in milliseconds (10 minutes)
- **`DESKTOP_AUTH_CLEANUP_INTERVAL`**: Cleanup interval in milliseconds (5 minutes)

### Security Variables
- **`DESKTOP_AUTH_SECRET`**: Secret key for desktop auth operations
- **`JWT_SECRET`**: JWT signing secret (if needed for custom tokens)

## 🚀 Production Configuration

For production deployment, create a `.env.production` file or update your hosting platform's environment variables:

```env
# Production Website URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Generate strong secrets for production
DESKTOP_AUTH_SECRET=generate-strong-secret-for-production-32-chars-min
JWT_SECRET=generate-strong-jwt-secret-for-production-32-chars-min

# Production Supabase (if different)
# NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Production Razorpay Keys
# RAZORPAY_KEY_ID=rzp_live_your_production_key
# RAZORPAY_KEY_SECRET=your_production_secret
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_production_key
```

## 🔐 Security Best Practices

### Secret Generation
Generate strong secrets using:

```bash
# For DESKTOP_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Environment Security
1. **Never commit** `.env.local` or `.env.production` to version control
2. **Use different secrets** for development and production
3. **Rotate secrets** regularly in production
4. **Limit access** to environment variables in your hosting platform

## 🌐 Hosting Platform Setup

### Vercel
```bash
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add DESKTOP_AUTH_SECRET
vercel env add JWT_SECRET
# Add other variables as needed
```

### Netlify
Add variables in Netlify dashboard under Site Settings > Environment Variables

### Railway/Render
Add variables in your platform's environment variables section

## 🧪 Testing Configuration

### Development Testing
1. Ensure `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
2. Start your development server: `npm run dev`
3. Test desktop auth flow with your desktop app

### Production Testing
1. Update `NEXT_PUBLIC_SITE_URL` to your production domain
2. Deploy your application
3. Test the complete authentication flow

## 🔄 Environment Variable Usage

### In API Routes
```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const authSecret = process.env.DESKTOP_AUTH_SECRET;
const sessionTimeout = parseInt(process.env.DESKTOP_AUTH_SESSION_TIMEOUT || '600000');
```

### In Client Components
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const desktopAuthEnabled = process.env.NEXT_PUBLIC_DESKTOP_AUTH_ENABLED === 'true';
```

## 🚨 Troubleshooting

### Common Issues
1. **Authentication fails**: Check `NEXT_PUBLIC_SITE_URL` matches your actual domain
2. **CORS errors**: Ensure Supabase auth settings include your domain
3. **Redirect issues**: Verify URL scheme matches desktop app configuration
4. **Session timeout**: Adjust `DESKTOP_AUTH_SESSION_TIMEOUT` if needed

### Debug Mode
Add debug variables for development:
```env
DEBUG_DESKTOP_AUTH=true
LOG_LEVEL=debug
```

## 📝 Checklist

- [ ] All environment variables are set
- [ ] Secrets are generated and secure
- [ ] Production URLs are configured
- [ ] Supabase auth settings updated
- [ ] Desktop app URL scheme matches
- [ ] Testing completed in both environments

---

**Note**: Keep this guide updated when adding new environment variables or changing configuration requirements.
