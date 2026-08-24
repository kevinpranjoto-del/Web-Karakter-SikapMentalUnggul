# 🚀 KPPSM WEBSITE - SETUP GUIDE
## Step-by-Step Installation & Configuration

---

## 📋 Requirements

### Minimum Requirements
- Node.js v14+ ([Download](https://nodejs.org))
- MySQL 5.7+ ([Download](https://dev.mysql.com/downloads/mysql))
- Git ([Download](https://git-scm.com))
- Code Editor (VS Code recommended)
- Terminal/Command Prompt access

### Recommended Specifications
- Node.js v16 atau v18 LTS
- MySQL 8.0+
- 2GB RAM minimum
- 5GB disk space

---

## 📥 Step 1: Download & Prepare Files

### Option A: Git Clone
```bash
# Clone from repository
git clone https://github.com/your-repo/Web-Karakter-SikapMentalUnggul.git
cd Web-Karakter-SikapMentalUnggul
```

### Option B: Manual Download
1. Download file dari workspace
2. Extract ke folder `Web-Karakter-SikapMentalUnggul`
3. Navigate ke folder tersebut

### Verify File Structure
```bash
ls -la
# Verify output:
# index.html
# styles.css
# script.js
# server-api.js
# database-schema.sql
# API-DOCUMENTATION.md
# README.md
# .env.example
# .gitignore
# package.json
```

---

## 🖼️ Step 2: Prepare Images

### Create Images Folder
```bash
mkdir -p images
mkdir -p uploads/foto_orang
mkdir -p uploads/logo_perusahaan
mkdir -p logs
```

### Add Images
Place atau download images dengan nama:
```
images/
├── tatag-utomo-hero.jpg
├── tatag-utomo-resmi.jpg
├── wisma-kppsm.jpg
├── ruang-pelatihan.jpg
├── buku-1-mentalitas-profesional.jpg
├── buku-2-health-quotient.jpg
├── buku-3-magic-anak.jpg
├── buku-4-kewenangan.jpg
├── galeri-wisma.jpg
├── galeri-ruang-pelatihan.jpg
├── galeri-seminar.jpg
├── galeri-revolusi-mental.jpg
├── galeri-behaviour-test.jpg
└── galeri-polbangtan.jpg
```

**Quick Placeholder Solution:**
Gunakan placeholder images sementara (update nanti):
```html
<!-- Di index.html, ganti image src: -->
<img src="images/tatag-utomo-hero.jpg" alt="...">
<!-- Menjadi: -->
<img src="https://via.placeholder.com/800x600?text=Tatag+Utomo" alt="...">
```

---

## 💾 Step 3: Database Setup

### Windows Users

**Buka MySQL Command Prompt:**
```bash
# Start MySQL Service (jika belum)
net start MySQL80

# Login MySQL
mysql -u root -p
# Masukkan password MySQL Anda
```

**Create Database & Import Schema:**
```sql
-- Buat database baru
CREATE DATABASE IF NOT EXISTS kppsm_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE kppsm_website;

-- Import schema (run from terminal, bukan di MySQL prompt)
mysql -u root -p kppsm_website < database-schema.sql
```

### macOS/Linux Users

```bash
# Start MySQL (jika menggunakan Homebrew)
brew services start mysql

# Connect to MySQL
mysql -u root -p
# atau jika no password:
mysql -u root

# Di MySQL prompt:
CREATE DATABASE kppsm_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kppsm_website;
exit;

# Import schema (di terminal)
mysql -u root -p kppsm_website < database-schema.sql
# atau:
mysql -u root kppsm_website < database-schema.sql
```

### Verify Database

```bash
# Login MySQL
mysql -u root -p

# Check database
SHOW DATABASES;

# Use database
USE kppsm_website;

# Check tables
SHOW TABLES;

# Check sample data
SELECT COUNT(*) as total_testimoni FROM testimonial;
SELECT * FROM testimonial LIMIT 1\G

# Verify success (should return 7 testimonials)
```

**Expected Output:**
```
mysql> SELECT COUNT(*) as total_testimoni FROM testimonial;
+-------------------+
| total_testimoni   |
+-------------------+
|         7         |
+-------------------+
```

---

## 🖥️ Step 4: Frontend Setup (Standalone)

### Quick Start - No Backend Needed

**Option A: Using Python HTTP Server**
```bash
cd Web-Karakter-SikapMentalUnggul

# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js http-server**
```bash
# Install globally (jika belum)
npm install -g http-server

# Start server
http-server -p 8000 -c-1

# Access: http://localhost:8000
```

**Option C: Direct Browser Open**
- Buka file `index.html` langsung di browser
- Testimonials akan menggunakan static fallback

### Access Website
```
http://localhost:8000
```

---

## 🔌 Step 5: Backend API Setup

### Initialize Project

```bash
# Navigate to project folder
cd Web-Karakter-SikapMentalUnggul

# Initialize npm (jika belum ada package.json)
npm init -y

# Install dependencies
npm install

# Atau individual install
npm install express mysql2 jsonwebtoken express-validator multer dotenv cors helmet morgan bcryptjs
```

### Environment Configuration

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env file dengan text editor
```

**Update .env values:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password    # ⚠️ Ganti password Anda
DB_NAME=kppsm_website

# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production    # ⚠️ Ganti dengan key unik
```

### Start Backend Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Atau production mode
npm start

# Expected output:
# KPPSM Testimonial API running on port 3000
```

### Test API

Buka browser atau gunakan curl:
```bash
# Test API endpoint
curl http://localhost:3000/api/v1/testimonials

# Atau buka di browser:
# http://localhost:3000/api/v1/testimonials
```

---

## 🔐 Step 6: Authentication Setup

### Generate JWT Token

```bash
# Buat script untuk generate token
cat > generate-token.js << 'EOF'
const jwt = require('jsonwebtoken');

const payload = {
    id: 1,
    email: 'admin@kppsm.com',
    role: 'admin'
};

const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '24h' });
console.log('Token:', token);
EOF

# Run script
node generate-token.js

# Copy token untuk testing API
```

### Test API dengan Authentication

```bash
# Copy token dari output di atas
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Test GET endpoint dengan token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/testimonials

# Test POST endpoint dengan token
curl -X POST http://localhost:3000/api/v1/testimonials \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_perusahaan": "PT Test",
    "nama_pemberi_testimoni": "Test User",
    "jabatan": "Manager",
    "isi_testimoni": "Testimoni test lebih dari 20 karakter untuk valid",
    "rating": 5
  }'
```

---

## 🌐 Step 7: Connect Frontend to Backend

### Update API Endpoint in JavaScript

Edit `script.js`:

```javascript
// Line ~100, change:
const apiEndpoint = '/api/testimonials';  // Static fallback

// To:
const apiEndpoint = 'http://localhost:3000/api/v1/testimonials';  // Development
```

### Verify Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Check if testimonials loading dari API
4. Should see API responses atau fallback to static

---

## ✅ Step 8: Verification Checklist

### Frontend Tests
- [ ] Website loads at http://localhost:8000
- [ ] Navigation menu works
- [ ] All sections visible & styled correctly
- [ ] Hamburger menu works on mobile (resize browser)
- [ ] Images displaying correctly
- [ ] Links clickable (hero CTA, social, etc)
- [ ] Responsive on different screen sizes

### Backend Tests
- [ ] API server running at http://localhost:3000
- [ ] `GET /api/v1/testimonials` returns data
- [ ] Database connected successfully
- [ ] No error logs in console
- [ ] JWT authentication working

### Database Tests
```bash
# Login MySQL
mysql -u root -p

USE kppsm_website;

# Check tables
SHOW TABLES;

# Check data
SELECT COUNT(*) FROM testimonial;
SELECT * FROM testimonial WHERE status_approve = 'approved';
SELECT AVG(rating) FROM testimonial;
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
# Run npm install
npm install

# If still error, delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MySQL Connection Error"
**Solution:**
```bash
# Check MySQL is running
# Windows: Services > MySQL80 (start if stopped)
# macOS: brew services list
# Linux: sudo service mysql status

# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password

# Test connection
mysql -u root -p -h localhost
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process (macOS/Linux)
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### Issue: Images not loading
**Solution:**
```bash
# Check image paths are correct
# Images should be in ./images/ folder
# Update image src paths if needed

# Use absolute URLs as fallback:
https://via.placeholder.com/800x600?text=Image+Name
```

### Issue: CORS errors in frontend
**Solution:**
```javascript
// In script.js, update fetch headers:
fetch(apiEndpoint, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
```

---

## 📦 Step 9: Production Deployment

### Option A: Deploy to Netlify (Frontend Only)

1. Prepare files:
   ```bash
   # Ensure all images are in place
   # No backend required
   ```

2. Deploy:
   - Go to https://app.netlify.com
   - Drag & drop project folder
   - Site deployed!

### Option B: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Option C: Deploy to Heroku (Full Stack)
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create kppsm-website

# Add buildpack
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option D: Self-Hosted (VPS/Dedicated Server)
```bash
# SSH to server
ssh user@your-server.com

# Clone repo
git clone https://github.com/your-repo/Web-Karakter-SikapMentalUnggul.git
cd Web-Karakter-SikapMentalUnggul

# Setup Node
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start server-api.js --name "kppsm-api"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
# Configure SSL with Let's Encrypt
# Setup DNS records
```

---

## 🔒 Security Best Practices

### Before Going Live

1. **Change All Secrets**
   ```env
   JWT_SECRET=use-strong-random-string
   DB_PASSWORD=use-strong-database-password
   ```

2. **Enable HTTPS**
   - Get SSL certificate (Let's Encrypt free)
   - Configure Nginx/Apache for HTTPS

3. **Database Security**
   - Change MySQL root password
   - Create app-specific database user
   - Restrict database access

4. **API Security**
   - Enable rate limiting
   - Validate all inputs
   - Use HTTPS only
   - Set CORS properly

5. **File Permissions**
   ```bash
   chmod 600 .env
   chmod 644 index.html
   chmod 755 uploads/
   ```

6. **Regular Backups**
   ```bash
   # Backup database
   mysqldump -u root -p kppsm_website > backup.sql
   
   # Backup files
   tar -czf website-backup.tar.gz .
   ```

---

## 📞 Support

If stuck, check:
1. Console logs (F12 DevTools)
2. Server logs (`npm run dev` output)
3. README.md troubleshooting section
4. API-DOCUMENTATION.md for reference

---

**Setup Complete! 🎉**

Your KPPSM website is ready:
- Frontend: http://localhost:8000
- Backend API: http://localhost:3000
- Database: kppsm_website

Next: Customize content, add your images, and deploy!
