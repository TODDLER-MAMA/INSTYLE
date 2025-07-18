import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          
          {/* Overlay with actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={displayStock === 0}
                className="w-10 h-10 bg-white hover:bg-gold-50 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300"
              >
                <ShoppingBag className="w-4 h-4 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white hover:bg-gold-50 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300"
              >
                <Heart className="w-4 h-4 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white hover:bg-gold-50 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {displayStock < 10 && displayStock > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                Only {displayStock} left
              </span>
            )}
            {displayStock === 0 && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                Out of Stock
              </span>
            )}
            {product.is_featured && (
              <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                Featured
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          {/* Brand and Category */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">IS</span>
            </div>
            <span className="text-xs font-medium text-gray-900">In Style BD</span>
            <span className="text-xs text-gray-500">• {product.category}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300 text-sm">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-gold-400 fill-current" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>

          {/* Variant colors preview */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-3">
              <div className="flex space-x-1">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedVariant(variant)
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      selectedVariant?.id === variant.id ? 'border-gold-500 shadow-lg' : 'border-gray-300'
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
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{product.variants.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent">
                {typeof displayPrice === 'number' ? formatPrice(displayPrice) : `৳${displayPrice}`}
              </span>
              {selectedVariant && (
                <div className="text-xs text-gray-500">
                  {selectedVariant.size && `Size: ${selectedVariant.size}`}
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={displayStock === 0}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                displayStock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard