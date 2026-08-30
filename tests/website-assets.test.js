const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/server-api');

describe('KPPSM Website & Media Assets Test Suite', () => {
  // 1. Root & HTML Verification
  test('GET / returns 200 and valid index.html with new structure', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Karakter-SikapMentalUnggul.id');
    expect(res.text).toContain('REVOLUSI');
    expect(res.text).toContain('MENTAL');
    expect(res.text).toContain('Bpk. F.X. Oerip');
    expect(res.text).toContain('ToABQ');
    expect(res.text).toContain('0818.874.430');
    expect(res.text).toContain('Wisma KPPSM');
    expect(res.text).toContain('Testimoni Klien');
    expect(res.text).toContain('Iwan Mahatirta');
    expect(res.text).toContain('PT Meiji Indonesian Pharmaceutical');
  });

  test('GET /index.html returns 200 and valid content', async () => {
    const res = await request(app).get('/index.html');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Karakter-SikapMentalUnggul.id');
  });

  // 2. Physical File Existence on Disk
  const expectedImages = [
    'foto-pendiri.jpg',
    'foto-tatag-utomo.jpg',
    'foto-gedung.jpg',
    'foto-ruangan.jpg',
    'foto-seminar.jpg',
    'seminar-stbc.jpg',
    'seminar-polbangtan.jpg',
    'seminar-fajarpaper.jpg',
    'seminar-rsud-kemayoran.jpg',
    'seminar-mandor.jpg',
    'buku-mentalitas-profesional.jpg',
    'buku-health-quotient.jpg',
    'buku-krisis-manusia.jpg',
    'buku-krisis-anak.jpg',
    'buku-renungan-karyawan.jpg',
    'buku-renungan-orang-tua.jpg',
    'buku-inspirator-revolusi-mental.jpg'
  ];

  expectedImages.forEach(imageName => {
    test(`Image asset exists on disk: ${imageName}`, () => {
      const filePath = path.join(__dirname, '../assets/images', imageName);
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(10000); // Verify it's a real non-empty image
    });
  });

  // 3. Static HTTP Serving Verification
  const staticEndpoints = [
    '/assets/images/foto-pendiri.jpg',
    '/assets/images/foto-seminar.jpg',
    '/assets/images/foto-ruangan.jpg',
    '/assets/images/foto-gedung.jpg',
    '/assets/images/buku-mentalitas-profesional.jpg',
    '/assets/images/buku-health-quotient.jpg',
    '/assets/images/seminar-fajarpaper.jpg'
  ];

  staticEndpoints.forEach(endpoint => {
    test(`Static asset route returns 200: ${endpoint}`, async () => {
      const res = await request(app).get(endpoint);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/image\/(jpeg|jpg|png|webp)/);
    });
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
