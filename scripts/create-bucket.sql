-- scripts/create-bucket.sql
-- TẠO BUCKET CHO DOCUMENTS - CHẠY TRONG SQL EDITOR CỦA SUPABASE

-- =====================================================
-- 1. TẠO BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- 2. TẠO POLICIES CHO BUCKET
-- =====================================================

-- Policy: Cho phép public xem file
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

-- Policy: Cho phép user authenticated upload file
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

-- Policy: Cho phép user update file của mình
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Cho phép user delete file của mình
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 3. KIỂM TRA
-- =====================================================

SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'documents';