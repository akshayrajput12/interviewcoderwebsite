import { NextRequest, NextResponse } from 'next/server';
import { authStates, storeDesktopSession } from '../auth-state';

// CORS headers for desktop app requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, session } = body;

    if (!state || !session) {
      return NextResponse.json({
        success: false,
        error: 'State and session are required'
      }, {
        status: 400,
        headers: corsHeaders
      });
    }

    // Verify the state exists
    const stateData = authStates.get(state);
    if (!stateData) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired state'
      }, {
        status: 400,
        headers: corsHeaders
      });
    }

    // Store the session for the desktop app to retrieve
    storeDesktopSession(state, session);

    return NextResponse.json({
      success: true,
      message: 'Session stored successfully'
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Desktop auth complete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}
