// /api/paytr/token.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    // 405 hatasını önlemek için doğru başlıkları gönderiyoruz.
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, user_ip, amount, user_name } = req.body;

    // Vercel sunucu ortamı için process.env kullanılır.
    const merchant_id = process.env.VITE_PAYTR_MERCHANT_ID;
    const merchant_key = process.env.VITE_PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.VITE_PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('❌ Sunucu Hatası: PAYTR ortam değişkenleri bulunamadı!');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }

    const payment_amount = amount * 100;
    const merchant_oid = 'SHUFFLE-' + Date.now();

    const user_basket = Buffer.from(
      JSON.stringify([['ShuffleCase Siparişi', amount.toString(), 1]])
    ).toString('base64');

    const hashStr = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + '1' + '0' + 'TL' + '0';
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hashStr)
      .digest('base64');

    const postData = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount.toString(),
      paytr_token,
      user_basket,
      debug_on: '1',
      no_installment: '1',
      max_installment: '0',
      user_name,
      user_address: 'Belirtilmedi',
      user_phone: 'Belirtilmedi',
      merchant_ok_url: 'https://shufflecase.com/siparis-alindi',
      merchant_fail_url: 'https://shufflecase.com/cart',
      timeout_limit: '30',
      currency: 'TL',
      test_mode: '0',
    } );

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: postData.toString( ),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('PAYTR Token Hatası:', result.reason);
      return res.status(400).json(result);
    }

  } catch (error: any) {
    console.error('API Kök Hatası (/api/paytr/token):', error);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.', details: error.message });
  }
}
