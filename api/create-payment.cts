import type { VercelRequest, VercelResponse } from '@vercel/node';
const CryptoJS = require('crypto-js');

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers to allow requests from your frontend
  // In production, you should restrict this to your actual domain for security
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Ensure only POST requests are processed
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    // Respond with JSON to be consistent
    return res.status(405).json({ status: 'error', reason: `Method ${req.method} Not Allowed` });
  }
  
  try {
    const { email, user_ip, amount, user_name, user_basket, merchant_oid } = req.body;
    const { VITE_PAYTR_MERCHANT_ID, VITE_PAYTR_MERCHANT_KEY, VITE_PAYTR_MERCHANT_SALT } = process.env;

    if (!VITE_PAYTR_MERCHANT_ID || !VITE_PAYTR_MERCHANT_KEY || !VITE_PAYTR_MERCHANT_SALT) {
      console.error('Sunucu Hatası: PAYTR ortam değişkenleri eksik.');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }

    const user_basket_string = JSON.stringify(user_basket);
    const user_basket_encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(user_basket_string));
    
    const payment_amount = Math.round(amount * 100);
    const currency = 'TL';
    const test_mode = '0';

    const hashStr =
      VITE_PAYTR_MERCHANT_ID + user_ip + merchant_oid + email + payment_amount +
      user_basket_encoded + '1' + '0' + currency + test_mode;

    const hmac = CryptoJS.HmacSHA256(hashStr + VITE_PAYTR_MERCHANT_SALT, VITE_PAYTR_MERCHANT_KEY);
    const paytr_token = CryptoJS.enc.Base64.stringify(hmac);

    const postData = new URLSearchParams({
      merchant_id: VITE_PAYTR_MERCHANT_ID,
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

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: postData,
    });

    const result = await response.json();

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('PAYTR API Hatası:', result);
      return res.status(400).json({ status: 'error', reason: `PAYTR Hatası: ${result.reason || 'Bilinmeyen Hata'}` });
    }

  } catch (error: any) {
    console.error('API Kök Hatası:', error.message);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.' });
  }
};

module.exports = handler;
