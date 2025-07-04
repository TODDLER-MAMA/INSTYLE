import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Award, Heart, Star, CheckCircle, Target, Eye, Zap, Globe, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'

const About: React.FC = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers', description: 'Satisfied customers across Bangladesh' },
    { number: '35%', label: 'High Engagement', description: 'Customer retention and loyalty' },
    { number: '98%', label: 'Buyer Satisfaction', description: 'Quality products and service' },
    { number: '৳10M+', label: 'Secure Payments', description: 'Safe and secure transactions' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We curate only the finest products that meet our strict quality standards.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen, adapt, and deliver excellence.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Award,
      title: 'Authentic Products',
      description: 'Every item is carefully sourced and verified for authenticity and quality.',
      color: 'from-gold-500 to-yellow-500'
    },
    {
      icon: Globe,
      title: 'Local Heritage',
      description: 'Celebrating Bangladeshi culture while embracing global fashion trends.',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const services = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick delivery across Bangladesh with careful packaging'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '100% authentic products with quality assurance'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Hassle-free 7-day return and exchange policy'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer service for all queries'
    }
  ]

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with a vision to bring quality fashion to Bangladesh' },
    { year: '2021', title: 'First 1000 Customers', description: 'Reached our first milestone of satisfied customers' },
    { year: '2022', title: 'Expanded Categories', description: 'Added jewelry and beauty products to our collection' },
    { year: '2023', title: 'Online Platform', description: 'Launched our comprehensive e-commerce platform' },
    { year: '2024', title: '50K+ Customers', description: 'Serving over 50,000 happy customers nationwide' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-gold-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-gold-200/30 to-gold-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-gold-300/20 to-gold-400/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide px-4 py-2 bg-gold-100 rounded-full">
                  About In Style BD
                </span>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Empowering
                  <span className="block bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                    Style
                  </span>
                  Everywhere
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  A premier destination for fashion enthusiasts to discover, shop, and express 
                  their unique style with our curated collection of apparel, jewelry, and beauty products.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore Our Collection
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                </Link>
                
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold rounded-xl transition-all duration-300"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-gold-100 to-gold-200 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fashion Model"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <Star className="w-8 h-8 text-gold-500" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full shadow-lg flex items-center justify-center"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
                  Our Story
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  What is the story of In Style BD?
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission</h3>
                    <p className="text-gray-600">
                      To democratize fashion by making high-quality, stylish products accessible to everyone in Bangladesh, 
                      celebrating local culture while embracing global trends.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vision</h3>
                    <p className="text-gray-600">
                      To become Bangladesh's most trusted and beloved fashion destination, 
                      empowering individuals to express their unique style with confidence.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Values</h3>
                    <p className="text-gray-600">
                      Quality, authenticity, customer satisfaction, and cultural appreciation guide everything we do. 
                      We believe fashion should be accessible, sustainable, and empowering.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fashion Collection"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Jewelry Collection"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8"
                />
                <img
                  src="https://images.pexels.com/photos/3373726/pexels-photo-3373726.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Beauty Products"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg -mt-8"
                />
                <img
                  src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Customer Service"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
              Our Values
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose In Style BD?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence drives everything we do, from product selection to customer service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-gold-600 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-100 rounded-full">
              Our Services
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How We Serve You Better
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-gold-400 uppercase tracking-wide mb-4 px-4 py-2 bg-gold-900/20 rounded-full">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-white mb-6">
              Milestones & Achievements
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gold-500 to-gold-600"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20">
                      <div className="text-2xl font-bold text-gold-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gold-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-500 to-gold-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Discover Your Style?
            </h2>
            <p className="text-xl text-gold-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust In Style BD for their fashion needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-white text-gold-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gold-600 font-semibold rounded-xl transition-all duration-300"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About