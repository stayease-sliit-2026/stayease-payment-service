const { body, query } = require('express-validator');

const sendNotificationValidator = [
  body('userId').isString().notEmpty(),
  body('bookingId').isString().notEmpty(),
  body('paymentId').isString().notEmpty(),
  body('channel').isIn(['email', 'sms']),
  body('destination').isString().notEmpty(),
  body('message').isString().isLength({ min: 5, max: 500 }),
];

const notificationHistoryValidator = [
  query('userId').optional().isString().notEmpty(),
];

module.exports = {
  sendNotificationValidator,
  notificationHistoryValidator,
};
