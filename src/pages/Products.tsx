import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, FilterState } from '../types'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'

const Products: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
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
      // Fetch products with variants and images
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (productsError) throw productsError

      // Fetch variants for all products
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .order('is_default', { ascending: false })

      if (variantsError) throw variantsError

      // Fetch images for all products
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order')

      if (imagesError) throw imagesError

      // Combine data
      const productsWithDetails = productsData.map(product => ({
        ...product,
        variants: variantsData.filter(variant => variant.product_id === product.id),
        images: imagesData.filter(image => image.product_id === product.id)
      }))

      setProducts(productsWithDetails || [])
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

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gold-200 to-gold-300 rounded-2xl w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gold-100">
                  <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 rounded-t-3xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-3"></div>
                    <div className="h-6 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl w-20"></div>
                      <div className="h-10 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl w-24"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-gold-200/30 to-gold-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-gold-300/20 to-gold-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gold-100/10 to-gold-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Our Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover handpicked pieces that celebrate your unique style and elegance
            </p>
          </div>
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex-1 max-w-2xl relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5 group-focus-within:text-gold-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for your perfect piece..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-gold-200 rounded-2xl focus:ring-4 focus:ring-gold-200 focus:border-gold-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500 shadow-lg hover:shadow-xl"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center px-6 py-4 border-2 border-gold-300 rounded-2xl hover:bg-gold-50 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Filter className="w-5 h-5 mr-2 text-gold-600" />
                <span className="font-medium text-gray-700">Filters</span>
              </button>
              
              <div className="flex border-2 border-gold-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-gold-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-4 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-gold-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 shadow-lg border border-gold-200">
              Showing {filteredProducts.length} of {products.length} exquisite pieces
            </span>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Filters Sidebar - Desktop Only */}
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
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gold-200">
                <div className="text-gold-400 mb-6">
                  <Filter className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No treasures found</h3>
                <p className="text-gray-600 mb-8 text-lg">Try adjusting your filters to discover more beautiful pieces.</p>
                <button
                  onClick={() => setFilters({
                    category: '',
                    subcategory: [],
                    priceRange: [0, 10000],
                    searchQuery: ''
                  })}
                  className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
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