# Google Drive Integration Setup Guide

## Overview
This guide helps you set up Google Drive integration for downloading large files (>50MB) that exceed Supabase storage limits.

## 1. Upload Files to Google Drive

### Step 1: Upload Your Files
1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "File upload"
3. Upload your installer files:
   - `GhostCoder Setup 1.1.0.exe` (Windows)
   - `GhostCoder-1.1.0.dmg` (macOS)

### Step 2: Make Files Public
For each uploaded file:
1. Right-click the file → "Share"
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the share link

## 2. Extract File IDs from Google Drive URLs

### URL Formats:
- **Share URL**: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- **Direct Download**: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Example:
If your share URL is:
```
https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing
```

Your File ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 3. Add Files via Admin Panel

### Method 1: Using Admin Interface (Recommended)
1. Go to `/admin/downloads` on your website
2. In the "Google Drive URL" section:
   - Select platform (Windows/macOS)
   - Paste the Google Drive share URL
   - Click "Add Google Drive URL"

### Method 2: Direct Database Insert
Run this SQL in your Supabase SQL editor:

```sql
-- Replace YOUR_WINDOWS_FILE_ID and YOUR_MAC_FILE_ID with actual file IDs

-- Windows installer
INSERT INTO public.downloads (
  name, 
  description, 
  google_drive_file_id, 
  google_drive_url, 
  platform, 
  version, 
  storage_type,
  is_active
) VALUES (
  'GhostCoder Setup',
  'GhostCoder installer for Windows',
  'YOUR_WINDOWS_FILE_ID',
  'https://drive.google.com/uc?export=download&id=YOUR_WINDOWS_FILE_ID',
  'windows',
  '1.1.0',
  'google_drive',
  true
) ON CONFLICT (platform) DO UPDATE SET
  google_drive_file_id = EXCLUDED.google_drive_file_id,
  google_drive_url = EXCLUDED.google_drive_url,
  storage_type = EXCLUDED.storage_type,
  updated_at = timezone('utc'::text, now());

-- macOS installer
INSERT INTO public.downloads (
  name, 
  description, 
  google_drive_file_id, 
  google_drive_url, 
  platform, 
  version, 
  storage_type,
  is_active
) VALUES (
  'GhostCoder',
  'GhostCoder installer for macOS',
  'YOUR_MAC_FILE_ID',
  'https://drive.google.com/uc?export=download&id=YOUR_MAC_FILE_ID',
  'mac',
  '1.1.0',
  'google_drive',
  true
) ON CONFLICT (platform) DO UPDATE SET
  google_drive_file_id = EXCLUDED.google_drive_file_id,
  google_drive_url = EXCLUDED.google_drive_url,
  storage_type = EXCLUDED.storage_type,
  updated_at = timezone('utc'::text, now());
```

## 4. Testing the Integration

### Test Downloads:
1. Visit your website
2. Click any download button (Hero, CTA, Footer)
3. File should download directly from Google Drive
4. Check admin panel - download count should increment

### Verify in Admin Panel:
1. Go to `/admin/downloads`
2. Check that files show "Google Drive" storage type
3. Verify download counts are tracking

## 5. Benefits of Google Drive Integration

### ✅ **Advantages:**
- **No Size Limits**: Upload files of any size
- **Fast Downloads**: Google's CDN ensures fast delivery
- **Cost Effective**: Free storage up to 15GB
- **Easy Management**: Simple web interface
- **Reliable**: Google's infrastructure
- **Analytics**: Track downloads in your database

### ✅ **Features:**
- **Direct Downloads**: No intermediate pages
- **Download Tracking**: Count downloads automatically
- **Admin Management**: Easy file management
- **Fallback Support**: Can use both Google Drive and Supabase
- **Mobile Friendly**: Works on all devices

## 6. File Management

### Updating Files:
1. Upload new version to Google Drive
2. Update the URL in admin panel
3. Old downloads automatically use new file

### Version Control:
- Keep old versions in separate folders
- Update version number in database
- Track download statistics per version

## 7. Security Considerations

### ✅ **Secure Setup:**
- Files are publicly accessible (required for direct downloads)
- No sensitive data should be in file names
- Use download tracking for analytics
- Monitor download patterns for abuse

### 🔒 **Best Practices:**
- Use descriptive but generic file names
- Regularly check download statistics
- Keep backup copies of files
- Monitor Google Drive storage usage

## 8. Troubleshooting

### Common Issues:

**Downloads not working:**
- Check if file is publicly accessible
- Verify file ID is correct
- Test direct Google Drive URL

**File not found:**
- Ensure file sharing is set to "Anyone with the link"
- Check if file was moved or deleted
- Verify file ID extraction

**Slow downloads:**
- Google Drive may throttle large downloads
- Consider using multiple mirror links
- Check user's internet connection

## 9. Advanced Features (Optional)

### Google Drive API Integration:
If you want advanced features, you can integrate Google Drive API:

1. Get API key from Google Cloud Console
2. Add to environment variables:
   ```env
   GOOGLE_DRIVE_API_KEY=your_api_key
   ```
3. Use API for file metadata, size info, etc.

This is optional - the current system works without API access.