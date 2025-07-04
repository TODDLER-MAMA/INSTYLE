import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Heart, ShoppingBag, TrendingUp, Crown, Gem, Palette, Truck, Shield, RotateCcw, Sparkles, Headphones, Award, Clock, Users, MapPin, Phone, Mail, CheckCircle, Zap, Gift } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product } from '../types'
import ProductCard from '../components/ProductCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TextPressure from '../components/TextPressure'
import ScrollReveal from '../components/ScrollReveal'
import { GlowingEffect } from '../components/ui/GlowingEffect'
import TiltedCard from '../components/ui/TiltedCard'
import SpotlightCard from '../components/ui/SpotlightCard'
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card'

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
      gradient: 'from-emerald-400/90 to-emerald-600/90',
      bgGradient: 'from-emerald-50 to-emerald-100',
      icon: '👗'
    },
    {
      name: 'Jewelry',
      description: 'Exquisite pieces for every occasion',
      image: 'https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=jewelry',
      count: '150+ items',
      gradient: 'from-purple-400/90 to-purple-600/90',
      bgGradient: 'from-purple-50 to-purple-100',
      icon: '💎'
    },
    {
      name: 'Beauty',
      description: 'Premium skincare and cosmetics',
      image: 'https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600',
      href: '/products?category=beauty',
      count: '100+ items',
      gradient: 'from-rose-400/90 to-rose-600/90',
      bgGradient: 'from-rose-50 to-rose-100',
      icon: '💄'
    }
  ]

  // Premium brands for Bangladesh fashion market
  const premiumBrands = ['AARONG', 'KAY KRAFT', 'YELLOW', 'ECSTASY', 'RICHMAN', 'SAILOR']

  const services = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary delivery on orders over ৳2000 across Bangladesh",
      image: "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your queries",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% authentic products with quality assurance",
      image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Hassle-free 7-day return and exchange policy",
      image: "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Carefully curated products from trusted brands",
      image: "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Gift,
      title: "Gift Wrapping",
      description: "Beautiful gift wrapping service for special occasions",
      image: "https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]

  const facilities = [
    {
      title: "Personal Styling",
      description: "Get personalized fashion advice from our expert stylists",
      features: ["One-on-one consultation", "Style recommendations", "Wardrobe planning"],
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "Custom Tailoring",
      description: "Perfect fit guaranteed with our professional tailoring services",
      features: ["Precise measurements", "Expert alterations", "Perfect fitting"],
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "VIP Membership",
      description: "Exclusive benefits and early access to new collections",
      features: ["Priority access", "Special discounts", "Exclusive events"],
      image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-100/50">
        {/* Background gradient elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-gold-200/30 to-gold-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-gold-300/20 to-gold-400/30 rounded-full blur-3xl"></div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-50/60"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Simple Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">IS</span>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Elegance Meets
            <span className="block bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
              Tradition
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of exquisite dresses, stunning jewelry, and premium beauty products.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="md" className="group">
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            
            <Link to="/about">
              <Button variant="outline" size="md">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Text Pressure Section with ScrollReveal */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gold-50/30">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-100/30 via-gray-50/50 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-gold-200/20 to-gold-300/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-gold-300/15 to-gold-400/20 rounded-full blur-3xl"></div>
          
          {/* Floating sparkles */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20"
          >
            <Sparkles className="w-6 h-6 text-gold-400/60" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-32 right-32"
          >
            <Crown className="w-8 h-8 text-gold-500/40" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 right-20"
          >
            <Gem className="w-5 h-5 text-gold-600/50" />
          </motion.div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/50 to-white/80"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
                Experience Excellence
              </span>
              
              {/* ScrollReveal Animation for "Where Style Meets Innovation" */}
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.2}
                baseRotation={2}
                blurStrength={3}
                containerClassName="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
                textClassName="leading-relaxed"
              >
                Where Style Meets Innovation
              </ScrollReveal>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Move your cursor over our brand name to experience the interactive magic that defines our commitment to exceptional design and user experience.
              </p>
            </motion.div>
          </div>

          {/* Text Pressure Animation Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="h-48 md:h-64 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <TextPressure
                  text="IN STYLE BD"
                  textColor="#D4AF37"
                  minFontSize={32}
                  width={true}
                  weight={true}
                  italic={true}
                  flex={true}
                />
              </div>
            </div>
          </motion.div>

          {/* Description below animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-8">
                Our interactive brand experience reflects our dedication to creating memorable moments. 
                Just like our products, every detail is crafted with precision and care to deliver 
                something truly extraordinary.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { number: '10K+', label: 'Happy Customers' },
                  { number: '500+', label: 'Premium Products' },
                  { number: '99%', label: 'Satisfaction Rate' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section - Redesigned and Compact */}
      <section className="relative py-16 bg-gradient-to-br from-white via-gold-50/30 to-gold-100/50">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-50/30 via-white/60 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
                Our Collections
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our carefully curated collections designed to enhance your natural beauty and style.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={category.href} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                    {/* Background Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80`}></div>
                      
                      {/* Floating Icon */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>

                      {/* Item Count Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`relative bg-gradient-to-br ${category.bgGradient} p-6`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gold-600 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-gold-600 group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                        
                        <div className="inline-flex items-center text-gold-600 font-semibold group-hover:text-gold-700 transition-colors duration-300 text-sm">
                          <span className="mr-2">Explore Collection</span>
                          <div className="w-6 h-6 bg-gold-100 group-hover:bg-gold-200 rounded-full flex items-center justify-center transition-colors duration-300">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-800/10 to-gray-900/30"></div>
      </section>

      {/* Premium Brands Section - Redesigned and Compact */}
      <section className="relative py-12 bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-100/20 via-gray-800/20 to-transparent"></div>

        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-medium text-gold-400 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-900/20 rounded-full">
              Premium Partners
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trusted Brands We Carry
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto text-sm">
              Discover premium fashion and beauty brands in our carefully curated selection.
            </p>
          </motion.div>
        </div>

        {/* Single horizontal scroll line */}
        <div className="relative">
          <div className="flex animate-scroll">
            {[...premiumBrands, ...premiumBrands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 text-3xl md:text-4xl font-bold text-gold-500/30 select-none tracking-wider"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-900/30 to-white/20"></div>
      </section>

      {/* Featured Products */}
      <section className="relative py-16 bg-gradient-to-r from-white to-gold-50/50">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/20 via-gray-500/10 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-gold-600 mr-2" />
              <span className="text-sm font-medium text-gold-600 uppercase tracking-wide">Featured Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked items that represent the finest in fashion, jewelry, and beauty.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products">
              <Button size="md">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gold-50/30 to-gold-100/30"></div>
      </section>

      {/* Services Section with TiltedCard Animation */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-200/30 via-gray-100/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
                Our Services
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose In Style BD
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide exceptional services and facilities to ensure your shopping experience is nothing short of perfect.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="relative">
                    <GlowingEffect
                      disabled={false}
                      proximity={80}
                      spread={35}
                      movementDuration={1.8}
                      borderWidth={2}
                      className="rounded-2xl"
                    />
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gold-100 overflow-hidden">
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                        
                        <div className="w-full h-32 rounded-lg overflow-hidden">
                          <TiltedCard
                            imageSrc={service.image}
                            altText={service.title}
                            captionText={service.title}
                            containerHeight="128px"
                            containerWidth="100%"
                            imageHeight="128px"
                            imageWidth="100%"
                            scaleOnHover={1.08}
                            rotateAmplitude={12}
                            showTooltip={false}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-100/50 to-gold-50/50"></div>
      </section>

      {/* Facilities Section with Tilted Cards */}
      <section className="relative py-20 bg-gradient-to-br from-gold-50 to-gold-100/50">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/50 via-gray-50/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-white/50 rounded-full">
                Premium Facilities
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Exclusive Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience our premium facilities designed to provide you with personalized and exceptional service.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-8">
                  <TiltedCard
                    imageSrc={facility.image}
                    altText={facility.title}
                    captionText={facility.title}
                    containerHeight="300px"
                    containerWidth="100%"
                    imageHeight="300px"
                    imageWidth="100%"
                    scaleOnHover={1.08}
                    rotateAmplitude={12}
                    showTooltip={false}
                    className="mx-auto"
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="text-white text-center p-6">
                        <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                        <p className="text-sm opacity-90">{facility.description}</p>
                      </div>
                    }
                  />
                </div>
                
                <div className="relative">
                  <GlowingEffect
                    disabled={false}
                    proximity={60}
                    spread={25}
                    movementDuration={2}
                    borderWidth={1}
                    className="rounded-2xl"
                  />
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{facility.title}</h3>
                    <p className="text-gray-600 mb-6">{facility.description}</p>
                    
                    <ul className="space-y-3">
                      {facility.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-gold-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gold-100/30 to-gray-900/30"></div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-100/20 via-gray-700/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-400 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-900/20 rounded-full">
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Visit Our Store
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Experience our products in person at our flagship store in Dhaka, or reach out to us for any inquiries.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                details: ["Shop 318, 3rd floor, Rakeen commercial complex", "Rakeen city, mirpur 13", "Open 10 AM - 10 PM"]
              },
              {
                icon: Phone,
                title: "Call Us",
                details: ["01842299333", "Customer Service & WhatsApp", "Available 24/7"]
              },
              {
                icon: Mail,
                title: "Email Us",
                details: ["info@instylebd.com", "support@instylebd.com", "Quick response guaranteed"]
              }
            ].map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="relative">
                    <GlowingEffect
                      disabled={false}
                      proximity={70}
                      spread={30}
                      movementDuration={1.5}
                      borderWidth={2}
                      variant="white"
                      className="rounded-2xl"
                    />
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4">{contact.title}</h3>
                      
                      <div className="space-y-2">
                        {contact.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80"></div>
      </section>

      {/* Features Section with SpotlightCard */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Gradient transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/50 via-gray-900/70 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-medium text-gold-400 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-900/20 rounded-full">
                Our Promise
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Excellence in Every Detail
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover what makes In Style BD the premier destination for fashion, jewelry, and beauty in Bangladesh.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Curated with Love",
                description: "Every item is carefully selected to ensure the highest quality and style for our customers.",
                gradient: "from-gold-400 to-gold-500",
                spotlightColor: "rgba(212, 175, 55, 0.3)" as const
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Quick and reliable delivery across Bangladesh with careful packaging and tracking.",
                gradient: "from-gold-500 to-gold-600",
                spotlightColor: "rgba(212, 175, 55, 0.35)" as const
              },
              {
                icon: Shield,
                title: "Premium Quality",
                description: "Only the finest materials and craftsmanship for lasting beauty and satisfaction.",
                gradient: "from-gold-600 to-gold-700",
                spotlightColor: "rgba(212, 175, 55, 0.4)" as const
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <SpotlightCard
                    className="h-full"
                    spotlightColor={feature.spotlightColor}
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 mx-auto`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Gradient transition to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900"></div>
      </section>
    </div>
  )
}

export default Home