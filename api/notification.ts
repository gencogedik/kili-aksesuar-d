import type { NextApiRequest, NextApiResponse } from 'next';

// Bu endpoint sadece POST isteklerini kabul eder
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // PayTR bildirim verisi burada gelir
    const body = req.body;

    // Örnek: Ödeme başarılı mı kontrol et
    if (body.status === 'success') {
      console.log('✅ Ödeme başarılı:', body.merchant_oid);

      // Ödeme sonucunu veritabanına kaydedebilirsin (Supabase örneği aşağıda)
      // await supabase.from('orders').insert({...})

      res.status(200).send('OK');
    } else {
      console.warn('⚠️ Ödeme başarısız veya eksik:', body);
      res.status(400).send('Invalid');
    }
  } catch (error) {
    console.error('🔥 Hata:', error);
    res.status(500).send('Internal Server Error');
  }
}
