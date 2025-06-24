/*
  # Seed sample products for In Style BD

  1. Sample Data
    - Add sample products for each category (apparel, jewelry, beauty)
    - Include products for all specified subcategories
    - Use realistic product names and descriptions
*/

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

-- Beauty Products
('Hydrating Hyaluronic Acid Serum', 'beauty', 'skincare', 2800, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Intensive hydrating serum with hyaluronic acid', 50),
('Long-Lasting Matte Lipstick', 'beauty', 'makeup', 1200, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'High-quality long-lasting matte lipstick', 60),
('Vanilla Orchid Eau de Parfum', 'beauty', 'fragrance', 4500, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Luxurious vanilla orchid eau de parfum', 25),
('Argan Oil Hair Mask', 'beauty', 'haircare', 1800, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Nourishing argan oil hair mask', 35),
('Shea Butter Body Lotion', 'beauty', 'bodycare', 1500, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Moisturizing shea butter body lotion', 40),
('Gel Nail Polish Kit', 'beauty', 'nailcare', 2200, 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=600', 'Complete gel nail polish kit', 20),
('Professional Makeup Brush Set', 'beauty', 'tools', 3500, 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600', 'Professional quality makeup brush set', 15),
('Travel Size Skincare Set', 'beauty', 'sets', 2800, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600', 'Convenient travel size skincare set', 30);