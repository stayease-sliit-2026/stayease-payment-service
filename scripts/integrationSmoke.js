const axios = require('axios');

const baseUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:4004';
const bearerToken = process.env.SMOKE_BEARER_TOKEN || 'demo-token';
const internalKey = process.env.INTERNAL_SERVICE_KEY || 'replace-this-with-strong-random-value';

async function run() {
  const bookingId = `BK-${Date.now()}`;
  const userId = 'USR1001';

  const authHeaders = {
    Authorization: `Bearer ${bearerToken}`,
  };

  const paymentPayload = {
    bookingId,
    userId,
    amount: 25000,
    currency: 'LKR',
    contact: {
      channel: 'email',
      destination: 'user@example.com',
    },
  };

  const paymentResponse = await axios.post(`${baseUrl}/payments`, paymentPayload, {
    headers: authHeaders,
  });
  console.log('1) Payment created:', paymentResponse.data.data.status);

  const paymentStatusResponse = await axios.get(`${baseUrl}/payments/${bookingId}`, {
    headers: authHeaders,
  });
  console.log('2) Payment fetched:', paymentStatusResponse.data.data.status);

  const notificationResponse = await axios.post(
    `${baseUrl}/notifications/send`,
    {
      userId,
      bookingId,
      paymentId: String(paymentResponse.data.data._id),
      channel: 'email',
      destination: 'user@example.com',
      message: 'Smoke test message',
    },
    {
      headers: {
        'x-internal-service-key': internalKey,
      },
    }
  );
  console.log('3) Internal notification:', notificationResponse.data.data.status);

  const historyResponse = await axios.get(`${baseUrl}/notifications/history?userId=${userId}`, {
    headers: authHeaders,
  });
  console.log('4) Notification history count:', historyResponse.data.data.length);

  const refundResponse = await axios.post(
    `${baseUrl}/payments/refund`,
    { bookingId, reason: 'Smoke test refund' },
    { headers: authHeaders }
  );
  console.log('5) Refund status:', refundResponse.data.data.status);

  console.log('Smoke test completed successfully');
}

run().catch((error) => {
  const status = error.response?.status;
  const data = error.response?.data;
  console.error('Smoke test failed', { status, data, message: error.message });
  process.exit(1);
});
