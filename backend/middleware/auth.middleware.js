const firebaseAdmin = require('../config/firebase');
const supabase = require('../config/supabase');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    // 🛡️ Verify token directly with Firebase Admin
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach user info to request
    // Map Firebase fields to what the app expects
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      avatar: decodedToken.picture
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(401).json({ message: 'Unauthorized: Session expired or invalid' });
  }
};

exports.requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.email) return res.status(403).json({ message: 'Forbidden: Admin access required' });

    // Using email for lookup is safer during migration/initial Firebase setup
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', req.user.email)
      .single();

    if (error || !dbUser?.is_admin) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
