# Complete Desktop App Authentication Guide

## 🎯 Overview

Your website is now fully configured for desktop app authentication. The desktop app should redirect users to `/login/auth/desktop` for authentication.

## 🌐 Website Routes (Ready)

### Authentication Routes
- **`/login/auth/desktop`** - Main desktop authentication page
- **`/login/auth/desktop/callback`** - OAuth callback handler

### API Endpoints
- **`POST /api/auth/desktop`** - Initiate and check authentication status
- **`POST /api/auth/desktop/complete`** - Complete authentication flow

## 🖥️ Desktop App Implementation

### 1. Authentication Flow

```typescript
class DesktopAuth {
  private baseUrl = 'http://localhost:3000'; // Change to your website URL
  private authState: string | null = null;

  async initiateAuth(): Promise<boolean> {
    try {
      // Step 1: Get auth URL from website
      const response = await fetch(`${this.baseUrl}/api/auth/desktop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate authentication');
      }

      this.authState = data.state;
      
      // Step 2: Open auth URL in browser
      // The URL will be: http://localhost:3000/login/auth/desktop?state=xxx
      this.openAuthUrl(data.authUrl);
      
      // Step 3: Poll for completion
      return this.pollForAuth();
      
    } catch (error) {
      console.error('Auth initiation failed:', error);
      return false;
    }
  }

  private openAuthUrl(url: string): void {
    // Platform-specific browser opening
    if (typeof window !== 'undefined' && window.require) {
      // Electron
      const { shell } = window.require('electron');
      shell.openExternal(url);
    } else if (typeof window !== 'undefined') {
      // Web environment
      window.open(url, '_blank');
    }
  }

  private async pollForAuth(): Promise<boolean> {
    if (!this.authState) return false;

    const maxAttempts = 60; // 5 minutes
    let attempts = 0;

    return new Promise((resolve) => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${this.baseUrl}/api/auth/desktop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'check', 
              state: this.authState 
            })
          });

          const data = await response.json();
          
          if (data.success && data.authenticated) {
            this.handleAuthSuccess(data.session);
            resolve(true);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('Authentication timeout');
            resolve(false);
            return;
          }
          
          setTimeout(checkAuth, 5000); // Check every 5 seconds
          
        } catch (error) {
          console.error('Auth check failed:', error);
          resolve(false);
        }
      };

      checkAuth();
    });
  }

  private handleAuthSuccess(session: any): void {
    // Store session securely
    this.storeSession(session);
    console.log('Authentication successful!', session.user);
  }

  private storeSession(session: any): void {
    // Use secure storage (keytar for Electron, secure storage for other platforms)
    localStorage.setItem('auth_session', JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: session.user
    }));
  }

  // Handle deep link callback
  handleDeepLink(url: string): void {
    const urlObj = new URL(url);
    const success = urlObj.searchParams.get('success');
    const state = urlObj.searchParams.get('state');

    if (success === 'true' && state === this.authState) {
      console.log('Deep link authentication confirmed');
    }
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now() / 1000;
    return session.expires_at > now;
  }

  getSession(): any | null {
    const stored = localStorage.getItem('auth_session');
    return stored ? JSON.parse(stored) : null;
  }

  signOut(): void {
    localStorage.removeItem('auth_session');
    this.authState = null;
  }
}
```

### 2. Platform-Specific Setup

#### Electron App Setup

**main.js**:
```javascript
const { app, BrowserWindow, protocol } = require('electron');

// Register custom protocol
app.setAsDefaultProtocolClient('interviewcoder');

// Handle protocol URLs when app is running
app.on('second-instance', (event, commandLine, workingDirectory) => {
  const url = commandLine.find(arg => arg.startsWith('interviewcoder://'));
  if (url) {
    // Send to renderer process
    mainWindow.webContents.send('deep-link', url);
  }
});

// Handle protocol URLs when app starts
app.on('ready', () => {
  if (process.argv.length >= 2) {
    const url = process.argv.find(arg => arg.startsWith('interviewcoder://'));
    if (url) {
      // Handle initial deep link
      setTimeout(() => {
        mainWindow.webContents.send('deep-link', url);
      }, 1000);
    }
  }
});
```

**renderer.js**:
```javascript
const { ipcRenderer } = require('electron');
const auth = new DesktopAuth();

// Listen for deep links
ipcRenderer.on('deep-link', (event, url) => {
  auth.handleDeepLink(url);
});

// Login button handler
document.getElementById('loginBtn').addEventListener('click', async () => {
  const success = await auth.initiateAuth();
  if (success) {
    updateUIForAuthenticatedUser();
  }
});
```

**package.json**:
```json
{
  "build": {
    "win": {
      "protocols": [
        {
          "name": "Interview Coder",
          "schemes": ["interviewcoder"]
        }
      ]
    },
    "mac": {
      "protocols": [
        {
          "name": "Interview Coder",
          "schemes": ["interviewcoder"]
        }
      ]
    }
  }
}
```

#### Tauri App Setup

**src-tauri/tauri.conf.json**:
```json
{
  "tauri": {
    "allowlist": {
      "shell": {
        "open": true
      }
    },
    "bundle": {
      "identifier": "com.interviewcoder.app",
      "protocols": ["interviewcoder"]
    }
  }
}
```

**src-tauri/src/main.rs**:
```rust
use tauri::Manager;

#[tauri::command]
fn handle_deep_link(url: String) {
    println!("Received deep link: {}", url);
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            
            // Register deep link handler
            app.listen_global("deep-link", move |event| {
                if let Some(payload) = event.payload() {
                    handle.emit_all("auth-callback", payload).unwrap();
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. Usage Example

```typescript
// Initialize authentication
const auth = new DesktopAuth();

// Check if already authenticated
if (auth.isAuthenticated()) {
  console.log('User is already logged in');
  const session = auth.getSession();
  updateUI(session.user);
} else {
  // Show login button
  showLoginButton();
}

// Login handler
async function handleLogin() {
  showLoadingState();
  
  const success = await auth.initiateAuth();
  
  if (success) {
    const session = auth.getSession();
    updateUI(session.user);
    hideLoadingState();
  } else {
    showError('Authentication failed');
    hideLoadingState();
  }
}

// Logout handler
function handleLogout() {
  auth.signOut();
  showLoginButton();
}
```

## 🔧 Configuration

### Desktop App Config
```typescript
const config = {
  development: {
    websiteUrl: 'http://localhost:3000'
  },
  production: {
    websiteUrl: 'https://your-domain.com'
  }
};

const baseUrl = process.env.NODE_ENV === 'production' 
  ? config.production.websiteUrl 
  : config.development.websiteUrl;
```

## 🧪 Testing

### Test Flow
1. Start your website: `npm run dev`
2. Build and run your desktop app
3. Click login in desktop app
4. Browser opens to `/login/auth/desktop?state=xxx`
5. Complete authentication on website
6. Website redirects to `interviewcoder://auth?success=true&state=xxx`
7. Desktop app receives tokens

### Debug Tips
- Check browser console for errors
- Verify URL scheme registration
- Test with different authentication methods
- Monitor network requests

## 🚀 Production Deployment

1. Update website URL in desktop app config
2. Deploy website with production environment variables
3. Test authentication flow with production URLs
4. Distribute desktop app with proper code signing

## 📋 Checklist

- [ ] Desktop app opens browser to `/login/auth/desktop`
- [ ] Custom URL scheme `interviewcoder://` is registered
- [ ] Authentication polling is implemented
- [ ] Session storage is secure
- [ ] Deep link handling works
- [ ] Error handling is robust
- [ ] Production configuration is ready

---

**Your website is ready! Follow this guide to implement the desktop app side.**
