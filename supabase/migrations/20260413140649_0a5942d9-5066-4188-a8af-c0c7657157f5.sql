-- Drop existing policies on portfolio-assets
DROP POLICY IF EXISTS "Public read access for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for portfolio assets" ON storage.objects;

-- SELECT: public read
CREATE POLICY "Public read access for portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- INSERT: authenticated users can upload
CREATE POLICY "Authenticated upload for portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- UPDATE: only the file owner can update
CREATE POLICY "Owner update for portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND owner = auth.uid());

-- DELETE: only the file owner can delete
CREATE POLICY "Owner delete for portfolio assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND owner = auth.uid());