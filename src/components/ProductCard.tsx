import React from 'react'
import { ShoppingBag, Heart } from 'lucide-react'
import { Product } from '../types'
import { useCart } from '../contexts/CartContext'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gold-100 transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gold-100 transition-colors duration-300">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gold-600 font-medium uppercase tracking-wide">
            {product.category} • {product.subcategory}
          </span>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gold-600">
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-gold-600 hover:bg-gold-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard