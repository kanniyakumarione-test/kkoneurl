const express = require('express');
const router = express.Router();
const { createBundle, getBundles, moveLinkToBundle, deleteBundle } = require('../controllers/bundle.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getBundles);
router.post('/', createBundle);
router.post('/move', moveLinkToBundle);
router.delete('/:id', deleteBundle);

module.exports = router;
