jest.mock('../src/services/authService', () => ({
  verifyUserToken: jest.fn(),
}));

jest.mock('../src/services/notificationService', () => ({
  sendNotification: jest.fn(),
}));

jest.mock('../src/models/Notification', () => ({
  find: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const { verifyUserToken } = require('../src/services/authService');
const { sendNotification } = require('../src/services/notificationService');
const Notification = require('../src/models/Notification');

describe('Notification API', () => {
  beforeEach(() => {
    process.env.INTERNAL_SERVICE_KEY = 'internal-secret';
    verifyUserToken.mockResolvedValue({ userId: 'USR1001', role: 'guest' });
  });

  it('creates an internal notification', async () => {
    sendNotification.mockResolvedValue({
      _id: 'note-1',
      userId: 'USR1001',
      channel: 'email',
      status: 'sent',
    });

    const response = await request(app)
      .post('/notifications/send')
      .set('x-internal-service-key', 'internal-secret')
      .send({
        userId: 'USR1001',
        bookingId: 'BK1001',
        paymentId: 'pay-1',
        channel: 'email',
        destination: 'user@example.com',
        message: 'Payment successful',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('rejects invalid internal service key', async () => {
    const response = await request(app)
      .post('/notifications/send')
      .set('x-internal-service-key', 'wrong-key')
      .send({
        userId: 'USR1001',
        bookingId: 'BK1001',
        paymentId: 'pay-1',
        channel: 'email',
        destination: 'user@example.com',
        message: 'Payment successful',
      });

    expect(response.statusCode).toBe(403);
  });

  it('returns user notification history', async () => {
    Notification.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ userId: 'USR1001', channel: 'email' }]),
      }),
    });

    const response = await request(app)
      .get('/notifications/history?userId=USR1001')
      .set('Authorization', 'Bearer token');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].userId).toBe('USR1001');
  });
});
