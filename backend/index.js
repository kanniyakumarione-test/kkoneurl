const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 1. CORS - Must be first
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 2. Middleware
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(express.json());
app.use(morgan('dev'));

// 3. Health Check (Must be before redirection)
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 4. API Routes (Must be before redirection)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));

// 5. 🚀 Root Level Redirection
const { redirectUrl } = require('./controllers/link.controller');

app.get('/:code', (req, res, next) => {
  const { code } = req.params;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://kkoneurlorig.vercel.app';
  
  // 🛡️ SECURITY: If it starts with /api, STOP HERE and let Express handle it above
  if (req.path.startsWith('/api')) return next();

  const systemRoutes = ['dashboard', 'links', 'analytics', 'qr', 'bio', 'settings', 'login', '404'];
  
  // Handle Bio Pages (@username)
  if (code.startsWith('@')) {
    return res.redirect(`${FRONTEND_URL}/${code}`);
  }

  // Handle System Routes (Redirect to Frontend)
  if (systemRoutes.includes(code)) {
    return res.redirect(`${FRONTEND_URL}/${code}`);
  }

  // Ignore files (favicon.ico, etc)
  if (code.includes('.')) return next();

  // Process as short link
  redirectUrl(req, res, next);
});

// 6. Proper 404 Fallback
app.get('/404', (req, res) => {
  res.status(404).send('<h1>404 - Link Not Found</h1><p>The link you followed is inactive or does not exist.</p><a href="/">Go Home</a>');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🛰️ Server running on port ${PORT}`);
  });
}

module.exports = app;
