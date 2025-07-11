
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Package, Users, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  phone_model: string;
  case_type: string;
  stock_quantity: number;
  is_active: boolean;
}

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      phone_model: '',
      case_type: '',
      image_url: '',
      stock_quantity: ''
    }
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoadingProducts(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: values.name,
          description: values.description,
          price: parseFloat(values.price),
          phone_model: values.phone_model,
          case_type: values.case_type,
          image_url: values.image_url || '/placeholder.svg',
          stock_quantity: parseInt(values.stock_quantity) || 0
        }]);

      if (error) throw error;

      toast.success('Ürün başarıyla eklendi!');
      form.reset();
      setShowAddForm(false);
      fetchProducts();
    } catch (error: any) {
      toast.error('Ürün eklenirken hata oluştu: ' + error.message);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Ürün durumu güncellendi');
      fetchProducts();
    } catch (error: any) {
      toast.error('Güncelleme sırasında hata oluştu');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallic-600"></div>
    </div>;
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Admin Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-metallic-800 mb-6">Admin Panel</h2>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Package className="w-4 h-4" />
                  Ürün Yönetimi
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  Siparişler
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Users className="w-4 h-4" />
                  Kullanıcılar
                </Button>
              </div>
            </div>
          </div>

          {/* Products Management */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-metallic-800">Ürün Yönetimi</h2>
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="metallic-button text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Yeni Ürün Ekle
                </Button>
              </div>

              {showAddForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-metallic-800 mb-4">Yeni Ürün Ekle</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ürün Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="Ürün adı" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fiyat (₺)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="299" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon Modeli</FormLabel>
                            <FormControl>
                              <Input placeholder="iPhone 15" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="case_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kılıf Tipi</FormLabel>
                            <FormControl>
                              <Input placeholder="Carbon Fiber" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stok Adedi</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resim URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Açıklama</FormLabel>
                              <FormControl>
                                <Input placeholder="Ürün açıklaması" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2 flex gap-4">
                        <Button type="submit" className="metallic-button text-white">
                          Ürün Ekle
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowAddForm(false)}
                        >
                          İptal
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metallic-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-metallic-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {product.phone_model} • {product.case_type} • {product.price}₺
                        </p>
                        <p className="text-sm text-gray-500">Stok: {product.stock_quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                        >
                          {product.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
