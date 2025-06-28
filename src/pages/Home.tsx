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
      gradient: 'from-gold-400 via-gold-500 to-gold-600',
      bgGradient: 'from-gold-50 to-gold-100'
    },
    {
      name: 'Jewelry',
      description: 'Exquisite pieces for every occasion',
      image: 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=jewelry',
      count: '150+ items',
      icon: Gem,
      gradient: 'from-gold-500 via-gold-600 to-gold-700',
      bgGradient: 'from-gold-100 to-gold-200'
    },
    {
      name: 'Beauty',
      description: 'Premium skincare and cosmetics',
      image: 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=beauty',
      count: '100+ items',
      icon: Palette,
      gradient: 'from-gold-600 via-gold-700 to-gold-800',
      bgGradient: 'from-gold-200 to-gold-300'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-gold-200/40 to-gold-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-gradient-to-r from-gold-300/30 to-gold-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gold-100/20 to-gold-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-gold-500/15 to-gold-600/15 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
          <div className="text-center">
            {/* Enhanced Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-12"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                  <span className="text-white font-bold text-3xl">IS</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -right-4 w-4 h-4 bg-gradient-to-r from-gold-200 to-gold-300 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '2s' }}></div>
              </div>
            </motion.div>
            
            {/* Enhanced Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight"
            >
              Where Elegance
              <span className="block bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 bg-clip-text text-transparent">
                Meets Perfection
              </span>
            </motion.h1>
            
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
              className="flex flex-col sm:flex-row gap-8 justify-center mb-16"
            >
              <Link to="/products">
                <Button size="lg" className="group text-lg px-10 py-5 shadow-2xl hover:shadow-3xl">
                  Explore Collection
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-gold-300 hover:bg-gold-50">
                  Our Story
                </Button>
              </Link>
            </motion.div>

            {/* Enhanced Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-32 left-20 hidden lg:block"
            >
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gold-200">
                <Sparkles className="w-10 h-10 text-gold-500" />
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -8, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-40 right-32 hidden lg:block"
            >
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gold-200">
                <Crown className="w-12 h-12 text-gold-600" />
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
              className="absolute bottom-32 left-32 hidden lg:block"
            >
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gold-200">
                <Gem className="w-8 h-8 text-gold-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-24 lg:py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div className="p-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl shadow-xl mr-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-bold text-gold-600 uppercase tracking-wider">Premium Collections</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Shop by Category
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore our carefully curated collections designed to enhance your natural beauty and express your unique style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, rotateY: 5 }}
                  className="group"
                >
                  <Link to={category.href}>
                    <div className="relative overflow-hidden h-[600px] rounded-3xl shadow-2xl border border-gold-200 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-700">
                      {/* Background Image with Enhanced Overlay */}
                      <div className="absolute inset-0">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-700`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity duration-700`}></div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="relative h-full flex flex-col justify-between p-10 text-white">
                        {/* Top Section */}
                        <div className="flex items-center justify-between">
                          <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                              {category.count}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-4xl font-bold mb-4 group-hover:text-gold-300 transition-colors duration-500">
                              {category.name}
                            </h3>
                            <p className="text-gray-200 text-lg leading-relaxed mb-6">
                              {category.description}
                            </p>
                          </div>
                          
                          <div className="inline-flex items-center text-lg font-semibold group-hover:translate-x-3 transition-transform duration-500 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                            Explore Collection 
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-6 right-6 w-3 h-3 bg-gold-400 rounded-full animate-pulse opacity-80"></div>
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-gold-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-24 lg:py-40 bg-gradient-to-r from-gold-50 via-white to-gold-100 relative">
        {/* Section Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-gold-200/30 to-gold-300/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gold-300/20 to-gold-400/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl shadow-xl mr-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-bold text-gold-600 uppercase tracking-wider">Featured Collection</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Trending Masterpieces
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
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gold-200 overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 animate-pulse"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl mb-6 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl w-24 animate-pulse"></div>
                      <div className="h-10 bg-gradient-to-r from-gold-200 to-gold-300 rounded-xl w-28 animate-pulse"></div>
                    </div>
                  </div>
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
              <Button size="lg" className="text-lg px-10 py-5 shadow-2xl hover:shadow-3xl">
                View All Masterpieces
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 lg:py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Heart,
                title: "Curated with Love",
                description: "Every item is carefully selected to ensure the highest quality and style for our discerning customers.",
                gradient: "from-red-400 via-red-500 to-pink-500",
                bgGradient: "from-red-50 to-pink-50"
              },
              {
                icon: Zap,
                title: "Lightning Fast Delivery",
                description: "Quick and reliable delivery across Bangladesh with careful packaging and real-time tracking.",
                gradient: "from-blue-400 via-blue-500 to-indigo-500",
                bgGradient: "from-blue-50 to-indigo-50"
              },
              {
                icon: Gift,
                title: "Premium Quality",
                description: "Only the finest materials and craftsmanship for lasting beauty and complete satisfaction.",
                gradient: "from-gold-400 via-gold-500 to-gold-600",
                bgGradient: "from-gold-50 to-gold-100"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group text-center"
                >
                  <div className={`p-10 rounded-3xl shadow-2xl border border-gold-200 bg-gradient-to-br ${feature.bgGradient} hover:shadow-3xl transition-all duration-700 h-full`}>
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gold-700 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home