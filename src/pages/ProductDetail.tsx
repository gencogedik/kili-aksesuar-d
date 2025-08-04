import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  phone_model: string;
  case_type: string;
  rating?: number;
  stock_quantity: number;
}

const normalizeFileName = (name: string): string => {
  return (name || '')
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

const getImagePath = (product: Product): string => {
  if (product.image_url?.startsWith('http')) {
    return product.image_url;
  }
  return `/images/${normalizeFileName(product.name)}.jpg`;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error("❌ URL'den ID alınamadı.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, phone_model, case_type, stock_quantity')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err: any) {
        console.error('🔥 Ürün getirme hatası:', err.message);
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
        image: getImagePath(product),
        phoneModel: product.phone_model,
        caseType: product.case_type,
      },
    });

    toast.success(`${product.name} sepete eklendi!`);
  };

  if (loading)
    return <div className="text-center p-10 text-gray-500">Yükleniyor...</div>;

  if (!product)
    return <div className="text-center p-10 text-red-500">Ürün bulunamadı.</div>;

  const stockQuantity = Number(product.stock_quantity);
  const rating = product.rating ?? 4.5;

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={getImagePath(product)}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-metallic-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 text-sm mb-1">
          {product.phone_model} • {product.case_type}
        </p>

        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">({rating})</span>
        </div>

        {stockQuantity > 0 ? (
          <p className="text-sm text-green-600 mb-2">✅ Stokta {stockQuantity} adet var</p>
        ) : (
          <p className="text-sm text-red-500 mb-2">❌ Stokta kalmadı</p>
        )}

        <p className="text-2xl font-bold text-metallic-800 mb-4">{product.price}₺</p>

        <button
          onClick={handleAddToCart}
          className="metallic-button text-white px-6 py-3 rounded-lg text-lg font-medium hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          disabled={stockQuantity === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          Sepete Ekle
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
