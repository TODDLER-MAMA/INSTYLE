import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Product, FilterState } from '../types'
import { useCart } from '../contexts/CartContext'
import FilterSidebar from '../components/FilterSidebar'

const Products: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { dispatch } = useCart()
  
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    subcategory: [],
    priceRange: [0, 10000],
    searchQuery: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      // Fetch products first
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (productsError) throw productsError

      // Fetch all variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .order('is_default', { ascending: false })

      if (variantsError) throw variantsError

      // Fetch all images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order')

      if (imagesError) throw imagesError

      // Combine data manually
      const productsWithDetails = productsData?.map(product => ({
        ...product,
        variants: variantsData?.filter(variant => variant.product_id === product.id) || [],
        images: imagesData?.filter(image => image.product_id === product.id) || []
      })) || []

      setProducts(productsWithDetails)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Subcategory filter
    if (filters.subcategory.length > 0) {
      filtered = filtered.filter(product => 
        filters.subcategory.includes(product.subcategory)
      )
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.variants && product.variants.length > 0 
        ? Math.min(...product.variants.map(v => v.price))
        : product.base_price
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0]
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        product, 
        variant: defaultVariant || undefined
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

  const getDisplayPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.is_default) || product.variants[0]
      return defaultVariant.price
    }
    return product.base_price
  }

  const getDisplayStock = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + variant.stock, 0)
    }
    return 0
  }

  const getPrimaryImage = (product: Product) => {
    return product.images?.find(img => img.is_primary)?.image_url || 
           product.images?.[0]?.image_url || 
           'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm">
                  <div className="aspect-square bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Our Products
              </h1>
              <p className="text-gray-600 mt-1">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 bg-white text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gold-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-300`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gold-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-300`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Mobile Filter Sidebar */}
          {isFilterOpen && (
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters({
                    category: '',
                    subcategory: [],
                    priceRange: [0, 10000],
                    searchQuery: ''
                  })}
                  className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-xl transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={getPrimaryImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-50 transition-colors">
                              <Heart className="w-4 h-4 text-gray-700" />
                            </button>
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="w-10 h-10 bg-gold-600 hover:bg-gold-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                          {getDisplayStock(product) < 10 && getDisplayStock(product) > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                              Only {getDisplayStock(product)} left
                            </span>
                          )}
                          {getDisplayStock(product) === 0 && (
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                              Out of Stock
                            </span>
                          )}
                          {product.is_featured && (
                            <span className="bg-gold-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Brand and Category */}
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-medium text-gold-600 uppercase tracking-wide">
                            {product.brand || 'In Style BD'}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-gold-400 fill-current" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(getDisplayPrice(product))}
                            </span>
                            {product.variants && product.variants.length > 1 && (
                              <div className="text-xs text-gray-500">
                                {product.variants.length} variants
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={getDisplayStock(product) === 0}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              getDisplayStock(product) === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gold-600 hover:bg-gold-700 text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {getDisplayStock(product) === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products