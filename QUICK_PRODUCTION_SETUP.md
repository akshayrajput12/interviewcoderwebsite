# Quick Production Setup Reference

## 🚀 Your Production Configuration

### Website URL
```
https://interviewcoderr.vercel.app
```

### Desktop Authentication URL
```
https://interviewcoderr.vercel.app/login/auth/desktop
```

## 🔑 Generated Secrets

### DESKTOP_AUTH_SECRET (Ready to Use)
```
dd0e9dc0669fde588bf2884626395d3248c1273d98255a3263e5255aaf243512
```

### JWT_SECRET (Get from Supabase)
**You need to get this from your Supabase dashboard:**

1. Go to: https://supabase.com/dashboard
2. Select project: `stiwqolzjvrvxrytbbbv`
3. Settings → API → JWT Settings → JWT Secret
4. Copy the JWT Secret value

## 📋 Environment Variables for Vercel

Add these to your Vercel project environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://interviewcoderr.vercel.app
NEXT_PUBLIC_DESKTOP_AUTH_ENABLED=true
DESKTOP_APP_URL_SCHEME=interviewcoder
DESKTOP_AUTH_SESSION_TIMEOUT=600000
DESKTOP_AUTH_CLEANUP_INTERVAL=300000
DESKTOP_AUTH_SECRET=dd0e9dc0669fde588bf2884626395d3248c1273d98255a3263e5255aaf243512
JWT_SECRET=[GET_FROM_SUPABASE_DASHBOARD]
```

## 🔧 Vercel Setup Steps

### Option 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your `interviewcoderr` project
3. Settings → Environment Variables
4. Add each variable above

### Option 2: Vercel CLI
```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://interviewcoderr.vercel.app

vercel env add DESKTOP_AUTH_SECRET
# Enter: dd0e9dc0669fde588bf2884626395d3248c1273d98255a3263e5255aaf243512

vercel env add JWT_SECRET
# Enter: [your-supabase-jwt-secret]

vercel env add NEXT_PUBLIC_DESKTOP_AUTH_ENABLED
# Enter: true

vercel env add DESKTOP_APP_URL_SCHEME
# Enter: interviewcoder

vercel env add DESKTOP_AUTH_SESSION_TIMEOUT
# Enter: 600000

vercel env add DESKTOP_AUTH_CLEANUP_INTERVAL
# Enter: 300000
```

## 🎯 Desktop App Configuration

Update your desktop app to use:

```typescript
const WEBSITE_URL = 'https://interviewcoderr.vercel.app';
const AUTH_URL = 'https://interviewcoderr.vercel.app/login/auth/desktop';
const URL_SCHEME = 'interviewcoder';
```

## ✅ Testing Checklist

- [ ] Get JWT_SECRET from Supabase dashboard
- [ ] Add all environment variables to Vercel
- [ ] Deploy to production
- [ ] Test: `https://interviewcoderr.vercel.app/login/auth/desktop`
- [ ] Update desktop app with production URL
- [ ] Test complete authentication flow

## 🚨 Security Notes

- **DESKTOP_AUTH_SECRET** is already generated and secure
- **JWT_SECRET** must be retrieved from Supabase (don't generate a new one)
- Never commit these secrets to your repository
- Use these exact values for production

## 📱 Desktop App Integration

Your desktop app should:
1. Open browser to: `https://interviewcoderr.vercel.app/login/auth/desktop?state=xxx`
2. Listen for redirect: `interviewcoder://auth?success=true&state=xxx`
3. Poll API: `https://interviewcoderr.vercel.app/api/auth/desktop`

---

**Next Step**: Get your JWT_SECRET from Supabase dashboard and add all variables to Vercel!
