const express = require('express');

const {
  createPayment,
  getPaymentStatus,
  issueRefund,
} = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  createPaymentValidator,
  bookingIdParamValidator,
  refundPaymentValidator,
} = require('../validators/paymentValidators');

const router = express.Router();

router.post('/', requireAuth, createPaymentValidator, validateRequest, createPayment);
router.get('/:bookingId', requireAuth, bookingIdParamValidator, validateRequest, getPaymentStatus);
router.post('/refund', requireAuth, refundPaymentValidator, validateRequest, issueRefund);

module.exports = router;
