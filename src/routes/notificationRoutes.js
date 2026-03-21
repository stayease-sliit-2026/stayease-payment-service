const express = require('express');

const {
  createNotification,
  getNotificationHistory,
} = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireInternalServiceKey } = require('../middleware/internalServiceAuth');
const { validateRequest } = require('../middleware/validateRequest');
const {
  sendNotificationValidator,
  notificationHistoryValidator,
} = require('../validators/notificationValidators');

const router = express.Router();

router.post('/send', requireInternalServiceKey, sendNotificationValidator, validateRequest, createNotification);
router.get('/history', requireAuth, notificationHistoryValidator, validateRequest, getNotificationHistory);

module.exports = router;
