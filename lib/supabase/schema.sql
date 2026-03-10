-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text not null,
  last_name text not null,
  avatar_url text,
  current_country text,
  current_city text,
  job_title text,
  education text,
  is_approved boolean default false not null,
  is_admin boolean default false not null,
  contact_links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies

-- 1. Public can view approved profiles (or admins)
create policy "Public can view approved profiles."
  on public.profiles for select
  using ( is_approved = true or is_admin = true );

-- 2. Users can view their own profile regardless of approval
create policy "Users can view own profile."
  on public.profiles for select
  to authenticated
  using ( auth.uid() = id );

-- 3. Users can update their own profile
create policy "Users can update own profile."
  on public.profiles for update
  to authenticated
  using ( auth.uid() = id );

-- Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin FROM profiles WHERE id = auth.uid();
$$;

-- 4. Admins can view all profiles
create policy "Admins can view all profiles."
  on public.profiles for select
  to authenticated
  using ( public.is_admin() );

-- 5. Admins can update all profiles (for approval)
create policy "Admins can update all profiles."
  on public.profiles for update
  to authenticated
  using ( public.is_admin() );

-- 6. Insert policy - Authenticated users can insert their initial profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  to authenticated
  with check ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  to authenticated
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );

-- ==========================================
-- GALLERY
-- ==========================================

-- Create gallery_photos table
create table public.gallery_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  caption text,
  category text not null default 'General',
  is_approved boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gallery_photos enable row level security;

-- Anyone can view gallery photos
create policy "Gallery photos are publicly viewable."
  on public.gallery_photos for select
  using ( true );

-- Authenticated users can insert their own photos
create policy "Users can upload gallery photos."
  on public.gallery_photos for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Users can delete their own photos
create policy "Users can delete own gallery photos."
  on public.gallery_photos for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Admins can delete any photo
create policy "Admins can delete any gallery photo."
  on public.gallery_photos for delete
  to authenticated
  using ( public.is_admin() );

-- Admins can update any photo (for approval)
create policy "Admins can update gallery photos."
  on public.gallery_photos for update
  to authenticated
  using ( public.is_admin() );

-- Create storage bucket for gallery
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- Gallery storage policies
create policy "Gallery images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'gallery' );

create policy "Authenticated users can upload gallery images."
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'gallery' );

create policy "Users can delete own gallery images."
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'gallery' and auth.uid() = owner );
