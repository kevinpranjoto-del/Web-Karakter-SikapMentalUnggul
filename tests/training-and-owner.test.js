const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../src/server-api');

describe('KPPSM Training Data, Blue Navbar & Owner Edit System Suite', () => {
  // 1. Training Data Integrity
  test('Training data file exists and contains exactly 711 historical records (1992-2025)', () => {
    const trainingDataPath = path.join(__dirname, '../assets/js/training-data.js');
    expect(fs.existsSync(trainingDataPath)).toBe(true);

    const trainingData = require(trainingDataPath);
    expect(Array.isArray(trainingData)).toBe(true);
    expect(trainingData.length).toBe(711);

    // Verify first record (1992)
    expect(trainingData[0].no).toBe(1);
    expect(trainingData[0].tahun).toBe('1992');
    expect(trainingData[0].perusahaan).toBe('Putera Group');
    expect(trainingData[0].kota).toBe('Jakarta');
    expect(trainingData[0].tipe).toBe('Training');

    // Verify last record (2025)
    expect(trainingData[710].no).toBe(711);
    expect(trainingData[710].tahun).toBe('2025');
    expect(trainingData[710].perusahaan).toBe('PT SWK & PT BWS');
    expect(trainingData[710].kota).toBe('Bangka');

    // Verify all records have required keys
    trainingData.forEach((rec, i) => {
      expect(rec.no).toBe(i + 1);
      expect(rec.tahun).toBeTruthy();
      expect(rec.bulan).toBeTruthy();
      expect(rec.tanggal).toBeTruthy();
      expect(rec.kota).toBeTruthy();
      expect(rec.perusahaan).toBeTruthy();
      expect(rec.tipe).toBeTruthy();
    });
  });

  // 2. HTTP Server Serving Verification
  test('GET / returns HTML containing Blue Navbar, Training Experience menu & section, and Owner Modal', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);

    // Blue Navbar checks
    expect(res.text).toContain('id="mainNav"');
    expect(res.text).toContain('bg-[#1E40AF]');
    expect(res.text).toContain('Karakter-');
    expect(res.text).toContain('SikapMentalUnggul');

    // Training Experience section & menu checks
    expect(res.text).toContain('Pengalaman Training');
    expect(res.text).toContain('id="pengalaman"');
    expect(res.text).toContain('id="trainingLogTable"');
    expect(res.text).toContain('id="trainingLogBody"');
    expect(res.text).toContain('id="trainingSearchInput"');
    expect(res.text).toContain('id="trainingYearFilter"');
    expect(res.text).toContain('id="trainingTypeFilter"');
    expect(res.text).toContain('id="trainingPaginationPages"');
    expect(res.text).toContain('assets/js/training-data.js');

    // Owner Login & Edit System checks
    expect(res.text).toContain('navOwnerLoginBtn');
    expect(res.text).toContain('openOwnerLoginModal()');
    expect(res.text).toContain('id="ownerLoginModal"');
    expect(res.text).toContain('id="ownerPasswordInput"');
    expect(res.text).toContain('id="ownerLockBtn"');
    expect(res.text).toContain('id="ownerToolbar"');
    expect(res.text).toContain('id="ownerToast"');
    expect(res.text).toContain('data-owner-text');
    expect(res.text).toContain('data-owner-img');
  });

  test('Static serving of training-data.js returns 200 and JS content', async () => {
    const res = await request(app).get('/assets/js/training-data.js');
    expect(res.status).toBe(200);
    expect(res.text).toContain('KPPSM_TRAINING_DATA');
    expect(res.text).toContain('Putera Group');
  });

  // 3. CSS & JS File Verification
  test('CSS file contains blue navbar styles, training badges, and owner edit mode styles', () => {
    const cssContent = fs.readFileSync(path.join(__dirname, '../assets/css/styles.css'), 'utf8');
    expect(cssContent).toContain('--color-biru-navbar: #1E40AF');
    expect(cssContent).toContain('#mainNav');
    expect(cssContent).toContain('.badge-training');
    expect(cssContent).toContain('.badge-tipe-training');
    expect(cssContent).toContain('.pagination-btn');
    expect(cssContent).toContain('#ownerLockBtn');
    expect(cssContent).toContain('#ownerToolbar');
    expect(cssContent).toContain('body.owner-edit-mode');
    expect(cssContent).toContain('.ow-del-btn');
    expect(cssContent).toContain('.ow-img-controls');
  });

  test('Main JS file contains training table controller, search/filter, and owner edit functions', () => {
    const jsContent = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');
    expect(jsContent).toContain('initTrainingTable');
    expect(jsContent).toContain('applyTrainingFilters');
    expect(jsContent).toContain('renderTrainingTable');
    expect(jsContent).toContain('openOwnerLoginModal');
    expect(jsContent).toContain('submitOwnerLogin');
    expect(jsContent).toContain('ownerToggleEditMode');
    expect(jsContent).toContain('ownerSaveChanges');
    expect(jsContent).toContain('ownerAddTrainingRow');
    expect(jsContent).toContain('ownerDeleteTrainingRow');
    expect(jsContent).toContain('applyStoredChanges');
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
