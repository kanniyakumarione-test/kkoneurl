const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth.middleware');
const { getAdminStats, getAllUsers, getAllLinks } = require('../controllers/admin.controller');

router.use(protect, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/links', getAllLinks);

module.exports = router;
