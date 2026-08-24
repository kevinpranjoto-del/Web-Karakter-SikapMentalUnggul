# 🎯 KPPSM - Website Pengembangan Sikap Mental Positif
**Lembaga Pelatihan & Konsultasi SDM | Tatag Utomo, M.M., M.Si.**

---

## 📑 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Struktur Folder](#struktur-folder)
3. [Setup & Installation](#setup--installation)
4. [File Documentation](#file-documentation)
5. [Features](#features)
6. [Customization Guide](#customization-guide)
7. [Deployment](#deployment)
8. [Support & Contact](#support--contact)

---

## Pendahuluan

Website KPPSM adalah platform komprehensif untuk:
- ✅ Showcase layanan pelatihan dan konsultasi SDM
- ✅ Menampilkan profil pendiri (Tatag Utomo)
- ✅ Manajemen testimoni klien dinamis dengan database
- ✅ Display portfolio/galeri kegiatan
- ✅ Integrasi WhatsApp & Media Sosial
- ✅ API REST untuk CRUD testimoni

**Built with:**
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js/Express (example)
- Database: MySQL
- Authentication: JWT

---

## 📁 Struktur Folder

```
Web-Karakter-SikapMentalUnggul/
│
├── 📄 index.html                    # Main website structure
├── 📄 styles.css                    # Styling & responsive design
├── 📄 script.js                     # JavaScript interactivity
│
├── 📄 database-schema.sql           # MySQL database schema & sample data
├── 📄 server-api.js                 # Express.js API backend implementation
│
├── 📄 API-DOCUMENTATION.md          # Complete API endpoints documentation
├── 📄 01-COPYWRITING-CONTENT.md     # All website copywriting content
├── 📄 README.md                     # This file
│
├── 📁 images/                       # Folder untuk gambar
│   ├── tatag-utomo-hero.jpg
│   ├── tatag-utomo-resmi.jpg
│   ├── wisma-kppsm.jpg
│   ├── ruang-pelatihan.jpg
│   ├── buku-1-mentalitas-profesional.jpg
│   ├── buku-2-health-quotient.jpg
│   ├── buku-3-magic-anak.jpg
│   ├── buku-4-kewenangan.jpg
│   ├── galeri-wisma.jpg
│   ├── galeri-ruang-pelatihan.jpg
│   ├── galeri-seminar.jpg
│   ├── galeri-revolusi-mental.jpg
│   ├── galeri-behaviour-test.jpg
│   └── galeri-polbangtan.jpg
│
└── 📁 uploads/                      # Folder untuk upload user (foto testimoni, logo)
    ├── foto_orang/
    └── logo_perusahaan/

```

---

## Setup & Installation

### Frontend Setup (Tanpa Backend)

1. **Clone atau download semua file**
   ```bash
   cd Web-Karakter-SikapMentalUnggul
   ```

2. **Buat folder images**
   ```bash
   mkdir images
   mkdir uploads
   ```

3. **Upload gambar ke folder images/**
   - Download atau siapkan semua gambar yang dibutuhkan
   - Rename sesuai dengan daftar di atas

4. **Open di browser**
   ```bash
   # Buka index.html langsung di browser
   # Atau gunakan live server
   python -m http.server 8000
   # Akses: http://localhost:8000
   ```

### Backend & Database Setup

#### 1. **Database Setup (MySQL)**

```bash
# Connect ke MySQL
mysql -u root -p

# Run database schema
mysql -u root -p kppsm_website < database-schema.sql

# Verify
USE kppsm_website;
SELECT * FROM testimonial;
```

#### 2. **Node.js/Express API Setup**

```bash
# Initialize Node project
npm init -y

# Install dependencies
npm install express mysql2 jsonwebtoken express-validator multer dotenv cors

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kppsm_website
JWT_SECRET=your-super-secret-key
NODE_ENV=production
PORT=3000
EOF

# Start server
node server-api.js
```

**Server akan running di:** `http://localhost:3000`

#### 3. **Update frontend untuk connect ke API**

Edit `script.js` line 100:
```javascript
const apiEndpoint = 'http://localhost:3000/api/v1'; // Production
// const apiEndpoint = '/api/v1'; // Relative path
```

---

## 📄 File Documentation

### `index.html` - Main Website Structure
- **Ukuran:** ~25KB
- **Sections:** 
  - Navigation Bar (sticky)
  - Hero Section dengan CTA
  - Tentang KPPSM & Visi-Misi
  - Profil Pendiri
  - 6 Layanan Unggulan
  - Galeri 4 Buku Karya
  - Galeri Kegiatan (6 foto)
  - Testimoni dinamis (dari API atau static fallback)
  - Kontak dengan Google Maps embed
  - Footer

### `styles.css` - Complete Styling
- **Ukuran:** ~28KB
- **Features:**
  - Mobile-responsive design
  - CSS Variables untuk easy customization
  - Modern design dengan gradients & shadows
  - Smooth animations & transitions
  - Responsive breakpoints: 768px, 480px
  - Dark mode support (optional)

### `script.js` - JavaScript Functionality
- **Ukuran:** ~16KB
- **Features:**
  - Hamburger menu mobile
  - Smooth scroll navigation
  - Testimonial carousel/pagination
  - Dynamic API loading
  - Gallery lightbox (optional)
  - Form handling & validation
  - Scroll reveal animations
  - WhatsApp integration helper

### `database-schema.sql` - MySQL Database
- **Tables:** testimonial, testimonial_category, audit_log
- **Views:** v_approved_testimonials, v_testimonials_by_rating, v_testimonials_stats
- **Stored Procedures:** sp_get_approved_testimonials, sp_create_testimonial, sp_update_testimonial_status
- **Sample Data:** 7 contoh testimoni lengkap
- **Indexes:** Optimized untuk performa query

### `server-api.js` - Express Backend
- **Endpoints:** 8 route lengkap (GET, POST, PUT, DELETE)
- **Authentication:** JWT-based
- **Validation:** Express-validator
- **Error Handling:** Comprehensive error responses
- **CORS:** Enabled
- **Response Format:** Standardized JSON

### `API-DOCUMENTATION.md` - API Reference
- **Coverage:** Semua 8 endpoints
- **Format:** Detailed dengan examples
- **Includes:** cURL, JavaScript, PHP examples
- **Response:** Success & error samples
- **Validation:** Input validation rules
- **Error Codes:** HTTP status & meanings

### `01-COPYWRITING-CONTENT.md` - Content Guide
- **Sections:** 8 bagian utama website
- **Tone:** Professional, inspiring, credible, humane
- **Examples:** Setiap section punya copywriting siap pakai
- **Data:** Berdasarkan info client (Tatag Utomo)

---

## ✨ Features

### Frontend Features
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Sticky Navigation** - Always accessible
- ✅ **Hero Section** - Eye-catching dengan CTA buttons
- ✅ **Dynamic Testimonials** - Load dari API atau fallback ke static
- ✅ **Gallery** - Image gallery dengan hover effects
- ✅ **Smooth Scrolling** - Scroll ke section dengan smooth animation
- ✅ **Mobile Menu** - Hamburger menu untuk mobile
- ✅ **Social Integration** - Links ke semua social media
- ✅ **WhatsApp CTA** - Direct WhatsApp contact integration
- ✅ **Google Maps** - Location embed
- ✅ **SEO Friendly** - Meta tags, semantic HTML, fast load

### Backend Features
- ✅ **CRUD Operations** - Complete testimonial management
- ✅ **Authentication** - JWT-based access control
- ✅ **Authorization** - Role-based permissions (admin)
- ✅ **Validation** - Input validation & sanitization
- ✅ **Pagination** - Efficient data loading
- ✅ **Filtering** - Filter by rating, search, sort
- ✅ **Audit Logging** - Track changes
- ✅ **Error Handling** - Standardized error responses
- ✅ **API Documentation** - Complete API docs
- ✅ **CORS** - Cross-origin support

### Database Features
- ✅ **Normalized Schema** - Well-structured tables
- ✅ **Indexes** - Optimized queries
- ✅ **Views** - Simplified data access
- ✅ **Stored Procedures** - Reusable logic
- ✅ **Constraints** - Data integrity
- ✅ **Sample Data** - 7 ready-to-use testimonials

---

## 🎨 Customization Guide

### 1. Mengubah Warna (Color Scheme)

Edit `styles.css` bagian `:root`:

```css
:root {
    /* Primary Colors */
    --primary-color: #2d5f7f;        /* Biru tua - ganti ke warna Anda */
    --secondary-color: #e8852a;      /* Orange - ganti ke warna Anda */
    --accent-color: #27ae60;         /* Hijau - ganti ke warna Anda */
    /* ... */
}
```

### 2. Mengubah Konten

Edit `index.html` atau `01-COPYWRITING-CONTENT.md`:

```html
<!-- Contoh: Ganti judul hero -->
<h1 class="hero-title">Ubah Mentalitas. Raih Kesuksesan.</h1>
<!-- Menjadi: -->
<h1 class="hero-title">Transformasi Mental Anda Sekarang</h1>
```

### 3. Mengubah Contact Details

Edit `index.html` section **KONTAK**:

```html
<a href="https://wa.me/6281887443" target="_blank">0818.874.430</a>
<!-- Ganti nomor sesuai kebutuhan -->
```

### 4. Menambah/Mengurangi Services

Edit `index.html` section **LAYANAN UNGGULAN**:

```html
<!-- Copy-paste .service-card untuk menambah layanan -->
<div class="service-card">
    <div class="service-icon"><i class="fas fa-icon-name"></i></div>
    <h3>Nama Layanan Baru</h3>
    <p class="service-tagline">"Tagline"</p>
    <!-- ... -->
</div>
```

### 5. Update Font

Edit `styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;600;700&display=swap');

:root {
    --font-heading: 'YOUR_FONT', serif;
    --font-body: 'YOUR_FONT', sans-serif;
}
```

### 6. Menambah Testimoni Statis

Edit `index.html` section **TESTIMONI**:

```html
<div class="testimoni-card">
    <div class="testimoni-stars">
        <i class="fas fa-star"></i>
        <!-- ... repeat 5x -->
    </div>
    <p class="testimoni-text">"Testimoni text di sini..."</p>
    <div class="testimoni-author">
        <!-- Author info -->
    </div>
</div>
```

---

## 🚀 Deployment

### Option 1: Deploy ke Netlify (Frontend Only)

1. **Drag & drop folder ke Netlify**
   - Buka https://app.netlify.com
   - Drag folder Web-Karakter-SikapMentalUnggul
   - Publish

### Option 2: Deploy ke Heroku (Full Stack)

```bash
# Login Heroku
heroku login

# Create app
heroku create kppsm-website

# Set environment variables
heroku config:set DB_HOST=your_host
heroku config:set DB_USER=your_user
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Option 3: Deploy ke VPS (Self-Hosted)

```bash
# SSH ke server
ssh user@your_server.com

# Clone repository
git clone your_repo.git
cd Web-Karakter-SikapMentalUnggul

# Setup Node
npm install
npm start

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/kppsm

# Konfigurasi:
server {
    listen 80;
    server_name api.kppsm.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable & restart
sudo ln -s /etc/nginx/sites-available/kppsm /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Option 4: Deploy Frontend ke GitHub Pages

```bash
# Push ke GitHub
git push origin main

# GitHub Pages akan auto-deploy dari branch 'main'
# Akses di: https://username.github.io/Web-Karakter-SikapMentalUnggul
```

---

## 📋 Checklist Pre-Launch

- [ ] Ganti semua placeholder images dengan real photos
- [ ] Update kontak details (WA, email)
- [ ] Verify semua links working
- [ ] Test responsive design di mobile
- [ ] Update social media links
- [ ] Setup Google Analytics
- [ ] Setup Google Business Profile
- [ ] Test form submission
- [ ] Setup SSL certificate
- [ ] Performance optimization (images, caching)
- [ ] SEO optimization (meta tags, schema markup)
- [ ] Mobile app ready (PWA optional)

---

## 🔧 Troubleshooting

### Testimoni tidak muncul
**Solusi:**
- Cek koneksi API di browser console (F12)
- Verify JWT token valid
- Check database connection
- Fallback ke static testimonials

### Gambar tidak muncul
**Solusi:**
- Verify file path di src attribute
- Check image dimensions (recommended: 16:9)
- Optimize image size
- Use CDN untuk production

### API error 500
**Solusi:**
- Check server logs: `heroku logs --tail`
- Verify database credentials
- Check MySQL connection
- Review error handling in server-api.js

### CORS error
**Solusi:**
- Verify CORS headers in server
- Check frontend API endpoint URL
- Add domain to CORS whitelist

---

## 📚 Referensi & Resources

### Documentation
- [API Documentation](./API-DOCUMENTATION.md)
- [Copywriting Content](./01-COPYWRITING-CONTENT.md)
- [Database Schema](./database-schema.sql)

### Tools & Services
- [Express.js Docs](https://expressjs.com)
- [MySQL Docs](https://dev.mysql.com/doc)
- [JWT.io](https://jwt.io)
- [Font Awesome Icons](https://fontawesome.com)
- [Google Fonts](https://fonts.google.com)

### Inspirasi & Best Practices
- Responsive Design: Mobile-first approach
- Performance: Lazy loading, image optimization
- Security: Input validation, JWT auth, SQL injection prevention
- SEO: Semantic HTML, meta tags, structured data

---

## 📞 Support & Contact

### Untuk Website/Tech Issues
- Email: technical@kppsm.com
- WhatsApp: 0818.874.430

### Untuk Business/Konsultasi
- Nama: Tatag Utomo, M.M., M.Si.
- WA: 0818.874.430 / 0813.1521.0388
- Email: tatag.kppsm.com

### Lokasi
- Wisma KPPSM
- Komp. Cibubur Indah 3 Blok F-7
- Jakarta Timur

### Social Media
- 🔵 Facebook: @TatagMotivator SDM
- 🎥 TikTok: @TatagMotivator SDM
- 📸 Instagram: @kppsm_revolusimental
- 𝕏 Twitter: @tatagkppsm
- 📺 YouTube: Kppsm Video

---

## 📄 License

Proprietary Software. © 2024 KPPSM - All Rights Reserved.

---

## 📝 Version History

### v1.0.0 (August 14, 2024)
- ✅ Initial website launch
- ✅ Complete copywriting
- ✅ Database schema
- ✅ API implementation
- ✅ Frontend design & functionality
- ✅ Documentation complete

---

**Last Updated:** August 14, 2024  
**Status:** Ready for Production  
**Maintained by:** KPPSM Tech Team
