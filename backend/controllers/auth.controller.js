const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kkoneurl_secret_key', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const { data: user, error } = await supabase.from('users').insert([{ email, password, display_name: displayName }]).select().single();
    if (error) throw error;

    res.status(201).json({
      _id: user.id,
      email: user.email,
      displayName: user.display_name,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    
    if (error || !user) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: user.id,
      email: user.email,
      displayName: user.display_name,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    
    if (error && (error.code === 'PGRST116' || error.message?.includes('not found'))) {
      const { data: newUser, error: createError } = await supabase.from('users').insert([{
        id: req.user.id,
        email: req.user.email,
        display_name: req.user.email?.split('@')[0] || 'User',
        username: 'user_' + Math.random().toString(36).substring(2, 7)
      }]).select().single();
      
      if (createError) throw createError;
      return res.json(newUser);
    }
    
    if (error) throw error;
    res.json(user);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio, avatar, theme, bio_links, username, settings } = req.body;
    
    // 🛡️ Username Change Policy (60 Days)
    const { data: current, error: fetchError } = await supabase.from('users').select('username, username_last_changed').eq('id', req.user.id).single();
    if (fetchError) throw fetchError;

    let updateData = {
      display_name: displayName,
      bio,
      avatar,
      theme,
      bio_links,
      settings, // ⚙️ Store preferences
      email: req.user.email
    };

    if (username && username !== current.username) {
      const lastChanged = new Date(current.username_last_changed);
      const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;
      const now = new Date();

      if (now - lastChanged < sixtyDaysInMs) {
        const daysRemaining = Math.ceil((sixtyDaysInMs - (now - lastChanged)) / (24 * 60 * 60 * 1000));
        return res.status(403).json({ 
          message: `Username can only be changed once every 60 days. Wait ${daysRemaining} more days.`,
          daysRemaining 
        });
      }

      updateData.username = username.replace(/\s+/g, '_').toLowerCase();
      updateData.username_last_changed = now.toISOString();
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // 1. Delete all user links (Cascade might handle this but we do it explicitly to be safe)
    await supabase.from('links').delete().eq('user_id', req.user.id);
    
    // 2. Delete user profile
    const { error } = await supabase.from('users').delete().eq('id', req.user.id);
    if (error) throw error;

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase.from('users').select('display_name, bio, avatar, theme, bio_links, settings').eq('username', username).single();
    
    if (error || !data) return res.status(404).json({ message: 'Profile not found' });
    
    // 🛡️ Respect "Public Profile" setting
    if (data.settings && data.settings.publicProfile === false) {
        return res.status(403).json({ message: 'This profile is private' });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // 1. Fetch current user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password, password_last_changed')
      .eq('id', req.user.id)
      .single();
    
    if (fetchError) {
      console.error('Fetch User Error:', fetchError);
      return res.status(500).json({ message: `Database error: ${fetchError.message}` });
    }
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // 2. Verify Old Password
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: 'Current password does not match' });
    }

    // 3. 🛡️ 30-Day Policy
    const lastChanged = new Date(user.password_last_changed || 0);
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();

    if (now - lastChanged < thirtyDaysInMs) {
      const daysRemaining = Math.ceil((thirtyDaysInMs - (now - lastChanged)) / (24 * 60 * 60 * 1000));
      return res.status(403).json({ 
        message: `Password can only be changed once every 30 days. Wait ${daysRemaining} more days.`,
        daysRemaining 
      });
    }

    // 4. Update Password
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: newPassword,
        password_last_changed: now.toISOString()
      })
      .eq('id', req.user.id);

    if (updateError) throw updateError;

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ message: err.message });
  }
};
