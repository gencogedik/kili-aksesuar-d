
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

const PhoneModels = () => {
  const [searchParams] = useSearchParams();
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || 'all');

  const phoneModels = [
    { id: 'all', name: 'Tüm Modeller', count: 150 },
    { id: 'iphone-15', name: 'iPhone 15', count: 45 },
    { id: 'iphone-14', name: 'iPhone 14', count: 38 },
    { id: 'iphone-13', name: 'iPhone 13', count: 32 },
    { id: 'iphone-12', name: 'iPhone 12', count: 25 },
    { id: 'iphone-11', name: 'iPhone 11', count: 18 }
  ];

  const mockProducts = [
    {
      id: '1',
      name: 'Carbon Pro Max',
      price: 299,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 15',
      caseType: 'Carbon Fiber',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Crystal Shield',
      price: 199,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 15',
      caseType: 'Saydam',
      rating: 4.6
    },
    {
      id: '3',
      name: 'Dragon Elite',
      price: 399,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 14',
      caseType: 'Özel Baskı',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Batman Pro',
      price: 349,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 14',
      caseType: 'Karakter',
      rating: 4.7
    },
    {
      id: '5',
      name: 'Metallic Defense',
      price: 259,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 13',
      caseType: 'Carbon Fiber',
      rating: 4.5
    },
    {
      id: '6',
      name: 'Clear Vision',
      price: 189,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 13',
      caseType: 'Saydam',
      rating: 4.4
    },
    {
      id: '7',
      name: 'Sunset Design',
      price: 329,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 12',
      caseType: 'Özel Baskı',
      rating: 4.6
    },
    {
      id: '8',
      name: 'Spider-Man Edition',
      price: 369,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 12',
      caseType: 'Karakter',
      rating: 4.8
    },
    {
      id: '9',
      name: 'Carbon Lite',
      price: 229,
      image: '/placeholder.svg',
      phoneModel: 'iPhone 11',
      caseType: 'Carbon Fiber',
      rating: 4.3
    }
  ];

  const filteredProducts = selectedModel === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => 
        product.phoneModel.toLowerCase().replace(' ', '-') === selectedModel
      );

  useEffect(() => {
    const model = searchParams.get('model');
    if (model) {
      setSelectedModel(model);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-800 mb-4">Telefon Modelleri</h1>
          <p className="text-gray-600">Telefonunuza uygun kılıfları keşfedin</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-metallic-800 mb-4">Telefon Modeli Seç</h3>
              <div className="space-y-2">
                {phoneModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedModel === model.id
                        ? 'bg-gradient-to-r from-metallic-600 to-metallic-700 text-white'
                        : 'hover:bg-metallic-50 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{model.name}</span>
                      <span className={`text-sm ${
                        selectedModel === model.id ? 'text-metallic-200' : 'text-gray-500'
                      }`}>
                        ({model.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} ürün bulundu
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-metallic-500 focus:border-transparent">
                <option>Fiyat: Düşükten Yükseğe</option>
                <option>Fiyat: Yüksekten Düşüğe</option>
                <option>En Popüler</option>
                <option>En Yeni</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Bu model için henüz ürün bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneModels;
