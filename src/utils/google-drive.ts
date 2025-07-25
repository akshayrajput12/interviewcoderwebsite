/**
 * Google Drive utilities for file downloads
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  size: string;
  downloadUrl: string;
}

/**
 * Extract Google Drive file ID from various URL formats
 */
export function extractGoogleDriveFileId(url: string): string | null {
  // Handle different Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,  // https://drive.google.com/file/d/FILE_ID/view
    /id=([a-zA-Z0-9-_]+)/,          // https://drive.google.com/uc?id=FILE_ID
    /^([a-zA-Z0-9-_]+)$/            // Just the file ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate direct download URL from Google Drive file ID
 */
export function generateGoogleDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Generate Google Drive preview URL
 */
export function generateGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Validate Google Drive file ID format
 */
export function isValidGoogleDriveFileId(fileId: string): boolean {
  // Google Drive file IDs are typically 25-44 characters long
  // and contain letters, numbers, hyphens, and underscores
  const pattern = /^[a-zA-Z0-9-_]{25,44}$/;
  return pattern.test(fileId);
}

/**
 * Get file information from Google Drive (requires API key)
 * This is optional - you can use it if you have Google Drive API access
 */
export async function getGoogleDriveFileInfo(fileId: string, apiKey?: string): Promise<GoogleDriveFile | null> {
  if (!apiKey) {
    // Return basic info without API call
    return {
      id: fileId,
      name: 'Unknown',
      size: 'Unknown',
      downloadUrl: generateGoogleDriveDownloadUrl(fileId)
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch file info');
    }

    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      size: data.size,
      downloadUrl: generateGoogleDriveDownloadUrl(fileId)
    };
  } catch (error) {
    console.error('Error fetching Google Drive file info:', error);
    return null;
  }
}

/**
 * Trigger download from Google Drive
 */
export function downloadFromGoogleDrive(fileId: string, fileName?: string): void {
  const downloadUrl = generateGoogleDriveDownloadUrl(fileId);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  
  if (fileName) {
    link.download = fileName;
  }
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Check if Google Drive file is publicly accessible
 */
export async function checkGoogleDriveFileAccess(fileId: string): Promise<boolean> {
  try {
    const downloadUrl = generateGoogleDriveDownloadUrl(fileId);
    const response = await fetch(downloadUrl, { method: 'HEAD' });
    
    // If we get a redirect or success, the file is accessible
    return response.ok || response.status === 302;
  } catch (error) {
    console.error('Error checking file access:', error);
    return false;
  }
}