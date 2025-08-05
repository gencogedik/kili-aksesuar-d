// api/notification.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Supabase server-side client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Özel key sadece burada kullanılır
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const body = req.body;

  const {
    merchant_oid,
    status,
    total_amount,
    hash
  } = body;

  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

  // Güvenlik için hash doğrulaması
  const tokenStr = merchant_oid + merchant_salt + status + total_amount;
  const token = crypto
    .createHmac('sha256', merchant_key)
    .update(tokenStr)
    .digest('base64');

  if (token !== hash) {
    console.error('🚫 Geçersiz hash doğrulaması!');
    return res.status(400).send('PAYTR notification failed: invalid hash');
  }

  // Başarılıysa sipariş durumunu güncelle
  if (status === 'success') {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('order_number', merchant_oid);

    if (error) {
      console.error('❌ Supabase güncelleme hatası:', error.message);
      return res.status(500).send('Supabase error');
    }

    console.log('✅ Sipariş onaylandı:', merchant_oid);
    return res.status(200).send('OK');
  } else {
    console.warn('⚠️ Ödeme başarısız:', body);

    // Opsiyonel: istersen siparişi "cancelled" yapabilirsin
    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('order_number', merchant_oid);

    return res.status(200).send('OK');
  }
}
