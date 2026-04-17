CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  course text NOT NULL,
  course_en text,
  school text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_en text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read education"
ON public.education
FOR SELECT
USING (true);

CREATE POLICY "Auth manage education"
ON public.education
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);