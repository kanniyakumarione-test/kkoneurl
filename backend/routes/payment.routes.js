const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const axios = require('axios');

// PayPal Credentials (Set these in your .env)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

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

router.post('/paypal-webhook', async (req, res) => {
  try {
    const { event_type, resource, custom_id } = req.body;
    const userId = custom_id; // We pass this in the frontend button

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

module.exports = router;
