import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard'; // Benzer ürünler için
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Model seçimi için
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Sekmeler için

// Genişletilmiş Product arayüzü
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  phone_model: string; // Ana model
  case_type: string;
  rating: number;
  stock_quantity: number;
  compatible_phones?: string[]; // Uyumlu telefon modelleri dizisi
  specs?: Record<string, string>; // Teknik özellikler için JSON nesnesi
}

// Yardımcı fonksiyonlar
const normalizeFileName = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

const getImagePath = (product: Product): string => {
  if (product.image_url?.startsWith('http' )) return product.image_url;
  return `/images/${normalizeFileName(product.name)}.jpg`;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError("Ürün ID'si bulunamadı.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Ana ürünü çek
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        if (!productData) {
          setError('Ürün bulunamadı.');
          return;
        }
        setProduct(productData);

        // Benzer ürünleri çek (aynı kılıf tipine sahip, mevcut ürün hariç)
        const { data: similarData, error: similarError } = await supabase
          .from('products')
          .select('*')
          .eq('case_type', productData.case_type)
          .neq('id', productData.id)
          .limit(4);
        
        if (similarError) console.error("Benzer ürünler çekilirken hata:", similarError);
        else setSimilarProducts(similarData || []);

      } catch (err: any) {
        console.error("❌ Veri çekme hatası:", err);
        setError('Sayfa yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedPhoneModel) {
      toast.error('Lütfen bir telefon modeli seçin.');
      return;
    }
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${product.id}-${selectedPhoneModel}`, // ID'yi model ile birleştirerek benzersiz yap
        name: product.name,
        price: product.price,
        image: getImagePath(product),
        phoneModel: selectedPhoneModel,
        caseType: product.case_type,
        quantity: quantity, // Miktar state'ini kullan
      },
    });
    toast.success(`${quantity} adet ${product.name} (${selectedPhoneModel}) sepete eklendi!`);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Hata: {error}</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Ürün bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/case-types" className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kılıflara Geri Dön
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-center items-center">
            <img src={getImagePath(product)} alt={product.name} className="w-full max-w-md rounded-lg shadow-lg object-cover aspect-square" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-metallic-800">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.case_type}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
              <span className="text-sm text-gray-600 ml-2">({product.rating || 0} Puan)</span>
            </div>

            {/* Telefon Modeli Seçimi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Modeli Seçin:</label>
              <Select onValueChange={setSelectedPhoneModel} value={selectedPhoneModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Model seç..." />
                </SelectTrigger>
                <SelectContent>
                  {product.compatible_phones?.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  )) || <SelectItem value={product.phone_model}>{product.phone_model}</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {/* Stok Durumu */}
            {Number(product.stock_quantity) > 0 ? (
              <p className="text-lg text-green-600 mb-4 font-semibold">✅ Stokta Mevcut</p>
            ) : (
              <p className="text-lg text-red-500 mb-4 font-semibold">❌ Stokta Kalmadı</p>
            )}

            {/* Fiyat, Miktar ve Sepet Butonu */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <span className="text-3xl font-bold text-metallic-800">{product.price}₺</span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.min(10, q + 1))}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={Number(product.stock_quantity) === 0}
              className="mt-6 w-full metallic-button text-white px-8 py-3 rounded-lg font-medium text-lg hover:transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Sepete Ekle
            </Button>
          </div>
        </div>

        {/* Açıklama, Özellikler ve Benzer Ürünler Sekmeleri */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
              <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="similar">Benzer Ürünler</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="bg-white p-6 rounded-b-lg shadow-inner">
              <p className="text-gray-700 leading-relaxed">{product.description || "Bu ürün için henüz bir açıklama eklenmemiş."}</p>
            </TabsContent>
            <TabsContent value="specs" className="bg-white p-6 rounded-b-lg shadow-inner">
              <ul className="space-y-2 text-gray-700">
                {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="font-semibold">{key}:</span>
                    <span>{value}</span>
                  </li>
                )) : <li>Teknik özellik bulunmuyor.</li>}
              </ul>
            </TabsContent>
            <TabsContent value="similar" className="bg-white p-6 rounded-b-lg shadow-inner">
              {similarProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <p className="text-center text-gray-600">Bu kılıf tipinde başka ürün bulunamadı.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
