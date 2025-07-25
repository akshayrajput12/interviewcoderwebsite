import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, filename, userAgent } = body;

    // Log download analytics (you can extend this to save to database)
    console.log('Download Analytics:', {
      platform,
      filename,
      userAgent,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown'
    });

    // You can save this to your database here
    // await supabaseClient.from('download_analytics').insert({...})

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download analytics error:', error);
    return NextResponse.json({ error: 'Failed to log analytics' }, { status: 500 });
  }
}