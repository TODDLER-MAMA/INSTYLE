/*
  # Enhanced Product Management System

  1. New Tables
    - `products` - Main product information with enhanced fields
    - `product_variants` - Product variations (size, color, material, etc.)
    - `product_images` - Multiple images per product with ordering
  
  2. Security
    - Enable RLS on all product tables
    - Public can read active products and their variants/images
    - Only admin can manage all product data
    - Updated policies for orders and profiles using correct auth functions
  
  3. Features
    - Support for multiple product variants with individual pricing and stock
    - Multiple images per product with display ordering
    - Enhanced product categorization and metadata
    - Automatic timestamp updates via triggers
*/

-- Drop existing products table if it exists
DROP TABLE IF EXISTS products CASCADE;

-- Create enhanced products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('apparel', 'jewelry', 'beauty')),
  subcategory text NOT NULL,
  base_price numeric(10,2) NOT NULL CHECK (base_price >= 0),
  description text NOT NULL DEFAULT '',
  brand text,
  material text,
  care_instructions text,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  size text,
  color text,
  material_variant text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku text UNIQUE,
  weight numeric(8,2),
  dimensions text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_subcategory_idx ON products(subcategory);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS product_variants_sku_idx ON product_variants(sku);
CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON product_images(product_id);
CREATE INDEX IF NOT EXISTS product_images_display_order_idx ON product_images(display_order);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current user email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'email',
    (auth.jwt() -> 'user_metadata' ->> 'email'),
    (auth.jwt() -> 'app_metadata' ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active products" ON products;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can read product variants" ON product_variants;
DROP POLICY IF EXISTS "Only admin can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;
DROP POLICY IF EXISTS "Only admin can manage product images" ON product_images;

-- Create RLS policies for products
CREATE POLICY "Anyone can read active products"
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

-- Create RLS policies for product variants
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

-- Create RLS policies for product images
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

-- Update existing orders and profiles policies
DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;

-- Create updated policies for orders
CREATE POLICY "Only admin can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (get_current_user_email() = 'instylebd86@gmail.com')
  WITH CHECK (get_current_user_email() = 'instylebd86@gmail.com');

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create updated policies for profiles
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

-- Create function to update product updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();

-- Insert sample products with variants and images
INSERT INTO products (name, category, subcategory, base_price, description, brand, material, is_featured) VALUES
-- Apparel Products
('Floral Embroidered Kurta Set', 'apparel', 'kurta-set', 3500, 'Beautiful floral embroidered kurta set perfect for festive occasions', 'In Style BD', 'Cotton Silk', true),
('Bohemian Blouse with Tassels', 'apparel', 'tops', 1800, 'Trendy bohemian style blouse with decorative tassels', 'In Style BD', 'Cotton', false),
('Handloom Cotton Kurta', 'apparel', 'kurta', 2200, 'Comfortable handloom cotton kurta for daily wear', 'In Style BD', 'Handloom Cotton', false),
('Linen Co-ord Set', 'apparel', 'coord-set', 4200, 'Stylish linen co-ord set with wide-leg pants', 'In Style BD', 'Linen', true),
('Unicorn Print Kids Frock', 'apparel', 'kids-wear', 1200, 'Adorable unicorn print frock for little girls', 'In Style BD', 'Cotton', false),
('Velvet Evening Gown', 'apparel', 'long-gown', 8500, 'Elegant velvet evening gown for special occasions', 'In Style BD', 'Velvet', true),

-- Jewelry Products
('Dainty Gold Layered Necklace', 'jewelry', 'necklace', 4500, 'Delicate gold layered necklace for everyday elegance', 'In Style BD', 'Gold Plated', true),
('Sterling Silver Drop Earrings', 'jewelry', 'earrings', 2200, 'Beautiful sterling silver drop earrings', 'In Style BD', 'Sterling Silver', false),
('Beaded Charm Bracelet', 'jewelry', 'bracelet', 1800, 'Colorful beaded charm bracelet', 'In Style BD', 'Mixed Materials', false),
('Solitaire Ring', 'jewelry', 'ring', 3200, 'Elegant solitaire cubic zirconia ring', 'In Style BD', 'Sterling Silver', true),

-- Beauty Products
('Hydrating Serum', 'beauty', 'skincare', 2800, 'Intensive hydrating serum with hyaluronic acid', 'In Style BD', null, false),
('Matte Lipstick', 'beauty', 'makeup', 1200, 'High-quality long-lasting matte lipstick', 'In Style BD', null, true),
('Vanilla Perfume', 'beauty', 'fragrance', 4500, 'Luxurious vanilla orchid eau de parfum', 'In Style BD', null, false),
('Hair Mask', 'beauty', 'haircare', 1800, 'Nourishing argan oil hair mask', 'In Style BD', null, false);

-- Insert product variants
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, is_default) 
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'apparel' THEN 'Medium - Red'
    WHEN p.category = 'jewelry' THEN 'Standard - Gold'
    ELSE 'Standard'
  END,
  CASE 
    WHEN p.category = 'apparel' THEN 'M'
    WHEN p.category = 'jewelry' THEN '18"'
    ELSE '50ml'
  END,
  CASE 
    WHEN p.category = 'apparel' THEN 'Red'
    WHEN p.category = 'jewelry' THEN 'Gold'
    ELSE null
  END,
  p.base_price,
  FLOOR(RANDOM() * 50 + 10)::integer,
  true
FROM products p;

-- Insert additional variants for some products
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, is_default)
SELECT 
  p.id,
  'Large - Blue',
  'L',
  'Blue',
  p.base_price + 200,
  FLOOR(RANDOM() * 30 + 5)::integer,
  false
FROM products p 
WHERE p.category = 'apparel'
LIMIT 3;

-- Insert sample product images (using placeholder URLs for now)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'apparel' THEN 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHEN p.category = 'jewelry' THEN 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600'
    ELSE 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600'
  END,
  p.name || ' - Main Image',
  0,
  true
FROM products p;