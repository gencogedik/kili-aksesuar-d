// src/pages/Checkout.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(3, { message: "Ad Soyad en az 3 karakter olmalıdır." }),
  phone: z.string().min(10, { message: "Geçerli bir telefon numarası girin." }),
  addressLine1: z.string().min(10, { message: "Adres en az 10 karakter olmalıdır." }),
  city: z.string().min(2, { message: "Geçerli bir il girin." }),
  state: z.string().min(2, { message: "Geçerli bir ilçe girin." }),
  postalCode: z.string().min(5, { message: "Posta kodu 5 karakter olmalıdır." }).max(5, { message: "Posta kodu 5 karakter olmalıdır." }),
});

const Checkout = () => {
  const { user, loading } = useAuth();
  const { state, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '' }
  });

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (state.items.length === 0 && !iframeToken) navigate('/cart');
  }, [user, loading, state.items, iframeToken, navigate]);

  const getUserIP = async (): Promise<string> => {
    try {
      const res = await fetch('https://api.ipify.org?format=json' );
      if (!res.ok) throw new Error('IP adresi alınamadı.');
      return (await res.json()).ip;
    } catch (error) {
      console.error(error);
      return '127.0.0.1';
    }
  };

  const encodeUserBasket = (items: CartItem[]) => {
    const basketArray = items.map(item => [item.name, item.price.toString(), item.quantity]);
    return Buffer.from(JSON.stringify(basketArray)).toString('base64');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setSubmitting(true);

    try {
      const merchant_oid = 'SHUFFLE-' + Date.now();
      const totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const finalAmount = Math.round(totalAmount * 1.2);

      // ========================================================================
      // NİHAİ DÜZELTME:
      // 1. 'id' alanını kaldırarak Supabase'in otomatik UUID oluşturmasını sağlıyoruz.
      // 2. .select().single() ile yeni oluşturulan siparişin verilerini (ve UUID'sini) geri alıyoruz.
      const { data: newOrder, error: orderError } = await supabase.from('orders').insert([{
        user_id: user.id,
        order_number: merchant_oid, // PayTR için oluşturduğumuz numara buraya
        total_amount: finalAmount,
        shipping_address: values,
        status: 'pending'
      }]).select().single(); // .select().single() eklendi

      if (orderError) throw new Error(`Sipariş veritabanına kaydedilemedi: ${orderError.message}`);
      if (!newOrder) throw new Error('Sipariş oluşturuldu ancak verisi alınamadı.');

      // 3. Sipariş ürünlerini, veritabanından gelen doğru 'newOrder.id' ile bağlıyoruz.
      const orderItems = state.items.map(item => ({
        order_id: newOrder.id, // merchant_oid yerine newOrder.id kullanılıyor
        product_name: item.name,
        product_image: item.image,
        phone_model: item.phoneModel,
        case_type: item.caseType,
        price: item.price,
        quantity: item.quantity
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error(`Sipariş ürünleri kaydedilemedi: ${itemsError.message}`);
      // ========================================================================

      const ip = await getUserIP();
      const user_basket = state.items.map(item => [item.name, item.price.toString(), item.quantity]);
      
      const res = await fetch('/api/paytr/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          user_ip: ip,
          amount: finalAmount,
          user_name: values.fullName,
          user_basket,
          merchant_oid, // PayTR'a hala bu benzersiz numarayı gönderiyoruz
        }),
      });

      const data = await res.json();
      if (data.status !== 'success') {
        throw new Error(data.reason || 'Ödeme sağlayıcıdan yanıt alınamadı.');
      }

      setIframeToken(data.token);

    } catch (error: any) {
      console.error("Sipariş oluşturma hatası:", error);
      toast.error('Hata: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // JSX kısmı aynı kalabilir...
  if (loading || (!user && !iframeToken)) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!iframeToken && (
          <div className="flex items-center gap-4 mb-8">
            <Link to="/cart" className="inline-flex items-center gap-2 text-metallic-600 hover:text-metallic-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Sepete Dön
            </Link>
          </div>
        )}

        {iframeToken ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">Ödeme Ekranı</h2>
            <p className="text-center text-gray-600 mb-6">Lütfen ödemeyi tamamlamak için aşağıdaki adımları izleyin.</p>
            <div className="max-w-2xl mx-auto border rounded-lg overflow-hidden shadow-lg">
              <script src="https://www.paytr.com/js/iframeResizer.min.js" async></script>
              <iframe
                src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
                id="paytriframe"
                frameBorder="0"
                scrolling="no"
                style={{ width: '100%', minHeight: '600px' }}
                onLoad={( ) => {
                  // @ts-ignore
                  if (window.iFrameResize) {
                    // @ts-ignore
                    window.iFrameResize({}, '#paytriframe');
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-metallic-600" />
                  <h2 className="text-2xl font-bold text-metallic-800">Teslimat Bilgileri</h2>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad Soyad</FormLabel>
                          <FormControl><Input placeholder="Adınız Soyadınız" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl><Input placeholder="0555 123 45 67" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="addressLine1" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl><Input placeholder="Mahalle, Sokak, Bina No, Daire No" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>İl</FormLabel>
                          <FormControl><Input placeholder="Örn: Adana" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlçe</FormLabel>
                          <FormControl><Input placeholder="Örn: Seyhan" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu</FormLabel>
                          <FormControl><Input placeholder="Örn: 01150" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full metallic-button text-white py-4 text-lg flex items-center justify-center gap-3 mt-6">
                      <CreditCard className="w-5 h-5" />
                      {submitting ? 'Güvenli Ödemeye Yönlendiriliyor...' : 'Ödemeye Geç'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
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
                          <span className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString('tr-TR')}₺</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between"><span className="text-gray-600">Ara Toplam</span><span className="font-semibold">{state.total.toLocaleString('tr-TR')}₺</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">KDV (%20)</span><span className="font-semibold">{Math.round(state.total * 0.2).toLocaleString('tr-TR')}₺</span></div>
                  <div className="flex justify-between text-xl font-bold text-metallic-800 border-t border-gray-200 pt-3 mt-3"><span>Toplam</span><span>{Math.round(state.total * 1.2).toLocaleString('tr-TR')}₺</span></div>
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
