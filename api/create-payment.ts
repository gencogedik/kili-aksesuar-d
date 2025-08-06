// /api/create-payment.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
// node-fetch'i CommonJS uyumlu şekilde import ediyoruz
const fetch = require('node-fetch');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Gelen isteğin POST olduğundan emin ol
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 2. Gerekli verileri ve ortam değişkenlerini al
    const { email, user_ip, amount, user_name, user_basket, merchant_oid } = req.body;
    const merchant_id = process.env.VITE_PAYTR_MERCHANT_ID;
    const merchant_key = process.env.VITE_PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.VITE_PAYTR_MERCHANT_SALT;

    // 3. Gerekli tüm verilerin mevcut olduğunu kontrol et
    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('Sunucu Hatası: PAYTR ortam değişkenleri eksik.');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }
    if (!email || !user_ip || !amount || !user_name || !user_basket || !merchant_oid) {
      return res.status(400).json({ status: 'error', reason: 'İstemciden eksik parametre gönderildi.' });
    }

    // 4. PayTR için gerekli verileri hazırla
    const payment_amount = Math.round(amount * 100);
    const user_basket_encoded = Buffer.from(JSON.stringify(user_basket)).toString('base64');
    const test_mode = '0'; // Canlıya geçerken '0' olmalı
    const currency = 'TL';

    // 5. PayTR dokümanına göre HASH oluştur
    const hashStr =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket_encoded +
      '1' + // no_installment
      '0' + // max_installment
      currency +
      test_mode;
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hashStr + merchant_salt)
      .digest('base64');

    // 6. PayTR'a gönderilecek POST verisini oluştur
    const params = new URLSearchParams();
    params.append('merchant_id', merchant_id);
    params.append('user_ip', user_ip);
    params.append('merchant_oid', merchant_oid);
    params.append('email', email);
    params.append('payment_amount', payment_amount.toString());
    params.append('paytr_token', paytr_token);
    params.append('user_basket', user_basket_encoded);
    params.append('debug_on', '1');
    params.append('no_installment', '1');
    params.append('max_installment', '0');
    params.append('user_name', user_name);
    params.append('user_address', 'Belirtilmedi');
    params.append('user_phone', 'Belirtilmedi');
    params.append('merchant_ok_url', `https://shufflecase.com/siparis-alindi?order_id=${merchant_oid}` );
    params.append('merchant_fail_url', `https://shufflecase.com/cart?payment_failed=true&order_id=${merchant_oid}` );
    params.append('timeout_limit', '30');
    params.append('currency', currency);
    params.append('test_mode', test_mode);

    // 7. node-fetch ile PayTR'a isteği gönder
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: params,
    } );

    const result = await response.json();

    // 8. PayTR'dan gelen yanıta göre istemciye cevap dön
    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('PAYTR API Hatası:', result);
      return res.status(400).json({ status: 'error', reason: `PAYTR Hatası: ${result.reason || 'Bilinmeyen Hata'}` });
    }

  } catch (error: any) {
    console.error('API Kök Hatası:', error);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.' });
  }
}
