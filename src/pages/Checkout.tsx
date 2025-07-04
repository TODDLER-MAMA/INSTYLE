import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, User, Phone, Mail, ShoppingBag, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabase'

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

const Checkout: React.FC = () => {
  const { state, dispatch } = useCart()
  const navigate = useNavigate()
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateDeliveryCharge = () => {
    const isDhaka = customerInfo.city.toLowerCase().includes('dhaka')
    return isDhaka ? 80 : 150
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}
    
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required'
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid'
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required'
    if (!customerInfo.city.trim()) newErrors.city = 'City is required'
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (state.items.length === 0) return

    setIsSubmitting(true)

    try {
      const deliveryCharge = calculateDeliveryCharge()
      const subtotal = state.total
      const totalWithDelivery = subtotal + deliveryCharge
      const fullAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}`
      
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: fullAddress,
        items: state.items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_price: item.variant?.price || item.product.base_price || item.product.price || 0,
          variant_id: item.variant?.id,
          variant_name: item.variant?.variant_name,
          quantity: item.quantity,
          subtotal: (item.variant?.price || item.product.base_price || item.product.price || 0) * item.quantity
        })),
        total_amount: totalWithDelivery,
        status: 'pending'
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (error) throw error

      // Update product variant stock
      for (const item of state.items) {
        if (item.variant) {
          const { error: stockError } = await supabase
            .from('product_variants')
            .update({ 
              stock: item.variant.stock - item.quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.variant.id)

          if (stockError) {
            console.error('Error updating variant stock:', stockError)
          }
        }
      }

      setOrderId(data.id)
      setOrderComplete(true)
      dispatch({ type: 'CLEAR_CART' })
      
    } catch (error) {
      console.error('Error placing order:', error)
      alert('There was an error placing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-sm font-medium text-gray-900">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-gold-600 hover:text-gold-700 font-medium py-3 px-4 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const deliveryCharge = calculateDeliveryCharge()
  const subtotal = state.total
  const totalWithDelivery = subtotal + deliveryCharge

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="01842299333"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dhaka"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={customerInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                      errors.postalCode ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1000"
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-600 hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => {
                const displayPrice = item.variant?.price || item.product.base_price || item.product.price || 0
                const primaryImage = item.product.images?.find(img => img.is_primary)?.image_url || 
                                   item.product.images?.[0]?.image_url ||
                                   'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=600'
                
                return (
                  <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex items-center space-x-4">
                    <img
                      src={primaryImage}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">{item.variant.variant_name}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(displayPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Delivery ({customerInfo.city.toLowerCase().includes('dhaka') ? 'Inside Dhaka' : 'Outside Dhaka'})
                </span>
                <span className="font-medium">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-gold-600">{formatPrice(totalWithDelivery)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gold-50 rounded-lg">
              <p className="text-sm text-gold-800">
                <strong>Payment:</strong> Cash on Delivery (COD) available. 
                You can pay when your order is delivered to your doorstep.
              </p>
              <div className="mt-2 text-xs text-gold-700">
                <p>• Inside Dhaka: ৳80 delivery charge</p>
                <p>• Outside Dhaka: ৳150 delivery charge</p>
                <p>• Free delivery on orders over ৳2000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout