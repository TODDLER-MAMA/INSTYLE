import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Truck, Shield, RotateCcw, Plus, Minus, MessageCircle, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'
import Button from '../components/ui/Button'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dispatch } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchRelatedProducts()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      // Fetch product with variants and images
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (productError) throw productError

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('is_default', { ascending: false })

      if (variantsError) throw variantsError

      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order')

      if (imagesError) throw imagesError

      const fullProduct = {
        ...productData,
        variants: variantsData,
        images: imagesData
      }

      setProduct(fullProduct)
      setSelectedVariant(variantsData.find(v => v.is_default) || variantsData[0] || null)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*, product_variants(*), product_images(*)')
        .eq('status', 'active')
        .neq('id', id)
        .limit(4)

      if (error) throw error

      const productsWithDetails = productsData.map(product => ({
        ...product,
        variants: product.product_variants,
        images: product.product_images
      }))

      setRelatedProducts(productsWithDetails || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch({ 
          type: 'ADD_ITEM', 
          payload: { 
            product, 
            variant: selectedVariant || undefined
          } 
        })
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ image_url: 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: product.name }]

  const reviews = [
    { id: 1, name: 'Sarah K.', rating: 5, comment: 'Excellent quality! Fits perfectly and the material is amazing.', verified: true, days: 2 },
    { id: 2, name: 'Fatima R.', rating: 5, comment: 'Beautiful design and fast delivery. Highly recommended!', verified: true, days: 5 },
    { id: 3, name: 'Ayesha M.', rating: 4, comment: 'Good product, exactly as described. Will order again.', verified: true, days: 8 }
  ]

  const averageRating = 4.8
  const totalReviews = 47

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate('/products')}
              className="hover:text-gold-600 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={images[selectedImageIndex]?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-gold-500 shadow-lg' : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Brand and Category */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gold-600 uppercase tracking-wide">
                {product.brand || 'In Style BD'}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500 capitalize">{product.category}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-gold-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-900">{averageRating}</span>
              <span className="text-gray-500">({totalReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(selectedVariant?.price || product.base_price || 0)}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Select Variant
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {variant.color && variant.size ? `${variant.color} • ${variant.size}` : variant.variant_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(variant.price)} • {variant.stock} in stock
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <span className="text-lg font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 border-x-2 border-gray-200 min-w-[80px] text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-500">
                  {selectedVariant?.stock || 0} available
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gold-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Chat</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gold-600 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Wishlist</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gold-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {[
                { icon: Truck, title: "Free Delivery", subtitle: "On orders over ৳2000" },
                { icon: Shield, title: "Secure Payment", subtitle: "100% secure checkout" },
                { icon: RotateCcw, title: "Easy Returns", subtitle: "7-day return policy" }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                    <div className="text-xs font-medium text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.subtitle}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const primaryImage = relatedProduct.images?.find(img => img.is_primary)?.image_url || 
                                   relatedProduct.images?.[0]?.image_url || 
                                   'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600'
                const defaultVariant = relatedProduct.variants?.find(v => v.is_default) || relatedProduct.variants?.[0]
                const price = defaultVariant?.price || relatedProduct.base_price

                return (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={primaryImage}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-gold-400 fill-current" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(price)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {(['details', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-6 px-8 font-medium text-lg capitalize transition-colors relative ${
                      activeTab === tab
                        ? 'text-gold-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-600"
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-lg max-w-none"
                >
                  <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                  
                  {product.material && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Material</h4>
                      <p className="text-gray-600 text-lg">{product.material}</p>
                    </div>
                  )}
                  
                  {product.care_instructions && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Care Instructions</h4>
                      <p className="text-gray-600 text-lg">{product.care_instructions}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-gold-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
                    </div>
                    <span className="text-gray-500">{totalReviews} reviews</span>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{review.name}</div>
                              {review.verified && (
                                <div className="text-sm text-green-600">✓ Verified Purchase</div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.days} days ago</span>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-gold-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail