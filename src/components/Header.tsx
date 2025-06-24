import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state: cartState } = useCart()
  const { state: authState } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b border-gold-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-gold-600 to-gold-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">IS</span>
            </div>
            <span className="text-xl font-serif font-bold text-gray-900 group-hover:text-gold-600 transition-colors duration-300">
              In Style BD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? 'text-gold-600'
                    : 'text-gray-700 hover:text-gold-600'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-600 animate-slide-up"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
            </Link>
            
            <Link
              to={authState.isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300 group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">
                  {cartState.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gold-200 animate-slide-up">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-gray-700 hover:text-gold-600 hover:bg-gold-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header