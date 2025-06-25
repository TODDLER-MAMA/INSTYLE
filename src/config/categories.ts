import { CategoryConfig } from '../types'

export const categoryConfigs: Record<string, CategoryConfig> = {
  apparel: {
    name: 'Apparel',
    subcategories: [
      {
        value: 'kurta-set',
        name: 'Kurta Set',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'tops',
        name: 'Tops',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'kurta',
        name: 'Kurta',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'coord-set',
        name: 'Coord Set',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'kids-wear',
        name: 'Kids Wear',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y', '10-11Y', '11-12Y'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'long-gown',
        name: 'Long Gown',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'three-piece',
        name: 'Three Piece',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'saree',
        name: 'Saree',
        sizes: ['One Size'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'dupatta',
        name: 'Dupatta',
        sizes: ['One Size'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'bottom',
        name: 'Bottom',
        sizes: ['26', '28', '30', '32', '34', '36', '38', '40', '42'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      },
      {
        value: 'trouser',
        name: 'Trouser',
        sizes: ['26', '28', '30', '32', '34', '36', '38', '40', '42'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Maroon', 'Navy', 'Cream']
      }
    ]
  },
  jewelry: {
    name: 'Jewelry',
    subcategories: [
      {
        value: 'necklace',
        name: 'Necklace',
        sizes: ['14"', '16"', '18"', '20"', '22"', '24"'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'earrings',
        name: 'Earrings',
        sizes: ['Small', 'Medium', 'Large'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'bracelet',
        name: 'Bracelet',
        sizes: ['6"', '6.5"', '7"', '7.5"', '8"', '8.5"'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'ring',
        name: 'Ring',
        sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'anklet',
        name: 'Anklet',
        sizes: ['8"', '9"', '10"', '11"'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'pendant',
        name: 'Pendant',
        sizes: ['Small', 'Medium', 'Large'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      },
      {
        value: 'nose-pin',
        name: 'Nose Pin',
        sizes: ['One Size'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold']
      },
      {
        value: 'hair-accessories',
        name: 'Hair Accessories',
        sizes: ['One Size'],
        materials: ['Gold Plated', 'Sterling Silver', 'Alloy', 'Brass']
      },
      {
        value: 'set',
        name: 'Jewelry Set',
        sizes: ['One Size'],
        materials: ['Gold Plated', 'Sterling Silver', '18K Gold', '14K Gold', 'Rose Gold', 'Platinum']
      }
    ]
  },
  beauty: {
    name: 'Beauty',
    subcategories: [
      {
        value: 'skincare',
        name: 'Skincare',
        sizes: ['15ml', '30ml', '50ml', '100ml', '150ml']
      },
      {
        value: 'makeup',
        name: 'Makeup',
        sizes: ['Mini', 'Full Size', 'Travel Size']
      },
      {
        value: 'fragrance',
        name: 'Fragrance',
        sizes: ['30ml', '50ml', '100ml', '150ml']
      },
      {
        value: 'haircare',
        name: 'Hair Care',
        sizes: ['100ml', '200ml', '300ml', '500ml']
      },
      {
        value: 'bodycare',
        name: 'Body Care',
        sizes: ['100ml', '200ml', '300ml', '500ml']
      },
      {
        value: 'nailcare',
        name: 'Nail Care',
        sizes: ['10ml', '15ml', '20ml']
      },
      {
        value: 'tools',
        name: 'Beauty Tools',
        sizes: ['One Size']
      },
      {
        value: 'sets',
        name: 'Beauty Sets',
        sizes: ['Travel Size', 'Full Size', 'Deluxe']
      }
    ]
  }
}

export const getSubcategoryConfig = (category: string, subcategory: string) => {
  return categoryConfigs[category]?.subcategories.find(sub => sub.value === subcategory)
}

export const getSubcategoriesForCategory = (category: string) => {
  return categoryConfigs[category]?.subcategories || []
}