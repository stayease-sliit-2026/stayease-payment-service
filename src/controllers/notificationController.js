const Notification = require('../models/Notification');
const { sendNotification } = require('../services/notificationService');

function normalizeNotificationPayload(payload) {
  const userId = payload.userId;
  const bookingId = payload.bookingId || payload.referenceId || 'unknown-booking';
  const paymentId = payload.paymentId || 'unknown-payment';
  const channel = payload.channel || 'email';
  const destination = payload.destination || `user:${userId}`;
  const messageParts = [payload.subject, payload.message].filter(Boolean);

  return {
    userId,
    bookingId,
    paymentId,
    channel,
    destination,
    message: messageParts.join(' - '),
  };
}

async function createNotification(req, res, next) {
  try {
    const notificationPayload = normalizeNotificationPayload(req.body);
    const notification = await sendNotification(notificationPayload);

    return res.status(201).json({
      success: true,
      message: 'Notification sent',
      data: notification,
    });
  } catch (error) {
    return next(error);
  }
}

async function getNotificationHistory(req, res, next) {
  try {
    const userId = req.query.userId || req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId query parameter is required',
      });
    }

    const history = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createNotification,
  getNotificationHistory,
};
