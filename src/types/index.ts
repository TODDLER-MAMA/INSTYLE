export interface Product {
  id: string
  name: string
  category: 'apparel' | 'jewelry' | 'beauty'
  subcategory: string
  base_price: number
  description: string
  brand?: string
  material?: string
  care_instructions?: string
  is_featured: boolean
  status: 'active' | 'inactive' | 'discontinued'
  created_at: string
  updated_at: string
  variants?: ProductVariant[]
  images?: ProductImage[]
  // Legacy fields for backward compatibility
  price?: number
  image_url?: string
  stock?: number
}

export interface ProductVariant {
  id: string
  product_id: string
  variant_name: string
  size?: string
  color?: string
  material_variant?: string
  price: number
  stock: number
  sku?: string
  weight?: number
  dimensions?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  variant?: ProductVariant
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: CartItem[]
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface FilterState {
  category: string
  subcategory: string[]
  priceRange: [number, number]
  searchQuery: string
}

export interface CategoryConfig {
  name: string
  subcategories: SubcategoryConfig[]
}

export interface SubcategoryConfig {
  value: string
  name: string
  sizes?: string[]
  colors?: string[]
  materials?: string[]
}