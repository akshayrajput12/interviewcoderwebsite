import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/utils/supabase-client';
import { generateGoogleDriveDownloadUrl } from '@/utils/google-drive';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    if (!platform || !['windows', 'mac'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be "windows" or "mac"' },
        { status: 400 }
      );
    }

    // Get download information
    const { data: downloadInfo, error: downloadError } = await supabaseClient
      .from('downloads')
      .select('*')
      .eq('platform', platform)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (downloadError || !downloadInfo) {
      return NextResponse.json(
        { error: 'Download not found' },
        { status: 404 }
      );
    }

    let downloadUrl: string;

    // Handle different storage types
    if (downloadInfo.storage_type === 'google_drive') {
      if (downloadInfo.google_drive_url) {
        downloadUrl = downloadInfo.google_drive_url;
      } else if (downloadInfo.google_drive_file_id) {
        downloadUrl = generateGoogleDriveDownloadUrl(downloadInfo.google_drive_file_id);
      } else {
        return NextResponse.json(
          { error: 'No Google Drive URL or file ID found' },
          { status: 500 }
        );
      }
    } else {
      // Supabase storage
      if (!downloadInfo.file_path) {
        return NextResponse.json(
          { error: 'No file path found for Supabase storage' },
          { status: 500 }
        );
      }

      const { data: urlData, error: urlError } = await supabaseClient.storage
        .from('downloads')
        .createSignedUrl(downloadInfo.file_path, 3600); // 1 hour expiry

      if (urlError || !urlData) {
        return NextResponse.json(
          { error: 'Could not generate download URL' },
          { status: 500 }
        );
      }

      downloadUrl = urlData.signedUrl;
    }

    // Increment download count
    await supabaseClient.rpc('increment_download_count', {
      download_id: downloadInfo.id
    });

    return NextResponse.json({
      success: true,
      download: {
        id: downloadInfo.id,
        name: downloadInfo.name,
        platform: downloadInfo.platform,
        version: downloadInfo.version,
        storage_type: downloadInfo.storage_type,
        url: downloadUrl
      }
    });

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform } = body;

    if (!platform || !['windows', 'mac'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be "windows" or "mac"' },
        { status: 400 }
      );
    }

    // This endpoint can be used to trigger downloads and track analytics
    const response = await fetch(`${request.nextUrl.origin}/api/downloads?platform=${platform}`);
    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Download POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}