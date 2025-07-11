
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhoneMenuOpen, setIsPhoneMenuOpen] = useState(false);
  const [isCaseMenuOpen, setIsCaseMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useCart();

  const phoneModels = ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'];
  const caseTypes = ['Karbon Fiber', 'Saydam', 'Özel Baskı', 'Karakter'];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="carbon-texture h-1"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-metallic-600 to-metallic-800 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-metallic-700 to-metallic-900 bg-clip-text text-transparent">
              PhoneCase Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'text-primary font-semibold' : ''}`}
            >
              Ana Sayfa
            </Link>
            
            {/* Phone Models Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPhoneMenuOpen(true)}
              onMouseLeave={() => setIsPhoneMenuOpen(false)}
            >
              <Link
                to="/phone-models"
                className={`nav-link ${isActive('/phone-models') ? 'text-primary font-semibold' : ''}`}
              >
                Telefon Modelleri
              </Link>
              {isPhoneMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {phoneModels.map((model) => (
                    <Link
                      key={model}
                      to={`/phone-models?model=${model.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-metallic-50 hover:to-metallic-100 hover:text-metallic-800 transition-all duration-200"
                    >
                      {model}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Case Types Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCaseMenuOpen(true)}
              onMouseLeave={() => setIsCaseMenuOpen(false)}
            >
              <Link
                to="/case-types"
                className={`nav-link ${isActive('/case-types') ? 'text-primary font-semibold' : ''}`}
              >
                Kılıf Çeşitleri
              </Link>
              {isCaseMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {caseTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/case-types?type=${type.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-metallic-50 hover:to-metallic-100 hover:text-metallic-800 transition-all duration-200"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'text-primary font-semibold' : ''}`}
            >
              İletişim
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/phone-models"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Telefon Modelleri
              </Link>
              <Link
                to="/case-types"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kılıf Çeşitleri
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
