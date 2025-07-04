import React, { useState, useEffect } from 'react'
import { X, Plus, Upload, Trash2 } from 'lucide-react'
import { Product, ProductVariant, ProductImage } from '../types'
import { categoryConfigs, getSubcategoryConfig } from '../config/categories'

interface ProductFormProps {
  product?: Product | null
  onSubmit: (productData: any) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'apparel' as 'apparel' | 'jewelry' | 'beauty',
    subcategory: '',
    base_price: 0,
    description: '',
    brand: '',
    material: '',
    care_instructions: '',
    is_featured: false
  })

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        base_price: product.base_price || product.price || 0,
        description: product.description,
        brand: product.brand || '',
        material: product.material || '',
        care_instructions: product.care_instructions || '',
        is_featured: product.is_featured || false
      })
      
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants)
      } else {
        // Create default variant from legacy product data
        setVariants([{
          variant_name: 'Default',
          price: product.price || product.base_price || 0,
          stock: product.stock || 0,
          is_default: true
        }])
      }

      // Set existing images
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images)
      }
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        category: 'apparel',
        subcategory: '',
        base_price: 0,
        description: '',
        brand: '',
        material: '',
        care_instructions: '',
        is_featured: false
      })
      setVariants([{
        variant_name: 'Default',
        price: 0,
        stock: 0,
        is_default: true
      }])
      setExistingImages([])
    }
    
    // Reset new images
    setImages([])
    setImagePreview([])
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Reset subcategory when category changes
    if (field === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }))
      // Reset variants when category changes
      setVariants([{
        variant_name: 'Default',
        price: 0,
        stock: 0,
        is_default: true
      }])
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = existingImages.length + images.length + files.length
    
    if (totalImages > 5) {
      alert('Maximum 5 images allowed per product')
      return
    }

    setImages(prev => [...prev, ...files])
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    const subcategoryConfig = getSubcategoryConfig(formData.category, formData.subcategory)
    setVariants(prev => [...prev, {
      variant_name: '',
      size: subcategoryConfig?.sizes?.[0] || '',
      color: subcategoryConfig?.colors?.[0] || '',
      material_variant: subcategoryConfig?.materials?.[0] || '',
      price: formData.base_price,
      stock: 0,
      is_default: false
    }])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subcategory) {
      alert('Please select a subcategory')
      return
    }

    if (variants.length === 0) {
      alert('At least one variant is required')
      return
    }

    if (existingImages.length === 0 && images.length === 0) {
      alert('At least one image is required')
      return
    }

    const productData = {
      ...formData,
      variants: variants.map(variant => ({
        ...variant,
        variant_name: variant.variant_name || `${variant.color || ''} ${variant.size || ''}`.trim() || 'Default'
      })),
      images,
      existingImages
    }

    await onSubmit(productData)
  }

  const subcategories = categoryConfigs[formData.category]?.subcategories || []
  const subcategoryConfig = getSubcategoryConfig(formData.category, formData.subcategory)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                >
                  <option value="apparel">Apparel</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub.value} value={sub.value}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (৳) *
                </label>
                <input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Instructions
              </label>
              <textarea
                value={formData.care_instructions}
                onChange={(e) => handleInputChange('care_instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                rows={2}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images * (Max 5 images)
              </label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || `Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {image.is_primary && (
                          <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={existingImages.length + images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center py-4 ${
                    existingImages.length + images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {existingImages.length + images.length >= 5 ? 'Maximum images reached' : 'Click to upload new images'}
                  </span>
                </label>
              </div>

              {/* New Image Previews */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`New image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Variants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Product Variants *
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center px-3 py-1 bg-gold-600 text-white text-sm rounded-lg hover:bg-gold-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Variant {index + 1} {variant.is_default && '(Default)'}
                      </h4>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Variant Name
                        </label>
                        <input
                          type="text"
                          value={variant.variant_name || ''}
                          onChange={(e) => updateVariant(index, 'variant_name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          placeholder="e.g., Red Medium"
                        />
                      </div>

                      {subcategoryConfig?.sizes && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Size
                          </label>
                          <select
                            value={variant.size || ''}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          >
                            <option value="">Select Size</option>
                            {subcategoryConfig.sizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {subcategoryConfig?.colors && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <select
                            value={variant.color || ''}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          >
                            <option value="">Select Color</option>
                            {subcategoryConfig.colors.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {subcategoryConfig?.materials && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Material
                          </label>
                          <select
                            value={variant.material_variant || ''}
                            onChange={(e) => updateVariant(index, 'material_variant', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          >
                            <option value="">Select Material</option>
                            {subcategoryConfig.materials.map(material => (
                              <option key={material} value={material}>{material}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price (৳) *
                        </label>
                        <input
                          type="number"
                          value={variant.price || 0}
                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Stock *
                        </label>
                        <input
                          type="number"
                          value={variant.stock || 0}
                          onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gold-500"
                          placeholder="Optional"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`default-${index}`}
                          checked={variant.is_default || false}
                          onChange={(e) => {
                            // Only one variant can be default
                            if (e.target.checked) {
                              setVariants(prev => prev.map((v, i) => ({
                                ...v,
                                is_default: i === index
                              })))
                            }
                          }}
                          className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <label htmlFor={`default-${index}`} className="ml-2 text-xs text-gray-700">
                          Default
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gold-600 hover:bg-gold-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm