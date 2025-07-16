import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Star, Shield, Truck } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState([]);

  const features = [
    {
      icon: Shield,
      title: 'Maksimum Koruma',
      description: 'Düşme ve darbelere karşı üstün koruma'
    },
    {
      icon: Star,
      title: 'Premium Kalite',
      description: 'Yüksek kaliteli malzemeler ve işçilik'
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: '24 saat içinde kargo ile teslim'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(6); // Öne çıkan ürünler için 6 ürün getir

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-metallic-800/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-metallic-800 to-metallic-600 bg-clip-text text-transparent">
              Premium Telefon Kılıfları
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Telefonunuzu korurken stilinizi yansıtın. Carbon fiber, saydam, özel baskı ve karakter tasarımları ile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/case-types" className="metallic-button text-white px-8 py-4 rounded-lg font-semibold text-lg hover:transform hover:scale-105 transition-all duration-300">
                Kılıfları Keşfet
              </Link>
              <Link to="/phone-models" className="border-2 border-metallic-600 text-metallic-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-metallic-50 transition-all duration-300">
                Telefon Modellerim
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-metallic-600 to-metallic-800 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-metallic-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-metallic-800">Öne Çıkan Ürünler</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="product-card relative group">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.rating || 4.5})</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-metallic-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.phone_model} • {product.case_type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-metallic-800">{product.price}₺</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="metallic-button text-white px-4 py-2 rounded-lg text-sm font-medium hover:transform hover:scale-105 transition-all duration-300"
                    >
                      İncele
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-metallic-800 to-metallic-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Telefonunuz İçin Mükemmel Kılıfı Bulun
          </h2>
          <p className="text-metallic-200 text-lg mb-8 max-w-2xl mx-auto">
            Binlerce kılıf çeşidi arasından telefonunuza uygun olanı seçin. Premium kalite, uygun fiyat.
          </p>
          <Link 
            to="/case-types" 
            className="inline-block bg-white text-metallic-800 px-8 py-4 rounded-lg font-semibold text-lg hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Şimdi Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-metallic-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">PhoneCase Pro</h3>
              <p className="text-metallic-300">
                Premium telefon kılıfları ile telefonunuzu koruyun ve stilinizi yansıtın.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kategoriler</h4>
              <ul className="space-y-2 text-metallic-300">
                <li><Link to="/case-types?type=carbon-fiber" className="hover:text-white transition-colors">Carbon Fiber</Link></li>
                <li><Link to="/case-types?type=saydam" className="hover:text-white transition-colors">Saydam Kılıflar</Link></li>
                <li><Link to="/case-types?type=ozel-baski" className="hover:text-white transition-colors">Özel Baskılar</Link></li>
                <li><Link to="/case-types?type=karakter" className="hover:text-white transition-colors">Karakter Kılıfları</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Telefon Modelleri</h4>
              <ul className="space-y-2 text-metallic-300">
                <li><Link to="/phone-models?model=iphone-15" className="hover:text-white transition-colors">iPhone 15</Link></li>
                <li><Link to="/phone-models?model=iphone-14" className="hover:text-white transition-colors">iPhone 14</Link></li>
                <li><Link to="/phone-models?model=iphone-13" className="hover:text-white transition-colors">iPhone 13</Link></li>
                <li><Link to="/phone-models?model=iphone-12" className="hover:text-white transition-colors">iPhone 12</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-metallic-300">
                <li>Tel: +90 (212) 555 0123</li>
                <li>Email: info@phonecasepro.com</li>
                <li>Adres: İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-metallic-700 mt-8 pt-8 text-center text-metallic-400">
            <p>&copy; 2024 PhoneCase Pro. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
