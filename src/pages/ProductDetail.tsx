import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link eklendi
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'; // ArrowLeft eklendi
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Header from '@/components/Header'; // 1. DÜZELTME: Header import edildi

// 2. DÜZELTME: Veritabanı ile uyumlu Product arayüzü
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string; // 'image' -> 'image_url' olarak düzeltildi
  phone_model: string;
  case_type: string;
  rating: number;
  stock_quantity: number;
}

// Türkçe karakterleri sadeleştiren ve dosya adına dönüştüren yardımcı fonksiyon
const normalizeFileName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

// Görsel yolunu çözümleyen fonksiyon (image_url kullanacak şekilde güncellendi)
const getImagePath = (product: Product): string => {
  if (product.image_url?.startsWith('http' )) {
    return product.image_url;
  }
  // Fallback için ürün adına göre bir yol oluşturur
  return `/images/${normalizeFileName(product.name)}.jpg`;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
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
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (dbError) throw dbError;
        if (data) setProduct(data);
        else setError('Ürün bulunamadı.');
      } catch (err: any) {
        console.error("❌ Ürün detayı çekme hatası:", err);
        setError('Sayfa yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: getImagePath(product), // Fonksiyon doğru görseli alacak
        phoneModel: product.phone_model,
        caseType: product.case_type,
      },
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Hata: {error}</div>;
  }
  if (!product) {
    return <div className="flex justify-center items-center h-screen">Ürün bulunamadı.</div>;
  }

  // 3. DÜZELTME: Sayfa yapısı diğer sayfalarla tutarlı hale getirildi
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/case-types" 
            className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kılıflara Geri Dön
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-8 rounded-xl shadow-lg">
          {/* Ürün Görseli */}
          <div className="flex justify-center items-center">
            <img
              src={getImagePath(product)}
              alt={product.name}
              className="w-full max-w-md rounded-lg shadow-lg object-cover aspect-square"
            />
          </div>
          {/* Ürün Bilgileri */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-metallic-800">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.phone_model} • {product.case_type}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-600 ml-2">({product.rating || 0} Puan)</span>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {product.description || "Bu ürün için henüz bir açıklama eklenmemiş."}
            </p>
            {Number(product.stock_quantity) > 0 ? (
              <p className="text-lg text-green-600 mb-4 font-semibold">✅ Stokta Mevcut</p>
            ) : (
              <p className="text-lg text-red-500 mb-4 font-semibold">❌ Stokta Kalmadı</p>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mt-4">
              <span className="text-3xl font-bold text-metallic-800">{product.price}₺</span>
              <button
                onClick={handleAddToCart}
                disabled={Number(product.stock_quantity) === 0}
                className="metallic-button w-full sm:w-auto text-white px-8 py-3 rounded-lg font-medium hover:transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
