const firebaseAdmin = require('../config/firebase');
const supabase = require('../config/supabase');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'aigenerator2k@gmail.com').toLowerCase();

const generateUsername = () => `user_${Math.random().toString(36).substring(2, 7)}`;

const findOrCreateDbUser = async ({ email, name, avatar }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail) throw new Error('Missing email in Firebase token');

  const { data: existing, error: lookupError } = await supabase
    .from('users')
    .select('id, email, display_name, username, avatar, is_admin, plan, is_banned')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existing?.id) return existing;

  let createdUser = null;
  let lastError = null;

  // Retry username generation on rare uniqueness collisions.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const username = generateUsername();
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: normalizedEmail,
        display_name: name || normalizedEmail.split('@')[0] || 'User',
        username,
        username_customized: false,
        avatar: avatar || null,
        is_admin: normalizedEmail === ADMIN_EMAIL
      }])
      .select('id, email, display_name, username, avatar, is_admin, plan')
      .single();

    if (!error && data?.id) {
      createdUser = data;
      break;
    }

    lastError = error;
    if (!error?.message?.toLowerCase?.().includes('duplicate key')) break;
  }

  if (!createdUser) throw (lastError || new Error('Failed to create user'));
  return createdUser;
};

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

    const dbUser = await findOrCreateDbUser({
      email: decodedToken.email,
      name: decodedToken.name,
      avatar: decodedToken.picture
    });
    
    if (dbUser.is_banned) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    // Attach user info to request
    // Always use Supabase UUID as req.user.id to match DB schema.
    req.user = {
      id: dbUser.id,
      firebaseUid: decodedToken.uid,
      email: dbUser.email || decodedToken.email,
      name: dbUser.display_name || decodedToken.name,
      avatar: dbUser.avatar || decodedToken.picture,
      isAdmin: dbUser.is_admin === true,
      plan: dbUser.plan || 'free'
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
