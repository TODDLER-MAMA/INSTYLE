import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Heart, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'

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
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">IS</span>
                </div>
                <span className="text-2xl font-bold text-white">In Style BD</span>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Your premier destination for elegant dresses, exquisite jewelry, and premium beauty products in Bangladesh. We curate the finest collections to celebrate your unique style.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/1GtksZSK3i/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://www.instagram.com/instyle.934/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://wa.me/8801842299333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Products', href: '/products' },
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
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-gold-600/20 rounded-lg flex items-center justify-center group-hover:bg-gold-600 transition-colors duration-300 flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <a href="tel:01842299333" className="text-gray-300 hover:text-gold-400 text-sm transition-colors duration-300">
                      01842299333
                    </a>
                    <p className="text-gray-400 text-xs">Customer Service & WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-gold-600/20 rounded-lg flex items-center justify-center group-hover:bg-gold-600 transition-colors duration-300 flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <a href="mailto:instylebd86@gmail.com" className="text-gray-300 hover:text-gold-400 text-sm transition-colors duration-300">
                      instylebd86@gmail.com
                    </a>
                    <p className="text-gray-400 text-xs">Email Support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-gold-600/20 rounded-lg flex items-center justify-center group-hover:bg-gold-600 transition-colors duration-300 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">
                      Shop 318, 3rd floor, Rakeen commercial complex, Rakeen city, mirpur 13
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Our Services</h3>
              <div className="space-y-4">
                {[
                  { icon: Truck, text: 'Free Delivery (৳2000+)', subtext: 'Inside Dhaka ৳80, Outside ৳150' },
                  { icon: Shield, text: 'Quality Guarantee', subtext: '100% authentic products' },
                  { icon: RotateCcw, text: 'Easy Returns', subtext: '7-day return policy' },
                  { icon: Headphones, text: '24/7 Support', subtext: 'Always here to help' }
                ].map(({ icon: Icon, text, subtext }, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-gold-600/20 rounded-lg flex items-center justify-center group-hover:bg-gold-600 transition-colors duration-300 flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">{text}</span>
                      <p className="text-gray-400 text-xs">{subtext}</p>
                    </div>
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