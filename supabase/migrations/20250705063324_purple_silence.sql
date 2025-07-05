/*
  # Complete Database Schema Setup for In Style BD E-commerce

  1. New Tables
    - `products` - Main product information
    - `product_variants` - Product variations (size, color, price, stock)
    - `product_images` - Product image management
  
  2. Enhanced Features
    - Row Level Security (RLS) enabled
    - Admin-only management policies
    - Public read access for active products
    - Proper indexing for performance
    - Sample data insertion
  
  3. Security
    - Admin access restricted to instylebd86@gmail.com
    - Public can read active products and create orders
    - Proper foreign key relationships
*/

-- Create helper function to get current user email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS text AS $$
BEGIN
  RETURN auth.jwt() ->> 'email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Only admin can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can read product variants" ON product_variants;
DROP POLICY IF EXISTS "Only admin can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;
DROP POLICY IF EXISTS "Only admin can manage product images" ON product_images;

-- Create RLS policies for products
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

-- Update existing orders and profiles policies if tables exist
DO $$
BEGIN
  -- Update orders policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
    DROP POLICY IF EXISTS "Only admin can manage orders" ON orders;
    DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
    
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
  END IF;

  -- Update profiles policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Only admin can view profiles" ON profiles;
    DROP POLICY IF EXISTS "Only admin can insert profiles" ON profiles;
    DROP POLICY IF EXISTS "Only admin can update profiles" ON profiles;
    
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
  END IF;
END $$;

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
('Floral Embroidered Kurta Set', 'apparel', 'kurta-set', 3500, 'Beautiful floral embroidered kurta set perfect for festive occasions. Features intricate hand embroidery and comfortable fit.', 'In Style BD', 'Cotton Silk', true),
('Bohemian Blouse with Tassels', 'apparel', 'tops', 1800, 'Trendy bohemian style blouse with decorative tassels. Perfect for casual outings and summer days.', 'In Style BD', 'Cotton', false),
('Handloom Cotton Kurta', 'apparel', 'kurta', 2200, 'Comfortable handloom cotton kurta for daily wear. Breathable fabric with traditional design.', 'In Style BD', 'Handloom Cotton', false),
('Linen Co-ord Set', 'apparel', 'coord-set', 4200, 'Stylish linen co-ord set with wide-leg pants. Perfect for office wear and casual meetings.', 'In Style BD', 'Linen', true),
('Unicorn Print Kids Frock', 'apparel', 'kids-wear', 1200, 'Adorable unicorn print frock for little girls. Soft fabric with vibrant colors.', 'In Style BD', 'Cotton', false),
('Velvet Evening Gown', 'apparel', 'long-gown', 8500, 'Elegant velvet evening gown for special occasions. Features flowing silhouette and luxurious feel.', 'In Style BD', 'Velvet', true),
('Traditional Three Piece', 'apparel', 'three-piece', 5200, 'Complete traditional three piece set with dupatta. Perfect for weddings and festivals.', 'In Style BD', 'Georgette', true),
('Silk Saree with Blouse', 'apparel', 'saree', 6800, 'Premium silk saree with matching blouse piece. Traditional design with modern touch.', 'In Style BD', 'Silk', false),
('Embroidered Dupatta', 'apparel', 'dupatta', 1500, 'Beautiful embroidered dupatta to complement your outfit. Lightweight and elegant.', 'In Style BD', 'Chiffon', false),
('High-Waist Palazzo', 'apparel', 'bottom', 2200, 'Comfortable high-waist palazzo pants. Perfect for casual and semi-formal occasions.', 'In Style BD', 'Rayon', false),

-- Jewelry Products
('Dainty Gold Layered Necklace', 'jewelry', 'necklace', 4500, 'Delicate gold layered necklace for everyday elegance. Features multiple chains of varying lengths.', 'In Style BD', 'Gold Plated', true),
('Sterling Silver Drop Earrings', 'jewelry', 'earrings', 2200, 'Beautiful sterling silver drop earrings with cubic zirconia stones. Perfect for special occasions.', 'In Style BD', 'Sterling Silver', false),
('Beaded Charm Bracelet', 'jewelry', 'bracelet', 1800, 'Colorful beaded charm bracelet with meaningful symbols. Adjustable size for comfort.', 'In Style BD', 'Mixed Materials', false),
('Solitaire Ring', 'jewelry', 'ring', 3200, 'Elegant solitaire cubic zirconia ring. Classic design that never goes out of style.', 'In Style BD', 'Sterling Silver', true),
('Delicate Anklet', 'jewelry', 'anklet', 1200, 'Delicate gold-plated anklet with small charms. Perfect for summer styling.', 'In Style BD', 'Gold Plated', false),
('Heart Pendant', 'jewelry', 'pendant', 2800, 'Beautiful heart-shaped pendant with chain. Symbol of love and affection.', 'In Style BD', 'Rose Gold', false),
('Traditional Nose Pin', 'jewelry', 'nose-pin', 800, 'Traditional gold-plated nose pin with small stone. Comfortable and secure fit.', 'In Style BD', 'Gold Plated', false),
('Pearl Hair Clip', 'jewelry', 'hair-accessories', 1500, 'Elegant pearl hair clip for special occasions. Adds sophistication to any hairstyle.', 'In Style BD', 'Alloy', false),
('Bridal Jewelry Set', 'jewelry', 'set', 12000, 'Complete bridal jewelry set including necklace, earrings, and bracelet. Perfect for weddings.', 'In Style BD', '18K Gold', true),

-- Beauty Products
('Hydrating Serum', 'beauty', 'skincare', 2800, 'Intensive hydrating serum with hyaluronic acid. Provides deep moisture and plumps the skin.', 'In Style BD', null, false),
('Matte Lipstick', 'beauty', 'makeup', 1200, 'High-quality long-lasting matte lipstick. Available in multiple shades for every skin tone.', 'In Style BD', null, true),
('Vanilla Orchid Perfume', 'beauty', 'fragrance', 4500, 'Luxurious vanilla orchid eau de parfum. Long-lasting fragrance with floral notes.', 'In Style BD', null, false),
('Argan Oil Hair Mask', 'beauty', 'haircare', 1800, 'Nourishing argan oil hair mask for damaged hair. Restores shine and softness.', 'In Style BD', null, false),
('Body Butter', 'beauty', 'bodycare', 2200, 'Rich and creamy body butter with shea butter. Provides intense moisturization.', 'In Style BD', null, false),
('Nail Polish Set', 'beauty', 'nailcare', 1500, 'Set of 5 nail polishes in trending colors. Long-lasting formula with high shine.', 'In Style BD', null, false),
('Makeup Brush Set', 'beauty', 'tools', 3200, 'Professional makeup brush set with 12 brushes. Soft bristles for flawless application.', 'In Style BD', null, true),
('Skincare Gift Set', 'beauty', 'sets', 5500, 'Complete skincare gift set with cleanser, toner, serum, and moisturizer.', 'In Style BD', null, false);

-- Insert product variants
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, is_default) 
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'apparel' THEN p.size_color.size || ' - ' || p.size_color.color
    WHEN p.category = 'jewelry' THEN 'Standard - ' || p.size_color.color
    ELSE 'Standard'
  END,
  p.size_color.size,
  p.size_color.color,
  p.base_price,
  FLOOR(RANDOM() * 50 + 10)::integer,
  true
FROM (
  SELECT 
    p.*,
    CASE 
      WHEN p.category = 'apparel' THEN 
        CASE 
          WHEN p.subcategory IN ('kids-wear') THEN ROW('2-3Y', 'Pink')::record
          WHEN p.subcategory IN ('saree', 'dupatta') THEN ROW('One Size', 'Red')::record
          ELSE ROW('M', 'Red')::record
        END
      WHEN p.category = 'jewelry' THEN 
        CASE 
          WHEN p.subcategory = 'necklace' THEN ROW('18"', 'Gold')::record
          WHEN p.subcategory = 'ring' THEN ROW('7', 'Silver')::record
          WHEN p.subcategory = 'bracelet' THEN ROW('7"', 'Gold')::record
          WHEN p.subcategory = 'anklet' THEN ROW('9"', 'Gold')::record
          ELSE ROW('One Size', 'Gold')::record
        END
      ELSE ROW('50ml', NULL)::record
    END AS size_color
  FROM products p
) p(id, name, category, subcategory, base_price, description, brand, material, care_instructions, is_featured, status, created_at, updated_at, size_color);

-- Insert additional variants for apparel products
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, is_default)
SELECT 
  p.id,
  'L - Blue',
  'L',
  'Blue',
  p.base_price + 200,
  FLOOR(RANDOM() * 30 + 5)::integer,
  false
FROM products p 
WHERE p.category = 'apparel' AND p.subcategory NOT IN ('saree', 'dupatta', 'kids-wear')
LIMIT 5;

-- Insert additional variants for jewelry
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, is_default)
SELECT 
  p.id,
  'Standard - Rose Gold',
  CASE 
    WHEN p.subcategory = 'necklace' THEN '20"'
    WHEN p.subcategory = 'ring' THEN '8'
    WHEN p.subcategory = 'bracelet' THEN '7.5"'
    ELSE 'One Size'
  END,
  'Rose Gold',
  p.base_price + 500,
  FLOOR(RANDOM() * 25 + 3)::integer,
  false
FROM products p 
WHERE p.category = 'jewelry'
LIMIT 4;

-- Insert sample product images
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

-- Insert additional images for featured products
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'apparel' THEN 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHEN p.category = 'jewelry' THEN 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600'
    ELSE 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600'
  END,
  p.name || ' - Secondary Image',
  1,
  false
FROM products p 
WHERE p.is_featured = true;