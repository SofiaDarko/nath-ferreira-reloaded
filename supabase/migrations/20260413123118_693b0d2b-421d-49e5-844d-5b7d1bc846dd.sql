-- Remove políticas permissivas existentes
DROP POLICY IF EXISTS "Public read access for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public update for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for portfolio assets" ON storage.objects;

-- SELECT: leitura pública
CREATE POLICY "Public read access for portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- INSERT: apenas autenticados
CREATE POLICY "Authenticated upload for portfolio assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- UPDATE: apenas autenticados
CREATE POLICY "Authenticated update for portfolio assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio-assets');

-- DELETE: apenas autenticados
CREATE POLICY "Authenticated delete for portfolio assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-assets');