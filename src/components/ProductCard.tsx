import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Eye, Star, Check } from 'lucide-react'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
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
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdding(true)
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 600))
    
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        product, 
        variant: selectedVariant || undefined 
      } 
    })
    
    setIsAdding(false)
    setJustAdded(true)
    
    // Reset the success state after animation
    setTimeout(() => setJustAdded(false), 2000)
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gold-200 overflow-hidden hover:shadow-2xl hover:border-gold-300 transition-all duration-500">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100 relative">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Floating Action Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex space-x-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button
                      onClick={handleAddToCart}
                      disabled={displayStock === 0 || isAdding}
                      className="relative bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-gold-50 shadow-xl border border-gold-200 p-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {isAdding ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, rotate: -180 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 180 }}
                            className="w-5 h-5"
                          >
                            <div className="w-5 h-5 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : justAdded ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="w-5 h-5 text-green-600"
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="cart"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button className="bg-white/95 backdrop-blur-sm shadow-xl border border-gold-200 p-3 rounded-2xl hover:bg-red-50 transition-all duration-300">
                      <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                    </button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button className="bg-white/95 backdrop-blur-sm shadow-xl border border-gold-200 p-3 rounded-2xl hover:bg-blue-50 transition-all duration-300">
                      <Eye className="w-5 h-5 text-gray-700 hover:text-blue-500" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {displayStock < 10 && displayStock > 0 && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                Only {displayStock} left
              </motion.span>
            )}
            {displayStock === 0 && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                Out of Stock
              </motion.span>
            )}
            {product.is_featured && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                Featured
              </motion.span>
            )}
          </div>

          {/* Success Animation Overlay */}
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-white rounded-full p-4 shadow-xl"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6">
          {/* Brand and Category */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">IS</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">In Style BD</span>
            <span className="text-xs text-gray-500">• {product.category}</span>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300 text-lg">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
            ))}
            <span className="text-xs text-gray-500 ml-2 font-medium">(4.8)</span>
          </div>

          {/* Variant colors preview */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-4">
              <div className="flex space-x-2">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedVariant(variant)
                    }}
                    className={`w-7 h-7 rounded-full border-3 transition-all duration-300 shadow-lg ${
                      selectedVariant?.id === variant.id 
                        ? 'border-gold-500 shadow-gold-200 scale-110' 
                        : 'border-gray-300 hover:border-gold-400'
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
                  <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center shadow-lg">
                    <span className="text-xs text-gray-600 font-bold">+{product.variants.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent">
                {typeof displayPrice === 'number' ? formatPrice(displayPrice) : `৳${displayPrice}`}
              </span>
              {selectedVariant && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedVariant.size && `Size: ${selectedVariant.size}`}
                </div>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={displayStock === 0 || isAdding}
              size="sm"
              className="relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding...
                  </motion.div>
                ) : justAdded ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center text-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Added!
                  </motion.div>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard