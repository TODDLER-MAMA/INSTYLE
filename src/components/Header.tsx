import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: authState } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gold-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo - Smaller */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/icon.png" alt="In Style BD Logo" className="w-7 h-7" />
            <span className="text-lg font-bold text-gray-900 group-hover:text-gold-600 transition-colors duration-300">
              In Style BD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-gold-600"
                    : "text-gray-700 hover:text-gold-600"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-600"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Icons - Smaller */}
          <div className="flex items-center space-x-3">
            <Link
              to={authState.isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300"
            >
              <User className="w-4 h-4" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300 group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gold-600 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gold-200">
            <div className="py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-gold-600 bg-gold-50"
                      : "text-gray-700 hover:text-gold-600 hover:bg-gold-50"
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
  );
};

export default Header;
