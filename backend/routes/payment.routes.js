const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const axios = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// PayPal Credentials (Set these in your .env)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Razorpay Credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get PayPal Access Token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data.access_token;
};

// PayPal Webhook
router.post('/paypal-webhook', async (req, res) => {
  try {
    const { event_type, resource, custom_id } = req.body;
    const userId = custom_id;

    console.log(`🅿️ PayPal Webhook: ${event_type} for User: ${userId}`);

    if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED' || event_type === 'BILLING.SUBSCRIPTION.CREATED') {
      await supabase
        .from('users')
        .update({
          plan: 'pro',
          subscription_id: resource.id,
          customer_id: resource.subscriber?.payer_id || null,
          pro_until: resource.billing_info?.next_billing_time || null
        })
        .eq('id', userId);
    }

    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      await supabase
        .from('users')
        .update({
          plan: 'free'
        })
        .eq('id', userId);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ PayPal Webhook Error:', err);
    res.status(500).send('Internal Error');
  }
});

// Razorpay: Create Order
router.post('/razorpay-order', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId
      }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('❌ Razorpay Order Error:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
});

// Razorpay: Verify Payment (Alternative to webhook if needed, but webhook is safer)
router.post('/razorpay-verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment verified!
      await supabase
        .from('users')
        .update({
          plan: 'pro',
          pro_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 Year Pro
        })
        .eq('id', userId);

      res.json({ status: 'ok', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('❌ Razorpay Verification Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Razorpay Webhook
router.post('/razorpay-webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === signature) {
      const { event, payload } = req.body;
      
      if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        const userId = payment.notes.userId;
        
        await supabase
          .from('users')
          .update({
            plan: 'pro',
            pro_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', userId);
      }
      res.json({ status: 'ok' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (err) {
    console.error('❌ Razorpay Webhook Error:', err);
    res.status(500).send('Internal Error');
  }
});

module.exports = router;

