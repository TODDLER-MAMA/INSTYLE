/*
  # Fix RLS Policies and Admin Access

  1. Security
    - Create helper function to get user email from JWT
    - Update all RLS policies to use proper authentication
    - Ensure admin-only access for management operations
    - Maintain public read access for products and variants

  2. Changes
    - Drop existing problematic policies
    - Create new policies using public schema function
    - Fix authentication checks for admin user
*/

-- Create helper function to get user email from JWT in public schema
CREATE OR REPLACE FUNCTION public.get_user_email() 
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'email')::text
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Drop all existing policies to ensure clean state
DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Only admin can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can read product variants" ON product_variants;
DROP POLICY IF EXISTS "Only admin can manage product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;

-- Create RLS policies for profiles table
CREATE POLICY "Only admin can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.get_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_user_email() = 'instylebd86@gmail.com');

-- Create RLS policies for products table
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Only admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (public.get_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (public.get_user_email() = 'instylebd86@gmail.com');

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
  USING (public.get_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (public.get_user_email() = 'instylebd86@gmail.com');

-- Create RLS policies for product_variants table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants') THEN
    EXECUTE 'CREATE POLICY "Anyone can read product variants"
      ON product_variants
      FOR SELECT
      TO public
      USING (true)';

    EXECUTE 'CREATE POLICY "Only admin can manage product variants"
      ON product_variants
      FOR ALL
      TO authenticated
      USING (public.get_user_email() = ''instylebd86@gmail.com'')
      WITH CHECK (public.get_user_email() = ''instylebd86@gmail.com'')';
  END IF;
END $$;

-- Create RLS policies for product_images table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_images') THEN
    EXECUTE 'CREATE POLICY "Anyone can read product images"
      ON product_images
      FOR SELECT
      TO public
      USING (true)';

    EXECUTE 'CREATE POLICY "Only admin can manage product images"
      ON product_images
      FOR ALL
      TO authenticated
      USING (public.get_user_email() = ''instylebd86@gmail.com'')
      WITH CHECK (public.get_user_email() = ''instylebd86@gmail.com'')';
  END IF;
END $$;