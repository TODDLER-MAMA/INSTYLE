/*
  # Fix Admin User Setup and RLS Policies

  1. Security Updates
    - Update RLS policies to work with Supabase auth
    - Ensure proper admin access control
    - Fix auth function references

  2. Notes
    - Admin user must be created manually through Supabase Dashboard
    - Email: instylebd86@gmail.com
    - This migration sets up the database policies correctly
*/

-- Create or replace the email function that works with Supabase auth
CREATE OR REPLACE FUNCTION public.get_user_email() 
RETURNS text 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'email',
    ''
  );
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- Create updated policies using the correct auth approach
CREATE POLICY "Only admin can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  );

CREATE POLICY "Only admin can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  );

CREATE POLICY "Only admin can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  );

CREATE POLICY "Only admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  );

CREATE POLICY "Only admin can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'instylebd86@gmail.com'
  );

-- Ensure public can still read products and create orders
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update the handle_new_user function to work properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile for the admin user
  IF NEW.email = 'instylebd86@gmail.com' THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'In Style BD Admin'),
      'admin'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create admin profile if it doesn't exist (for manual user creation)
DO $$
BEGIN
  -- This will only work if the admin user already exists in auth.users
  -- The user must be created manually through Supabase Dashboard
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'instylebd86@gmail.com'
  ) THEN
    INSERT INTO profiles (id, email, full_name, role, created_at)
    SELECT 
      id, 
      email, 
      'In Style BD Admin', 
      'admin', 
      now()
    FROM auth.users 
    WHERE email = 'instylebd86@gmail.com'
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      updated_at = now();
    
    RAISE NOTICE 'Admin profile created/updated successfully';
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users - please create manually through Supabase Dashboard';
  END IF;
END $$;