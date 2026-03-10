-- ==========================================
-- GALLERY ALBUMS MIGRATION
-- ==========================================

-- Create gallery_albums table
CREATE TABLE public.gallery_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  year integer NOT NULL,
  category text NOT NULL DEFAULT 'General',
  cover_image_url text,
  is_featured boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

-- Anyone can view albums
CREATE POLICY "Albums are publicly viewable."
  ON public.gallery_albums FOR SELECT
  USING (true);

-- Admins can insert albums
CREATE POLICY "Admins can create albums."
  ON public.gallery_albums FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Admins can update albums
CREATE POLICY "Admins can update albums."
  ON public.gallery_albums FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Admins can delete albums
CREATE POLICY "Admins can delete albums."
  ON public.gallery_albums FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Add album_id to gallery_photos (nullable for backward compatibility)
ALTER TABLE public.gallery_photos ADD COLUMN album_id uuid REFERENCES public.gallery_albums(id) ON DELETE SET NULL;

-- Add year column to gallery_photos for timeline grouping
ALTER TABLE public.gallery_photos ADD COLUMN year integer;

-- Add media_type column to support videos
ALTER TABLE public.gallery_photos ADD COLUMN media_type text DEFAULT 'photo' CHECK (media_type IN ('photo', 'video'));
