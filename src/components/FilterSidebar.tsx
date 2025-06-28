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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static lg:top-0 left-0 h-full lg:h-auto w-80 
        bg-white/90 backdrop-blur-xl shadow-2xl lg:shadow-xl border border-gold-200
        transform transition-all duration-500 z-50 lg:z-auto lg:rounded-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Filters
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-gold-50"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Price Range</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-gold-200 to-gold-300 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(filters.priceRange[1] / 10000) * 100}%, #f3e8a6 ${(filters.priceRange[1] / 10000) * 100}%, #f3e8a6 100%)`
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">৳0</span>
                <span className="font-bold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                  ৳{filters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {Object.entries(categories).map(([categoryKey, categoryData]) => (
              <div key={categoryKey} className="border-b border-gold-100 pb-8 last:border-b-0">
                <button
                  onClick={() => handleCategoryChange(categoryKey)}
                  className={`w-full text-left font-semibold mb-4 transition-all duration-300 text-lg p-3 rounded-xl ${
                    filters.category === categoryKey 
                      ? 'text-white bg-gradient-to-r from-gold-500 to-gold-600 shadow-lg' 
                      : 'text-gray-700 hover:text-gold-600 hover:bg-gold-50'
                  }`}
                >
                  {categoryData.name}
                </button>
                
                {filters.category === categoryKey && (
                  <div className="space-y-3 animate-slide-up pl-2">
                    {categoryData.subcategories.map((subcategory) => (
                      <label
                        key={subcategory}
                        className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gold-50 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={filters.subcategory.includes(subcategory)}
                          onChange={() => handleSubcategoryChange(subcategory)}
                          className="w-5 h-5 text-gold-600 bg-white border-2 border-gold-300 rounded focus:ring-gold-500 focus:ring-2 transition-all duration-300"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gold-700 transition-colors duration-300">
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #b8860b);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #b8860b);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          transition: all 0.3s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
        }
      `}</style>
    </>
  )
}

export default FilterSidebar