import React, { useState } from 'react'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { dispatch } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find(v => v.is_default) || product.variants?.[0] || null
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        product, 
        variant: selectedVariant || undefined 
      } 
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDisplayPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price
    }
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`
    }
    return product.price || product.base_price || 0
  }

  const getDisplayStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock
    }
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + variant.stock, 0)
    }
    return product.stock || 0
  }

  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url || 
                      product.image_url

  const displayPrice = getDisplayPrice()
  const displayStock = getDisplayStock()

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={displayStock === 0}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gold-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gold-100 transition-colors duration-300">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gold-100 transition-colors duration-300">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Stock indicators */}
        {displayStock < 10 && displayStock > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Only {displayStock} left
          </div>
        )}
        {displayStock === 0 && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gold-600 font-medium uppercase tracking-wide">
            {product.category} • {product.subcategory}
          </span>
          {product.brand && (
            <span className="text-xs text-gray-500 ml-2">by {product.brand}</span>
          )}
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Variant selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-3">
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const variant = product.variants?.find(v => v.id === e.target.value)
                setSelectedVariant(variant || null)
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-gold-500"
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.variant_name} - {formatPrice(variant.price)}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gold-600">
            {typeof displayPrice === 'number' ? formatPrice(displayPrice) : `৳${displayPrice}`}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={displayStock === 0}
            className="bg-gold-600 hover:bg-gold-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard