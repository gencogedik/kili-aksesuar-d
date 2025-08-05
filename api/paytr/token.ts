// /api/paytr/token.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email, user_ip, amount, user_name } = req.body;

  const merchant_id = process.env.VITE_PAYTR_MERCHANT_ID!;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

  const payment_amount = amount * 100;
  const merchant_oid = 'ORDER_' + Date.now();

  const user_basket = Buffer.from(
    JSON.stringify([['Kılıf', amount.toString(), 1]])
  ).toString('base64');

  const data_to_hash =
    merchant_id +
    user_ip +
    merchant_oid +
    email +
    payment_amount +
    user_basket +
    'TL' +
    '1' +
    merchant_salt;

  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(data_to_hash)
    .digest('base64');

  const postData = {
    merchant_id,
    user_ip,
    merchant_oid,
    email,
    payment_amount,
    paytr_token,
    user_basket,
    no_installment: '1',
    currency: 'TL',
    test_mode: '1',
    user_name,
    merchant_ok_url: 'https://shufflecase.com/payment-success',
    merchant_fail_url: 'https://shufflecase.com/payment-fail',
    debug_on: '1',
    iframe: '1',
  };

  const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(postData).toString(),
  });

  const result = await response.json();
  return res.status(200).json(result);
}
