// /api/paytr/token.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { email, user_ip, amount, user_name } = req.body;

    // Gerekli değişkenlerin varlığını kontrol et
    if (!process.env.PAYTR_MERCHANT_ID || !process.env.PAYTR_MERCHANT_KEY || !process.env.PAYTR_MERCHANT_SALT) {
      console.error('❌ Sunucu Hatası: PAYTR ortam değişkenleri eksik!');
      return res.status(500).json({ status: 'error', reason: 'Sunucu yapılandırma hatası.' });
    }

    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    const payment_amount = amount * 100; // Tutar kuruşa çevrilir
    const merchant_oid = 'SHUFFLE-' + Date.now(); // Sipariş Numarası

    // Sepet içeriği Base64 formatında
    const user_basket = Buffer.from(
      JSON.stringify([['ShuffleCase Siparişi', amount.toString(), 1]])
    ).toString('base64');

    // Hash oluşturmak için kullanılacak veri
    const data_to_hash =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket +
      '1' + // no_installment
      '0' + // max_installment
      'TL' + // currency
      '0'; // test_mode (0: Gerçek, 1: Test)

    // Hash (paytr_token) oluşturma
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(data_to_hash)
      .digest('base64');

    // PAYTR'a gönderilecek POST verisi
    const postData = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount.toString(),
      paytr_token,
      user_basket,
      debug_on: '1', // Hata ayıklama için
      no_installment: '1',
      max_installment: '0',
      user_name,
      user_address: 'Belirtilmedi', // Adres Checkout sayfasından alınıyor, burada zorunlu değil
      user_phone: 'Belirtilmedi', // Telefon Checkout sayfasından alınıyor, burada zorunlu değil
      merchant_ok_url: 'https://shufflecase.com/siparis-alindi', // Başarılı dönüş URL'si
      merchant_fail_url: 'https://shufflecase.com/cart', // Başarısız dönüş URL'si
      timeout_limit: '30',
      currency: 'TL',
      test_mode: '0', // Test modunu kapatmak için '0' yapın
    } );

    // PAYTR'dan token almak için istek
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postData.toString( ),
    });

    const result = await response.json();

    // PAYTR'dan gelen yanıtı istemciye gönder
    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('PAYTR Token Hatası:', result.reason);
      return res.status(400).json(result);
    }

  } catch (error: any) {
    console.error('API Hatası (/api/paytr/token):', error);
    return res.status(500).json({ status: 'error', reason: error.message });
  }
}
