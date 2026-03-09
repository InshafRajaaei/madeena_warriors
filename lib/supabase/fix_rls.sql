-- Drop the recursive policies that are causing the 500 error
DROP POLICY IF EXISTS "Admins can view all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles." ON public.profiles;

-- Create a secure function to check admin status without triggering RLS again
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin FROM profiles WHERE id = auth.uid();
$$;

-- Recreate the policies using the new function
CREATE POLICY "Admins can view all profiles."
  ON public.profiles FOR SELECT
  TO authenticated
  USING ( public.is_admin() );

CREATE POLICY "Admins can update all profiles."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( public.is_admin() );
