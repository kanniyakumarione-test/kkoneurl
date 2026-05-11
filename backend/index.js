const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 1. CORS - Most permissive possible for debugging
app.use(cors());

// 2. Middleware
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(express.json());
app.use(morgan('dev'));

// 3. API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/links', require('./routes/link.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// 4. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 5. 🚀 Root Level Redirection
const { redirectUrl } = require('./controllers/link.controller');

app.get('/', (req, res) => {
  res.redirect('https://kkoneurlorig.vercel.app');
});

app.get('/:code', async (req, res, next) => {
  const { code } = req.params;
  
  if (req.path.startsWith('/api')) return next();
  if (code.includes('.') || code === '404') return next();

  const systemRoutes = ['dashboard', 'links', 'analytics', 'qr', 'bio', 'settings', 'login'];
  if (systemRoutes.includes(code) || code.startsWith('@')) {
    return res.redirect(`https://kkoneurlorig.vercel.app/${code}`);
  }

  await redirectUrl(req, res, next);
});

app.get('/404', (req, res) => {
  res.status(404).send('Link not found');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🛰️ Server running on port ${PORT}`);
  });
}

module.exports = app;
