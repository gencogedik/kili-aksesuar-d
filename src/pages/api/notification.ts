import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const data = req.body;

  console.log('PayTR notification received:', data);

  if (data.status === 'success') {
    const orderId = data.order_id;

    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (error) {
      console.error('Supabase update error:', error.message);
      return res.status(500).json({ message: 'Database update failed' });
    }

    return res.status(200).json({ message: 'Order updated as paid' });
  }

  return res.status(200).json({ message: 'Notification received' });
}
