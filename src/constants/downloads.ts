/**
 * Download URLs and constants for local files
 * Files are stored in public/downloads/ and tracked with Git LFS
 */

export const DOWNLOAD_URLS = {
  WINDOWS: {
    url: '/downloads/GhostCoder Setup 1.1.0.exe',
    filename: 'GhostCoder Setup 1.1.0.exe',
    version: '1.1.0',
    platform: 'Windows'
  },
  MAC: {
    url: '/downloads/GhostCoder-1.1.0.dmg',
    filename: 'GhostCoder-1.1.0.dmg',
    version: '1.1.0',
    platform: 'macOS'
  }
} as const;

/**
 * Log download analytics
 */
const logDownload = async (platform: 'windows' | 'mac', filename: string) => {
  try {
    await fetch('/api/download-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        filename,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.error('Failed to log download:', error);
  }
};

/**
 * Trigger download for Windows
 */
export const downloadWindows = () => {
  // Log analytics
  logDownload('windows', DOWNLOAD_URLS.WINDOWS.filename);
  
  // Create download link
  const link = document.createElement('a');
  link.href = DOWNLOAD_URLS.WINDOWS.url;
  link.download = DOWNLOAD_URLS.WINDOWS.filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Trigger download for macOS
 */
export const downloadMac = () => {
  // Log analytics
  logDownload('mac', DOWNLOAD_URLS.MAC.filename);
  
  // Create download link
  const link = document.createElement('a');
  link.href = DOWNLOAD_URLS.MAC.url;
  link.download = DOWNLOAD_URLS.MAC.filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get download URL by platform
 */
export const getDownloadUrl = (platform: 'windows' | 'mac') => {
  return platform === 'windows' ? DOWNLOAD_URLS.WINDOWS.url : DOWNLOAD_URLS.MAC.url;
};

/**
 * Get filename by platform
 */
export const getFilename = (platform: 'windows' | 'mac') => {
  return platform === 'windows' ? DOWNLOAD_URLS.WINDOWS.filename : DOWNLOAD_URLS.MAC.filename;
};