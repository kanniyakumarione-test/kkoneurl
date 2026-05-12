const supabase = require('../config/supabase');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customSlug, title, password, expiresAt, tags, device_routing, geo_redirects } = req.body;
    
    // 🛡️ Global Limit Check (100 links max per user)
    const { count, error: countError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (countError) throw countError;
    if (count >= 100) {
      return res.status(403).json({ 
        message: 'Link limit reached (100/100). Please delete old links to create more.' 
      });
    }

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
        tags: tagsArray,
        device_routing: device_routing || {},
        geo_redirects: geo_redirects || {}
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
    const { password } = req.query;
    const userAgent = req.headers['user-agent'] || '';
    const ip = require('request-ip').getClientIp(req) || '0.0.0.0';

    if (!code) return res.redirect('https://kkoneurlorig.vercel.app');

    const { data: link, error } = await supabase.from('links').select('*').eq('short_code', code).single();

    if (error || !link || !link.is_active) {
      return res.redirect('https://kkoneurlorig.vercel.app/404');
    }

    // 1. 🛡️ Expiration Check
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.redirect('https://kkoneurlorig.vercel.app/404?error=expired');
    }

    // 2. 🛡️ Password Protection Gate
    if (link.password && link.password !== password) {
      return res.redirect(`https://kkoneurlorig.vercel.app/p/${code}`);
    }

    // 3. 📊 Analytics Tracking (Async - don't block redirect)
    const trackAnalytics = async () => {
      try {
        const ua = require('useragent').parse(userAgent);
        const device = ua.device.family === 'Other' ? (userAgent.includes('Mobile') ? 'mobile' : 'desktop') : ua.device.family.toLowerCase();
        const browser = ua.family.toLowerCase();
        const today = new Date().toISOString().split('T')[0];

        // Update Stats
        const device_stats = link.device_stats || { mobile: 0, desktop: 0, tablet: 0 };
        const browser_stats = link.browser_stats || {};
        const daily_clicks = link.daily_clicks || [];

        // Increment device
        if (device.includes('iphone') || device.includes('mobile')) device_stats.mobile = (device_stats.mobile || 0) + 1;
        else if (device.includes('ipad') || device.includes('tablet')) device_stats.tablet = (device_stats.tablet || 0) + 1;
        else device_stats.desktop = (device_stats.desktop || 0) + 1;

        // Increment browser
        browser_stats[browser] = (browser_stats[browser] || 0) + 1;

        // Daily clicks
        const dayIdx = daily_clicks.findIndex(d => d.date === today);
        if (dayIdx > -1) daily_clicks[dayIdx].clicks += 1;
        else daily_clicks.push({ date: today, clicks: 1 });

        // Milestone Notification Check
        const totalClicks = (link.clicks || 0) + 1;
        const milestones = [10, 50, 100, 500, 1000, 5000];
        if (milestones.includes(totalClicks)) {
          await supabase.from('notifications').insert([{
            user_id: link.user_id,
            type: 'milestone',
            title: 'Link Milestone Reached! 🎉',
            message: `Your link "${link.title || code}" has reached ${totalClicks} clicks!`
          }]);
        }

        await supabase.from('links').update({
          clicks: totalClicks,
          device_stats,
          browser_stats,
          daily_clicks: daily_clicks.slice(-30) // Keep last 30 days
        }).eq('id', link.id);
      } catch (err) {
        console.error('Analytics Error:', err);
      }
    };
    trackAnalytics();

    // 4. 🌍 Geo-Redirects & 📱 Device Routing & 🧪 A/B Testing
    let finalUrl = link.original_url;

    // A/B Testing
    if (link.ab_test && link.ab_test.enabled && link.ab_test.url_b) {
      const split = link.ab_test.split || 50;
      if (Math.random() * 100 > split) {
        finalUrl = link.ab_test.url_b;
      }
    }

    // Device Routing (Smart detection)
    if (link.device_routing) {
      if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
        if (link.device_routing.ios) finalUrl = link.device_routing.ios;
      } else if (userAgent.includes('Android')) {
        if (link.device_routing.android) finalUrl = link.device_routing.android;
      } else if (userAgent.includes('Mobi')) {
        if (link.device_routing.mobile) finalUrl = link.device_routing.mobile;
      }
    }

    // Geo-Redirects (Placeholder for now, requires a Geo-IP lookup)
    // if (link.geo_redirects && link.geo_redirects[countryCode]) { ... }

    res.redirect(finalUrl);
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
