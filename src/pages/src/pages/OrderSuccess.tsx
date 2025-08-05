// src/pages/OrderSuccess.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
        <h1 className="text-3xl font-bold text-metallic-800 mb-4">Siparişiniz Alındı!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Ödemeniz başarıyla tamamlandı. Siparişiniz hazırlanıyor.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-metallic-800 text-white rounded-lg shadow hover:bg-metallic-900 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
