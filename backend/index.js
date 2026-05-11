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
app.get('/:code', redirectUrl);

app.get('/', (req, res) => res.json({ message: 'kkoneurl API v1.0 (Supabase Powered)' }));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🛰️ Server running on port ${PORT}`);
    console.log(`📡 Connected to Supabase`);
  });
}

module.exports = app;
