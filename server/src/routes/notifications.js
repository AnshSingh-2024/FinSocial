const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, notificationsController.getNotifications);
router.get('/unread-count', requireAuth, notificationsController.getUnreadCount);
router.patch('/:id/read', requireAuth, notificationsController.markRead);
router.patch('/read-all', requireAuth, notificationsController.markAllRead);

module.exports = router;
