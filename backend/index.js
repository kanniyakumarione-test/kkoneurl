const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 1. Move CORS to the VERY TOP
app.use(cors({
  origin: '*', // Temporarily allow all during debug to break the block
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// 2. Middleware
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(express.json());
app.use(morgan('dev'));

// 3. API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));

// 4. 🚀 Root Level Redirection
const { redirectUrl } = require('./controllers/link.controller');

app.get('/:code', (req, res, next) => {
  const { code } = req.params;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://kkoneurlorig.vercel.app';
  const systemRoutes = ['api', 'dashboard', 'links', 'analytics', 'qr', 'bio', 'settings', 'login', '404'];
  
  if (code.includes('.') || systemRoutes.includes(code) || code.startsWith('@')) {
    if (code.startsWith('@')) return res.redirect(`${FRONTEND_URL}/${code}`);
    if (systemRoutes.includes(code)) return res.redirect(`${FRONTEND_URL}/${code}`);
    return next();
  }

  redirectUrl(req, res, next);
});

app.get('/404', (req, res) => {
  res.status(404).send('<h1>404 - Link Not Found</h1><p>The link you followed is inactive or does not exist.</p><a href="/">Go Home</a>');
});

// 5. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🛰️ Server running on port ${PORT}`);
  });
}

module.exports = app;
