import React, { useState, useEffect } from 'react'
import { Plus, Package, ShoppingCart, Users, TrendingUp, Edit, Trash2, LogOut, Eye, EyeOff, Crown, Gem, Star, Calendar, DollarSign, BarChart3, Filter, Search, Download, Upload, Settings, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Product, Order } from '../types'
import ProductForm from '../components/ProductForm'

const Admin: React.FC = () => {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [orderFilter, setOrderFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ])

      if (productsRes.error) throw productsRes.error
      if (ordersRes.error) throw ordersRes.error

      setProducts(productsRes.data || [])
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (productData: any) => {
    setIsSubmitting(true)
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: productData.name,
            category: productData.category,
            subcategory: productData.subcategory,
            base_price: productData.base_price,
            description: productData.description,
            brand: productData.brand,
            material: productData.material,
            care_instructions: productData.care_instructions,
            is_featured: productData.is_featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert([{
            name: productData.name,
            category: productData.category,
            subcategory: productData.subcategory,
            base_price: productData.base_price,
            description: productData.description,
            brand: productData.brand,
            material: productData.material,
            care_instructions: productData.care_instructions,
            is_featured: productData.is_featured
          }])
          .select()
          .single()

        if (productError) throw productError

        // Insert variants
        if (productData.variants && productData.variants.length > 0) {
          const variantsToInsert = productData.variants.map((variant: any) => ({
            ...variant,
            product_id: newProduct.id
          }))

          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(variantsToInsert)

          if (variantsError) throw variantsError
        }
      }

      setShowAddProduct(false)
      setEditingProduct(null)
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status. Please try again.')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter
    const matchesSearch = searchQuery === '' || 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const totalProducts = products.length
  const totalOrders = orders.length
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-gold-500 to-gold-600',
      bgColor: 'bg-gold-50',
      textColor: 'text-gold-600'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Products',
      value: totalProducts.toString(),
      change: '+3.1%',
      icon: Package,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts.toString(),
      change: '-2.4%',
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gold-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">In Style BD Management</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gold-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gold-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gold-200">
            {(['dashboard', 'products', 'orders'] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium capitalize transition-all duration-300 relative ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gold-600 hover:bg-gold-50'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg -z-10"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold-200 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.textColor} font-medium`}>{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gold-200 bg-gradient-to-r from-gold-50 to-gold-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-gold-600" />
                    Recent Orders
                  </h2>
                  <button className="text-gold-600 hover:text-gold-700 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gold-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gold-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                            <div className="text-sm text-gray-500">{order.customer_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package className="w-6 h-6 mr-2 text-gold-600" />
                Products Management
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </motion.button>
            </div>

            {/* Product Form Modal */}
            {(showAddProduct || editingProduct) && (
              <ProductForm
                product={editingProduct}
                onSubmit={handleProductSubmit}
                onClose={() => {
                  setShowAddProduct(false)
                  setEditingProduct(null)
                }}
                isLoading={isSubmitting}
              />
            )}

            {/* Products Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gold-200 bg-gradient-to-r from-gold-50 to-gold-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gold-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gold-600 transition-colors">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gold-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gold-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg flex items-center justify-center">
                              <Gem className="w-6 h-6 text-gold-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                          <div className="text-sm text-gray-500 capitalize">{product.subcategory}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(product.base_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            product.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                          {product.is_featured && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gold-100 text-gold-800">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingProduct(product)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-gold-600" />
                Orders Management
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-4 py-2 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gold-200 bg-gradient-to-r from-gold-50 to-gold-100">
                <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gold-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gold-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                            <div className="text-sm text-gray-500">{order.customer_email}</div>
                            <div className="text-sm text-gray-500">{order.customer_phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Array.isArray(order.items) ? order.items.length : 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-sm rounded-lg px-3 py-1 font-semibold border-0 focus:ring-2 focus:ring-gold-500 ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin