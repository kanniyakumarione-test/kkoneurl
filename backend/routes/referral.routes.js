const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getReferralStats, claimScratchCard, redeemPromoCode } = require('../controllers/referral.controller');

router.get('/stats', protect, getReferralStats);
router.post('/claim', protect, claimScratchCard);
router.post('/redeem', protect, redeemPromoCode);

module.exports = router;
