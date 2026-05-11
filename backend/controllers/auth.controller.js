const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kkoneurl_secret_key', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Check exists
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase.from('users').insert([{
      email,
      password: hashedPassword,
      display_name: displayName
    }]).select().single();

    if (error) throw error;

    res.status(201).json({
      _id: user.id,
      email: user.email,
      displayName: user.display_name,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    
    if (error || !user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user.id,
      email: user.email,
      displayName: user.display_name,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
  if (error) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio, avatar, theme, bio_links, username } = req.body;
    const { data: user, error } = await supabase
      .from('users')
      .update({ 
        display_name: displayName, 
        bio, 
        avatar, 
        theme, 
        bio_links,
        username 
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { data: user, error } = await supabase
      .from('users')
      .select('display_name, bio, avatar, theme, bio_links, username')
      .eq('username', username)
      .single();

    if (error || !user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
