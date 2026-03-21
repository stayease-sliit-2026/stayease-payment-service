const request = require('supertest');
const app = require('../src/app');

describe('Health API', () => {
  it('returns service status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.service).toBe('stayease-payment-service');
    expect(response.body.status).toBe('ok');
  });
});
