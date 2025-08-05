// /api/paytr/token.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, user_ip, amount, user_name, user_basket_encoded } = req.body;

    // Gelen verileri doğrula
    if (!email || !user_ip || !amount || !user_name || !user_basket_encoded) {
      return res.status(400).json({ status: 'error', reason: 'Eksik parametreler.' });
    }

    const merchant_id = import.meta.env.VITE_PAYTR_MERCHANT_ID;
    const merchant_key = import.meta.env.VITE_PAYTR_MERCHANT_KEY;
    const merchant_salt = import.meta.env.VITE_PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('❌ Sunucu Hatası: PAYTR ortam değişkenleri bulunamadı!');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }

    const payment_amount = Math.round(amount * 100); // Kuruşa çevir
    const merchant_oid = 'SHUFFLE-' + Date.now();
    const currency = 'TL';
    const test_mode = '0';

    const hashStr = 
        merchant_id +
        user_ip +
        merchant_oid +
        email +
        payment_amount +
        user_basket_encoded + // İstemciden gelen base64 sepet
        '1' + // no_installment
        '0' + // max_installment
        currency +
        test_mode;
    
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hashStr + merchant_salt)
      .digest('base64');

    const postData = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount.toString(),
      paytr_token,
      user_basket: user_basket_encoded,
      debug_on: '1',
      no_installment: '1',
      max_installment: '0',
      user_name,
      user_address: 'Belirtilmedi',
      user_phone: 'Belirtilmedi',
      merchant_ok_url: `https://shufflecase.com/siparis-alindi?order_id=${merchant_oid}`,
      merchant_fail_url: 'https://shufflecase.com/cart',
      timeout_limit: '30',
      currency,
      test_mode,
    } );

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: postData.toString( ),
    });

    const result = await response.json();

    if (result.status === 'success') {
      // Başarılı olursa, istemcinin siparişi oluşturabilmesi için merchant_oid'i de geri dön.
      return res.status(200).json({ ...result, merchant_oid });
    } else {
      console.error('PAYTR API Hatası:', result.reason);
      return res.status(400).json({ status: 'error', reason: `PAYTR Hatası: ${result.reason}` });
    }

  } catch (error: any) {
    console.error('API Kök Hatası (/api/paytr/token):', error);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.', details: error.message });
  }
}
