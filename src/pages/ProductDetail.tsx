import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, ProductVariant } from '../types'
import { useCart } from '../contexts/CartContext'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dispatch } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'discussion'>('details')

  useEffect(() => {
    if (id) {
      fetchProduct()
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-gold-600 hover:text-gold-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ image_url: product.image_url, alt_text: product.name }]

  const reviews = [
    { id: 1, name: 'Sarah K.', rating: 5, comment: 'Excellent quality! Fits perfectly and the material is amazing.', verified: true, days: 2 },
    { id: 2, name: 'Fatima R.', rating: 5, comment: 'Beautiful design and fast delivery. Highly recommended!', verified: true, days: 5 },
    { id: 3, name: 'Ayesha M.', rating: 4, comment: 'Good product, exactly as described. Will order again.', verified: true, days: 8 }
  ]

  const averageRating = 4.8
  const totalReviews = 47

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/products')}
            className="hover:text-gold-600 transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={images[selectedImageIndex]?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-gold-600' : 'border-gray-200 hover:border-gray-300'
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
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">IS</span>
              </div>
              <span className="text-sm font-medium text-gray-900">In Style BD</span>
              <span className="text-sm text-gray-500">• {product.category}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{averageRating}</span>
              <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(selectedVariant?.price || product.base_price || 0)}
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    {selectedVariant?.color && 'Color'} 
                    {selectedVariant?.color && selectedVariant?.size && ' • '}
                    {selectedVariant?.size && 'Size'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {variant.color && variant.size ? `${variant.color} • ${variant.size}` : variant.variant_name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {selectedVariant?.stock || 0} available
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2" />
                Free delivery on orders over ৳2000
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-500">On orders over ৳2000</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900">Secure Payment</div>
                <div className="text-xs text-gray-500">100% secure checkout</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-500">7-day return policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {(['details', 'reviews', 'discussion'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                
                {product.material && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Material</h4>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                )}
                
                {product.care_instructions && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                    <p className="text-gray-600">{product.care_instructions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{totalReviews} reviews</span>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{review.name}</div>
                            {review.verified && (
                              <div className="text-xs text-green-600">Verified Purchase</div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.days} days ago</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Share2 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Discussion</h3>
                <p className="text-gray-600 mb-6">Ask questions about this product or share your experience.</p>
                <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Start Discussion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail