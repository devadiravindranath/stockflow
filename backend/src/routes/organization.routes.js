const express = require('express');
const organizationController = require('../controllers/organization.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all organization routes
router.use(protect);

router.post('/', organizationController.createOrganization);
router.get('/me', organizationController.getMyOrganization);

module.exports = router;
