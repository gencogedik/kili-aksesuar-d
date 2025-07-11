
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-metallic-800 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!</p>
            <Link 
              to="/case-types" 
              className="metallic-button text-white px-8 py-4 rounded-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Alışverişe Devam Et
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-metallic-800">
                  Sepetim ({state.items.reduce((sum, item) => sum + item.quantity, 0)} ürün)
                </h1>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Sepeti Temizle
                </button>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-metallic-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.phoneModel} • {item.caseType}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg text-metallic-800">
                            {(item.price * item.quantity).toLocaleString('tr-TR')}₺
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-metallic-800 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-semibold">{state.total.toLocaleString('tr-TR')}₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KDV (%20)</span>
                  <span className="font-semibold">{Math.round(state.total * 0.2).toLocaleString('tr-TR')}₺</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-metallic-800 mb-6">
                <span>Toplam</span>
                <span>{Math.round(state.total * 1.2).toLocaleString('tr-TR')}₺</span>
              </div>

              {user ? (
                <Link
                  to="/checkout"
                  className="w-full metallic-button text-white py-4 rounded-lg font-semibold text-lg hover:transform hover:scale-105 transition-all duration-300 block text-center"
                >
                  Ödemeye Geç
                </Link>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">Satın almak için giriş yapın</p>
                  <Link
                    to="/auth"
                    className="w-full metallic-button text-white py-4 rounded-lg font-semibold text-lg hover:transform hover:scale-105 transition-all duration-300 block text-center"
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Güvenli ödeme</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>7 gün iade garantisi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Ücretsiz kargo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
