export interface Product {
  id: string
  name: string
  category: 'apparel' | 'jewelry' | 'beauty'
  subcategory: string
  price: number
  image_url: string
  description: string
  stock: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
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