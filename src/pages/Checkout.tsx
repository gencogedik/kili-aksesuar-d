import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';

const Checkout = () => {
  const { user, loading } = useAuth();
  const { state, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: ''
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  const onSubmit = async (values: any) => {
    if (!user) return;

    setSubmitting(true);
    try {
      // 1. Sipariş numarası oluştur
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');
      if (orderNumberError) throw orderNumberError;

      // 2. Siparişi kaydet
      const total = Math.round(state.total * 1.2); // KDV dahil
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumberData,
          total_amount: total,
          shipping_address: values,
          status: 'pending'
        }])
        .select()
        .single();
      if (orderError) throw orderError;

      // 3. Sipariş ürünleri kaydet
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_name: item.name,
        product_image: item.image,
        phone_model: item.phoneModel,
        case_type: item.caseType,
        price: item.price,
        quantity: item.quantity
      }));
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. PayTR token al
      const res = await fetch('/api/paytr/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          user_ip: '127.0.0.1', // isteğe göre gerçek IP kullanılabilir
          amount: total,
          user_name: values.fullName
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        setIframeToken(data.token);
        dispatch({ type: 'CLEAR_CART' });
      } else {
        throw new Error(data.reason || 'Ödeme başlatılamadı.');
      }
    } catch (error: any) {
      toast.error('Hata: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || state.items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sepete Dön
          </Link>
        </div>

        {iframeToken ? (
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{ width: '100%', height: '700px' }}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Teslimat Formu */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-metallic-600" />
                  <h2 className="text-2xl font-bold text-metallic-800">Teslimat Bilgileri</h2>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad Soyad *</FormLabel>
                          <FormControl><Input placeholder="Ad Soyad" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon *</FormLabel>
                          <FormControl><Input placeholder="0555 123 45 67" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="addressLine1" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres *</FormLabel>
                        <FormControl><Input placeholder="Mahalle, Sokak, No" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="addressLine2" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres Tarifi (Opsiyonel)</FormLabel>
                        <FormControl><Input placeholder="Apartman adı, kat, daire no" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>İl *</FormLabel>
                          <FormControl><Input placeholder="İstanbul" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlçe *</FormLabel>
                          <FormControl><Input placeholder="Kadıköy" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu *</FormLabel>
                          <FormControl><Input placeholder="34000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full metallic-button text-white py-4 text-lg flex items-center gap-3"
                    >
                      <CreditCard className="w-5 h-5" />
                      {submitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-metallic-800 mb-6">Sipariş Özeti</h3>
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.phoneModel}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">{item.quantity} adet</span>
                          <span className="font-semibold text-sm">
                            {(item.price * item.quantity).toLocaleString('tr-TR')}₺
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-semibold">{state.total.toLocaleString('tr-TR')}₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span className="font-semibold text-green-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KDV (%20)</span>
                    <span className="font-semibold">
                      {Math.round(state.total * 0.2).toLocaleString('tr-TR')}₺
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-metallic-800 border-t border-gray-200 pt-3">
                    <span>Toplam</span>
                    <span>{Math.round(state.total * 1.2).toLocaleString('tr-TR')}₺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
