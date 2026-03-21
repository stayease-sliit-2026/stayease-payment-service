const {
  processPayment,
  getPaymentByBookingId,
  refundPayment,
} = require('../services/paymentService');

async function createPayment(req, res, next) {
  try {
    const payment = await processPayment(req.body);

    return res.status(201).json({
      success: true,
      message: 'Payment processed',
      data: payment,
    });
  } catch (error) {
    return next(error);
  }
}

async function getPaymentStatus(req, res, next) {
  try {
    const payment = await getPaymentByBookingId(req.params.bookingId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for booking',
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return next(error);
  }
}

async function issueRefund(req, res, next) {
  try {
    const payment = await refundPayment(req.body.bookingId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for booking',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Refund issued',
      data: payment,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPayment,
  getPaymentStatus,
  issueRefund,
};
