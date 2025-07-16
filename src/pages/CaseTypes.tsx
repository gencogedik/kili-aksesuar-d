import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

const CaseTypes = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [products, setProducts] = useState([]);

  const caseTypes = [
    { id: 'all', name: 'Tüm Çeşitler', count: 150 },
    { id: 'carbon-fiber', name: 'Carbon Fiber', count: 42 },
    { id: 'saydam', name: 'Saydam', count: 35 },
    { id: 'ozel-baski', name: 'Özel Baskı', count: 48 },
    { id: 'karakter', name: 'Karakter', count: 25 }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams]);

  const filteredProducts = selectedType === 'all'
    ? products
    : products.filter(product =>
        product.case_type?.toLowerCase().replace(/\s/g, '-') === selectedType
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-800 mb-4">Kılıf Çeşitleri</h1>
          <p className="text-gray-600">Tarzınıza uygun kılıfı bulun</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-metallic-800 mb-4">Kılıf Tipi Seç</h3>
              <div className="space-y-2">
                {caseTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedType === type.id
                        ? 'bg-gradient-to-r from-metallic-600 to-metallic-700 text-white'
                        : 'hover:bg-metallic-50 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{type.name}</span>
                      <span className={`text-sm ${
                        selectedType === type.id ? 'text-metallic-200' : 'text-gray-500'
                      }`}>
                        ({type.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-metallic-800 mb-3">Fiyat Aralığı</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">100₺ - 200₺</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">200

