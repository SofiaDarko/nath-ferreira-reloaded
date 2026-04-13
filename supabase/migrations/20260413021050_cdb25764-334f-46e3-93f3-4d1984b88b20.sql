
-- Create the portfolio-assets bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true);

-- Allow public read access
CREATE POLICY "Public read access for portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Allow public upload
CREATE POLICY "Public upload for portfolio assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow public update
CREATE POLICY "Public update for portfolio assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-assets');

-- Allow public delete
CREATE POLICY "Public delete for portfolio assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets');
