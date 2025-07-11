
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Star, ShoppingCart, Heart, Shield, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPhone, setSelectedPhone] = useState('');

  // Mock product data
  const product = {
    id: id || '1',
    name: 'Carbon Pro Elite',
    price: 299,
    originalPrice: 399,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    caseType: 'Carbon Fiber',
    rating: 4.8,
    reviewCount: 124,
    description: 'Premium carbon fiber kılıf, maksimum koruma ve şık tasarım. Darbe emici teknoloji ile telefonunuzu günlük kullanımda korur.',
    features: [
      'Gerçek carbon fiber malzeme',
      'Düşme koruması sertifikalı',
      'Kablosuz şarj uyumlu',
      'Ultra ince tasarım',
      'Anti-parmak izi kaplama'
    ],
    compatiblePhones: ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
    inStock: true,
    stockCount: 15
  };

  const handleAddToCart = () => {
    if (!selectedPhone) {
      alert('Lütfen telefon modelinizi seçin');
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${product.id}-${selectedPhone}`,
        name: product.name,
        price: product.price,
        image: product.images[0],
        phoneModel: selectedPhone,
        caseType: product.caseType
      }
    });

    alert('Ürün sepete eklendi!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-metallic-600">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/case-types" className="hover:text-metallic-600">Kılıf Çeşitleri</Link>
          <span>/</span>
          <span className="text-metallic-800">{product.name}</span>
        </div>

        <Link 
          to="/case-types" 
          className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-metallic-600 ring-2 ring-metallic-200' 
                        : 'border-gray-200 hover:border-metallic-400'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-metallic-100 text-metallic-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.caseType}
                </span>
                {product.inStock && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Stokta Var
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-metallic-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({product.reviewCount} değerlendirme)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-metallic-800">{product.price}₺</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{product.originalPrice}₺</span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    %{Math.round((1 - product.price / product.originalPrice) * 100)} İndirim
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Phone Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-metallic-800 mb-3">
                  Telefon Modelinizi Seçin *
                </label>
                <select 
                  value={selectedPhone}
                  onChange={(e) => setSelectedPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-metallic-500 focus:border-transparent"
                >
                  <option value="">Telefon modeli seçin</option>
                  {product.compatiblePhones.map((phone) => (
                    <option key={phone} value={phone}>{phone}</option>
                  ))}
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-metallic-800 mb-3">
                  Adet
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Stokta {product.stockCount} adet kaldı</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="metallic-button text-white px-8 py-4 rounded-lg font-semibold text-lg hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-2 flex-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Sepete Ekle
                </button>
                <button className="border-2 border-red-500 text-red-500 px-6 py-4 rounded-lg hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-metallic-800 mb-4">Özellikler</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-5 h-5 text-metallic-600" />
                  <span>Ücretsiz kargo • 1-2 iş günü teslimat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
