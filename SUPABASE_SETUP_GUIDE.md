# Supabase Downloads Setup Guide

## 1. Database Setup

1. Run the migration file in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/migrations/20250124_create_downloads_system.sql
   ```

## 2. Storage Bucket Setup

### Step 1: Create the Downloads Bucket
1. Go to your Supabase Dashboard
2. Navigate to Storage > Buckets
3. Click "Create Bucket"
4. Name: `downloads`
5. Set as Public: ✅ (checked)
6. Click "Create Bucket"

### Step 2: Set Bucket Policies
Run these SQL commands in your Supabase SQL editor:

```sql
-- Allow public read access to downloads bucket
CREATE POLICY "Allow public read access to downloads bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'downloads');

-- Allow authenticated users to upload to downloads bucket
CREATE POLICY "Allow authenticated users to upload to downloads bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'downloads' AND auth.role() = 'authenticated');

-- Allow service role to manage downloads bucket
CREATE POLICY "Allow service role to manage downloads bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'downloads' AND auth.jwt() ->> 'role' = 'service_role');
```

## 3. Upload Your Files

### Option 1: Using Supabase Dashboard
1. Go to Storage > downloads bucket
2. Create a folder called `downloads`
3. Upload your files:
   - `GhostCoder Setup 1.1.0.exe` (Windows installer)
   - `GhostCoder-1.1.0.dmg` (macOS installer)

### Option 2: Using the Admin Component (Recommended)
1. Access `/admin/downloads` on your website (after implementing the admin component below)
2. Use the upload interface to upload files directly

## 4. File Structure in Bucket
Your bucket should look like this:
```
downloads/
├── downloads/
│   ├── GhostCoder Setup 1.1.0.exe
│   └── GhostCoder-1.1.0.dmg
```

## 5. Environment Variables
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 6. Testing
1. Visit your website
2. Click any download button
3. The file should download from Supabase storage
4. Check the database - download count should increment

## 7. Monitoring
- View download statistics in the `downloads` table
- Monitor storage usage in Supabase Dashboard
- Check download logs in your application logs