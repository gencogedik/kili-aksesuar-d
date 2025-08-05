// api/notification.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    if (body.status === 'success') {
      console.log('✅ Ödeme başarılı:', body.merchant_oid);

      // Burada Supabase işlemi yapılabilir:
      // await supabase.from('orders').insert({...})

      return res.status(200).send('OK');
    } else {
      console.warn('⚠️ Ödeme başarısız veya eksik:', body);
      return res.status(400).send('Invalid');
    }
  } catch (error) {
    console.error('🔥 Hata:', error);
    return res.status(500).send('Internal Server Error');
  }
}
