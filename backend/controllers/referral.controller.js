const supabase = require('../config/supabase');

exports.getReferralStats = async (req, res) => {
  try {
    // 1. Get referral count
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', req.user.id);
    
    if (error) throw error;

    // 2. Get user's milestone progress
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('referral_milestones_claimed, referral_code, link_limit')
      .eq('id', req.user.id)
      .single();

    if (userError) throw userError;

    // Calculate if they can claim a new scratch card
    // Every 20 referrals = 1 scratch card
    const availableScratchCards = Math.floor(count / 20) - (user.referral_milestones_claimed || 0);

    res.json({
      referralCount: count,
      referralCode: user.referral_code,
      linkLimit: user.link_limit,
      availableScratchCards: availableScratchCards > 0 ? availableScratchCards : 0,
      milestonesClaimed: user.referral_milestones_claimed || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.claimScratchCard = async (req, res) => {
  try {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', req.user.id);

    const { data: user } = await supabase
      .from('users')
      .select('referral_milestones_claimed')
      .eq('id', req.user.id)
      .single();

    const available = Math.floor(count / 20) - (user.referral_milestones_claimed || 0);

    if (available <= 0) {
      return res.status(403).json({ message: 'No scratch cards available. Refer more people!' });
    }

    // Generate a promo code
    // Random bonus links between 20 and 100
    const rewardValue = Math.floor(Math.random() * 81) + 20; // 20 to 100
    const promoCode = 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error: promoError } = await supabase
      .from('promo_codes')
      .insert([{
        code: promoCode,
        reward_value: rewardValue,
        user_id: req.user.id
      }]);

    if (promoError) throw promoError;

    // Increment milestones claimed
    await supabase
      .from('users')
      .update({ referral_milestones_claimed: (user.referral_milestones_claimed || 0) + 1 })
      .eq('id', req.user.id);

    res.json({ code: promoCode, value: rewardValue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redeemPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Promo code is required' });

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_used', false)
      .single();

    if (error || !promo) {
      return res.status(404).json({ message: 'Invalid or already used promo code' });
    }

    // Add reward to user
    const { data: user } = await supabase.from('users').select('link_limit').eq('id', req.user.id).single();
    const newLimit = (user.link_limit || 100) + promo.reward_value;

    await supabase.from('users').update({ link_limit: newLimit }).eq('id', req.user.id);
    await supabase.from('promo_codes').update({ 
      is_used: true, 
      used_by: req.user.id,
      used_at: new Date().toISOString()
    }).eq('id', promo.id);

    res.json({ 
      message: `Success! ${promo.reward_value} extra links added to your account.`,
      newLimit 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
