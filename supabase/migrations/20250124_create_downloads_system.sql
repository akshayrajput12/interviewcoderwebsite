-- Create downloads table to track download files
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500), -- For Supabase storage (optional)
  google_drive_url VARCHAR(500), -- For Google Drive direct download
  google_drive_file_id VARCHAR(100), -- Google Drive file ID
  file_size BIGINT,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('windows', 'mac', 'linux')),
  version VARCHAR(50) NOT NULL,
  storage_type VARCHAR(20) DEFAULT 'supabase' CHECK (storage_type IN ('supabase', 'google_drive')),
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for downloads table
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active downloads
CREATE POLICY "Allow public read access to active downloads" ON public.downloads
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to update download count
CREATE POLICY "Allow authenticated users to update download count" ON public.downloads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to update download count
CREATE OR REPLACE FUNCTION increment_download_count(download_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.downloads 
  SET download_count = download_count + 1,
      updated_at = timezone('utc'::text, now())
  WHERE id = download_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial download records with Google Drive URLs
INSERT INTO public.downloads (name, description, google_drive_file_id, google_drive_url, platform, version, storage_type) VALUES
  ('GhostCoder Setup', 'GhostCoder installer for Windows', '1xBPo-9W9SX4gMKeLLVeLIZHKoK5ptRKq', 'https://drive.google.com/uc?export=download&id=1xBPo-9W9SX4gMKeLLVeLIZHKoK5ptRKq', 'windows', '1.1.0', 'google_drive'),
  ('GhostCoder', 'GhostCoder installer for macOS', '1CFOWm9NdUrCahrYaldtfVi7KY_h1Wc6c', 'https://drive.google.com/uc?export=download&id=1CFOWm9NdUrCahrYaldtfVi7KY_h1Wc6c', 'mac', '1.1.0', 'google_drive');

-- Create storage bucket for downloads (this needs to be run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('downloads', 'downloads', true);

-- Create storage policies for downloads bucket
-- CREATE POLICY "Allow public read access to downloads bucket" ON storathis is my link for  gjostcoder windows-https://drive.google.com/file/d/1xBPo-9W9SX4gMKeLLVeLIZHKoK5ptRKq/view?usp=sharing   

ge.objects
--   FOR SELECT USING (bucket_id = 'downloads');

-- CREATE POLICY "Allow authenticated users to upload to downloads bucket" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'downloads' AND auth.role() = 'authenticated');