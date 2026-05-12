const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteAccount, getPublicProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/generate-api-key', protect, require('../controllers/auth.controller').generateApiKey);
router.delete('/delete-account', protect, deleteAccount);
router.get('/public/:username', getPublicProfile);

module.exports = router;
