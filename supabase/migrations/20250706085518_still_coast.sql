/*
  # Fix RLS Policies for Admin Access

  1. Security Policies
    - Update RLS policies to use proper email-based authentication
    - Ensure admin can manage all resources
    - Allow public access to read products and create orders

  2. Changes
    - Remove problematic auth.users manipulation
    - Focus only on RLS policy definitions
    - Use email-based authentication checks
*/

-- Create helper function to get current user email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    ''
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Only admin can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Only admin can manage product images" ON product_images;
DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Anyone can read product variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- Profiles policies
CREATE POLICY "Only admin can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com');

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Only admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');

-- Product variants policies
CREATE POLICY "Anyone can read product variants"
  ON product_variants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can manage product variants"
  ON product_variants
  FOR ALL
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');

-- Product images policies
CREATE POLICY "Anyone can read product images"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can manage product images"
  ON product_images
  FOR ALL
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');

-- Orders policies
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admin can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');