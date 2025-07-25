import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const phoneModels = [
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 12 Pro Max',
  'iPhone 12 Pro',
  'iPhone 12',
  'iPhone 11 Pro Max',
  'iPhone 11 Pro',
  'iPhone 11'
];

// ✅ Slugify fonksiyonu: Türkçe karakter desteği + boşlukları kaldırır
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD') // Türkçe karakterleri çözer
    .replace(/[\u0300-\u036f]/g, '') // aksanları kaldırır
    .replace(/\s+/g, '-'); // boşlukları - yap

const PhoneModels = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-metallic-800 text-center mb-10">
          Telefon Modelini Seç
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {phoneModels.map((model) => (
            <Link
              key={model}
              to={`/case-types?model=${slugify(model)}`}
              className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-metallic-400"
            >
              <h2 className="text-lg font-semibold text-metallic-800">{model}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneModels;
