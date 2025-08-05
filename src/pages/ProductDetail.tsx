import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner'; // Sepete ekleme bildirimi için

// Ürün veri yapısı (arayüzü)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  phoneModel: string;
  caseType: string;
  rating: number;
  stock_quantity: number;
}

// Türkçe karakterleri sadeleştiren ve dosya adına dönüştüren yardımcı fonksiyon
const normalizeFileName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
};

// Görsel yolunu çözümleyen fonksiyon
const getImagePath = (product: Product): string => {
  if (product.image?.startsWith('http' )) {
    return product.image;
  }
  // Eğer veritabanında görsel yoksa veya yerel bir dosya ise, ürün adına göre bir yol oluşturur.
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
          .from('products') // Veritabanı tablo adınızı doğrulayın
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) throw dbError;

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
  }, [id]);

  // Sepete ekleme fonksiyonu
  const handleAddToCart = () => {
    if (!product) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: getImagePath(product),
        phoneModel: product.phoneModel,
        caseType: product.caseType,
      },
    });
    // Kullanıcıya geri bildirim ver
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.phoneModel} • {product.caseType}</p>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.rating} Puan)</span>
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
  );
};

export default ProductDetail;
