const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth');
const { validateSettings } = require('../validators/settings.validator');

// Apply protect middleware
router.use(protect);

router.get('/', settingsController.getSettings);
router.put('/', validateSettings, settingsController.updateSettings);

module.exports = router;
