/*
  # Create admin user and complete setup

  1. Admin User Setup
    - Insert admin user into auth.users table
    - Create corresponding profile
    - Set proper role and permissions

  2. Final Security Updates
    - Ensure all RLS policies are properly configured
    - Verify admin-only access restrictions
*/

-- Insert admin user into auth.users if not exists
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'instylebd86@gmail.com';
    
    -- If user doesn't exist, create them
    IF admin_user_id IS NULL THEN
        -- Generate a new UUID for the admin user
        admin_user_id := gen_random_uuid();
        
        -- Insert into auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role
        ) VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000',
            'instylebd86@gmail.com',
            crypt('instyl9911', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "In Style BD Admin"}',
            false,
            'authenticated'
        );
        
        -- Insert into profiles table
        INSERT INTO profiles (
            id,
            email,
            full_name,
            role,
            created_at
        ) VALUES (
            admin_user_id,
            'instylebd86@gmail.com',
            'In Style BD Admin',
            'admin',
            now()
        );
        
        RAISE NOTICE 'Admin user created successfully';
    ELSE
        -- Update existing user's password
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('instyl9911', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            updated_at = now()
        WHERE id = admin_user_id;
        
        -- Ensure profile exists and has admin role
        INSERT INTO profiles (
            id,
            email,
            full_name,
            role,
            created_at
        ) VALUES (
            admin_user_id,
            'instylebd86@gmail.com',
            'In Style BD Admin',
            'admin',
            now()
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            updated_at = now();
            
        RAISE NOTICE 'Admin user updated successfully';
    END IF;
END $$;

-- Ensure auth schema functions are available
CREATE OR REPLACE FUNCTION auth.email() RETURNS text AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'email')::text
  )
$$ LANGUAGE sql STABLE;

-- Update RLS policies to use proper auth functions
DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;

-- Create updated policies
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

CREATE POLICY "Only admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.email() = 'instylebd86@gmail.com')
  WITH CHECK (auth.email() = 'instylebd86@gmail.com');

CREATE POLICY "Only admin can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.email() = 'instylebd86@gmail.com')
  WITH CHECK (auth.email() = 'instylebd86@gmail.com');

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