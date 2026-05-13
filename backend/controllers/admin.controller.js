const supabase = require('../config/supabase');

exports.getAdminStats = async (req, res) => {
  try {
    const { count: totalUsers, error: usersCountError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (usersCountError) throw usersCountError;

    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('clicks');
    if (linksError) throw linksError;

    const totalLinks = Array.isArray(links) ? links.length : 0;
    const totalClicks = (links || []).reduce((sum, link) => sum + (link.clicks || 0), 0);

    res.json({
      totalUsers: totalUsers || 0,
      totalLinks,
      totalClicks,
      totalPro: (await supabase.from('users').select('*', { count: 'exact', head: true }).eq('plan', 'pro')).count || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, display_name, username, is_admin, plan, is_banned, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('id, user_id, title, short_code, original_url, clicks, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json((data || []).map((link) => ({ ...link, _id: link.id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    if (!['free', 'pro'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ 
        plan,
        pro_until: plan === 'pro' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.toggleUserBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: user } = await supabase.from('users').select('is_banned').eq('id', id).single();
    const { error } = await supabase.from('users').update({ is_banned: !user.is_banned }).eq('id', id);
    if (error) throw error;
    res.json({ success: true, is_banned: !user.is_banned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserVerify = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: user } = await supabase.from('users').select('is_verified').eq('id', id).single();
    const { error } = await supabase.from('users').update({ is_verified: !user.is_verified }).eq('id', id);
    if (error) throw error;
    res.json({ success: true, is_verified: !user.is_verified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGrowthStats = async (req, res) => {
  try {
    // Get users grouped by date for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo);
    
    if (error) throw error;

    const chartData = data.reduce((acc, user) => {
      const date = new Date(user.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json(Object.entries(chartData).map(([date, count]) => ({ date, count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
