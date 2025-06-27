/*
  # Fix JWT Function Error

  1. Problem
    - The jwt() function doesn't exist in Supabase
    - RLS policies are failing due to incorrect function calls
    - Need to use proper Supabase auth functions

  2. Solution
    - Drop all existing problematic policies
    - Create helper function using correct Supabase auth methods
    - Recreate all policies with proper authentication checks
    - Ensure admin-only access for management operations

  3. Security
    - Admin user: instylebd86@gmail.com
    - Public read access for active products
    - Public order creation for checkout
*/

-- Drop all existing policies that might be causing issues
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Create a reliable function to get the current user's email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    ''
  );
$$;

-- Create RLS policies for profiles table
CREATE POLICY "Only admin can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.get_current_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_current_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_email() = 'instylebd86@gmail.com');

-- Create RLS policies for products table
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Only admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (public.get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (public.get_current_user_email() = 'instylebd86@gmail.com');

-- Create RLS policies for orders table
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admin can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (public.get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (public.get_current_user_email() = 'instylebd86@gmail.com');

-- Create RLS policies for product_variants table (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_variants'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can read product variants"
      ON product_variants
      FOR SELECT
      TO public
      USING (true)';

    EXECUTE 'CREATE POLICY "Only admin can manage product variants"
      ON product_variants
      FOR ALL
      TO authenticated
      USING (public.get_current_user_email() = ''instylebd86@gmail.com'')
      WITH CHECK (public.get_current_user_email() = ''instylebd86@gmail.com'')';
  END IF;
END $$;

-- Create RLS policies for product_images table (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_images'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can read product images"
      ON product_images
      FOR SELECT
      TO public
      USING (true)';

    EXECUTE 'CREATE POLICY "Only admin can manage product images"
      ON product_images
      FOR ALL
      TO authenticated
      USING (public.get_current_user_email() = ''instylebd86@gmail.com'')
      WITH CHECK (public.get_current_user_email() = ''instylebd86@gmail.com'')';
  END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on variant and image tables if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_variants'
  ) THEN
    EXECUTE 'ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_images'
  ) THEN
    EXECUTE 'ALTER TABLE product_images ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

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
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();