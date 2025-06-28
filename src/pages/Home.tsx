import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Sparkles, Heart, ShoppingBag, TrendingUp, Crown, Gem, Palette } from 'lucide-react'
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
      gradient: 'from-gold-400 to-gold-600'
    },
    {
      name: 'Jewelry',
      description: 'Exquisite pieces for every occasion',
      image: 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=jewelry',
      count: '150+ items',
      icon: Gem,
      gradient: 'from-gold-500 to-gold-700'
    },
    {
      name: 'Beauty',
      description: 'Premium skincare and cosmetics',
      image: 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=beauty',
      count: '100+ items',
      icon: Palette,
      gradient: 'from-gold-600 to-gold-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gold-200 to-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-gold-100 to-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">IS</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gold-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Elegance Meets
              <span className="block bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                Tradition
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our curated collection of exquisite dresses, stunning jewelry, and premium beauty products that celebrate your unique style.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link to="/products">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-32 left-20 hidden lg:block"
            >
              <Sparkles className="w-8 h-8 text-gold-400" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-40 right-32 hidden lg:block"
            >
              <Crown className="w-10 h-10 text-gold-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collections designed to enhance your natural beauty and style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Link to={category.href} className="group block">
                    <Card className="relative overflow-hidden h-[500px]">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-between p-8 text-white">
                        {/* Icon and Count */}
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {category.count}
                          </span>
                        </div>

                        {/* Category Info */}
                        <div>
                          <h3 className="text-3xl font-bold mb-3 group-hover:text-gold-300 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-gray-200 mb-4 leading-relaxed">
                            {category.description}
                          </p>
                          <div className="inline-flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Shop Now <ArrowRight className="ml-2 w-4 h-4" />
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

      {/* Featured Products */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gold-50 to-gold-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-gold-600 mr-3" />
              <span className="text-lg font-medium text-gold-600 uppercase tracking-wide">Featured Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trending Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked items that represent the finest in fashion, jewelry, and beauty.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <Button size="lg">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: "Curated with Love",
                description: "Every item is carefully selected to ensure the highest quality and style for our customers.",
                gradient: "from-red-400 to-pink-500"
              },
              {
                icon: ShoppingBag,
                title: "Fast Delivery",
                description: "Quick and reliable delivery across Bangladesh with careful packaging and tracking.",
                gradient: "from-blue-400 to-indigo-500"
              },
              {
                icon: Star,
                title: "Premium Quality",
                description: "Only the finest materials and craftsmanship for lasting beauty and satisfaction.",
                gradient: "from-gold-400 to-gold-600"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <Card className="p-8 h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
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