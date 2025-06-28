import React, { useState } from 'react'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { dispatch } = useCart()
  const navigate = useNavigate()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find(v => v.is_default) || product.variants?.[0] || null
  )
  const [isHovered, setIsHovered] = useState(false)

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

  const handleProductClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/product/${product.id}`)
    }
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
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Overlay with actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={displayStock === 0}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {displayStock < 10 && displayStock > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Only {displayStock} left
            </div>
          )}
          {displayStock === 0 && (
            <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
          {product.is_featured && (
            <div className="bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5">
        {/* Brand and Category */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">IS</span>
          </div>
          <span className="text-xs font-medium text-gray-900">In Style BD</span>
          <span className="text-xs text-gray-500">• {product.category}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Variant colors preview */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-3">
            <div className="flex space-x-1">
              {product.variants.slice(0, 4).map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedVariant(variant)
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedVariant?.id === variant.id ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: variant.color?.toLowerCase() === 'white' ? '#ffffff' :
                                   variant.color?.toLowerCase() === 'black' ? '#000000' :
                                   variant.color?.toLowerCase() === 'red' ? '#ef4444' :
                                   variant.color?.toLowerCase() === 'blue' ? '#3b82f6' :
                                   variant.color?.toLowerCase() === 'green' ? '#10b981' :
                                   variant.color?.toLowerCase() === 'yellow' ? '#f59e0b' :
                                   variant.color?.toLowerCase() === 'pink' ? '#ec4899' :
                                   variant.color?.toLowerCase() === 'purple' ? '#8b5cf6' :
                                   variant.color?.toLowerCase() === 'gold' ? '#d4af37' :
                                   '#9ca3af'
                  }}
                />
              ))}
              {product.variants.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{product.variants.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {typeof displayPrice === 'number' ? formatPrice(displayPrice) : `৳${displayPrice}`}
            </span>
            {selectedVariant && (
              <div className="text-xs text-gray-500">
                {selectedVariant.size && `Size: ${selectedVariant.size}`}
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={displayStock === 0}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard