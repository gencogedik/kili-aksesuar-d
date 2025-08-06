
import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

export default async function handler(req, res) {
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
    // Verbose error for wrong method
    return res.status(405).json({
      status: 'error',
      error: 'Method Not Allowed',
      reason: `Method ${req.method} Not Allowed`,
      hint: 'Lütfen isteğinizi POST olarak gönderin.',
      verbose: true,
      timestamp: new Date().toISOString(),
      requestMethod: req.method
    });
  }
  
  try {
    // Vercel'de req.body bazen undefined olur, bu yüzden manuel olarak oku:
    let body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(data);
      } catch {
        throw new Error('İstek gövdesi JSON olarak ayrıştırılamadı.');
      }
    }

    // Verbose: Eksik body veya alanlar için hata-prone kontroller
    const { email, user_ip, amount, user_name, user_basket, merchant_oid, failTest } = body;
    if (!email || !user_ip || !amount || !user_name || !user_basket || !merchant_oid) {
      throw new Error('Zorunlu alanlardan biri eksik: email, user_ip, amount, user_name, user_basket, merchant_oid');
    }
    const { VITE_PAYTR_MERCHANT_ID, VITE_PAYTR_MERCHANT_KEY, VITE_PAYTR_MERCHANT_SALT } = process.env;

    if (!VITE_PAYTR_MERCHANT_ID || !VITE_PAYTR_MERCHANT_KEY || !VITE_PAYTR_MERCHANT_SALT) {
      console.error('Sunucu Hatası: PAYTR ortam değişkenleri eksik.');
      return res.status(500).json({
        status: 'error',
        error: 'ConfigError',
        reason: 'Sunucu yapılandırma hatası.',
        verbose: true,
        timestamp: new Date().toISOString(),
        envVars: {
          VITE_PAYTR_MERCHANT_ID,
          VITE_PAYTR_MERCHANT_KEY,
          VITE_PAYTR_MERCHANT_SALT
        }
      });
    }

    // Test amaçlı hata fırlatma
    if (failTest) {
      throw new Error('Test amaçlı hata fırlatıldı: failTest alanı true geldi.');
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

    let result;
    try {
      result = await response.json();
    } catch (jsonErr) {
      // JSON parse hatası
      return res.status(502).json({
        status: 'error',
        error: 'InvalidJSON',
        reason: 'PAYTR yanıtı JSON olarak ayrıştırılamadı.',
        verbose: true,
        raw: await response.text(),
        stack: jsonErr.stack,
        timestamp: new Date().toISOString()
      });
    }

    if (result.status === 'success') {
      return res.status(200).json({ ...result, verbose: true, timestamp: new Date().toISOString() });
    } else {
      console.error('PAYTR API Hatası:', result);
      return res.status(400).json({
        status: 'error',
        error: 'PaytrAPI',
        reason: `PAYTR Hatası: ${result.reason || 'Bilinmeyen Hata'}`,
        verbose: true,
        paytrResult: result,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    // Verbose error response
    console.error('API Kök Hatası:', error && error.message, error && error.stack);
    return res.status(500).json({
      status: 'error',
      error: error && error.name,
      reason: error && error.message,
      stack: error && error.stack,
      hint: 'Sunucu tarafında beklenmeyen bir hata oluştu. Lütfen logları ve istek formatını kontrol edin.',
      verbose: true,
      timestamp: new Date().toISOString(),
      requestMethod: req.method,
      requestBody: body,
    });
  }
}
