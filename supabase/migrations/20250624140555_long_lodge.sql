/*
  # Update products with specific categories and examples

  1. Clear existing products
  2. Insert new products with exact categories and examples as specified
  3. Ensure all subcategories match the required filters

  Categories:
  - Apparel: kurta-set, tops, kurta, coord-set, kids-wear, long-gown, three-piece, saree, dupatta, bottom, trouser
  - Jewelry: necklace, earrings, bracelet, ring, anklet, pendant, nose-pin, hair-accessories, set
  - Beauty: skincare, makeup, fragrance, haircare, bodycare, nailcare, tools, sets
*/

-- Clear existing products
TRUNCATE TABLE products;

-- Insert products with exact categories and examples
INSERT INTO products (name, category, subcategory, price, image_url, description, stock) VALUES
-- Apparel Products
('Floral Embroidered Kurta Set', 'apparel', 'kurta-set', 3500, 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beautiful floral embroidered kurta set perfect for festive occasions', 25),
('Bohemian Blouse with Tassels', 'apparel', 'tops', 1800, 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600', 'Trendy bohemian style blouse with decorative tassels', 30),
('Handloom Cotton Kurta', 'apparel', 'kurta', 2200, 'https://images.pexels.com/photos/8838974/pexels-photo-8838974.jpeg?auto=compress&cs=tinysrgb&w=600', 'Comfortable handloom cotton kurta for daily wear', 40),
('Linen Co-ord Set with Wide-Leg Pants', 'apparel', 'coord-set', 4200, 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Stylish linen co-ord set with wide-leg pants', 15),
('Unicorn Print Kids Frock', 'apparel', 'kids-wear', 1200, 'https://images.pexels.com/photos/6393342/pexels-photo-6393342.jpeg?auto=compress&cs=tinysrgb&w=600', 'Adorable unicorn print frock for little girls', 20),
('Velvet Evening Gown', 'apparel', 'long-gown', 8500, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', 'Elegant velvet evening gown for special occasions', 8),
('Embellished Three-Piece Suit', 'apparel', 'three-piece', 12000, 'https://images.pexels.com/photos/8838889/pexels-photo-8838889.jpeg?auto=compress&cs=tinysrgb&w=600', 'Luxurious embellished three-piece suit', 10),
('Traditional Jamdani Saree', 'apparel', 'saree', 6500, 'https://images.pexels.com/photos/8838845/pexels-photo-8838845.jpeg?auto=compress&cs=tinysrgb&w=600', 'Authentic traditional Jamdani saree', 12),
('Silk Organza Dupatta', 'apparel', 'dupatta', 950, 'https://images.pexels.com/photos/8838841/pexels-photo-8838841.jpeg?auto=compress&cs=tinysrgb&w=600', 'Elegant silk organza dupatta', 35),
('High-Waisted Palazzo Pants', 'apparel', 'bottom', 1600, 'https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=600', 'Comfortable high-waisted palazzo pants', 28),
('Tailored Slim-Fit Trousers', 'apparel', 'trouser', 2800, 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=600', 'Professional tailored slim-fit trousers', 22),

-- Additional Apparel Products for variety
('Printed Kurta Set with Palazzo', 'apparel', 'kurta-set', 3200, 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600', 'Stylish printed kurta set with matching palazzo', 20),
('Casual Cotton Top', 'apparel', 'tops', 1500, 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600', 'Comfortable casual cotton top for everyday wear', 35),
('Designer Anarkali Kurta', 'apparel', 'kurta', 2800, 'https://images.pexels.com/photos/8838974/pexels-photo-8838974.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beautiful designer anarkali kurta', 18),
('Matching Crop Top and Skirt Set', 'apparel', 'coord-set', 3800, 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600', 'Trendy matching crop top and skirt set', 12),
('Butterfly Print Kids Dress', 'apparel', 'kids-wear', 1100, 'https://images.pexels.com/photos/6393342/pexels-photo-6393342.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beautiful butterfly print dress for kids', 25),
('Sequined Party Gown', 'apparel', 'long-gown', 9500, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', 'Glamorous sequined party gown', 6),
('Wedding Three-Piece Lehenga', 'apparel', 'three-piece', 15000, 'https://images.pexels.com/photos/8838889/pexels-photo-8838889.jpeg?auto=compress&cs=tinysrgb&w=600', 'Exquisite wedding three-piece lehenga', 5),
('Handwoven Silk Saree', 'apparel', 'saree', 7200, 'https://images.pexels.com/photos/8838845/pexels-photo-8838845.jpeg?auto=compress&cs=tinysrgb&w=600', 'Premium handwoven silk saree', 8),
('Embroidered Net Dupatta', 'apparel', 'dupatta', 1200, 'https://images.pexels.com/photos/8838841/pexels-photo-8838841.jpeg?auto=compress&cs=tinysrgb&w=600', 'Delicate embroidered net dupatta', 30),
('Wide-Leg Culottes', 'apparel', 'bottom', 1800, 'https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=600', 'Stylish wide-leg culottes', 22),
('Formal Office Trousers', 'apparel', 'trouser', 3200, 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=600', 'Professional formal office trousers', 18),

-- Jewelry Products
('Dainty Gold Layered Necklace', 'jewelry', 'necklace', 4500, 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600', 'Delicate gold layered necklace for everyday elegance', 18),
('Sterling Silver Drop Earrings', 'jewelry', 'earrings', 2200, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beautiful sterling silver drop earrings', 25),
('Beaded Charm Bracelet', 'jewelry', 'bracelet', 1800, 'https://images.pexels.com/photos/6755071/pexels-photo-6755071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Colorful beaded charm bracelet', 30),
('Solitaire Cubic Zirconia Ring', 'jewelry', 'ring', 3200, 'https://images.pexels.com/photos/1121718/pexels-photo-1121718.jpeg?auto=compress&cs=tinysrgb&w=600', 'Elegant solitaire cubic zirconia ring', 15),
('Boho Shell Anklet', 'jewelry', 'anklet', 850, 'https://images.pexels.com/photos/6755068/pexels-photo-6755068.jpeg?auto=compress&cs=tinysrgb&w=600', 'Trendy boho style shell anklet', 40),
('Initial Letter Pendant', 'jewelry', 'pendant', 1500, 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600', 'Personalized initial letter pendant', 35),
('Classic Diamond Nose Pin', 'jewelry', 'nose-pin', 1200, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 'Classic diamond-studded nose pin', 20),
('Crystal Embellished Hair Clip', 'jewelry', 'hair-accessories', 650, 'https://images.pexels.com/photos/6755071/pexels-photo-6755071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Sparkly crystal embellished hair clip', 45),
('Pearl Necklace and Earring Set', 'jewelry', 'set', 5500, 'https://images.pexels.com/photos/1121718/pexels-photo-1121718.jpeg?auto=compress&cs=tinysrgb&w=600', 'Classic pearl necklace and earring set', 12),

-- Additional Jewelry Products
('Statement Gold Chain Necklace', 'jewelry', 'necklace', 5200, 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600', 'Bold statement gold chain necklace', 15),
('Hoop Earrings with Crystals', 'jewelry', 'earrings', 1800, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 'Elegant hoop earrings with crystal accents', 28),
('Tennis Bracelet', 'jewelry', 'bracelet', 3500, 'https://images.pexels.com/photos/6755071/pexels-photo-6755071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Classic tennis bracelet with cubic zirconia', 20),
('Vintage Style Cocktail Ring', 'jewelry', 'ring', 2800, 'https://images.pexels.com/photos/1121718/pexels-photo-1121718.jpeg?auto=compress&cs=tinysrgb&w=600', 'Vintage inspired cocktail ring', 12),
('Delicate Chain Anklet', 'jewelry', 'anklet', 950, 'https://images.pexels.com/photos/6755068/pexels-photo-6755068.jpeg?auto=compress&cs=tinysrgb&w=600', 'Delicate gold chain anklet', 35),
('Heart Shaped Pendant', 'jewelry', 'pendant', 1800, 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600', 'Romantic heart shaped pendant', 25),
('Gold Nose Ring', 'jewelry', 'nose-pin', 1400, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 'Traditional gold nose ring', 18),
('Pearl Hair Pins Set', 'jewelry', 'hair-accessories', 850, 'https://images.pexels.com/photos/6755071/pexels-photo-6755071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Elegant pearl hair pins set', 40),
('Bridal Jewelry Set', 'jewelry', 'set', 8500, 'https://images.pexels.com/photos/1121718/pexels-photo-1121718.jpeg?auto=compress&cs=tinysrgb&w=600', 'Complete bridal jewelry set', 8),

-- Beauty Products
('Hydrating Hyaluronic Acid Serum', 'beauty', 'skincare', 2800, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Intensive hydrating serum with hyaluronic acid', 50),
('Long-Lasting Matte Lipstick', 'beauty', 'makeup', 1200, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'High-quality long-lasting matte lipstick', 60),
('Vanilla Orchid Eau de Parfum', 'beauty', 'fragrance', 4500, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Luxurious vanilla orchid eau de parfum', 25),
('Argan Oil Hair Mask', 'beauty', 'haircare', 1800, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Nourishing argan oil hair mask', 35),
('Shea Butter Body Lotion', 'beauty', 'bodycare', 1500, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Moisturizing shea butter body lotion', 40),
('Gel Nail Polish Kit', 'beauty', 'nailcare', 2200, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Complete gel nail polish kit', 20),
('Professional Makeup Brush Set', 'beauty', 'tools', 3500, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Professional quality makeup brush set', 15),
('Travel Size Skincare Set', 'beauty', 'sets', 2800, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Convenient travel size skincare set', 30),

-- Additional Beauty Products
('Vitamin C Brightening Serum', 'beauty', 'skincare', 3200, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Brightening vitamin C serum for glowing skin', 45),
('Waterproof Mascara', 'beauty', 'makeup', 1500, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Long-lasting waterproof mascara', 55),
('Rose Garden Perfume', 'beauty', 'fragrance', 3800, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Romantic rose garden perfume', 30),
('Keratin Hair Treatment', 'beauty', 'haircare', 2500, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Professional keratin hair treatment', 25),
('Coconut Body Scrub', 'beauty', 'bodycare', 1800, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Exfoliating coconut body scrub', 35),
('French Manicure Kit', 'beauty', 'nailcare', 1800, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Complete French manicure kit', 25),
('LED Facial Cleansing Brush', 'beauty', 'tools', 4200, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Advanced LED facial cleansing brush', 12),
('Anti-Aging Skincare Set', 'beauty', 'sets', 3500, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Complete anti-aging skincare set', 20);