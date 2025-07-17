// Fixed Desktop Authentication Implementation
// Use this in your desktop app to properly handle authentication

class DesktopAuth {
  constructor() {
    this.baseUrl = 'https://interviewcoderr.vercel.app'; // Your production URL
    this.authState = null;
    this.isAuthenticating = false;
  }

  async initiateAuth() {
    if (this.isAuthenticating) {
      console.log('Authentication already in progress');
      return false;
    }

    this.isAuthenticating = true;
    
    try {
      console.log('Step 1: Initiating authentication...');
      
      // Step 1: Get auth URL from website
      const response = await fetch(`${this.baseUrl}/api/auth/desktop`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'initiate' })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Initiate response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate authentication');
      }

      this.authState = data.state;
      console.log('Generated state:', this.authState);
      
      // Step 2: Open auth URL in browser
      console.log('Step 2: Opening browser to:', data.authUrl);
      this.openAuthUrl(data.authUrl);
      
      // Step 3: Start polling for completion
      console.log('Step 3: Starting polling...');
      const result = await this.pollForAuth();
      
      this.isAuthenticating = false;
      return result;
      
    } catch (error) {
      console.error('Auth initiation failed:', error);
      this.isAuthenticating = false;
      return false;
    }
  }

  openAuthUrl(url) {
    console.log('Opening URL:', url);
    
    // For Electron
    if (typeof window !== 'undefined' && window.require) {
      try {
        const { shell } = window.require('electron');
        shell.openExternal(url);
        return;
      } catch (e) {
        console.log('Electron shell not available, trying other methods');
      }
    }
    
    // For web environment or fallback
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
      return;
    }
    
    // For Node.js environment
    if (typeof require !== 'undefined') {
      try {
        const { exec } = require('child_process');
        const command = process.platform === 'win32' ? 'start' : 
                       process.platform === 'darwin' ? 'open' : 'xdg-open';
        exec(`${command} "${url}"`);
      } catch (e) {
        console.error('Failed to open URL:', e);
      }
    }
  }

  async pollForAuth() {
    if (!this.authState) {
      console.error('No auth state available for polling');
      return false;
    }

    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    return new Promise((resolve) => {
      const checkAuth = async () => {
        try {
          console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
          
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
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Poll response:', data);
          
          if (data.success && data.authenticated) {
            console.log('Authentication successful!');
            this.handleAuthSuccess(data.session);
            resolve(true);
            return;
          }
          
          if (!data.success) {
            console.error('Poll failed:', data.error);
            resolve(false);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('Authentication timeout after', maxAttempts, 'attempts');
            resolve(false);
            return;
          }
          
          // Continue polling
          setTimeout(checkAuth, 5000);
          
        } catch (error) {
          console.error('Auth check failed:', error);
          attempts++;
          
          if (attempts >= maxAttempts) {
            resolve(false);
          } else {
            // Retry after error
            setTimeout(checkAuth, 5000);
          }
        }
      };

      checkAuth();
    });
  }

  handleAuthSuccess(session) {
    console.log('Handling auth success:', session);
    
    // Store session securely
    this.storeSession(session);
    
    // Clear auth state
    this.authState = null;
    
    // Emit success event or call callback
    if (this.onAuthSuccess) {
      this.onAuthSuccess(session);
    }
    
    console.log('Authentication completed successfully!');
  }

  storeSession(session) {
    try {
      // Use secure storage in production (keytar for Electron)
      const sessionData = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        user: session.user,
        timestamp: Date.now()
      };
      
      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      console.log('Session stored successfully');
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  }

  // Handle deep link callback
  handleDeepLink(url) {
    console.log('Received deep link:', url);
    
    try {
      const urlObj = new URL(url);
      const success = urlObj.searchParams.get('success');
      const state = urlObj.searchParams.get('state');

      if (success === 'true' && state === this.authState) {
        console.log('Deep link authentication confirmed for state:', state);
        // The polling will handle the actual token retrieval
      } else {
        console.log('Deep link state mismatch or failed:', { success, state, expectedState: this.authState });
      }
    } catch (error) {
      console.error('Failed to parse deep link:', error);
    }
  }

  getSession() {
    try {
      const stored = localStorage.getItem('auth_session');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    
    // Check if token is expired
    const now = Date.now() / 1000;
    return session.expires_at > now;
  }

  signOut() {
    localStorage.removeItem('auth_session');
    this.authState = null;
    this.isAuthenticating = false;
    console.log('Signed out successfully');
  }

  // Set callback for auth success
  onAuthSuccess(callback) {
    this.onAuthSuccess = callback;
  }
}

// Usage example:
const auth = new DesktopAuth();

// Set up auth success callback
auth.onAuthSuccess = (session) => {
  console.log('User authenticated:', session.user);
  // Update your UI here
  updateUIForAuthenticatedUser(session.user);
};

// Login button handler
document.getElementById('loginBtn')?.addEventListener('click', async () => {
  console.log('Login button clicked');
  
  // Show loading state
  showLoadingState();
  
  const success = await auth.initiateAuth();
  
  if (success) {
    console.log('Authentication flow completed successfully');
  } else {
    console.log('Authentication failed');
    showError('Authentication failed. Please try again.');
  }
  
  hideLoadingState();
});

// Deep link handler (register this with your app)
function handleAuthDeepLink(url) {
  auth.handleDeepLink(url);
}

// Check if already authenticated on app start
if (auth.isAuthenticated()) {
  const session = auth.getSession();
  console.log('User already authenticated:', session.user);
  updateUIForAuthenticatedUser(session.user);
} else {
  console.log('User not authenticated, showing login');
  showLoginButton();
}

// Helper functions (implement these in your app)
function showLoadingState() {
  console.log('Showing loading state...');
  // Implement your loading UI
}

function hideLoadingState() {
  console.log('Hiding loading state...');
  // Hide your loading UI
}

function showError(message) {
  console.error('Error:', message);
  // Show error in your UI
}

function showLoginButton() {
  console.log('Showing login button...');
  // Show login UI
}

function updateUIForAuthenticatedUser(user) {
  console.log('Updating UI for user:', user);
  // Update your UI for authenticated state
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesktopAuth;
}
