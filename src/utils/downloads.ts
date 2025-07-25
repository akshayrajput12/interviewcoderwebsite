import { supabaseClient } from './supabase-client';
import { downloadFromGoogleDrive, generateGoogleDriveDownloadUrl } from './google-drive';

export interface DownloadFile {
  id: string;
  name: string;
  description: string;
  file_path?: string;
  google_drive_url?: string;
  google_drive_file_id?: string;
  file_size?: number;
  platform: 'windows' | 'mac' | 'linux';
  version: string;
  storage_type: 'supabase' | 'google_drive';
  is_active: boolean;
  download_count: number;
}

/**
 * Get download file information by platform
 */
export async function getDownloadByPlatform(platform: 'windows' | 'mac'): Promise<DownloadFile | null> {
  try {
    const { data, error } = await supabaseClient
      .from('downloads')
      .select('*')
      .eq('platform', platform)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching download:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getDownloadByPlatform:', error);
    return null;
  }
}

/**
 * Get signed URL for download file
 */
export async function getDownloadUrl(filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseClient.storage
      .from('downloads')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getDownloadUrl:', error);
    return null;
  }
}

/**
 * Increment download count
 */
export async function incrementDownloadCount(downloadId: string): Promise<void> {
  try {
    const { error } = await supabaseClient.rpc('increment_download_count', {
      download_id: downloadId
    });

    if (error) {
      console.error('Error incrementing download count:', error);
    }
  } catch (error) {
    console.error('Error in incrementDownloadCount:', error);
  }
}

/**
 * Download file from Supabase storage or Google Drive
 */
export async function downloadFile(platform: 'windows' | 'mac'): Promise<void> {
  try {
    // Get download information
    const downloadInfo = await getDownloadByPlatform(platform);
    if (!downloadInfo) {
      console.error('Download not found for platform:', platform);
      alert('Download not available at the moment. Please try again later.');
      return;
    }

    // Increment download count first
    await incrementDownloadCount(downloadInfo.id);

    // Handle different storage types
    if (downloadInfo.storage_type === 'google_drive') {
      // Download from Google Drive
      if (downloadInfo.google_drive_file_id) {
        downloadFromGoogleDrive(downloadInfo.google_drive_file_id, downloadInfo.name);
      } else if (downloadInfo.google_drive_url) {
        // Direct URL download
        const link = document.createElement('a');
        link.href = downloadInfo.google_drive_url;
        link.target = '_blank';
        link.download = downloadInfo.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('No Google Drive URL or file ID found');
      }
    } else {
      // Download from Supabase storage (fallback)
      if (!downloadInfo.file_path) {
        throw new Error('No file path found for Supabase storage');
      }

      const downloadUrl = await getDownloadUrl(downloadInfo.file_path);
      if (!downloadUrl) {
        throw new Error('Could not generate download URL');
      }

      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadInfo.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Download failed. Please try again later.');
  }
}

/**
 * Get all available downloads
 */
export async function getAllDownloads(): Promise<DownloadFile[]> {
  try {
    const { data, error } = await supabaseClient
      .from('downloads')
      .select('*')
      .eq('is_active', true)
      .order('platform', { ascending: true });

    if (error) {
      console.error('Error fetching downloads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllDownloads:', error);
    return [];
  }
}