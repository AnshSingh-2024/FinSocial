const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { requireAuth } = require('../middleware/auth');

router.get('/mentors', requireAuth, socialController.getMentors);
router.get('/users/:userId', socialController.getUserProfile);
router.post('/users/:userId/follow', requireAuth, socialController.followUser);
router.delete('/users/:userId/follow', requireAuth, socialController.unfollowUser);

module.exports = router;
