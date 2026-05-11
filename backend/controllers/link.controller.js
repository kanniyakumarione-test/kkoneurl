const supabase = require('../config/supabase');
const useragent = require('useragent');
const requestIp = require('request-ip');
const axios = require('axios');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customSlug, title, password, expiresAt, tags } = req.body;
    const shortCode = customSlug || Math.random().toString(36).substring(2, 8);
    
    // Convert tags string to array if needed
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
    const { data: link, error } = await supabase.from('links').select('*').eq('short_code', code).single();

    if (error || !link || !link.is_active) return res.redirect('/404');

    // 🕵️ Advanced Tracking Logic
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = requestIp.getClientIp(req);
    const today = new Date().toISOString().split('T')[0];

    // 1. Device Stats
    const device = agent.device.toString().toLowerCase().includes('mobile') ? 'mobile' : 'desktop';
    const deviceStats = link.device_stats || { mobile: 0, desktop: 0, tablet: 0 };
    deviceStats[device] = (deviceStats[device] || 0) + 1;

    // 2. Browser Stats
    const browser = agent.family;
    const browserStats = link.browser_stats || {};
    browserStats[browser] = (browserStats[browser] || 0) + 1;

    // 3. Daily Clicks
    let dailyClicks = link.daily_clicks || [];
    const dayEntry = dailyClicks.find(d => d.date === today);
    if (dayEntry) {
      dayEntry.clicks += 1;
    } else {
      dailyClicks.push({ date: today, clicks: 1 });
    }
    // Keep only last 30 days
    if (dailyClicks.length > 30) dailyClicks.shift();

    // 4. Update Database
    await supabase.from('links').update({
      clicks: link.clicks + 1,
      device_stats: deviceStats,
      browser_stats: browserStats,
      daily_clicks: dailyClicks
    }).eq('id', link.id);

    res.redirect(link.original_url);
  } catch (err) {
    res.redirect('/');
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
