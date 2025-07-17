import { NextRequest, NextResponse } from 'next/server';
import { authStates, storeDesktopSession } from '../auth-state';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, session } = body;

    if (!state || !session) {
      return NextResponse.json({
        success: false,
        error: 'State and session are required'
      }, { status: 400 });
    }

    // Verify the state exists
    const stateData = authStates.get(state);
    if (!stateData) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired state'
      }, { status: 400 });
    }

    // Store the session for the desktop app to retrieve
    storeDesktopSession(state, session);

    return NextResponse.json({
      success: true,
      message: 'Session stored successfully'
    });

  } catch (error) {
    console.error('Desktop auth complete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
