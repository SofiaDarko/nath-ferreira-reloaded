-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  description text NOT NULL DEFAULT '',
  description_en text,
  tags text[] NOT NULL DEFAULT '{}',
  thumb text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#ffffff',
  bg text NOT NULL DEFAULT '#141414',
  special boolean NOT NULL DEFAULT false,
  icon_url text,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Auth manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- experiences
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  title text NOT NULL,
  title_en text,
  company text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_en text,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Auth manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- site_settings (single row)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  theme jsonb NOT NULL DEFAULT '{}',
  global_settings jsonb NOT NULL DEFAULT '{}',
  social_links jsonb NOT NULL DEFAULT '[]',
  editable_texts jsonb NOT NULL DEFAULT '{}',
  user_photo text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Auth manage settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure only one row in site_settings
CREATE UNIQUE INDEX site_settings_singleton ON public.site_settings ((true));