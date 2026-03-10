-- ==========================================
-- GALLERY V2 MIGRATION
-- Dynamic categories + cover photo support
-- ==========================================

-- Create gallery_categories table for dynamic categories
CREATE TABLE public.gallery_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Categories are publicly viewable."
  ON public.gallery_categories FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can create categories."
  ON public.gallery_categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories."
  ON public.gallery_categories FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete categories."
  ON public.gallery_categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Insert default categories
INSERT INTO public.gallery_categories (name, sort_order) VALUES
  ('School Days', 1),
  ('Sports & Events', 2),
  ('Farewell 2018', 3),
  ('Reunions', 4),
  ('Achievements', 5),
  ('Campus Life', 6),
  ('General', 7)
ON CONFLICT (name) DO NOTHING;
