/*
  # Create secure admin user system

  1. Security Updates
    - Create admin user with specific email and password
    - Restrict admin access to single authorized user
    - Update RLS policies for enhanced security

  2. Admin User Creation
    - Email: instylebd86@gmail.com
    - Password: instyl9911
    - Role: admin
*/

-- First, let's ensure we have the auth schema available
-- Create the admin user (this will be handled through Supabase Auth)
-- Note: The actual user creation needs to be done through Supabase Auth API

-- Update profiles table to ensure proper admin role assignment
DO $$
BEGIN
  -- Update RLS policies to be more restrictive
  DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

  -- Create more restrictive policies
  CREATE POLICY "Only admin can view profiles"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.email() = 'instylebd86@gmail.com');

  CREATE POLICY "Only admin can insert profiles"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.email() = 'instylebd86@gmail.com');

  CREATE POLICY "Only admin can update profiles"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.email() = 'instylebd86@gmail.com');

  -- Update products policies to be admin-only for modifications
  DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
  
  CREATE POLICY "Only admin can manage products"
    ON products
    FOR ALL
    TO authenticated
    USING (auth.email() = 'instylebd86@gmail.com')
    WITH CHECK (auth.email() = 'instylebd86@gmail.com');

  -- Update orders policies to be admin-only
  DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
  
  CREATE POLICY "Only admin can manage orders"
    ON orders
    FOR ALL
    TO authenticated
    USING (auth.email() = 'instylebd86@gmail.com')
    WITH CHECK (auth.email() = 'instylebd86@gmail.com');

  -- Allow public to insert orders (for checkout)
  CREATE POLICY "Anyone can create orders"
    ON orders
    FOR INSERT
    TO public
    WITH CHECK (true);

END $$;