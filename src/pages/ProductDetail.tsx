import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  phone_model: string;
  case_type: string;
  rating: number;
  stock_quantity: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        toast.error("Ürün ID'si bulunamadı.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ 'stock_quantity' ve diğer tüm gerekli alanları seçtiğimizden emin oluyoruz.
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, description, image_url, phone_model, case_type, stock_quantity')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProduct(data);
        } else {
          toast.warning('Ürün bulunamadı.');
        }
      } catch (err: any) {
        toast.error('Ürün yüklenirken bir hata oluştu: ' + err.message);
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
        image: product.image_url || '/placeholder.svg',
        phoneModel: product.phone_model,
        caseType: product.case_type,
      },
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallic-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold text-red-500">Ürün Bulunamadı</h2>
          <p className="text-gray-600 my-4">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Stok miktarını sayıya çeviriyoruz.
  const stockQuantity = Number(product.stock_quantity);
  const isOutOfStock = stockQuantity === 0;

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
            Alışverişe Devam Et
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-metallic-800 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-md mb-3">{product.phone_model} • {product.case_type}</p>
            
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">({product.rating || 4.5})</span>
            </div>

            <p className="text-gray-700 mb-5">{product.description || 'Bu ürün için açıklama bulunmamaktadır.'}</p>
            
            {/* ✅ Canlı Stok Bilgisi */}
            {stockQuantity > 0 ? (
              <p className="text-md text-green-600 mb-4 font-semibold">✅ Stokta {stockQuantity} adet var</p>
            ) : (
              <p className="text-md text-red-500 mb-4 font-semibold">❌ Stokta kalmadı</p>
            )}

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <span className="text-3xl font-bold text-metallic-800">{product.price}₺</span>
                <Button
                    onClick={handleAddToCart}
                    className="metallic-button text-white px-6 py-3 text-lg font-medium hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    disabled={isOutOfStock}
                >
                    <ShoppingCart className="w-5 h-5" />
                    Sepete Ekle
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
