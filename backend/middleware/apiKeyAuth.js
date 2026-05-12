const supabase = require('../config/supabase');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required in x-api-key header' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('api_key', apiKey)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  req.user = user;
  next();
};

module.exports = apiKeyAuth;
