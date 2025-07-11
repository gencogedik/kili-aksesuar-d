
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, signOut, isAdmin } = useAuth();

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 metallic-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-metallic-800">Kılıf Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-metallic-600 transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link to="/phone-models" className="text-gray-700 hover:text-metallic-600 transition-colors font-medium">
              Telefon Modelleri
            </Link>
            <Link to="/case-types" className="text-gray-700 hover:text-metallic-600 transition-colors font-medium">
              Kılıf Çeşitleri
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-metallic-600 transition-colors font-medium">
              İletişim
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-metallic-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-metallic-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block text-sm font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profilim
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Giriş Yap
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-metallic-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-metallic-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/phone-models"
                className="block px-3 py-2 text-gray-700 hover:text-metallic-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Telefon Modelleri
              </Link>
              <Link
                to="/case-types"
                className="block px-3 py-2 text-gray-700 hover:text-metallic-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Kılıf Çeşitleri
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-metallic-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
