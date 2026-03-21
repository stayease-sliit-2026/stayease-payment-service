const { body, param } = require('express-validator');

const createPaymentValidator = [
  body('bookingId').isString().notEmpty(),
  body('userId').isString().notEmpty(),
  body('amount').isFloat({ gt: 0 }),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }),
  body('paymentMethodId').optional().isString().notEmpty(),
  body('contact.channel').optional().isIn(['email', 'sms']),
  body('contact.destination').optional().isString().notEmpty(),
];

const bookingIdParamValidator = [
  param('bookingId').isString().notEmpty(),
];

const refundPaymentValidator = [
  body('bookingId').isString().notEmpty(),
  body('reason').optional().isString().isLength({ min: 3, max: 250 }),
];

module.exports = {
  createPaymentValidator,
  bookingIdParamValidator,
  refundPaymentValidator,
};
