import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Supabase client dosyanızın yolunu doğrulayın
import { Star, ShoppingCart } from 'lucide-react'; // Gerekli ikonları import edin
import { useCart } from '@/contexts/CartContext'; // Cart context'i import edin

// ProductCard'dan gelen Product tipini burada da kullanabiliriz veya yeniden tanımlayabiliriz.
interface Product {
  id: string;
  name: string;
  description: string; // Açıklama gibi ek alanlar olabilir
  price: number;
  image?: string;
  phoneModel: string;
  caseType: string;
  rating: number;
  stock_quantity: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL'den ürün ID'sini al
  const { dispatch } = useCart();

  // State'leri tanımla: product, loading, error
  const [product, setProduct] = useState<Product | null>(null); // Başlangıç değeri null olmalı
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Ürün ID'si bulunamadı.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('products') // VERİTABANI TABLO ADINIZI DOĞRULAYIN
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) {
          throw dbError;
        }

        if (data) {
          setProduct(data);
        } else {
          setError('Ürün bulunamadı.');
        }
      } catch (err: any) {
        console.error("❌ Ürün detayı çekme hatası:", err);
        setError('Sayfa yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // id değiştiğinde bu effect yeniden çalışır

  // --- EN ÖNEMLİ KISIM: KOŞULLU RENDER ---

  // 1. Yüklenme durumu
  if (loading) {
    return <div className="text-center p-10">Yükleniyor...</div>;
  }

  // 2. Hata durumu
  if (error) {
    return <div className="text-center p-10 text-red-500">Hata: {error}</div>;
  }

  // 3. Ürün bulunamama durumu
  if (!product) {
    return <div className="text-center p-10">Ürün bulunamadı.</div>;
  }

  // 4. Başarılı durum: Veri yüklendi, hata yok ve ürün mevcut.
  //    Artık 'product' nesnesini güvenle kullanabiliriz.
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün Görseli */}
        <div>
          <img 
            src={product.image?.startsWith('http' ) ? product.image : `/images/placeholder.jpg`} // Placeholder kullanmak daha güvenli
            alt={product.name} 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Ürün Bilgileri */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.phoneModel} • {product.caseType}</p>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
          </div>

          <p className="text-lg text-gray-700 mb-4">
            {product.description || "Bu ürün için açıklama mevcut değil."}
          </p>

          {Number(product.stock_quantity) > 0 ? (
            <p className="text-lg text-green-600 mb-4">✅ Stokta var</p>
          ) : (
            <p className="text-lg text-red-500 mb-4">❌ Stokta kalmadı</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-metallic-800">{product.price}₺</span>
            <button
              // onClick={handleAddToCart} // handleAddToCart fonksiyonunu tanımlamanız gerekir
              disabled={Number(product.stock_quantity) === 0}
              className="metallic-button text-white px-6 py-3 rounded-lg font-medium hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
