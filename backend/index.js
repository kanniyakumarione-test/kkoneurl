const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for easier development with external APIs
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));

// 🚀 Root Level Redirection
const { redirectUrl } = require('./controllers/link.controller');

// 1. Redirect Bio Pages and System routes to the frontend
app.get('/:code', (req, res, next) => {
  const { code } = req.params;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://kkoneurlorig.vercel.app';
  const systemRoutes = ['api', 'dashboard', 'links', 'analytics', 'qr', 'bio', 'settings', 'login', '404'];
  
  // If it's a Bio Page (@username)
  if (code.startsWith('@')) {
    return res.redirect(`${FRONTEND_URL}/${code}`);
  }

  // If it's a system route or has a file extension
  if (code.includes('.') || systemRoutes.includes(code)) {
    return res.redirect(`${FRONTEND_URL}/${code}`);
  }

  // 2. Process as short link
  redirectUrl(req, res, next);
});

// 4. Proper 404 Fallback to prevent loops
app.get('/404', (req, res) => {
  res.status(404).send('<h1>404 - Link Not Found</h1><p>The link you followed is inactive or does not exist.</p><a href="/">Go Home</a>');
});

// The frontend handles the root / via Vercel routing

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🛰️ Server running on port ${PORT}`);
    console.log(`📡 Connected to Supabase`);
  });
}

module.exports = app;
