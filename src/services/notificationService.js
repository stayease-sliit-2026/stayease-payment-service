const Notification = require('../models/Notification');

async function sendNotification(payload) {
  const status = 'sent';

  const notification = await Notification.create({
    userId: payload.userId,
    bookingId: payload.bookingId,
    paymentId: payload.paymentId,
    channel: payload.channel,
    destination: payload.destination,
    message: payload.message,
    status,
  });

  return notification;
}

module.exports = {
  sendNotification,
};
