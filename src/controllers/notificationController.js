const Notification = require('../models/Notification');
const { sendNotification } = require('../services/notificationService');

async function createNotification(req, res, next) {
  try {
    const notification = await sendNotification(req.body);

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
