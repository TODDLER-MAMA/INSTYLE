import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Sparkles, Heart, ShoppingBag, TrendingUp, Crown, Gem, Palette, Zap, Award, Gift } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product } from '../types'
import ProductCard from '../components/ProductCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch featured products with variants and images
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(6)
        .order('created_at', { ascending: false })

      if (productsError) throw productsError

      // Fetch variants for featured products
      const productIds = productsData.map(p => p.id)
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds)
        .order('is_default', { ascending: false })

      if (variantsError) throw variantsError

      // Fetch images for featured products
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('display_order')

      if (imagesError) throw imagesError

      // Combine data
      const productsWithDetails = productsData.map(product => ({
        ...product,
        variants: variantsData.filter(variant => variant.product_id === product.id),
        images: imagesData.filter(image => image.product_id === product.id)
      }))

      setFeaturedProducts(productsWithDetails || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      name: 'Apparel',
      description: 'Elegant dresses and traditional wear',
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=apparel',
      count: '200+ items',
      icon: Crown,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Jewelry',
      description: 'Exquisite pieces for every occasion',
      image: 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=jewelry',
      count: '150+ items',
      icon: Gem,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Beauty',
      description: 'Premium skincare and cosmetics',
      image: 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=beauty',
      count: '100+ items',
      icon: Palette,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-200/15 to-yellow-200/15 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-48">
          <div className="text-center">
            {/* Enhanced Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-16"
            >
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-white font-bold text-4xl">IS</span>
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -right-6 w-6 h-6 bg-gradient-to-r from-green-400 to-yellow-500 rounded-2xl animate-pulse shadow-lg" style={{ animationDelay: '2s' }}></div>
              </div>
            </motion.div>
            
            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-12"
            >
              <h1 className="text-7xl md:text-9xl font-black text-gray-900 mb-6 leading-none tracking-tight">
                Style
              </h1>
              <div className="flex items-center justify-center space-x-6 mb-6">
                <span className="text-4xl md:text-6xl font-light text-gray-500">that helps</span>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-7xl md:text-9xl font-black text-gray-900 leading-none tracking-tight">
                you <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">shine</span>
              </h2>
            </motion.div>
            
            {/* Enhanced Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Discover our curated collection of exquisite pieces that celebrate your unique style and timeless beauty.
            </motion.p>
            
            {/* Enhanced CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
            >
              <Link to="/products">
                <Button size="lg" className="text-xl px-12 py-6 shadow-2xl">
                  Start for free
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-xl px-12 py-6 bg-white/80 backdrop-blur-sm">
                  Request a demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats or Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-center text-gray-500"
            >
              <p className="text-lg">
                Turn information into advantage! Start using In Style BD today. Sign up for a free trial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8">
              Maximize <span className="text-gray-400">efficiency</span>
            </h2>
            <h3 className="text-6xl md:text-7xl font-black text-gray-900 mb-12">
              with our intuitive
            </h3>
            <div className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-12 py-6 rounded-3xl text-3xl font-bold shadow-2xl">
              collection set
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link to={category.href}>
                    <Card variant="glass" className="h-[500px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-between p-10 text-white">
                        {/* Top Section */}
                        <div className="flex items-center justify-between">
                          <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                            {category.count}
                          </span>
                        </div>

                        {/* Bottom Section */}
                        <div className="space-y-6">
                          <h3 className="text-4xl font-bold group-hover:text-orange-300 transition-colors duration-500">
                            {category.name}
                          </h3>
                          <p className="text-gray-200 text-lg leading-relaxed">
                            {category.description}
                          </p>
                          <div className="inline-flex items-center text-lg font-semibold group-hover:translate-x-3 transition-transform duration-500 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                            Explore Collection 
                            <ArrowRight className="ml-3 w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-xl mr-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-600 uppercase tracking-wider">Featured Collection</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8">
              Trending Products
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Handpicked items that represent the finest in fashion, jewelry, and beauty craftsmanship.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card variant="glass" className="overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
                    <div className="p-8">
                      <div className="h-4 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded-xl w-28 animate-pulse"></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/products">
              <Button size="lg" className="text-xl px-12 py-6 shadow-2xl">
                View All Products
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="mb-12">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8">
                Get Started
              </h2>
              <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
                Turn information into advantage! Start using In Style BD today. Sign up for a free trial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/products">
                <Button size="lg" className="text-xl px-12 py-6 shadow-2xl">
                  Start for free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-xl px-12 py-6 bg-white">
                  Request a demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home