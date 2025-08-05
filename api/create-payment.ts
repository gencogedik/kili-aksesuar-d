// /api/create-payment.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, user_ip, amount, user_name, user_basket, merchant_oid } = req.body;

    if (!email || !user_ip || !amount || !user_name || !user_basket || !merchant_oid) {
      return res.status(400).json({ status: 'error', reason: 'Eksik parametreler.' });
    }

    const merchant_id = process.env.VITE_PAYTR_MERCHANT_ID;
    const merchant_key = process.env.VITE_PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.VITE_PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('❌ Sunucu Hatası: PAYTR ortam değişkenleri bulunamadı!');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }

    // Base64 çevirme işlemi sunucuda yapılıyor
    const user_basket_encoded = Buffer.from(JSON.stringify(user_basket)).toString('base64');
    const payment_amount = Math.round(amount * 100);
    const currency = 'TL';
    const test_mode = '0';

    const hashStr =
      merchant_id + user_ip + merchant_oid + email + payment_amount +
      user_basket_encoded + '1' + '0' + currency + test_mode;

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
      merchant_fail_url: `https://shufflecase.com/cart?payment_failed=true&order_id=${merchant_oid}`,
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
      return res.status(200).json(result);
    } else {
      console.error('PAYTR API Hatası:', result);
      return res.status(400).json({ status: 'error', reason: `PAYTR Hatası: ${result.reason}` });
    }

  } catch (error: any) {
    console.error('API Kök Hatası (/api/create-payment.ts):', error.message);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.', details: error.message });
  }
}
