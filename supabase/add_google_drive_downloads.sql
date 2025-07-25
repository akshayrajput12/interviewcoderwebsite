-- Add/Update Google Drive download records
-- Run this SQL in your Supabase SQL editor

-- First, let's make sure we have the required columns (in case you're updating an existing table)
DO $$ 
BEGIN
    -- Add google_drive_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'google_drive_url') THEN
        ALTER TABLE public.downloads ADD COLUMN google_drive_url VARCHAR(500);
    END IF;
    
    -- Add google_drive_file_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'google_drive_file_id') THEN
        ALTER TABLE public.downloads ADD COLUMN google_drive_file_id VARCHAR(100);
    END IF;
    
    -- Add storage_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'storage_type') THEN
        ALTER TABLE public.downloads ADD COLUMN storage_type VARCHAR(20) DEFAULT 'supabase' CHECK (storage_type IN ('supabase', 'google_drive'));
    END IF;
END $$;

-- Insert or update Windows download record
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
    '1xBPo-9W9SX4gMKeLLVeLIZHKoK5ptRKq',
    'https://drive.google.com/uc?export=download&id=1xBPo-9W9SX4gMKeLLVeLIZHKoK5ptRKq',
    'windows',
    '1.1.0',
    'google_drive',
    true
) ON CONFLICT (platform) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    google_drive_file_id = EXCLUDED.google_drive_file_id,
    google_drive_url = EXCLUDED.google_drive_url,
    storage_type = EXCLUDED.storage_type,
    is_active = EXCLUDED.is_active,
    updated_at = timezone('utc'::text, now());

-- Insert or update macOS download record
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
    '1CFOWm9NdUrCahrYaldtfVi7KY_h1Wc6c',
    'https://drive.google.com/uc?export=download&id=1CFOWm9NdUrCahrYaldtfVi7KY_h1Wc6c',
    'mac',
    '1.1.0',
    'google_drive',
    true
) ON CONFLICT (platform) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    google_drive_file_id = EXCLUDED.google_drive_file_id,
    google_drive_url = EXCLUDED.google_drive_url,
    storage_type = EXCLUDED.storage_type,
    is_active = EXCLUDED.is_active,
    updated_at = timezone('utc'::text, now());

-- Verify the records were inserted/updated
SELECT 
    name,
    platform,
    storage_type,
    google_drive_file_id,
    is_active,
    download_count
FROM public.downloads 
WHERE platform IN ('windows', 'mac')
ORDER BY platform;