const { body, query, oneOf } = require('express-validator');

const sendNotificationValidator = [
  oneOf(
    [
      [
        body('userId').isString().notEmpty(),
        body('bookingId').isString().notEmpty(),
        body('paymentId').isString().notEmpty(),
        body('channel').isIn(['email', 'sms']),
        body('destination').isString().notEmpty(),
        body('message').isString().isLength({ min: 5, max: 500 }),
      ],
      [
        body('userId').isString().notEmpty(),
        body('message').isString().isLength({ min: 5, max: 500 }),
        body('channel').optional().isIn(['email', 'sms']),
        body('destination').optional().isString().notEmpty(),
        body('subject').optional().isString().isLength({ min: 1, max: 200 }),
        body('type').optional().isString().isLength({ min: 1, max: 100 }),
      ],
    ],
    'Notification payload must match internal or booking-service format'
  ),
];

const notificationHistoryValidator = [
  query('userId').optional().isString().notEmpty(),
];

module.exports = {
  sendNotificationValidator,
  notificationHistoryValidator,
};
