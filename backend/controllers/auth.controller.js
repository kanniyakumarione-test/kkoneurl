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
    
    // 🐣 Auto-provision profile if it doesn't exist
    if (error && (error.code === 'PGRST116' || error.message?.includes('not found'))) {
      const { data: newUser, error: createError } = await supabase.from('users').insert([{
        id: req.user.id,
        email: req.user.email,
        display_name: req.user.email?.split('@')[0] || 'User',
        username: 'user_' + Math.random().toString(36).substring(2, 7)
      }]).select().single();
      
      if (createError) {
        console.error('CRITICAL: Failed to auto-provision profile:', createError);
        return res.status(500).json({ message: 'Profile setup failed', details: createError.message });
      }
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
    const { displayName, bio, avatar, theme, bio_links, username } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: req.user.id,
        display_name: displayName,
        username,
        bio,
        avatar,
        theme,
        bio_links
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase.from('users').select('display_name, bio, avatar, theme, bio_links').eq('username', username).single();
    
    if (error || !data) return res.status(404).json({ message: 'Profile not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
