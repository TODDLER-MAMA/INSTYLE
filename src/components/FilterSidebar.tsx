import React from 'react'
import { X } from 'lucide-react'
import { FilterState } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose 
}) => {
  const categories = {
    apparel: {
      name: 'Apparel',
      subcategories: ['kurta-set', 'tops', 'kurta', 'coord-set', 'kids-wear', 'long-gown', 'three-piece', 'saree', 'dupatta', 'bottom', 'trouser']
    },
    jewelry: {
      name: 'Jewelry',
      subcategories: ['necklace', 'earrings', 'bracelet', 'ring', 'anklet', 'pendant', 'nose-pin', 'hair-accessories', 'set']
    },
    beauty: {
      name: 'Beauty',
      subcategories: ['skincare', 'makeup', 'fragrance', 'haircare', 'bodycare', 'nailcare', 'tools', 'sets']
    }
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? '' : category,
      subcategory: []
    })
  }

  const handleSubcategoryChange = (subcategory: string) => {
    const newSubcategories = filters.subcategory.includes(subcategory)
      ? filters.subcategory.filter(s => s !== subcategory)
      : [...filters.subcategory, subcategory]
    
    onFiltersChange({
      ...filters,
      subcategory: newSubcategories
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      subcategory: [],
      priceRange: [0, 10000],
      searchQuery: ''
    })
  }

  const formatSubcategoryName = (subcategory: string) => {
    return subcategory.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-20 left-0 h-full lg:h-auto w-80 bg-white shadow-lg lg:shadow-none
        transform transition-transform duration-300 z-50 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gold-600 hover:text-gold-700 transition-colors duration-300"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                  className="flex-1 accent-gold-600"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>৳0</span>
                <span>৳{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {Object.entries(categories).map(([categoryKey, categoryData]) => (
              <div key={categoryKey} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => handleCategoryChange(categoryKey)}
                  className={`w-full text-left font-medium mb-3 transition-colors duration-300 ${
                    filters.category === categoryKey ? 'text-gold-600' : 'text-gray-900 hover:text-gold-600'
                  }`}
                >
                  {categoryData.name}
                </button>
                
                {filters.category === categoryKey && (
                  <div className="space-y-2 animate-slide-up">
                    {categoryData.subcategories.map((subcategory) => (
                      <label
                        key={subcategory}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.subcategory.includes(subcategory)}
                          onChange={() => handleSubcategoryChange(subcategory)}
                          className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
                          {formatSubcategoryName(subcategory)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar