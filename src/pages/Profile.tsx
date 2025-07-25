import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Package, User, MapPin, LogOut } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: Array<{
    product_name: string;
    phone_model: string;
    case_type: string;
    quantity: number;
    price: number;
  }>;
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            phone_model,
            case_type,
            quantity,
            price
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(orders || []);
    } catch (error: any) {
      toast.error('Siparişler yüklenirken hata oluştu');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Çıkış yapıldı');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallic-600"></div>
      </div>
    );
  }

  if (!user) return null;

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
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-metallic-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-metallic-600" />
                </div>
                <h2 className="text-xl font-bold text-metallic-800">{user.email}</h2>
              </div>

              <div className="space-y-3">
                <Link to="/profile/orders">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Package className="w-4 h-4" />
                    Siparişlerim
                  </Button>
                </Link>
                <Link to="/profile/addresses">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <MapPin className="w-4 h-4" />
                    Adreslerim
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-3"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-metallic-800 mb-6">Sipariş Geçmişim</h2>

              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metallic-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz siparişiniz yok</h3>
                  <p className="text-gray-500 mb-6">İlk siparişinizi vermek için alışverişe başlayın!</p>
                  <Link to="/case-types">
                    <Button className="metallic-button text-white">Alışverişe Başla</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-metallic-800">Sipariş #{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-metallic-800">{order.total_amount.toLocaleString('tr-TR')}₺</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'pending'
                              ? 'Hazırlanıyor'
                              : order.status === 'completed'
                              ? 'Tamamlandı'
                              : order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div>
                              <p className="font-medium text-metallic-800">{item.product_name}</p>
                              <p className="text-sm text-gray-600">{item.phone_model} • {item.case_type}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{item.quantity} adet</p>
                              <p className="text-sm text-gray-600">{item.price.toLocaleString('tr-TR')}₺</p>
                            </div>
                          </div>
                        ))}
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

export default Profile;
