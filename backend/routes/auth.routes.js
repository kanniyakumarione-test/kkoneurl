const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getPublicProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/delete-account', protect, deleteAccount);
router.get('/public/:username', getPublicProfile);

module.exports = router;
