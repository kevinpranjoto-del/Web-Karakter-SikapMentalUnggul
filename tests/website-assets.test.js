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

  // 4. Content Revisions Verification (Batch 1 & 2)
  test('Verify all revised content, books, methods, emails, and testimonial layout', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);

    // Layanan Kami
    expect(res.text).toContain('ToABQ (Test of Aggregate Behaviour Quotient)');
    expect(res.text).toContain('Jasa Konseling Karakter, Mental dan Perilaku (Mental Health Counselling)');
    expect(res.text).toContain('Jasa Pelayanan Pelatihan Lain (Tailor Made)');

    // Metode Dari KPPSM
    expect(res.text).toContain('Metode Dari KPPSM');
    expect(res.text).toContain('Karakter Positif');
    expect(res.text).toContain('Pelatihan RIS Motivation');
    expect(res.text).toContain('Pelatihan Health Quotient');

    // Sifat Pelatihan
    expect(res.text).toContain('Fasilitator tidak bertindak sebagai penguasa yang memerintah (imperatif)');
    expect(res.text).toContain('Menilai Kematangan Berperilaku secara Agregat, yang terutama ditujukan untuk mendapatkan karyawan dengan Produktifitas yang Tinggi');

    // Asal Materi & Profil Pendiri
    expect(res.text).toContain('konsep asli dari Putera Bangsa Indonesia');
    expect(res.text).toContain('drg. T.A. Tatag Utomo, MM., ASM');
    expect(res.text).toContain('sebagai direktur pendidikannya telah membina');

    // CTA Button to #pengalaman
    expect(res.text).toContain('href="#pengalaman"');
    expect(res.text).toContain('Lihat Data Pengalaman Training (711 Arsip Resmi)');

    // 7 Books exact cover titles
    expect(res.text).toContain('Menggugah Mentalitas Profesional &amp; Pengusaha Indonesia');
    expect(res.text).toContain('Health Quotient: Cerdas Kesehatan untuk Eksekutif');
    expect(res.text).toContain('Mengatasi Krisis Manusia di Perusahaan');
    expect(res.text).toContain('Mencegah &amp; Mengatasi Krisis Anak Melalui Pengembangan Sikap Mental Orang Tua');
    expect(res.text).toContain('Renungan Sikap Mental Karyawan Perusahaan');
    expect(res.text).toContain('133 Renungan Perilaku Bijak Orang Tua dalam Mendidik Anak');
    expect(res.text).toContain('Inspirator Training Revolusi Mental');

    // Email
    expect(res.text).toContain('tatag.kppsm@gmail.com');

    // Testimoni layout & container
    expect(res.text).toContain('id="testiPartnerContainer"');
    expect(res.text).toContain('Dirga Wahana');
    expect(res.text).toContain('Rasidi, S.Pd');
    expect(res.text).toContain('Ign. Sumarya, SJ');
    expect(res.text).toContain('Friyandito');

    // 14 Karya Ilmiah
    expect(res.text).toContain('14 Karya Ilmiah &amp; Inovasi Orisinal KPPSM');
    expect(res.text).toContain('ReSSCaP');

    // 12 Bukti Nyata Dampak
    expect(res.text).toContain('EBITDA sebesar 15%');
    expect(res.text).toContain('PT Indah Kiat Pulp and Paper, Tbk.');
    expect(res.text).toContain('PT Meiji Indonesia');
    expect(res.text).toContain('PT Jakarta Land');
    expect(res.text).toContain('PT Dunkindo Lestari');
    expect(res.text).toContain('980.000 ton CPO');

    // Section Trainer Kami
    expect(res.text).toContain('id="trainer"');
    expect(res.text).toContain('F.X. Oerip S. Poerwopoespito, ASM');
    expect(res.text).toContain('Diki Permana, SE');
    expect(res.text).toContain('Albertus Widiarto, SE., MM');
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
