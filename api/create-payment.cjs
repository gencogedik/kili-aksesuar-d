// /api/create-payment.cjs

const crypto = require('crypto');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
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

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: params,
    } );

    const result = await response.json();

    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('PAYTR API Hatası:', result);
      return res.status(400).json({ status: 'error', reason: `PAYTR Hatası: ${result.reason || 'Bilinmeyen Hata'}` });
    }

  } catch (error) {
    console.error('API Kök Hatası:', error.message);
    return res.status(500).json({ status: 'error', reason: 'Beklenmedik bir sunucu hatası oluştu.' });
  }
};
