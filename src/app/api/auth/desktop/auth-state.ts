// Shared authentication state for desktop app authentication
// Store for temporary auth states (in production, use Redis or database)

interface AuthStateData {
  timestamp: number;
  redirectUrl?: string;
  session?: unknown;
}

export const authStates = new Map<string, AuthStateData>();

// Clean up expired states (older than 10 minutes)
export const cleanupExpiredStates = () => {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  
  for (const [key, value] of authStates.entries()) {
    if (now - value.timestamp > tenMinutes) {
      authStates.delete(key);
    }
  }
};

// Helper function to store session for desktop app
export const storeDesktopSession = (state: string, session: unknown) => {
  const sessionKey = `desktop_session_${state}`;
  authStates.set(sessionKey, {
    timestamp: Date.now(),
    session
  });
};
