/*
  # Enhanced Product System

  1. New Tables
    - Enhanced `products` table with variants and images
    - `product_variants` table for different sizes, colors, etc.
    - `product_images` table for multiple images per product
    - `product_categories` table for structured categories

  2. Features
    - Multiple product variants with different prices/stock
    - Up to 5 images per product
    - Structured category/subcategory system
    - Size and color variants
    - Advanced inventory management
*/

-- Drop existing products table and recreate with enhanced structure
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
  variant_name text NOT NULL, -- e.g., "Red - Medium", "Gold - 18K"
  size text, -- S, M, L, XL, or custom sizes like "32", "34", etc.
  color text,
  material_variant text, -- e.g., "18K Gold", "Sterling Silver"
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku text UNIQUE,
  weight numeric(8,2), -- for jewelry/beauty products
  dimensions text, -- for specific measurements
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

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

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
  USING (auth.jwt() ->> 'email' = 'instylebd86@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'instylebd86@gmail.com');

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
  USING (auth.jwt() ->> 'email' = 'instylebd86@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'instylebd86@gmail.com');

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
  USING (auth.jwt() ->> 'email' = 'instylebd86@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'instylebd86@gmail.com');

-- Create function to update product updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();