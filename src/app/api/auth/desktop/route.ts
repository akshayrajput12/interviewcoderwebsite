import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { authStates, cleanupExpiredStates } from './auth-state';

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredStates();

    const body = await request.json();
    const { action, state, redirectUrl } = body;

    console.log('Desktop auth API called:', { action, state: state ? 'present' : 'missing' });

    if (action === 'initiate') {
      // Generate a secure state parameter for CSRF protection
      const authState = randomBytes(32).toString('hex');
      
      // Store the state with timestamp and optional redirect URL
      authStates.set(authState, {
        timestamp: Date.now(),
        redirectUrl: redirectUrl || undefined
      });

      // Return the auth URL that the desktop app should open
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const authUrl = `${baseUrl}/login/auth/desktop?state=${authState}`;

      console.log('Generated auth URL:', authUrl);

      return NextResponse.json({
        success: true,
        authUrl,
        state: authState
      });
    }

    if (action === 'check') {
      // Check if authentication is complete for the given state
      if (!state) {
        return NextResponse.json({
          success: false,
          error: 'State parameter is required'
        }, { status: 400 });
      }

      // Check if state exists and is valid
      const stateData = authStates.get(state);
      if (!stateData) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or expired state'
        }, { status: 400 });
      }

      // Check for session using the state-specific session storage
      const sessionKey = `desktop_session_${state}`;
      const sessionData = authStates.get(sessionKey);

      if (sessionData && 'session' in sessionData && sessionData.session) {
        // Authentication is complete
        const session = sessionData.session;
        
        // Clean up the state
        authStates.delete(state);
        authStates.delete(sessionKey);

        return NextResponse.json({
          success: true,
          authenticated: true,
          session
        });
      }

      // Authentication not yet complete
      return NextResponse.json({
        success: true,
        authenticated: false,
        message: 'Authentication pending'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Desktop auth API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}


