const crypto = require('crypto');
const Payment = require('../models/Payment');
const { sendNotification } = require('./notificationService');

function resolvePaymentStatus() {
  const randomValue = Math.random();
  return randomValue < 0.9 ? 'success' : 'failed';
}

function buildTransactionId() {
  return `TXN-${crypto.randomUUID()}`;
}

async function processPayment(payload) {
  const transactionId = buildTransactionId();
  const status = resolvePaymentStatus();

  const payment = await Payment.create({
    bookingId: payload.bookingId,
    userId: payload.userId,
    amount: payload.amount,
    currency: (payload.currency || 'LKR').toUpperCase(),
    transactionId,
    status,
  });

  if (status === 'success' && payload.contact?.channel && payload.contact?.destination) {
    await sendNotification({
      userId: payload.userId,
      bookingId: payload.bookingId,
      paymentId: String(payment._id),
      channel: payload.contact.channel,
      destination: payload.contact.destination,
      message: `Your payment was successful for booking ${payload.bookingId}. Transaction: ${transactionId}`,
    });
  }

  return payment;
}

async function getPaymentByBookingId(bookingId) {
  return Payment.findOne({ bookingId }).sort({ createdAt: -1 }).lean();
}

async function refundPayment(bookingId) {
  const payment = await Payment.findOne({ bookingId }).sort({ createdAt: -1 });

  if (!payment) {
    return null;
  }

  payment.status = 'refunded';
  await payment.save();

  return payment;
}

module.exports = {
  processPayment,
  getPaymentByBookingId,
  refundPayment,
};
