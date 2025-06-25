import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'
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
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: { 
          product, 
          variant: selectedVariant || undefined,
          quantity 
        } 
      })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gold-600 hover:text-gold-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={images[selectedImageIndex]?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-gold-600' : 'border-gray-200'
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
            <div>
              <div className="text-sm text-gold-600 font-medium uppercase tracking-wide mb-2">
                {product.category} • {product.subcategory}
                {product.brand && <span className="ml-2 text-gray-500">by {product.brand}</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gold-600">
                  {formatPrice(selectedVariant?.price || product.base_price || 0)}
                </span>
                {product.is_featured && (
                  <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 124 reviews</span>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Select Variant:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-gold-600 bg-gold-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{variant.variant_name}</div>
                          <div className="text-sm text-gray-600">
                            {variant.size && `Size: ${variant.size}`}
                            {variant.color && ` • Color: ${variant.color}`}
                            {variant.material_variant && ` • Material: ${variant.material_variant}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gold-600">{formatPrice(variant.price)}</div>
                          <div className="text-sm text-gray-600">
                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {selectedVariant?.stock || 0} available
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              {product.material && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Material:</span>
                  <span className="text-gray-600">{product.material}</span>
                </div>
              )}
              {product.care_instructions && (
                <div>
                  <span className="font-medium text-gray-900">Care Instructions:</span>
                  <p className="text-gray-600 mt-1">{product.care_instructions}</p>
                </div>
              )}
              {selectedVariant?.sku && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="text-gray-600">{selectedVariant.sku}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-gold-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over ৳2000</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-gold-600" />
                <div>
                  <div className="font-medium text-gray-900">Secure Payment</div>
                  <div className="text-sm text-gray-600">100% secure checkout</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-6 h-6 text-gold-600" />
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">7-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail