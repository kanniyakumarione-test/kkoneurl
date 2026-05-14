const supabase = require('../config/supabase');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customSlug, title, password, expiresAt, tags, device_routing, geo_redirects } = req.body;
    
    // 🛡️ Pro Only: Custom Slugs (Admin Bypass)
    if (customSlug && req.user.plan !== 'pro' && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Custom slugs are a Pro feature. Upgrade to choose your own link names!' 
      });
    }
    
    // 🛡️ Plan-based Limit Check (Admin Bypass)
    if (req.user.plan !== 'pro' && !req.user.isAdmin) {
      const { count, error: countError } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id);

      if (countError) throw countError;
      const limit = req.user.linkLimit || 100;
      if (count >= limit) {
        return res.status(403).json({ 
          message: `Link limit reached (${count}/${limit}). Refer friends or upgrade to Pro for more links!` 
        });
      }
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

    if (!code) return res.redirect('https://kkoneurl.kanniyakumarione.com');
    
    // Fetch link with owner's plan info
    const { data: link, error } = await supabase
      .from('links')
      .select('*, users(plan, is_admin)') // Removed !inner to prevent 404 if join is tricky
      .eq('short_code', code)
      .single();

    if (error || !link || !link.is_active) {
      return res.redirect('https://kkoneurl.kanniyakumarione.com/404');
    }

    // 1. 🛡️ Expiration Check
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.redirect('https://kkoneurl.kanniyakumarione.com/404?error=expired');
    }

    // 2. 🛡️ Password Protection Gate
    if (link.password && link.password !== password) {
      return res.redirect(`https://kkoneurl.kanniyakumarione.com/p/${code}`);
    }

    // 3. 📊 Analytics Tracking (Immediate update)
    const trackAnalytics = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Prepare stats
        const device_stats = link.device_stats || { mobile: 0, desktop: 0, tablet: 0 };
        const browser_stats = link.browser_stats || {};
        const daily_clicks = link.daily_clicks || [];
        const geo_stats = link.geo_stats || {};
        const recent_ips = link.recent_ips || [];

        // 🛡️ Unique Click Detection
        const isUnique = !recent_ips.includes(ip);
        if (isUnique) {
          recent_ips.push(ip);
          if (recent_ips.length > 100) recent_ips.shift();
        }

        // 📱 Device & Browser Detection
        const ua = require('useragent').parse(userAgent);
        const device = ua.device.family === 'Other' ? (userAgent.includes('Mobile') ? 'mobile' : 'desktop') : ua.device.family.toLowerCase();
        const browser = ua.family.toLowerCase();

        if (device.includes('iphone') || device.includes('mobile')) device_stats.mobile = (device_stats.mobile || 0) + 1;
        else if (device.includes('ipad') || device.includes('tablet')) device_stats.tablet = (device_stats.tablet || 0) + 1;
        else device_stats.desktop = (device_stats.desktop || 0) + 1;

        browser_stats[browser] = (browser_stats[browser] || 0) + 1;

        // Daily clicks
        const dayIdx = daily_clicks.findIndex(d => d.date === today);
        if (dayIdx > -1) daily_clicks[dayIdx].clicks += 1;
        else daily_clicks.push({ date: today, clicks: 1 });

        const totalClicks = (link.clicks || 0) + 1;
        const totalUnique = (link.unique_clicks || 0) + (isUnique ? 1 : 0);

        // Update DB (Immediate)
        await supabase.from('links').update({
          clicks: totalClicks,
          unique_clicks: totalUnique,
          device_stats,
          browser_stats,
          recent_ips,
          daily_clicks: daily_clicks.slice(-30)
        }).eq('id', link.id);

        // 🌍 Geo Location (Separate background task)
        (async () => {
          try {
            const axios = require('axios');
            const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`).catch(() => null);
            if (geoRes?.data?.country_name) {
              const country = geoRes.data.country_name;
              const { data: latestLink } = await supabase.from('links').select('geo_stats').eq('id', link.id).single();
              const latestGeo = latestLink?.geo_stats || {};
              latestGeo[country] = (latestGeo[country] || 0) + 1;
              await supabase.from('links').update({ geo_stats: latestGeo }).eq('id', link.id);
            }
          } catch (gErr) {
            console.error('Geo Update Failed:', gErr.message);
          }
        })();

        // Milestone Notification
        const milestones = [10, 50, 100, 500, 1000, 5000];
        if (milestones.includes(totalClicks)) {
          await supabase.from('notifications').insert([{
            user_id: link.user_id,
            type: 'milestone',
            title: 'Link Milestone Reached! 🎉',
            message: `Your link "${link.title || code}" has reached ${totalClicks} clicks!`
          }]);
        }
      } catch (err) {
        console.error('Analytics Tracking Error:', err.message);
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

    // 5. 🚀 THE AD-GATE (Monetization Logic)
    // If the owner is not Pro, we redirect to the frontend gate page first.
    // Except if it's already a direct redirect request (we could add a param to skip, but let's keep it simple)
    const ownerPlan = link.users?.plan || 'free';
    const isOwnerAdmin = link.users?.is_admin || false;
    
    const host = req.get('host');
    const protocol = req.protocol;
    const frontendUrl = `${protocol}://${host.replace('api.', '')}`; // Attempt to detect frontend URL

    if (ownerPlan !== 'pro' && !isOwnerAdmin) {
      return res.redirect(`${frontendUrl}/gate/${code}`);
    }

    res.redirect(finalUrl);
  } catch (err) {
    console.error('Redirect Error:', err);
    res.redirect('https://kkoneurl.kanniyakumarione.com');
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

exports.getPublicLinkInfo = async (req, res) => {
  try {
    const { code } = req.params;
    const { data: link, error } = await supabase
      .from('links')
      .select('short_code, original_url, title, password, device_routing, users(plan)')
      .eq('short_code', code)
      .single();

    if (error || !link) return res.status(404).json({ message: 'Link not found' });
    
    // Logic for device routing / A/B testing can be replicated here if needed for the final destination
    // But for now, just return the data.
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

