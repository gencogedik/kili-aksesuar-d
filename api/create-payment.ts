import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';
import type { VercelRequest, VercelResponse } from '@vercel/node'; // TypeScript için

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok', method: 'OPTIONS', timestamp: new Date().toISOString() });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({
      status: 'error',
      error: 'Method Not Allowed',
      reason: `Method ${req.method} Not Allowed`,
      timestamp: new Date().toISOString(),
    });
  }

  let body: any;
  try {
    body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) buffers.push(chunk);
      const rawData = Buffer.concat(buffers).toString();
      body = JSON.parse(rawData);
    }
  } catch (err) {
    return res.status(400).json({ error: 'BadRequest', reason: 'JSON parse hatası' });
  }

  try {
    const { email, user_ip, amount, user_name, user_basket, merchant_oid } = body;

    if (!email || !user_ip || !amount || !user_name || !user_basket || !merchant_oid) {
      throw new Error('Eksik alanlar: email, user_ip, amount, user_name, user_basket, merchant_oid');
    }

    // ESM için doğru ortam değişkenleri
    const {
      PAYTR_MERCHANT_ID,
      PAYTR_MERCHANT_KEY,
      PAYTR_MERCHANT_SALT
    } = process.env;

    if (!PAYTR_MERCHANT_ID || !PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
      return res.status(500).json({
        error: 'ConfigError',
        reason: 'PAYTR ortam değişkenleri eksik',
        env: { PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT },
      });
    }

    const user_basket_string = JSON.stringify(user_basket);
    const user_basket_encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(user_basket_string));

    const payment_amount = Math.round(amount * 100);
    const currency = 'TL';
    const test_mode = '0';

    const hash_str = PAYTR_MERCHANT_ID +
      user_ip + merchant_oid + email + payment_amount +
      user_basket_encoded + '1' + '0' + currency + test_mode;

    const token = CryptoJS.HmacSHA256(hash_str + PAYTR_MERCHANT_SALT, PAYTR_MERCHANT_KEY);
    const paytr_token = CryptoJS.enc.Base64.stringify(token);

    const postData = new URLSearchParams({
      merchant_id: PAYTR_MERCHANT_ID,
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
    });

    const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: postData,
    });

    const result = await paytrRes.json().catch(async () => {
      const raw = await paytrRes.text();
      throw new Error(`PAYTR yanıtı JSON değil: ${raw}`);
    });

    if (result.status !== 'success') {
      return res.status(400).json({ error: 'PaytrError', reason: result.reason, result });
    }

    return res.status(200).json({ status: 'success', token: result.token });

  } catch (err: any) {
    console.error('🔥 Sunucu hatası:', err);
    return res.status(500).json({
      error: err.name || 'InternalServerError',
      reason: err.message || 'Bilinmeyen hata',
    });
  }
}
