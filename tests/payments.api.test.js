jest.mock('../src/services/authService', () => ({
  verifyUserToken: jest.fn(),
}));

jest.mock('../src/services/paymentService', () => ({
  processPayment: jest.fn(),
  getPaymentByBookingId: jest.fn(),
  refundPayment: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');
const { verifyUserToken } = require('../src/services/authService');
const {
  processPayment,
  getPaymentByBookingId,
  refundPayment,
} = require('../src/services/paymentService');

describe('Payment API', () => {
  beforeEach(() => {
    verifyUserToken.mockResolvedValue({ userId: 'USR1001', role: 'guest' });
  });

  it('creates a payment', async () => {
    processPayment.mockResolvedValue({
      _id: 'pay-1',
      bookingId: 'BK1001',
      userId: 'USR1001',
      amount: 20000,
      currency: 'LKR',
      status: 'success',
    });

    const response = await request(app)
      .post('/payments')
      .set('Authorization', 'Bearer token')
      .send({ bookingId: 'BK1001', userId: 'USR1001', amount: 20000, currency: 'LKR' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.bookingId).toBe('BK1001');
  });

  it('returns payment by booking id', async () => {
    getPaymentByBookingId.mockResolvedValue({ bookingId: 'BK1001', status: 'success' });

    const response = await request(app)
      .get('/payments/BK1001')
      .set('Authorization', 'Bearer token');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.status).toBe('success');
  });

  it('refunds a payment', async () => {
    refundPayment.mockResolvedValue({ bookingId: 'BK1001', status: 'refunded' });

    const response = await request(app)
      .post('/payments/refund')
      .set('Authorization', 'Bearer token')
      .send({ bookingId: 'BK1001' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.status).toBe('refunded');
  });

  it('rejects unauthorized requests', async () => {
    const response = await request(app)
      .post('/payments')
      .send({ bookingId: 'BK1001', userId: 'USR1001', amount: 20000, currency: 'LKR' });

    expect(response.statusCode).toBe(401);
  });
});
