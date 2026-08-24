const request = require('supertest');
const app = require('../server-api');

describe('KPPSM API', () => {
  test('POST /api/v1/auth/login succeeds with valid admin credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@kppsm.com',
        password: 'admin123'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.access_token).toBeTruthy();
    expect(response.body.data.user.role).toBe('admin');
  });

  test('GET /api/v1/health returns app status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.status).toBe('ok');
  });
});
