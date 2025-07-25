import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Siparişleri alma hatası:", error.message);
      } else {
        setOrders(ordersData);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p>Hiç siparişiniz bulunmuyor.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg p-5">
              <div className="mb-3">
                <p><strong>Sipariş No:</strong> {order.order_number}</p>
                <p><strong>Tarih:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Tutar:</strong> {order.total_amount} TL</p>
                <p><strong>Durum:</strong> {order.status}</p>
              </div>

              {order.shipping_address?.address_line && (
                <div className="mb-3 text-sm text-gray-600">
                  <p><strong>Adres:</strong> {order.shipping_address.address_line}, {order.shipping_address.city}</p>
                </div>
              )}

              <div className="space-y-2">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="border p-3 rounded-md bg-gray-50">
                    <div className="flex gap-4 items-center">
                      <img src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded" />
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.phone_model} - {item.case_type}
                        </p>
                        <p className="text-sm">Adet: {item.quantity} • Fiyat: {item.price} TL</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
