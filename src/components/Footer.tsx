import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gold-900/20 to-transparent"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">IS</span>
                </div>
                <span className="text-2xl font-bold text-white">In Style BD</span>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Your premier destination for elegant dresses, exquisite jewelry, and premium beauty products in Bangladesh. We curate the finest collections to celebrate your unique style.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' }
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-10 h-10 bg-white/10 hover:bg-gold-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Products', href: '/products' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-gold-400 transition-colors duration-300 text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gold-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: 'info@instylebd.com' },
                  { icon: Phone, text: '+880 1234 567890' },
                  { icon: MapPin, text: 'Dhaka, Bangladesh' }
                ].map(({ icon: Icon, text }, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-gold-600/20 rounded-lg flex items-center justify-center group-hover:bg-gold-600 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© 2024 In Style BD. Made with</span>
                <Heart className="w-4 h-4 text-gold-500" />
                <span>in Bangladesh</span>
              </div>
              
              <div className="flex items-center space-x-6">
                {['Privacy Policy', 'Terms of Service', 'Returns'].map((item) => (
                  <Link
                    key={item}
                    to="#"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer