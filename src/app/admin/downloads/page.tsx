'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/utils/supabase-client';
import { getAllDownloads, type DownloadFile } from '@/utils/downloads';
import { extractGoogleDriveFileId, generateGoogleDriveDownloadUrl, isValidGoogleDriveFileId } from '@/utils/google-drive';

export default function DownloadsAdmin() {
  const [downloads, setDownloads] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'mac'>('windows');

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    const data = await getAllDownloads();
    setDownloads(data);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, platform: 'windows' | 'mac') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${file.name}`;
      const filePath = `downloads/${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('downloads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update or create download record
      const { error: dbError } = await supabaseClient
        .from('downloads')
        .upsert({
          name: file.name.replace(`.${fileExt}`, ''),
          description: `${platform === 'windows' ? 'Windows' : 'macOS'} installer`,
          file_path: filePath,
          file_size: file.size,
          platform: platform,
          version: '1.1.0', // You can make this dynamic
          is_active: true
        }, {
          onConflict: 'platform'
        });

      if (dbError) {
        throw dbError;
      }

      alert('File uploaded successfully!');
      fetchDownloads();

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGoogleDriveUrl = async () => {
    if (!googleDriveUrl.trim()) {
      alert('Please enter a Google Drive URL');
      return;
    }

    const fileId = extractGoogleDriveFileId(googleDriveUrl);
    if (!fileId || !isValidGoogleDriveFileId(fileId)) {
      alert('Invalid Google Drive URL. Please check the URL and try again.');
      return;
    }

    setUploading(true);

    try {
      const downloadUrl = generateGoogleDriveDownloadUrl(fileId);
      
      // Update or create download record
      const { error } = await supabaseClient
        .from('downloads')
        .upsert({
          name: `GhostCoder ${selectedPlatform === 'windows' ? 'Setup' : ''}`,
          description: `${selectedPlatform === 'windows' ? 'Windows' : 'macOS'} installer from Google Drive`,
          google_drive_file_id: fileId,
          google_drive_url: downloadUrl,
          platform: selectedPlatform,
          version: '1.1.0',
          storage_type: 'google_drive',
          is_active: true
        }, {
          onConflict: 'platform'
        });

      if (error) throw error;

      alert('Google Drive URL added successfully!');
      setGoogleDriveUrl('');
      fetchDownloads();

    } catch (error) {
      console.error('Error adding Google Drive URL:', error);
      alert('Failed to add Google Drive URL. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleDownloadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from('downloads')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchDownloads();
    } catch (error) {
      console.error('Error updating download status:', error);
      alert('Failed to update download status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Downloads Administration</h1>

        {/* Upload Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Add Download Files</h2>
          
          {/* Google Drive URL Section */}
          <div className="border border-yellow-500 rounded-lg p-4 mb-6 bg-yellow-500/5">
            <h3 className="text-lg font-medium mb-3 text-yellow-400">🚀 Google Drive URL (Recommended for large files)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as 'windows' | 'mac')}
                  disabled={uploading}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="windows">Windows</option>
                  <option value="mac">macOS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Google Drive URL</label>
                <input
                  type="url"
                  value={googleDriveUrl}
                  onChange={(e) => setGoogleDriveUrl(e.target.value)}
                  disabled={uploading}
                  placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              <button
                onClick={handleGoogleDriveUrl}
                disabled={uploading || !googleDriveUrl.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-medium px-4 py-2 rounded"
              >
                Add Google Drive URL
              </button>
              <div className="text-sm text-gray-400">
                <p><strong>How to get Google Drive URL:</strong></p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Upload your file to Google Drive</li>
                  <li>Right-click the file → Share → Change to "Anyone with the link"</li>
                  <li>Copy the share link and paste it above</li>
                </ol>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Windows Upload */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Windows Installer (Supabase)</h3>
              <input
                type="file"
                accept=".exe"
                onChange={(e) => handleFileUpload(e, 'windows')}
                disabled={uploading}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <p className="text-sm text-gray-400 mt-2">Upload .exe file for Windows (Max 50MB)</p>
            </div>

            {/* macOS Upload */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">macOS Installer (Supabase)</h3>
              <input
                type="file"
                accept=".dmg"
                onChange={(e) => handleFileUpload(e, 'mac')}
                disabled={uploading}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <p className="text-sm text-gray-400 mt-2">Upload .dmg file for macOS (Max 50MB)</p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>

        {/* Downloads List */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Downloads</h2>
          
          {downloads.length === 0 ? (
            <p className="text-gray-400">No downloads found. Upload some files to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Platform</th>
                    <th className="pb-3">Storage</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Downloads</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((download) => (
                    <tr key={download.id} className="border-b border-gray-800">
                      <td className="py-3">{download.name}</td>
                      <td className="py-3 capitalize">{download.platform}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          download.storage_type === 'google_drive'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {download.storage_type === 'google_drive' ? 'Google Drive' : 'Supabase'}
                        </span>
                      </td>
                      <td className="py-3">{download.version}</td>
                      <td className="py-3">{download.download_count}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          download.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {download.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => toggleDownloadStatus(download.id, download.is_active)}
                          className={`px-3 py-1 rounded text-xs ${
                            download.is_active
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {download.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}