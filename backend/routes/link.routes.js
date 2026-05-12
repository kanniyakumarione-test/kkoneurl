const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getLinks, deleteLink, toggleStatus } = require('../controllers/link.controller');
const { protect } = require('../middleware/auth.middleware');

const controller = require('../controllers/link.controller');

// Public routes
router.get('/stats/global', controller.getGlobalStats);
router.get('/:code', controller.redirectUrl);

// Protected routes
router.use(protect);
router.get('/', controller.getLinks);
router.post('/shorten', controller.shortenUrl);
router.get('/:id/analytics', controller.getLinkAnalytics);
router.delete('/:id', controller.deleteLink);
router.patch('/:id/toggle', controller.toggleStatus);

// 🚀 Developer API (Using API Key)
const apiKeyAuth = require('../middleware/apiKeyAuth');
router.post('/api/v1/shorten', apiKeyAuth, controller.shortenUrl);

module.exports = router;
