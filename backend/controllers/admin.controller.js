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
      totalClicks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, display_name, username, is_admin, created_at')
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
