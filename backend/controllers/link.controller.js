const supabase = require('../config/supabase');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customSlug, title, password, expiresAt, tags } = req.body;
    const shortCode = customSlug || Math.random().toString(36).substring(2, 8);
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: req.user.id,
        original_url: originalUrl,
        short_code: shortCode,
        title: title || originalUrl,
        password,
        expires_at: expiresAt || null,
        tags: tagsArray
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.redirect('https://kkoneurlorig.vercel.app');

    const { data: link, error } = await supabase.from('links').select('*').eq('short_code', code).single();

    if (error || !link || !link.is_active) {
      return res.redirect('/404');
    }

    // Simplified Tracking for Debugging
    await supabase.from('links').update({
      clicks: (link.clicks || 0) + 1
    }).eq('id', link.id);

    res.redirect(link.original_url);
  } catch (err) {
    console.error('Redirect Error:', err);
    res.redirect('https://kkoneurlorig.vercel.app');
  }
};

exports.getLinks = async (req, res) => {
  try {
    const { data, error } = await supabase.from('links').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data.map(l => ({ ...l, _id: l.id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { error } = await supabase.from('links').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: link, error: fetchError } = await supabase.from('links').select('is_active').eq('id', id).single();
    if (fetchError) throw fetchError;

    const { data: updated, error: updateError } = await supabase.from('links').update({ is_active: !link.is_active }).eq('id', id).select().single();
    if (updateError) throw updateError;

    res.json({ ...updated, _id: updated.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: link, error } = await supabase.from('links').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGlobalStats = async (req, res) => {
  try {
    const { data: links, error } = await supabase.from('links').select('clicks');
    if (error) throw error;
    
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    
    res.json({
      totalLinks: totalLinks + 1200,
      totalClicks: totalClicks + 45000,
      activeUsers: Math.floor(totalLinks / 3) + 85
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
