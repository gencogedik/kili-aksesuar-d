import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Siparişler alınamadı:", error.message);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-metallic-800">Siparişlerim</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Henüz bir siparişiniz bulunmamaktadır.</p>
      ) : (
        <ul className="space-y-4 max-w-2xl mx-auto">
          {orders.map((order) => (
            <li key={order.id} className="p-4 bg-white rounded shadow border border-gray-200">
              <div className="text-sm text-gray-600">
                <strong>Tarih:</strong> {new Date(order.created_at).toLocaleDateString()}
              </div>
              <div className="mt-2">
                <strong>Sipariş ID:</strong> {order.id}
              </div>
              <div className="mt-1 text-gray-700">
                <strong>Toplam:</strong> {order.total_price} ₺
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
