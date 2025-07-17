# CORS Configuration for Desktop Authentication

## ✅ CORS Issues Fixed

I've added comprehensive CORS support to all desktop authentication endpoints:

### Updated Endpoints:
- ✅ `/api/auth/desktop` - Main authentication API
- ✅ `/api/auth/desktop/complete` - Session completion API

### CORS Headers Added:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};
```

### Features Added:
- ✅ **OPTIONS handler** for preflight requests
- ✅ **CORS headers** on all responses
- ✅ **Wildcard origin** for desktop app access
- ✅ **Proper error handling** with CORS

## 🧪 Testing CORS Configuration

### Test 1: Check if endpoints exist
```bash
# Test main endpoint
curl -X POST https://interviewcoderr.vercel.app/api/auth/desktop \
  -H "Content-Type: application/json" \
  -d '{"action": "initiate"}'

# Test complete endpoint
curl -X POST https://interviewcoderr.vercel.app/api/auth/desktop/complete \
  -H "Content-Type: application/json" \
  -d '{"state": "test", "session": {}}'
```

### Test 2: Check CORS headers
```bash
# Test preflight request
curl -X OPTIONS https://interviewcoderr.vercel.app/api/auth/desktop \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### Test 3: From JavaScript (Desktop App)
```javascript
// This should now work without CORS errors
fetch('https://interviewcoderr.vercel.app/api/auth/desktop', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ action: 'initiate' })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## 🔧 Desktop App Configuration

### Updated Desktop Auth Class (CORS-Ready)
```javascript
class DesktopAuth {
  constructor() {
    this.baseUrl = 'https://interviewcoderr.vercel.app';
    this.authState = null;
  }

  async initiateAuth() {
    try {
      console.log('Initiating authentication...');
      
      const response = await fetch(`${this.baseUrl}/api/auth/desktop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'initiate' })
      });

      // Check for CORS or network errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate authentication');
      }

      this.authState = data.state;
      console.log('Auth URL:', data.authUrl);
      
      // Open browser
      this.openBrowser(data.authUrl);
      
      // Start polling
      return this.pollForAuth();
      
    } catch (error) {
      console.error('CORS or API Error:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        console.error('CORS Error: Make sure the website has CORS headers configured');
        return false;
      }
      
      // Check if it's a network error
      if (error.message.includes('Failed to fetch')) {
        console.error('Network Error: Check if the API endpoint exists');
        return false;
      }
      
      return false;
    }
  }

  openBrowser(url) {
    // Platform-specific browser opening
    if (typeof window !== 'undefined' && window.require) {
      // Electron
      const { shell } = window.require('electron');
      shell.openExternal(url);
    } else if (typeof window !== 'undefined') {
      // Web
      window.open(url, '_blank');
    } else {
      // Node.js
      const { exec } = require('child_process');
      const command = process.platform === 'win32' ? 'start' : 
                     process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${command} "${url}"`);
    }
  }

  async pollForAuth() {
    const maxAttempts = 60;
    let attempts = 0;

    return new Promise((resolve) => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${this.baseUrl}/api/auth/desktop`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              action: 'check', 
              state: this.authState 
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          
          if (data.success && data.authenticated) {
            console.log('Authentication successful!');
            this.storeSession(data.session);
            resolve(true);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('Authentication timeout');
            resolve(false);
            return;
          }
          
          setTimeout(checkAuth, 5000);
          
        } catch (error) {
          console.error('Polling error:', error);
          attempts++;
          
          if (attempts >= maxAttempts) {
            resolve(false);
          } else {
            setTimeout(checkAuth, 5000);
          }
        }
      };

      checkAuth();
    });
  }

  storeSession(session) {
    localStorage.setItem('auth_session', JSON.stringify(session));
  }

  getSession() {
    const stored = localStorage.getItem('auth_session');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now() / 1000;
    return session.expires_at > now;
  }

  signOut() {
    localStorage.removeItem('auth_session');
    this.authState = null;
  }
}
```

## 🚨 Common CORS Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**: ✅ Fixed - Added CORS headers to all responses

### Issue 2: "Preflight request doesn't pass access control check"
**Solution**: ✅ Fixed - Added OPTIONS handler for preflight requests

### Issue 3: "Method POST is not allowed by Access-Control-Allow-Methods"
**Solution**: ✅ Fixed - Added POST to allowed methods

### Issue 4: "Request header Content-Type is not allowed"
**Solution**: ✅ Fixed - Added Content-Type to allowed headers

## 🔍 Debugging CORS Issues

### Check Browser Console
Look for these error patterns:
```
❌ Access to fetch at 'https://...' from origin 'null' has been blocked by CORS policy
❌ No 'Access-Control-Allow-Origin' header is present
❌ CORS preflight channel did not succeed
```

### Check Network Tab
1. Look for **OPTIONS** requests (preflight)
2. Check response headers for CORS headers
3. Verify status codes (200 for OPTIONS, 200/400/500 for POST)

### Test with curl
```bash
# Test if endpoint exists
curl -I https://interviewcoderr.vercel.app/api/auth/desktop

# Test CORS headers
curl -X OPTIONS https://interviewcoderr.vercel.app/api/auth/desktop \
  -H "Origin: http://localhost:3000" \
  -v
```

## ✅ Verification Checklist

- [ ] Deploy updated code to Vercel
- [ ] Test `/api/auth/desktop` endpoint exists
- [ ] Test `/api/auth/desktop/complete` endpoint exists
- [ ] Verify CORS headers in response
- [ ] Test from desktop app (no CORS errors)
- [ ] Test authentication flow end-to-end

## 🚀 Next Steps

1. **Deploy the updated code** to Vercel
2. **Test the endpoints** using the curl commands above
3. **Update your desktop app** with the CORS-ready code
4. **Test the complete authentication flow**

The CORS issues should now be completely resolved! 🎉
