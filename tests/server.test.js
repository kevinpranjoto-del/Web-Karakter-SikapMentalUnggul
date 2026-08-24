const request = require('supertest');
const app = require('../src/server-api');

describe('KPPSM API Test Suite', () => {
  let adminToken = '';

  // 1. Health Check
  test('GET /api/v1/health returns ok status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.timestamp).toBeTruthy();
  });

  // 2. Auth Tests
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
    adminToken = response.body.data.access_token;
  });

  test('POST /api/v1/auth/login fails with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@kppsm.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.error).toBe('Email atau password salah');
  });

  test('POST /api/v1/auth/login validation error returns valid field name in express-validator v7', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'not-an-email',
        password: ''
      });

    expect(response.status).toBe(422);
    expect(response.body.status).toBe('error');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors[0].field).toBeDefined();
    expect(response.body.errors[0].field).not.toBe('undefined');
  });

  // 3. Public Testimonials Endpoint
  test('GET /api/v1/testimonials returns list of approved testimonials', async () => {
    const response = await request(app).get('/api/v1/testimonials?page=1&per_page=5');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.page).toBe(1);
  });

  test('GET /api/v1/testimonials with search filter', async () => {
    const response = await request(app).get('/api/v1/testimonials?search=Kaji');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/v1/testimonials with rating filter', async () => {
    const response = await request(app).get('/api/v1/testimonials?rating=5');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  // 4. Authenticated Single Testimonial
  test('GET /api/v1/testimonials/:id requires authentication', async () => {
    const response = await request(app).get('/api/v1/testimonials/1');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });

  test('GET /api/v1/testimonials/:id succeeds with valid token', async () => {
    const response = await request(app)
      .get('/api/v1/testimonials/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.id).toBe(1);
  });

  // 5. Create Testimonial
  test('POST /api/v1/testimonials creates new testimonial with validation', async () => {
    const response = await request(app)
      .post('/api/v1/testimonials')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nama_perusahaan: 'PT Solusi Bangsa Mandiri',
        nama_pemberi_testimoni: 'Rina Rahmawati',
        jabatan: 'VP of Human Capital',
        isi_testimoni: 'Pelatihan pengembangan sikap mental yang sangat aplikatif dan memberikan dampak nyata terhadap performa tim kami.',
        rating: 5
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.nama_perusahaan).toBe('PT Solusi Bangsa Mandiri');
    expect(response.body.data.status_approve).toBe('pending');
  });

  // 6. Approve & Reject Testimonials (Admin Only)
  test('PUT /api/v1/testimonials/:id/approve approves testimonial', async () => {
    const response = await request(app)
      .put('/api/v1/testimonials/1/approve')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ notes: 'Disetujui untuk ditampilkan di web' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.status_approve).toBe('approved');
  });

  test('PUT /api/v1/testimonials/:id/reject rejects testimonial with reason', async () => {
    const response = await request(app)
      .put('/api/v1/testimonials/1/reject')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Format tidak sesuai standar' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.status_approve).toBe('rejected');
    expect(response.body.data.rejection_reason).toBe('Format tidak sesuai standar');
  });

  // 7. Testimonial Statistics
  test('GET /api/v1/testimonials/stats returns statistics breakdown', async () => {
    const response = await request(app)
      .get('/api/v1/testimonials/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.total_testimoni).toBeGreaterThanOrEqual(1);
    expect(response.body.data.rating_distribution).toBeDefined();
  });

  // 8. Contact Form Submission
  test('POST /api/contact submits contact inquiry', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        nama: 'Kurnia Setiawan',
        email: 'kurnia@example.com',
        telepon: '08123456789',
        perusahaan: 'PT Maju Bersama',
        pesan: 'Halo, saya ingin konsultasi mengenai program pelatihan karakter untuk 50 staf kami.'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('Terima kasih');
  });

  afterAll(async () => {
    if (app.pool) {
      try {
        await app.pool.end();
      } catch (err) {
        // ignore
      }
    }
  });
});

