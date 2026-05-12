const supabase = require('../config/supabase');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    // 🛡️ Verify token directly with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Session expired' });
  }
};

exports.requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.email) return res.status(403).json({ message: 'Forbidden: Admin access required' });

    const { data: dbUser, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', req.user.id)
      .single();

    if (error || !dbUser?.is_admin) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
