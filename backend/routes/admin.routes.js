const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth.middleware');
const { getAdminStats, getAllUsers, getAllLinks, updateUserPlan, toggleUserBan, toggleUserVerify, getGrowthStats } = require('../controllers/admin.controller');

router.use(protect, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/plan', updateUserPlan);
router.patch('/users/:id/ban', toggleUserBan);
router.patch('/users/:id/verify', toggleUserVerify);
router.get('/links', getAllLinks);
router.get('/growth', getGrowthStats);

module.exports = router;
