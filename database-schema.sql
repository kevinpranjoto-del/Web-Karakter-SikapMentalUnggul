-- =====================================================
-- KPPSM DATABASE - COMPLETE MANAGEMENT SYSTEM
-- MySQL Schema: Users, Services, Portfolio, Testimonials, etc
-- Version: 3.0 (KPPSM Content & Production)
-- =====================================================

-- CREATE DATABASE
DROP DATABASE IF EXISTS kppsm_website;
CREATE DATABASE IF NOT EXISTS kppsm_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kppsm_website;

-- =====================================================
-- TABLE: USERS - Admin & Staff Management
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    foto_profil VARCHAR(500),
    telepon VARCHAR(20),
    tanggal_daftar DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    token_reset VARCHAR(255),
    token_expire DATETIME,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk manajemen user/admin KPPSM website';

-- =====================================================
-- TABLE: ROLES & PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_role VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_permission VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    modul VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: SERVICES - Layanan Unggulan
-- =====================================================

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_service VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    tagline VARCHAR(255),
    deskripsi TEXT NOT NULL,
    deskripsi_lengkap LONGTEXT,
    icon VARCHAR(100),
    gambar_service VARCHAR(500),
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_urutan (urutan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk daftar layanan/services KPPSM';

-- =====================================================
-- TABLE: SERVICE BENEFITS - Keuntungan Setiap Service
-- =====================================================

CREATE TABLE IF NOT EXISTS service_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    benefit_text VARCHAR(255) NOT NULL,
    urutan INT DEFAULT 0,
    
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_service_id (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: BOOKS - Buku Karya
-- =====================================================

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    penulis VARCHAR(255) NOT NULL,
    deskripsi LONGTEXT NOT NULL,
    penerbit VARCHAR(255) NOT NULL,
    tahun_terbit YEAR,
    isbn VARCHAR(20),
    cover_image VARCHAR(500),
    urutan INT DEFAULT 0,
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_penulis (penulis),
    INDEX idx_urutan (urutan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk buku karya Tatag Utomo';

-- =====================================================
-- TABLE: PORTFOLIO / KEGIATAN
-- =====================================================

CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    deskripsi TEXT,
    kategori VARCHAR(100) NOT NULL COMMENT 'seminar, pelatihan, kegiatan, kolaborasi, dll',
    tanggal_kegiatan DATE,
    lokasi VARCHAR(255),
    gambar_utama VARCHAR(500),
    konten LONGTEXT,
    status ENUM('published', 'draft', 'archived') DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_kategori (kategori),
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal_kegiatan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk portfolio/galeri kegiatan KPPSM';

-- =====================================================
-- TABLE: PORTFOLIO GALLERY - Multiple images per portfolio
-- =====================================================

CREATE TABLE IF NOT EXISTS portfolio_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    gambar_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    urutan INT DEFAULT 0,
    
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE,
    INDEX idx_portfolio_id (portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: TESTIMONIAL - Client Testimonials
-- =====================================================

CREATE TABLE IF NOT EXISTS testimonial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_perusahaan VARCHAR(255) NOT NULL,
    nama_pemberi_testimoni VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    isi_testimoni LONGTEXT NOT NULL,
    rating INT NOT NULL,
    foto_orang VARCHAR(500),
    logo_perusahaan VARCHAR(500),
    kategori VARCHAR(100) COMMENT 'Corporate, Executive, Team Member, Partner',
    tanggal_input DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_diperbarui DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status_approve ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    alasan_tolak TEXT COMMENT 'Alasan jika testimoni ditolak',
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    INDEX idx_status (status_approve),
    INDEX idx_rating (rating),
    INDEX idx_tanggal (tanggal_input),
    INDEX idx_perusahaan (nama_perusahaan),
    INDEX idx_kategori (kategori),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk testimoni klien KPPSM';

-- =====================================================
-- TABLE: CONTACT INQUIRY - Inquiry/Konsultasi
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_inquiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telepon VARCHAR(20),
    perusahaan VARCHAR(255),
    subjek VARCHAR(255) NOT NULL,
    pesan LONGTEXT NOT NULL,
    tipe_inquiry ENUM('konsultasi', 'training', 'partnership', 'lainnya') DEFAULT 'lainnya',
    status ENUM('baru', 'diproses', 'selesai', 'spam') DEFAULT 'baru',
    ip_address VARCHAR(45),
    user_agent TEXT,
    tanggal_input DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_follow_up DATETIME,
    ditangani_oleh VARCHAR(255),
    catatan_internal LONGTEXT,
    
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_tanggal (tanggal_input),
    INDEX idx_tipe (tipe_inquiry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk inquiry dari website';

-- =====================================================
-- TABLE: WEBSITE SETTINGS - Konfigurasi Website
-- =====================================================

CREATE TABLE IF NOT EXISTS website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json', 'array') DEFAULT 'text',
    deskripsi TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: METRICS / ANALYTICS
-- =====================================================

CREATE TABLE IF NOT EXISTS metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INT DEFAULT 0,
    metric_date DATE DEFAULT CURDATE(),
    metric_type VARCHAR(100) COMMENT 'views, clicks, conversions, dll',
    metadata JSON,
    
    INDEX idx_name_date (metric_name, metric_date),
    INDEX idx_type (metric_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk analytics/metrics website';

-- =====================================================
-- TABLE: AUDIT LOG - Tracking Semua Aktivitas
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL COMMENT 'CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT',
    tabel_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_tabel (tabel_name),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabel untuk audit log semua aktivitas';

-- =====================================================
-- TABLE: EMAIL TEMPLATE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_template (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body LONGTEXT NOT NULL,
    variables JSON COMMENT 'Available variables',
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: EMAIL SENT - Log Email Terkirim
-- =====================================================

CREATE TABLE IF NOT EXISTS email_sent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_id INT,
    status ENUM('sent', 'failed', 'bounce') DEFAULT 'sent',
    error_message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (to_email),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at),
    FOREIGN KEY (template_id) REFERENCES email_template(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- KPPSM CONTENT MODEL - VERSION 3.0
-- Data profil, program, trainer, karya ilmiah, dan hasil nyata
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_profile (
    id TINYINT UNSIGNED PRIMARY KEY,
    nama_website VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    singkatan VARCHAR(50) NOT NULL,
    deskripsi LONGTEXT NOT NULL,
    tanggal_berdiri DATE NOT NULL,
    pendiri VARCHAR(255) NOT NULL,
    alamat LONGTEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    telepon_utama VARCHAR(30),
    telepon_kontak VARCHAR(30),
    total_pelatihan INT UNSIGNED DEFAULT 0,
    total_eksekutif INT UNSIGNED DEFAULT 0,
    total_organisasi INT UNSIGNED DEFAULT 0,
    tahun_pengamatan SMALLINT UNSIGNED DEFAULT 0,
    visi TEXT,
    misi TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS training_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode VARCHAR(30) NOT NULL UNIQUE,
    nama_program VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    kategori ENUM('utama', 'tes_perilaku', 'konseling', 'tailor_made') NOT NULL,
    durasi VARCHAR(100),
    deskripsi LONGTEXT NOT NULL,
    tujuan LONGTEXT,
    metode LONGTEXT,
    sifat_pelayanan TEXT,
    target_peserta TEXT,
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_program_category (kategori),
    INDEX idx_program_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    gelar VARCHAR(255),
    jabatan VARCHAR(255),
    foto_url VARCHAR(500),
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    UNIQUE KEY uq_trainer (nama, gelar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scientific_works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(500) NOT NULL,
    jenis ENUM('buku', 'artikel', 'materi', 'alat_tes', 'gelar_profesi') NOT NULL,
    deskripsi LONGTEXT,
    tahun SMALLINT UNSIGNED,
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    UNIQUE KEY uq_scientific_work (judul(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS impact_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_klien VARCHAR(255) NOT NULL,
    hasil LONGTEXT NOT NULL,
    indikator VARCHAR(255),
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    UNIQUE KEY uq_impact_case (nama_klien, indikator(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    urutan INT DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA - INITIAL DATA
-- =====================================================

-- Insert Roles
INSERT INTO roles (nama_role, deskripsi) VALUES
('admin', 'Administrator - Full access'),
('moderator', 'Moderator - Moderate content'),
('user', 'Regular User - Limited access');

-- Insert Permissions
INSERT INTO permissions (nama_permission, deskripsi, modul) VALUES
('view_testimonial', 'View testimonials', 'testimoni'),
('create_testimonial', 'Create testimonial', 'testimoni'),
('edit_testimonial', 'Edit testimonial', 'testimoni'),
('delete_testimonial', 'Delete testimonial', 'testimoni'),
('approve_testimonial', 'Approve testimonial', 'testimoni'),
('view_inquiry', 'View contact inquiry', 'inquiry'),
('manage_users', 'Manage users', 'users'),
('manage_services', 'Manage services', 'services'),
('manage_portfolio', 'Manage portfolio', 'portfolio'),
('manage_settings', 'Manage settings', 'settings'),
('view_analytics', 'View analytics', 'analytics');

-- Insert Admin User
INSERT INTO users (username, email, password_hash, nama_lengkap, role, status) VALUES
('admin', 'admin@kppsm.com', '$2b$10$gSvqqUxg8YW4i6.Zpmigeuxz0pVMhCMezV.SQlPJxLKe3E8KhZy2O', 'Administrator', 'admin', 'active'),
('tatag', 'tatag@kppsm.com', '$2b$10$gSvqqUxg8YW4i6.Zpmigeuxz0pVMhCMezV.SQlPJxLKe3E8KhZy2O', 'Tatag Utomo', 'admin', 'active'),
('moderator', 'moderator@kppsm.com', '$2b$10$gSvqqUxg8YW4i6.Zpmigeuxz0pVMhCMezV.SQlPJxLKe3E8KhZy2O', 'Moderator', 'moderator', 'active');

-- Insert Services
INSERT INTO services (nama_service, slug, tagline, deskripsi, icon, urutan) VALUES
('Transformasi Tim Sales & Manajemen', 'transformasi-tim-sales', 'Saat Komunikasi Rusak, Produksi Jatuh', 'Memperbaiki hubungan team dan meningkatkan produktivitas', 'fas fa-comments', 1),
('Krisis Management & Conflict Prevention', 'krisis-management', 'Cegah Demonstrasi Sebelum Eskalasi', 'Strategi pencegahan dan penyelesaian konflik yang terbukti', 'fas fa-shield-alt', 2),
('Pembinaan & Empowerment Koperasi', 'pembinaan-koperasi', 'Koperasi Sehat = Bisnis Sehat', 'Program pembinaan koperasi mitra dengan hasil terukur', 'fas fa-handshake', 3),
('Union Relations & Industrial Peace', 'union-relations', 'Hubungan Kerja Harmonis = Stabilitas Bisnis', 'Membangun hubungan baik antara labor dan management', 'fas fa-users', 4),
('Mental Health Crisis Intervention', 'mental-health', 'Selamatkan Eksekutif Dari Depresi', 'Layanan counseling dan therapy untuk krisis mental', 'fas fa-heart-pulse', 5),
('Performance Optimization & Target Achievement', 'performance-optimization', 'Dari Target Mustahil Jadi Nyata', 'Program motivasi dan continuous improvement untuk capai target', 'fas fa-rocket', 6);

-- Insert Service Benefits
INSERT INTO service_benefits (service_id, benefit_text, urutan) VALUES
(1, 'Team conflict resolution yang efektif', 1),
(1, 'Komunikasi manajemen yang lebih humanis', 2),
(1, 'Peningkatan produktivitas & loyalitas karyawan', 3),
(2, 'Identifikasi early warning signs konflik', 1),
(2, 'Strategi de-escalation yang terbukti', 2),
(2, 'Membangun dialog rutin yang produktif', 3);

-- Insert Books
INSERT INTO books (judul, slug, penulis, deskripsi, penerbit, tahun_terbit, isbn, urutan) VALUES
('Menggugah Mentalitas Profesional & Pengusaha Indonesia', 'mentalitas-profesional', 'Tatag Utomo', 'Panduan mengubah mindset dari worker ke entrepreneur mentalitas', 'PT. Grassindo', 2019, '978-6021-123456', 1),
('Health Quotient untuk Eksekutif', 'health-quotient', 'Tatag Utomo', 'Balanced lifestyle approach: physical, mental & spiritual health', 'PT. Grassindo', 2020, '978-6021-123457', 2),
('Menanam & Mengasah Magic Anak', 'magic-anak', 'Tatag Utomo', 'Metode praktis mengembangkan potensi dengan emotional intelligence tinggi', 'PT. Grassindo', 2018, '978-6021-123458', 3),
('Kewenangan Berpikir, Berucap, Berbuat Perusahaan', 'kewenangan-berbuat', 'Tatag Utomo', 'Deep dive tentang culture, authority & responsibility dalam organisasi', 'PT. Grassindo', 2021, '978-6021-123459', 4);

-- Insert Portfolio/Kegiatan
INSERT INTO portfolio (judul, slug, deskripsi, kategori, tanggal_kegiatan, lokasi) VALUES
('Wisma KPPSM - Fasilitas Modern', 'wisma-kppsm', 'Lokasi strategis dengan fasilitas lengkap di Cibubur Indah', 'kegiatan', '2024-08-14', 'Cibubur Indah, Jakarta Timur'),
('Pelatihan Revolusi Mental 2024', 'pelatihan-revolusi-mental', 'Flagship program intensive untuk transformasi mentalitas', 'pelatihan', '2024-08-14', 'Wisma KPPSM'),
('Seminar Bersama PT Kaji', 'seminar-pt-kaji', 'Workshop hubungan tim sales dan manajemen', 'seminar', '2024-07-20', 'PT Kaji Head Office'),
('Collaboration dengan Polbangtan Malang', 'kolaborasi-polbangtan', 'Partnership dengan institusi pendidikan pertanian', 'kolaborasi', '2024-06-15', 'Polbangtan Malang'),
('Behaviour Test & Assessment', 'behaviour-test', 'Program psychometric testing untuk klien korporat', 'pelatihan', '2024-08-10', 'Wisma KPPSM');

-- Insert Additional Sample Testimonials (for testing)
INSERT INTO testimonial (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, kategori, status_approve, created_by) VALUES
('PT Sinarmas', 'Dimas Pratama', 'VP Human Capital', 'Transformasi leadership team kami melalui KPPSM menghasilkan keputusan strategis yang lebih baik. Perusahaan semakin visioner dan profitable.', 5, 'Corporate', 'approved', 'admin'),
('Bank Mandiri', 'Retno Widowati', 'Division Head', 'Program wellness executive dari KPPSM sangat membantu mengelola stress dan work-life balance. Performa kerja meningkat 60%.', 5, 'Executive', 'approved', 'admin'),
('PT Unilever', 'Bambang Hartono', 'Sales Director', 'Kerjasama dengan KPPSM dalam transformasi sales culture memberikan hasil nyata: revenue naik 45%, turnover turun drastis.', 5, 'Corporate', 'approved', 'admin'),
('Telkom Indonesia', 'Ni Made Suastini', 'HR Manager', 'Program conflict resolution dari KPPSM sangat efektif mengatasi tension antar departemen. Kolaborasi jadi lebih solid.', 4, 'Corporate', 'approved', 'admin'),
('PT Astra Honda', 'Eko Gunawan', 'Plant Manager', 'Safety culture dan mental health program dari KPPSM menurunkan accident rate dan meningkatkan engagement karyawan.', 5, 'Corporate', 'approved', 'admin'),
('PT Indofood', 'Siti Marwati', 'Operations Head', 'Pembinaan manajemen operasional yang intensif membuat proses production lebih efficient dan cost-effective.', 4, 'Corporate', 'approved', 'admin'),
('Garuda Indonesia', 'Irvan Kurniawan', 'Customer Service Manager', 'Customer satisfaction meningkat 35% setelah tim kami mengikuti training service excellence dari KPPSM.', 5, 'Corporate', 'approved', 'admin'),
('PT Indomie', 'Yenny Gunawan', 'Supply Chain Director', 'Mindset coaching dari Pak Tatag mengubah cara tim supply chain kami berpikir. Efisiensi logistik meningkat signifikan.', 4, 'Corporate', 'approved', 'admin'),
('Bank Rakyat Indonesia', 'Cahyo Nugroho', 'Business Unit Head', 'Union relations program dari KPPSM menciptakan industrial harmony yang sustainable.', 5, 'Corporate', 'approved', 'admin'),
('PT Pertamina', 'Sumit Sharma', 'HSE Manager', 'Program transformasi kultur keselamatan melalui KPPSM menghasilkan zero accident selama 6 bulan berturut-turut.', 5, 'Corporate', 'approved', 'admin');

-- Insert Pending/Test Testimonials
INSERT INTO testimonial (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, kategori, status_approve, created_by) VALUES
('PT Test Company 1', 'Test User 1', 'Test Position', 'Ini adalah testimoni test yang masih dalam tahap pending review.', 4, 'Corporate', 'pending', 'admin'),
('PT Test Company 2', 'Test User 2', 'Another Position', 'Testimoni ini akan ditolak untuk testing purpose.', 2, 'Corporate', 'pending', 'admin');

-- Insert Rejected Testimonial (for testing)
INSERT INTO testimonial (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, kategori, status_approve, alasan_tolak, created_by) VALUES
('PT Reject Sample', 'Reject User', 'Test', 'Testimoni ini ditolak karena kualitas konten yang rendah.', 2, 'Corporate', 'rejected', 'Konten terlalu singkat dan tidak detail', 'admin');

-- Insert More Portfolio Items
INSERT INTO portfolio (judul, slug, deskripsi, kategori, tanggal_kegiatan, lokasi) VALUES
('Training Revolusi Mental Batch 15', 'training-batch-15', 'Program intensive selama 2 minggu dengan 45 peserta dari berbagai industri', 'pelatihan', '2024-08-20', 'Wisma KPPSM'),
('Seminar Union Relations di Jakarta', 'seminar-union-jakarta', 'Workshop tentang best practices dalam mengelola hubungan kerja', 'seminar', '2024-08-10', 'Hotel Bumi Karsa'),
('Kolaborasi dengan Universitas Pancasila', 'kolaborasi-unpancasila', 'Partnership untuk integrasi mental coaching dalam kurikulum bisnis', 'kolaborasi', '2024-08-05', 'Kampus Universitas Pancasila'),
('Executive Retreat PT Bumitama', 'exec-retreat-bumitama', 'Program intensif transformasi leadership untuk top management', 'pelatihan', '2024-07-25', 'Resort Lembang'),
('Gathering Internal KPPSM', 'gathering-kppsm-2024', 'Acara tahunan untuk team bonding dan strategic planning', 'kegiatan', '2024-07-15', 'Wisma KPPSM'),
('On-Site Training PT Kaji', 'onsite-kaji-2024', 'Program customized untuk transformasi sales team', 'pelatihan', '2024-06-28', 'PT Kaji Head Office'),
('Webinar Series Mental Health Crisis', 'webinar-mental-health', 'Series online tentang crisis intervention dan mental wellness', 'seminar', '2024-06-10', 'Online via Zoom');

-- Insert Gallery Images for Portfolio
INSERT INTO portfolio_gallery (portfolio_id, gambar_url, caption, urutan) VALUES
(1, 'https://via.placeholder.com/800x600?text=Batch+15+Session+1', 'Sesi pembuka - Peserta dari berbagai industri', 1),
(1, 'https://via.placeholder.com/800x600?text=Batch+15+Session+2', 'Diskusi kelompok mindset transformation', 2),
(1, 'https://via.placeholder.com/800x600?text=Batch+15+Closing', 'Graduation ceremony Batch 15', 3),
(2, 'https://via.placeholder.com/800x600?text=Seminar+Jakarta+1', 'Pembicara sedang memberikan materi', 1),
(2, 'https://via.placeholder.com/800x600?text=Seminar+Jakarta+2', 'Sesi tanya jawab dengan peserta', 2),
(5, 'https://via.placeholder.com/800x600?text=Gathering+Team+1', 'Team KPPSM gathering 2024', 1),
(5, 'https://via.placeholder.com/800x600?text=Gathering+Team+2', 'Strategic session dan planning', 2);

-- Insert More Contact Inquiries
INSERT INTO contact_inquiry (nama, email, telepon, perusahaan, subjek, pesan, tipe_inquiry, status, ip_address) VALUES
('Rina Kusuma', 'rina@pt-bintang.com', '0812-9999-8888', 'PT Bintang Indonesia', 'Program training untuk 100 peserta', 'Kami sedang mencari program transformasi mentalitas untuk 100 sales staff. Bisa diskusi lebih detail tentang customisasi program dan investasi?', 'training', 'baru', '192.168.1.100'),
('Hendra Maulana', 'hendra.m@kalbeindo.com', '0821-5555-4444', 'Kalbe Indonesia', 'Konsultasi hubungan industrial', 'Kami menghadapi tantangan dalam hubungan dengan serikat kerja. Butuh konsultasi mendalam dengan tim KPPSM tentang strategi terbaik.', 'konsultasi', 'diproses', '192.168.1.101'),
('Dewi Lestari', 'dewi@unilever.co.id', '0822-7777-3333', 'Unilever Indonesia', 'Partnership untuk employee wellness', 'Unilever ingin mengimplementasikan program wellness company-wide. Apakah bisa diskusi package dan timeline?', 'partnership', 'baru', '192.168.1.102'),
('Bambang Suryanto', 'bambang@pertamina.com', '0813-4444-2222', 'PT Pertamina', 'Program HSE mindset coaching', 'Kami tertarik dengan program mindset coaching untuk HSE culture. Bisa diatur session demo terlebih dahulu?', 'training', 'diproses', '192.168.1.103'),
('Siti Nurhaliza', 'siti.nur@bca.co.id', '0814-1111-5555', 'Bank Central Asia', 'Inquiry umum tentang services', 'Bisa informasi lengkap tentang semua service yang ditawarkan KPPSM?', 'lainnya', 'selesai', '192.168.1.104'),
('Ahmad Wijaya', 'ahmad.wijaya@email.com', '0815-6666-7777', '', 'Spam test', 'BUY CIALIS CHEAP ONLINE NOW!!!', 'lainnya', 'spam', '192.168.1.105'),
('Testing User', 'test@example.com', '0899-9999-9999', 'Test Company', 'Test inquiry', 'Ini adalah test inquiry untuk testing data validation', 'konsultasi', 'baru', '192.168.1.106');

-- Insert More Email Templates
INSERT INTO email_template (template_name, subject, body, variables, status) VALUES
('training_confirmation', 'Konfirmasi Training/Pelatihan', 'Yth. {{nama}},\\n\\nTerima kasih telah mendaftar program training kami: {{program_name}}.\\n\\nDetail Pelatihan:\\n- Tanggal: {{tanggal_training}}\\n- Lokasi: {{lokasi}}\\n- Jam: {{jam_training}}\\n\\nSilakan konfirmasi kehadiran Anda.\\n\\nSalam hormat,\\nKPPSM Team', '[\"nama\",\"program_name\",\"tanggal_training\",\"lokasi\",\"jam_training\"]', 'aktif'),
('inquiry_update', 'Update Status Inquiry Anda', 'Yth. {{nama}},\\n\\nTerima kasih atas inquiry Anda. Status terbaru:\\n\\nSubjek: {{subjek}}\\nStatus: {{status_inquiry}}\\n\\nTim kami akan menghubungi Anda segera untuk diskusi lebih lanjut.\\n\\nSalam hormat,\\nKPPSM Team', '[\"nama\",\"subjek\",\"status_inquiry\"]', 'aktif'),
('newsletter_monthly', 'Newsletter KPPSM Bulan {{bulan}}', 'Halo {{nama}},\\n\\nBerikut update terbaru dari KPPSM:\\n\\n{{content}}\\n\\nUntuk info lebih lanjut, kunjungi website kami.\\n\\nSalam,\\nKPPSM Team', '[\"nama\",\"bulan\",\"content\"]', 'aktif');

-- Insert Additional Website Settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, deskripsi) VALUES
('meta_description', 'KPPSM - Lembaga Pengembangan Sikap Mental dan Transformasi Mentalitas Profesional Indonesia. 20+ tahun pengalaman.', 'text', 'Meta description untuk SEO'),
('meta_keywords', 'KPPSM, transformasi mental, pelatihan kepemimpinan, motivasi bisnis, coaching, pengembangan SDM', 'text', 'Meta keywords untuk SEO'),
('google_analytics_id', 'G-XXXXXXXXXX', 'text', 'Google Analytics tracking ID'),
('site_title', 'KPPSM | Pengembangan Sikap Mental Positif Indonesia', 'text', 'Judul website'),
('phone_1_name', 'Tatag Utomo', 'text', 'Nama pemilik nomor WhatsApp 1'),
('phone_2_name', 'Adminstrasi KPPSM', 'text', 'Nama untuk nomor WhatsApp 2'),
('working_hours', '09:00 - 17:00 (Senin-Jumat)', 'text', 'Jam operasional'),
('about_company_excerpt', 'KPPSM adalah lembaga pelatihan dan pengembangan sikap mental terkemuka dengan pengalaman lebih dari 20 tahun.', 'text', 'Excerpt untuk halaman tentang'),
('enable_maintenance_mode', 'false', 'boolean', 'Aktifkan maintenance mode'),
('maintenance_message', 'Website sedang dalam perbaikan. Mohon coba beberapa jam lagi.', 'text', 'Pesan maintenance'),
('database_version', '2.0', 'text', 'Versi database schema'),
('last_backup_date', '2024-08-14 10:00:00', 'text', 'Tanggal backup terakhir');

-- Insert Website Settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, deskripsi) VALUES
('nama_perusahaan', 'KPPSM - Pengembangan Sikap Mental Positif', 'text', 'Nama perusahaan'),
('email_kontak', 'tatag@kppsm.com', 'text', 'Email kontak utama'),
('whatsapp_1', '0818874430', 'text', 'Nomor WhatsApp 1'),
('whatsapp_2', '08131521388', 'text', 'Nomor WhatsApp 2'),
('alamat', 'Wisma KPPSM, Komp. Cibubur Indah 3 Blok F-7, Jakarta Timur', 'text', 'Alamat fisik'),
('facebook', 'https://facebook.com/TatagMotivator', 'text', 'Link Facebook'),
('instagram', 'https://instagram.com/kppsm_revolusimental', 'text', 'Link Instagram'),
('tiktok', 'https://tiktok.com/@TatagMotivator', 'text', 'Link TikTok'),
('youtube', 'https://youtube.com/@kppsm', 'text', 'Link YouTube'),
('twitter', 'https://twitter.com/tatagkppsm', 'text', 'Link Twitter/X'),
('pengalaman_tahun', '20', 'number', 'Tahun pengalaman'),
('total_klien', '50', 'number', 'Total klien korporat'),
('total_peserta', '1000', 'number', 'Total peserta terlatih'),
('average_rating', '4.86', 'number', 'Rating rata-rata testimonial'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance website'),
('enable_inquiry', 'true', 'boolean', 'Enable form inquiry');

-- Insert Email Templates
INSERT INTO email_template (template_name, subject, body, variables, status) VALUES
('inquiry_received', 'Kami Terima Inquiry Anda - KPPSM', 'Terima kasih {{nama}} atas inquiry Anda tentang {{subjek}}. Kami akan menghubungi Anda segera di {{email}} atau {{telepon}}.', '["nama","subjek","email","telepon"]', 'aktif'),
('testimonial_submitted', 'Testimoni Anda Kami Terima', 'Terima kasih {{nama}} telah memberikan testimoni untuk KPPSM. Testimoni Anda akan kami review terlebih dahulu sebelum dipublikasikan.', '["nama"]', 'aktif'),
('testimonial_approved', 'Testimoni Anda Telah Dipublikasikan', 'Selamat {{nama}}, testimoni Anda dari {{perusahaan}} telah kami setujui dan dipublikasikan di website KPPSM. Terima kasih atas kepercayaan Anda.', '["nama","perusahaan"]', 'aktif');

-- =====================================================
-- AUTHORITATIVE KPPSM CONTENT - DATA DARI BRIEF PEMILIK
-- =====================================================

-- Remove placeholder content from the original demo seed.
DELETE FROM service_benefits;
DELETE FROM services;
DELETE FROM books;
DELETE FROM testimonial;

INSERT INTO organization_profile
    (id, nama_website, nama_usaha, singkatan, deskripsi, tanggal_berdiri, pendiri,
     alamat, email, telepon_utama, telepon_kontak, total_pelatihan, total_eksekutif,
     total_organisasi, tahun_pengamatan, visi, misi)
VALUES
    (1, 'Karakter-Sikap MentalUnggul.id', 'KPPSM F.X. Poerwopoespito', 'KPPSM',
     'Jasa pelatihan, pengembangan, riset, tes dan konseling untuk masalah karakter, sikap mental dan perilaku SDM perusahaan, institusi, organisasi dan BUMN.',
     '1992-07-23', 'Bapak F.X. Oerip',
     'Wisma KPPSM, Kompleks Cibubur Indah III Blok F-7, RT 05/011, Jakarta Timur 13720',
     'tatag.kppsm@gmail.com', '0818.874.430', '0813.1521.0388 (Tatag Utomo)',
     700, 46000, 220, 36,
     'Membantu manusia dan organisasi Indonesia mengembangkan karakter positif, sikap mental unggul dan perilaku yang produktif.',
     'Menyediakan pelatihan, tes, konseling, riset dan materi yang realistis, menyeluruh, ilmiah serta sesuai kebutuhan bangsa Indonesia.');

INSERT INTO training_programs
    (kode, nama_program, slug, kategori, durasi, deskripsi, tujuan, metode, sifat_pelayanan, target_peserta, urutan)
VALUES
    ('M1', 'Mengembangkan Karakter Positif dan Kuat melalui Revolusi Mental', 'karakter-positif-revolusi-mental', 'utama', '2 hari',
     'Pelatihan untuk mengembangkan pribadi berkarakter positif dan kuat.',
     'Meningkatkan produktivitas, kerja sama kelompok, prestasi dan daya tahan dalam era bisnis yang turbulen dan kompetitif.',
     'Dialog partisipatif: fasilitator dan peserta berdiskusi untuk berpikir mendalam serta mengkaji konsep yang diberikan.',
     'Intelektualitatif: fasilitator bertindak sebagai teman diskusi, bukan penguasa yang memerintah.',
     'Karyawan perusahaan, institusi, organisasi dan BUMN', 1),
    ('M2', 'RIS (Realistic, Integrated & Scientific) Motivation', 'ris-motivation', 'utama', '1 hari',
     'Pelatihan motivasi realistis, menyeluruh dan berdasarkan ilmu pengetahuan.',
     'Membantu karyawan tetap termotivasi dengan hebat dalam kondisi apa pun.',
     'Dialog partisipatif dan pengkajian konsep secara mendalam.',
     'Intelektualitatif dan aplikatif.', 'Karyawan, eksekutif dan pimpinan organisasi', 2),
    ('M3', 'Health Quotient', 'health-quotient-eksekutif', 'utama', '1 hari',
     'Pelatihan kecerdasan kesehatan secara holistik untuk eksekutif dan karyawan.',
     'Membantu peserta terhindar dari 10 gangguan kesehatan berat yang menghancurkan dan memiskinkan.',
     'Dialog partisipatif dan pembahasan kesehatan holistik.',
     'Intelektualitatif dan preventif.', 'Karyawan dan eksekutif', 3),
    ('TOABQ', 'ToABQ (Test of Aggregate Behaviour Quotient)', 'toabq-test-perilaku', 'tes_perilaku', '5,5 jam',
     'Tes untuk menilai kematangan berperilaku secara menyeluruh.',
     'Mendukung rekrutmen, seleksi, promosi, head hunter dan kebutuhan khusus HRD untuk memperoleh karyawan produktif dengan karakter baik.',
     'Kombinasi multiple choice, esai, wawancara dan visualisasi.',
     'Menilai kematangan berperilaku secara agregat serta mencegah masalah perilaku negatif di kemudian hari.',
     'Kandidat rekrutmen, karyawan dan kebutuhan HRD khusus', 4),
    ('KONSELING', 'Konseling Karakter, Mental dan Perilaku', 'konseling-karakter-mental-perilaku', 'konseling', '2 jam/sesi/orang; 5 kali pertemuan atau sesuai kebutuhan',
     'Konseling untuk membahas problem potensial atau yang sudah ada dalam kehidupan pekerjaan ketika seseorang masih sadar penuh dan belum mengalami stres berat.',
     'Mengenali, membedah dan menangani masalah karakter, mental serta perilaku sejak dini.',
     'Wawancara, kuesioner, neuroresponse test, problem breakdown, RIS motivation machine, group discussion dan konsultasi ahli.',
     'Pendampingan personal dan terarah.', 'Karyawan, eksekutif dan organisasi', 5),
    ('TAILOR', 'Pelayanan Pelatihan Lain (Tailor Made)', 'pelatihan-tailor-made', 'tailor_made', 'Sesuai kebutuhan',
     'Program yang dirancang sesuai kebutuhan organisasi.',
     'Menjawab kebutuhan pengembangan karakter, manajemen dan kepemimpinan secara spesifik.',
     'Dialog partisipatif dan metode yang disesuaikan dengan tujuan program.',
     'Fleksibel dan kolaboratif.', 'Perusahaan, institusi, organisasi, BUMN, SMP dan SMA', 6);

INSERT INTO trainers (nama, gelar, jabatan, urutan) VALUES
('F.X. Oerip S. Poerwopoespito', 'ASM', 'Pendiri KPPSM', 1),
('Drg. T.A. Tatag Utomo', 'MM., ASM', 'Trainer dan konsultan', 2),
('Diki Permana', 'SE', 'Trainer', 3),
('Albertus Widiarto', 'SE., MM', 'Trainer', 4);

INSERT INTO books (judul, slug, penulis, deskripsi, penerbit, tahun_terbit, urutan) VALUES
('Menggugah Mentalitas Profesional dan Pengusaha Indonesia', 'menggugah-mentalitas-profesional-pengusaha', 'KPPSM', 'Revisi total dari buku Mengatasi Krisis Manusia di Perusahaan, Solusi melalui Pengembangan Sikap Mental.', 'KPPSM', NULL, 1),
('Renungan Sikap Mental Karyawan Perusahaan', 'renungan-sikap-mental-karyawan', 'KPPSM', 'Renungan untuk mendukung pengembangan sikap mental karyawan perusahaan.', 'KPPSM', NULL, 2),
('Mencegah dan Mengatasi Krisis Anak melalui Pengembangan Sikap Mental Orangtua', 'krisis-anak-dan-sikap-mental-orangtua', 'KPPSM', 'Panduan pengembangan sikap mental orangtua dalam mencegah dan mengatasi krisis anak.', 'KPPSM', NULL, 3),
('Health Quotient untuk Eksekutif', 'health-quotient-untuk-eksekutif', 'KPPSM', 'Buku tentang kecerdasan kesehatan untuk eksekutif.', 'KPPSM', NULL, 4),
('133 Renungan Perilaku Bijak Orangtua dalam Mendidik Anak', '133-renungan-orangtua', 'KPPSM', 'Kumpulan renungan perilaku bijak untuk mendidik anak.', 'KPPSM', NULL, 5),
('Just One Habit', 'just-one-habit', 'KPPSM', 'Kumpulan pemikiran perilaku sebagai pendukung strategi kebijakan SDM dan peningkatan kualitas manusia.', 'KPPSM', NULL, 6);

INSERT INTO scientific_works (judul, jenis, deskripsi, urutan) VALUES
('Materi Pengembangan Sikap Mental pertama di Indonesia dan dunia', 'materi', 'Temuan materi pengembangan sikap mental berdasarkan renungan, pemikiran, pengamatan dan riset selama 36 tahun.', 1),
('Tehnik Presentasi Brillian', 'materi', 'Materi presentasi yang dikembangkan KPPSM.', 2),
('ASM (Ahli Sikap Mental)', 'gelar_profesi', 'Gelar profesi yang dibuat KPPSM.', 3),
('RIS (Realistic, Integrated and Scientific Motivation)', 'materi', 'Sistem motivasi yang menyeluruh, realistis dan berdasarkan ilmu pengetahuan.', 4),
('Health Quotient untuk Eksekutif', 'materi', 'Materi kecerdasan kesehatan untuk eksekutif.', 5),
('ToABQ (Test of Aggregate Behaviour Quotient)', 'alat_tes', 'Alat tes perilaku untuk rekrutmen, seleksi, promosi dan kebutuhan khusus HRD.', 6),
('ReSSCaP (Realistic, Simple, Scientific, Calm & Prudent)', 'materi', 'Materi trading dan investasi saham di BEI berbasis karakter positif.', 7),
('Artikel ilmiah populer untuk majalah dan jurnal manajemen', 'artikel', 'Kumpulan artikel ilmiah populer karya KPPSM.', 8);

INSERT INTO impact_cases (nama_klien, hasil, indikator, urutan) VALUES
('PT Indah Kiat Pulp and Paper, Tbk', 'Membantu tercapainya EBITDA sebesar 15%.', 'EBITDA 15%', 1),
('PT Meiji Indonesia', 'Membantu mengurangi reject dari 13% menjadi sekitar 1,5%.', 'Reject 13% menjadi 1,5%', 2),
('PT Dunkindo Lestari', 'Membantu meningkatkan penjualan 20% menurut penuturan pimpinan.', 'Penjualan naik 20%', 3),
('PT Furindo Kencana', 'Membantu melaksanakan dengan sempurna proyek tender khusus di Metro Department Store.', 'Proyek tender terlaksana', 4),
('PT Kencana Agri', 'Membantu upaya pencapaian 1 juta ton produksi CPO tahun 2025; capaian riil 980.000 ton.', '980.000 ton CPO', 5),
('PT Jakarta Land dan PT King Photo Studio', 'Mencegah unjuk rasa.', 'Unjuk rasa dicegah', 6),
('PT Kaji Inova Media', 'Memperbaiki hubungan antara tim sales dan manajemen melalui pelatihan dan diskusi tripartit.', 'Hubungan tim membaik', 7),
('WTC Jakarta', 'Mencegah rencana demonstrasi karyawan security perusahaan pengelola gedung.', 'Demonstrasi dicegah', 8),
('PT Bumitama Gunajaya Agro', 'Membantu membangun hubungan baik antara karyawan, petani plasma dan koperasi binaan perusahaan.', 'Relasi stakeholder membaik', 9),
('PT Prodia Laboratories, PT Kalbe Farma, Tbk dan PT Sampoerna Agro Lestari', 'Membantu membangun hubungan baik antara SPSI dan manajemen perusahaan.', 'Hubungan industrial membaik', 10),
('Eksekutif dengan depresi', 'Membantu mencegah tindakan bunuh diri beberapa eksekutif yang mengalami depresi.', 'Intervensi krisis', 11);

INSERT INTO social_links (platform, username, url, urutan) VALUES
('Facebook', 'PengembanganSikapMentalPositif', 'https://www.facebook.com/PengembanganSikapMentalPositif', 1),
('TikTok', '@TatagMotivator SDM', 'https://www.tiktok.com/@TatagMotivator', 2),
('Instagram', 'Kppsm_revolusimental', 'https://www.instagram.com/Kppsm_revolusimental', 3),
('X', '@tatagkppsm', 'https://x.com/tatagkppsm', 4),
('YouTube', 'Kppsm Video', 'https://www.youtube.com/@kppsm', 5);

INSERT INTO testimonial
    (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, kategori, status_approve, created_by)
VALUES
('PT Bumitama Gunajaya Agro', 'Iswandi Ilyas', 'Partnership Dept. Head', 'Materi sangat positif dan me-remind kita kembali kepada fitrah kita sebagai manusia yang pada dasarnya punya hati, etika dan adab. KPPSM hadir dan tepat sekali pada saat negara kita krisis moral dan mental.', 5, 'Corporate', 'approved', 'admin'),
('PT Lucky Indah Keramik', 'Junus Danie', 'Manajer HR, GA dan Perijinan', 'Ilmu adalah milik orang yang mau belajar. Kemajuan adalah milik orang yang mau berubah. Pak Oerip dan Pak Tatag telah mengajarkan keduanya dan kemajuan mulai kami rasakan di PT Lucky Indah Keramik.', 5, 'Corporate', 'approved', 'admin'),
('PT Maharupa Gatra/MG Sports & Music', 'Iwan Mahatirta', 'Direktur Utama', 'Selama hidup sudah ratusan pelatihan dan seminar yang saya ikuti, termasuk dari luar negeri. Namun KPPSM saya nilai adalah yang paling bagus dan OK, karena materinya padat, penceramahnya berpengalaman, gayanya hidup dan tidak membosankan.', 5, 'Executive', 'approved', 'admin'),
('PT Meiji Indonesian Pharmaceutical Industries', 'Artomo', 'Direktur', 'KPPSM memang luar biasa, dengan memberi contoh kecil tetapi bernilai besar yang membedakan dengan lembaga lain. Sikap teladan, disiplin dan profesional itu bukan basa-basi.', 5, 'Executive', 'approved', 'admin'),
('Hoka-hoka Bento Wisma BRI II', 'Dirga Wahana', 'Store Supervisor', 'Setelah mengikuti Pelatihan Pengembangan Sikap Mental dari KPPSM serta menyelenggarakan renungan seminggu sekali, sikap saya berubah. Sekarang saya berusaha mengerti kebijakan perusahaan dan meningkatkan prestasi dengan meningkatkan omset perusahaan.', 5, 'Team Member', 'approved', 'admin'),
('PT Enseval Putra Megatrading, Tbk', 'Herman Widjaja', 'Director in Charge MDD & EC', 'KPPSM tampil beda dari pelatihan lain: materinya sangat sederhana, membumi, mudah dicerna, mudah diterapkan, sesuai kebutuhan karyawan Indonesia dan hasilnya cepat dirasakan, terutama berkaitan dengan produktivitas perusahaan.', 5, 'Executive', 'approved', 'admin'),
('PT Kalla Lines', 'Djati Adi Wicaksono', 'Direktur IT Business Unit', 'KPPSM beda. Programnya bukan hanya bermanfaat bagi pribadi, keluarga dan perusahaan, tetapi juga bangsa. Langkah kecil KPPSM ini akan saya ikuti dan saya yakin 1000 langkah kecil akan membuat langkah besar.', 5, 'Executive', 'approved', 'admin'),
('SDN Kragilan 06 Serang', 'Rasidi, S.Pd', 'Kepala Sekolah', 'Pelatihan Revolusi Mental sangat bermanfaat bukan hanya buat saya sebagai pendidik, namun juga buat anak didik. Di dunia pendidikan, karakter seorang guru adalah pondasi untuk dicontoh dan ditiru oleh peserta didik.', 5, 'Partner', 'approved', 'admin');

UPDATE website_settings SET setting_value = 'Karakter-Sikap MentalUnggul.id', deskripsi = 'Nama website resmi KPPSM' WHERE setting_key = 'site_title';
UPDATE website_settings SET setting_value = 'KPPSM F.X. Poerwopoespito - jasa pelatihan, pengembangan, riset, tes dan konseling karakter, sikap mental serta perilaku SDM Indonesia.' WHERE setting_key = 'meta_description';
UPDATE website_settings SET setting_value = 'KPPSM F.X. Poerwopoespito' WHERE setting_key = 'nama_perusahaan';
UPDATE website_settings SET setting_value = 'tatag.kppsm@gmail.com' WHERE setting_key = 'email_kontak';
UPDATE website_settings SET setting_value = '0818.874.430' WHERE setting_key = 'whatsapp_1';
UPDATE website_settings SET setting_value = '0813.1521.0388' WHERE setting_key = 'whatsapp_2';
UPDATE website_settings SET setting_value = 'Wisma KPPSM, Kompleks Cibubur Indah III Blok F-7, RT 05/011, Jakarta Timur 13720' WHERE setting_key = 'alamat';
UPDATE website_settings SET setting_value = '34' WHERE setting_key = 'pengalaman_tahun';
UPDATE website_settings SET setting_value = '220' WHERE setting_key = 'total_klien';
UPDATE website_settings SET setting_value = '46000' WHERE setting_key = 'total_peserta';
UPDATE website_settings SET setting_value = '700' WHERE setting_key = 'total_pelatihan';
UPDATE website_settings SET setting_value = '215' WHERE setting_key = 'pengguna_jasa';
UPDATE website_settings SET setting_value = '3.0' WHERE setting_key = 'database_version';
INSERT IGNORE INTO website_settings (setting_key, setting_value, setting_type, deskripsi) VALUES
('tanggal_berdiri', '1992-07-23', 'text', 'Tanggal berdiri KPPSM'),
('pendiri', 'Bapak F.X. Oerip', 'text', 'Pendiri KPPSM'),
('asal_materi', 'Renungan, pemikiran, pengamatan dan riset KPPSM selama 36 tahun dengan obyek pengamatan bangsa Indonesia.', 'text', 'Asal materi pelatihan'),
('pengguna_jasa', '215', 'number', 'Jumlah perusahaan, institusi, organisasi atau BUMN pengguna jasa'),
('total_pelatihan', '700', 'number', 'Jumlah pelatihan, seminar dan konsultasi');

-- =====================================================
-- VIEWS - AGGREGATE DATA
-- =====================================================

-- =====================================================
-- VIEWS - AGGREGATE DATA & BUSINESS INTELLIGENCE
-- =====================================================

-- View: Approved Testimonials
DROP VIEW IF EXISTS v_approved_testimonials;
CREATE VIEW v_approved_testimonials AS
SELECT 
    id,
    nama_perusahaan,
    nama_pemberi_testimoni,
    jabatan,
    isi_testimoni,
    rating,
    foto_orang,
    logo_perusahaan,
    kategori,
    tanggal_input
FROM testimonial
WHERE status_approve = 'approved'
ORDER BY tanggal_input DESC;

-- View: Testimonials by Rating
DROP VIEW IF EXISTS v_testimonials_by_rating;
CREATE VIEW v_testimonials_by_rating AS
SELECT 
    rating,
    COUNT(*) as total,
    ROUND(AVG(rating), 2) as avg_rating
FROM testimonial
WHERE status_approve = 'approved'
GROUP BY rating
ORDER BY rating DESC;

-- View: Testimonials Statistics
DROP VIEW IF EXISTS v_testimonials_stats;
CREATE VIEW v_testimonials_stats AS
SELECT 
    COUNT(*) as total_approved,
    ROUND(AVG(rating), 2) as average_rating,
    COUNT(DISTINCT nama_perusahaan) as unique_companies,
    MIN(tanggal_input) as first_testimonial,
    MAX(tanggal_input) as last_testimonial
FROM testimonial
WHERE status_approve = 'approved';

-- View: Website Statistics
DROP VIEW IF EXISTS v_website_stats;
CREATE VIEW v_website_stats AS
SELECT 
    (SELECT COUNT(*) FROM testimonial WHERE status_approve = 'approved') as total_testimoni_aktif,
    (SELECT COUNT(*) FROM testimonial WHERE status_approve = 'pending') as testimoni_pending,
    (SELECT COUNT(*) FROM contact_inquiry WHERE status = 'baru') as inquiries_new,
    (SELECT COUNT(*) FROM portfolio) as total_portfolio,
    (SELECT COUNT(*) FROM services WHERE status = 'aktif') as total_services,
    (SELECT COUNT(*) FROM books WHERE status = 'published') as total_books,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users_aktif;

-- View: Active Services with Benefits
DROP VIEW IF EXISTS v_services_with_benefits;
CREATE VIEW v_services_with_benefits AS
SELECT 
    s.id,
    s.nama_service,
    s.slug,
    s.tagline,
    s.deskripsi,
    s.icon,
    s.urutan,
    CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', sb.id, 'benefit', sb.benefit_text)), ']') as benefits
FROM services s
LEFT JOIN service_benefits sb ON s.id = sb.service_id
WHERE s.status = 'aktif'
GROUP BY s.id
ORDER BY s.urutan;

-- View: Dashboard Inquiry Summary
DROP VIEW IF EXISTS v_inquiry_summary;
CREATE VIEW v_inquiry_summary AS
SELECT 
    tipe_inquiry,
    status,
    COUNT(*) as total
FROM contact_inquiry
WHERE YEAR(tanggal_input) = YEAR(NOW())
GROUP BY tipe_inquiry, status;

-- View: User Activity Log
DROP VIEW IF EXISTS v_user_activity;
CREATE VIEW v_user_activity AS
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    COUNT(al.id) as total_activities,
    MAX(al.created_at) as last_activity
FROM users u
LEFT JOIN audit_log al ON u.id = al.user_id
GROUP BY u.id
ORDER BY last_activity DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- SP: Get Approved Testimonials with Pagination
DROP PROCEDURE IF EXISTS sp_get_approved_testimonials;
DELIMITER //
CREATE PROCEDURE sp_get_approved_testimonials(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        id,
        nama_perusahaan,
        nama_pemberi_testimoni,
        jabatan,
        isi_testimoni,
        rating,
        foto_orang,
        logo_perusahaan,
        kategori,
        tanggal_input
    FROM testimonial
    WHERE status_approve = 'approved'
    ORDER BY tanggal_input DESC
    LIMIT p_limit OFFSET p_offset;
END //
DELIMITER ;

-- SP: Create New Testimonial
DROP PROCEDURE IF EXISTS sp_create_testimonial;
DELIMITER //
CREATE PROCEDURE sp_create_testimonial(
    IN p_nama_perusahaan VARCHAR(255),
    IN p_nama_pemberi VARCHAR(255),
    IN p_jabatan VARCHAR(255),
    IN p_isi_testimoni LONGTEXT,
    IN p_rating INT,
    IN p_foto_orang VARCHAR(500),
    IN p_logo_perusahaan VARCHAR(500),
    IN p_kategori VARCHAR(100),
    IN p_created_by VARCHAR(255),
    OUT p_id INT
)
BEGIN
    INSERT INTO testimonial (
        nama_perusahaan,
        nama_pemberi_testimoni,
        jabatan,
        isi_testimoni,
        rating,
        foto_orang,
        logo_perusahaan,
        kategori,
        created_by,
        status_approve
    ) VALUES (
        p_nama_perusahaan,
        p_nama_pemberi,
        p_jabatan,
        p_isi_testimoni,
        p_rating,
        p_foto_orang,
        p_logo_perusahaan,
        p_kategori,
        p_created_by,
        'pending'
    );
    
    SET p_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- SP: Update Testimonial Status with Reason
DROP PROCEDURE IF EXISTS sp_update_testimonial_status;
DELIMITER //
CREATE PROCEDURE sp_update_testimonial_status(
    IN p_id INT,
    IN p_status ENUM('pending', 'approved', 'rejected'),
    IN p_alasan_tolak TEXT,
    IN p_updated_by VARCHAR(255)
)
BEGIN
    UPDATE testimonial
    SET 
        status_approve = p_status,
        alasan_tolak = p_alasan_tolak,
        updated_by = p_updated_by,
        tanggal_diperbarui = NOW()
    WHERE id = p_id;
END //
DELIMITER ;

-- SP: Get Website Dashboard Stats
DROP PROCEDURE IF EXISTS sp_get_dashboard_stats;
DELIMITER //
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
    SELECT * FROM v_website_stats;
END //
DELIMITER ;

-- SP: Create Contact Inquiry
DROP PROCEDURE IF EXISTS sp_create_inquiry;
DELIMITER //
CREATE PROCEDURE sp_create_inquiry(
    IN p_nama VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telepon VARCHAR(20),
    IN p_perusahaan VARCHAR(255),
    IN p_subjek VARCHAR(255),
    IN p_pesan LONGTEXT,
    IN p_tipe_inquiry VARCHAR(100),
    IN p_ip_address VARCHAR(45),
    OUT p_id INT
)
BEGIN
    INSERT INTO contact_inquiry (
        nama,
        email,
        telepon,
        perusahaan,
        subjek,
        pesan,
        tipe_inquiry,
        ip_address,
        status
    ) VALUES (
        p_nama,
        p_email,
        p_telepon,
        p_perusahaan,
        p_subjek,
        p_pesan,
        p_tipe_inquiry,
        p_ip_address,
        'baru'
    );
    
    SET p_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- SP: Get Services with All Details
DROP PROCEDURE IF EXISTS sp_get_services_detail;
DELIMITER //
CREATE PROCEDURE sp_get_services_detail()
BEGIN
    SELECT * FROM v_services_with_benefits;
END //
DELIMITER ;

-- SP: Record Audit Log
DROP PROCEDURE IF EXISTS sp_log_audit;
DELIMITER //
CREATE PROCEDURE sp_log_audit(
    IN p_user_id INT,
    IN p_action VARCHAR(100),
    IN p_tabel_name VARCHAR(100),
    IN p_record_id INT,
    IN p_old_values JSON,
    IN p_new_values JSON,
    IN p_ip_address VARCHAR(45)
)
BEGIN
    INSERT INTO audit_log (
        user_id,
        action,
        tabel_name,
        record_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        p_user_id,
        p_action,
        p_tabel_name,
        p_record_id,
        p_old_values,
        p_new_values,
        p_ip_address
    );
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS - AUTO MAINTENANCE
-- =====================================================

-- Trigger: Auto update timestamp on testimonial update
DROP TRIGGER IF EXISTS tr_testimonial_update;
DELIMITER //
CREATE TRIGGER tr_testimonial_update
BEFORE UPDATE ON testimonial
FOR EACH ROW
BEGIN
    SET NEW.tanggal_diperbarui = NOW();
END //
DELIMITER ;

-- Trigger: Auto create audit log on testimonial changes
DROP TRIGGER IF EXISTS tr_testimonial_audit;
DELIMITER //
CREATE TRIGGER tr_testimonial_audit
AFTER UPDATE ON testimonial
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (action, tabel_name, record_id, old_values, new_values)
    VALUES (
        'UPDATE',
        'testimonial',
        NEW.id,
        JSON_OBJECT('status', OLD.status_approve, 'rating', OLD.rating),
        JSON_OBJECT('status', NEW.status_approve, 'rating', NEW.rating)
    );
END //
DELIMITER ;

-- =====================================================
-- USEFUL QUERIES & FUNCTIONS
-- =====================================================

-- Query: Get all pending testimonials
SELECT * FROM testimonial WHERE status_approve = 'pending' ORDER BY tanggal_input DESC;

-- Query: Get top rated testimonials
SELECT * FROM testimonial WHERE status_approve = 'approved' ORDER BY rating DESC, tanggal_input DESC LIMIT 10;

-- Query: Get testimonials by company
SELECT * FROM testimonial WHERE nama_perusahaan = 'PT Kaji' AND status_approve = 'approved';

-- Query: Monthly inquiry statistics
SELECT 
    DATE_FORMAT(tanggal_input, '%Y-%m') as bulan,
    tipe_inquiry,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
FROM contact_inquiry
GROUP BY bulan, tipe_inquiry
ORDER BY bulan DESC;

-- Query: User activity summary
SELECT 
    u.nama_lengkap,
    COUNT(al.id) as total_activities,
    MAX(al.created_at) as last_login
FROM users u
LEFT JOIN audit_log al ON u.id = al.user_id
WHERE u.status = 'active'
GROUP BY u.id;

-- Query: Services ranking by benefits count
SELECT 
    nama_service,
    slug,
    COUNT(sb.id) as total_benefits,
    urutan
FROM services s
LEFT JOIN service_benefits sb ON s.id = sb.service_id
WHERE s.status = 'aktif'
GROUP BY s.id
ORDER BY urutan;

-- =====================================================
-- INDEXES UNTUK PERFORMA
-- =====================================================

-- =====================================================
-- DATABASE INDEXES - OPTIMIZATION
-- =====================================================

-- Add additional composite indexes for common queries
ALTER TABLE testimonial ADD INDEX idx_status_rating (status_approve, rating);
ALTER TABLE testimonial ADD INDEX idx_status_date (status_approve, tanggal_input);
ALTER TABLE contact_inquiry ADD INDEX idx_status_date (status, tanggal_input);
ALTER TABLE audit_log ADD INDEX idx_action_date (action, created_at);
ALTER TABLE portfolio ADD INDEX idx_kategori_date (kategori, tanggal_kegiatan);
ALTER TABLE books ADD INDEX idx_status_tahun (status, tahun_terbit);
ALTER TABLE users ADD INDEX idx_role_status (role, status);

-- =====================================================
-- SAMPLE QUERIES - BUSINESS INTELLIGENCE
-- =====================================================

-- Query 1: Get all high-rated testimonials
-- SELECT * FROM testimonial 
-- WHERE status_approve = 'approved' AND rating >= 4
-- ORDER BY rating DESC, tanggal_input DESC;

-- Query 2: Overall testimonial statistics
-- SELECT 
--     COUNT(*) as total_testimoni,
--     ROUND(AVG(rating), 2) as avg_rating,
--     COUNT(DISTINCT nama_perusahaan) as unique_companies,
--     SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star_count
-- FROM testimonial
-- WHERE status_approve = 'approved';

-- Query 3: Get new inquiries from last 7 days
-- SELECT * FROM contact_inquiry
-- WHERE status = 'baru' AND tanggal_input >= DATE_SUB(NOW(), INTERVAL 7 DAY)
-- ORDER BY tanggal_input DESC;

-- Query 4: Monthly inquiry trend
-- SELECT 
--     DATE_TRUNC(tanggal_input, MONTH) as month,
--     COUNT(*) as total_inquiry,
--     tipe_inquiry
-- FROM contact_inquiry
-- GROUP BY YEAR(tanggal_input), MONTH(tanggal_input), tipe_inquiry
-- ORDER BY month DESC;

-- Query 5: Services with benefit count
-- SELECT 
--     s.nama_service,
--     COUNT(sb.id) as total_benefits
-- FROM services s
-- LEFT JOIN service_benefits sb ON s.id = sb.service_id
-- WHERE s.status = 'aktif'
-- GROUP BY s.id
-- ORDER BY s.urutan;

-- Query 6: Recently added portfolio items
-- SELECT * FROM portfolio
-- WHERE status = 'published'
-- ORDER BY tanggal_kegiatan DESC
-- LIMIT 10;

-- Query 7: User activity summary
-- SELECT 
--     u.nama_lengkap,
--     u.role,
--     COUNT(al.id) as activity_count,
--     MAX(al.created_at) as last_activity
-- FROM users u
-- LEFT JOIN audit_log al ON u.id = al.user_id
-- WHERE u.status = 'active'
-- GROUP BY u.id
-- ORDER BY last_activity DESC;

-- Query 8: Dashboard summary numbers
-- SELECT 
--     (SELECT COUNT(*) FROM testimonial WHERE status_approve = 'approved') as approved_testimonials,
--     (SELECT COUNT(*) FROM contact_inquiry WHERE status = 'baru') as new_inquiries,
--     (SELECT ROUND(AVG(rating), 2) FROM testimonial WHERE status_approve = 'approved') as avg_rating,
--     (SELECT COUNT(DISTINCT nama_perusahaan) FROM testimonial WHERE status_approve = 'approved') as total_companies;

-- =====================================================
-- VERIFICATION QUERIES - TEST DATA INTEGRITY
-- =====================================================

-- 1. Test: Verify all users dapat diakses
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT username, email, role, status FROM users ORDER BY id;

-- 2. Test: Verify testimonial relationships
-- SELECT 
--     COUNT(*) as total,
--     COUNT(DISTINCT nama_perusahaan) as companies,
--     AVG(rating) as avg_rating,
--     MIN(rating) as min_rating,
--     MAX(rating) as max_rating
-- FROM testimonial
-- WHERE status_approve = 'approved';

-- 3. Test: Verify service benefits relationship
-- SELECT 
--     s.nama_service,
--     COUNT(sb.id) as total_benefits
-- FROM services s
-- LEFT JOIN service_benefits sb ON s.id = sb.service_id
-- GROUP BY s.id;

-- 4. Test: Verify portfolio gallery relationship
-- SELECT 
--     p.judul,
--     COUNT(pg.id) as total_images
-- FROM portfolio p
-- LEFT JOIN portfolio_gallery pg ON p.id = pg.portfolio_id
-- GROUP BY p.id;

-- 5. Test: Check for orphaned records
-- SELECT * FROM service_benefits WHERE service_id NOT IN (SELECT id FROM services);
-- SELECT * FROM portfolio_gallery WHERE portfolio_id NOT IN (SELECT id FROM portfolio);
-- SELECT * FROM audit_log WHERE user_id NOT IN (SELECT id FROM users);

-- 6. Test: Verify constraint data types
-- SELECT * FROM testimonial WHERE rating NOT BETWEEN 1 AND 5;
-- SELECT * FROM testimonial WHERE status_approve NOT IN ('pending', 'approved', 'rejected');
-- SELECT * FROM services WHERE status NOT IN ('aktif', 'nonaktif');

-- 7. Test: Check duplicate emails
-- SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- 8. Test: Verify required fields are not NULL
-- SELECT * FROM testimonial WHERE nama_perusahaan IS NULL OR isi_testimoni IS NULL;
-- SELECT * FROM contact_inquiry WHERE nama IS NULL OR email IS NULL OR pesan IS NULL;

-- 9. Test: Check inquiry follow-up status
-- SELECT 
--     status,
--     COUNT(*) as total,
--     SUM(CASE WHEN ditangani_oleh IS NOT NULL THEN 1 ELSE 0 END) as handled_count
-- FROM contact_inquiry
-- GROUP BY status;

-- 10. Test: Verify all active books have covers
-- SELECT id, judul FROM books WHERE status = 'published' AND cover_image IS NULL;

-- =====================================================
-- DATA CONSISTENCY CHECKS - STORED PROCEDURES
-- =====================================================

-- SP: Comprehensive database health check
DELIMITER //
CREATE PROCEDURE sp_database_health_check()
BEGIN
    DECLARE v_error_count INT DEFAULT 0;
    
    -- Check 1: Orphaned service benefits
    IF EXISTS (SELECT 1 FROM service_benefits WHERE service_id NOT IN (SELECT id FROM services)) THEN
        SET v_error_count = v_error_count + 1;
        SELECT 'ERROR: Orphaned service_benefits detected' as check_result;
    END IF;
    
    -- Check 2: Invalid testimonial ratings
    IF EXISTS (SELECT 1 FROM testimonial WHERE rating NOT BETWEEN 1 AND 5) THEN
        SET v_error_count = v_error_count + 1;
        SELECT 'ERROR: Invalid testimonial ratings found' as check_result;
    END IF;
    
    -- Check 3: Duplicate user emails
    IF EXISTS (SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1) THEN
        SET v_error_count = v_error_count + 1;
        SELECT 'ERROR: Duplicate user emails detected' as check_result;
    END IF;
    
    -- Check 4: Missing required testimonial data
    IF EXISTS (SELECT 1 FROM testimonial WHERE nama_perusahaan IS NULL OR isi_testimoni IS NULL) THEN
        SET v_error_count = v_error_count + 1;
        SELECT 'ERROR: Missing required testimonial data' as check_result;
    END IF;
    
    -- If no errors, return success
    IF v_error_count = 0 THEN
        SELECT 'SUCCESS: Database integrity verified' as check_result;
    ELSE
        SELECT CONCAT('ERROR: Found ', v_error_count, ' integrity issues') as check_result;
    END IF;
END //
DELIMITER ;

-- SP: Generate data quality report
DELIMITER //
CREATE PROCEDURE sp_data_quality_report()
BEGIN
    SELECT 'KPPSM Database Quality Report' as report_title, NOW() as generated_at;
    
    SELECT '--- USER STATISTICS ---' as section;
    SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'moderator' THEN 1 ELSE 0 END) as moderator_count
    FROM users;
    
    SELECT '--- TESTIMONIAL STATISTICS ---' as section;
    SELECT 
        COUNT(*) as total_submitted,
        SUM(CASE WHEN status_approve = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status_approve = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status_approve = 'rejected' THEN 1 ELSE 0 END) as rejected,
        ROUND(AVG(CASE WHEN status_approve = 'approved' THEN rating END), 2) as avg_approved_rating
    FROM testimonial;
    
    SELECT '--- SERVICES & PORTFOLIO ---' as section;
    SELECT 
        (SELECT COUNT(*) FROM services WHERE status = 'aktif') as active_services,
        (SELECT COUNT(*) FROM books WHERE status = 'published') as published_books,
        (SELECT COUNT(*) FROM portfolio WHERE status = 'published') as published_portfolio,
        (SELECT COUNT(*) FROM portfolio_gallery) as total_gallery_images;
    
    SELECT '--- INQUIRY TRACKING ---' as section;
    SELECT 
        COUNT(*) as total_inquiries,
        SUM(CASE WHEN status = 'baru' THEN 1 ELSE 0 END) as new_inquiries,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'spam' THEN 1 ELSE 0 END) as spam_count
    FROM contact_inquiry;
END //
DELIMITER ;

-- SP: Clean up spam inquiries older than 90 days
DELIMITER //
CREATE PROCEDURE sp_cleanup_old_spam(IN p_days INT DEFAULT 90)
BEGIN
    DELETE FROM contact_inquiry
    WHERE status = 'spam' 
    AND tanggal_input < DATE_SUB(NOW(), INTERVAL p_days DAY);
    
    SELECT CONCAT('Cleaned up old spam inquiries older than ', p_days, ' days') as result;
END //
DELIMITER ;

-- =====================================================
-- MAINTENANCE COMMANDS
-- =====================================================

-- Optimize all tables
-- OPTIMIZE TABLE users, roles, permissions, services, service_benefits, 
--                  books, portfolio, portfolio_gallery, testimonial,
--                  contact_inquiry, website_settings, metrics, audit_log,
--                  email_template, email_sent;

-- Check table status
-- SHOW TABLE STATUS FROM kppsm_website;

-- Repair tables (if needed)
-- REPAIR TABLE testimonial;

-- Run database health check
-- CALL sp_database_health_check();

-- Generate quality report
-- CALL sp_data_quality_report();

-- Clean old spam inquiries
-- CALL sp_cleanup_old_spam(90);

-- =====================================================
-- BACKUP & RECOVERY PROCEDURES
-- =====================================================

-- SP: Create backup file list with timestamp
DELIMITER //
CREATE PROCEDURE sp_prepare_backup_info()
BEGIN
    SELECT 
        'KPPSM Database Backup Info' as backup_info,
        NOW() as backup_timestamp,
        DATABASE() as database_name,
        (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()) as total_tables,
        (SELECT SUM(DATA_LENGTH + INDEX_LENGTH) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()) / (1024 * 1024) as size_mb;
END //
DELIMITER ;

-- SP: Generate recovery checklist
DELIMITER //
CREATE PROCEDURE sp_recovery_checklist()
BEGIN
    SELECT 'RECOVERY CHECKLIST - KPPSM Database' as section;
    SELECT '1. Verify database exists' as step;
    SELECT '2. Check all tables are created' as step;
    SELECT '3. Verify data integrity with sp_database_health_check' as step;
    SELECT '4. Check foreign key relationships' as step;
    SELECT '5. Validate views are created' as step;
    SELECT '6. Verify stored procedures are available' as step;
    SELECT '7. Test CRUD operations on testimonial table' as step;
    SELECT '8. Run sp_data_quality_report() for statistics' as step;
    SELECT '9. Check audit_log is recording changes' as step;
    SELECT '10. Verify email_template is configured' as step;
    
    -- Show verification queries
    SELECT '--- VERIFICATION QUERY RESULTS ---' as verification_results;
    
    SELECT 'Total Tables:' as metric, COUNT(*) as value 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE();
    
    SELECT 'Total Stored Procedures:' as metric, COUNT(*) as value
    FROM INFORMATION_SCHEMA.ROUTINES
    WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_TYPE = 'PROCEDURE';
    
    SELECT 'Total Views:' as metric, COUNT(*) as value
    FROM INFORMATION_SCHEMA.VIEWS
    WHERE TABLE_SCHEMA = DATABASE();
    
    SELECT 'Total Triggers:' as metric, COUNT(*) as value
    FROM INFORMATION_SCHEMA.TRIGGERS
    WHERE TRIGGER_SCHEMA = DATABASE();
END //
DELIMITER ;

-- =====================================================
-- SHELL SCRIPTS FOR BACKUP & RESTORE (Run from terminal)
-- =====================================================

-- FILE: backup_kppsm.sh
-- #!/bin/bash
-- # KPPSM Database Backup Script
-- # Usage: ./backup_kppsm.sh
-- 
-- BACKUP_DIR="./backups"
-- TIMESTAMP=$(date +%Y%m%d_%H%M%S)
-- DB_NAME="kppsm_website"
-- DB_USER="root"
-- DB_PASSWORD="your_password_here"
-- 
-- # Create backup directory if not exists
-- mkdir -p $BACKUP_DIR
-- 
-- # Full database backup
-- mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql
-- 
-- # Compress backup
-- gzip $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql
-- 
-- # Keep only last 7 backups
-- cd $BACKUP_DIR
-- ls -t backup_*.sql.gz | tail -n +8 | xargs -r rm
-- 
-- echo "Backup completed: backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

-- FILE: restore_kppsm.sh
-- #!/bin/bash
-- # KPPSM Database Restore Script
-- # Usage: ./restore_kppsm.sh backup_file.sql
-- 
-- if [ -z "$1" ]; then
--     echo "Usage: $0 <backup_file.sql>"
--     exit 1
-- fi
-- 
-- DB_NAME="kppsm_website"
-- DB_USER="root"
-- DB_PASSWORD="your_password_here"
-- BACKUP_FILE="$1"
-- 
-- # Uncompress if needed
-- if [[ $BACKUP_FILE == *.gz ]]; then
--     gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
--     BACKUP_FILE="${BACKUP_FILE%.gz}"
-- fi
-- 
-- # Restore database
-- mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE
-- 
-- echo "Database restored from: $BACKUP_FILE"

-- FILE: backup_schedule.cron
-- # Add to crontab: crontab -e
-- # Daily backup at 2 AM
-- 0 2 * * * /home/user/scripts/backup_kppsm.sh > /var/log/kppsm_backup.log 2>&1
-- 
-- # Run health check daily at 3 AM
-- 0 3 * * * mysql -u root -p password kppsm_website -e "CALL sp_database_health_check();" >> /var/log/kppsm_health.log 2>&1

-- =====================================================
-- INCREMENTAL BACKUP PROCEDURE
-- =====================================================

-- SP: Backup only changed records (since last backup)
DELIMITER //
CREATE PROCEDURE sp_incremental_backup(IN p_backup_timestamp DATETIME)
BEGIN
    SELECT 
        'Backup records changed since: ' + DATE_FORMAT(p_backup_timestamp, '%Y-%m-%d %H:%i:%S') as backup_scope;
    
    -- Export changed testimonials
    SELECT * INTO OUTFILE '/tmp/testimonial_backup.csv'
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    FROM testimonial
    WHERE tanggal_diperbarui > p_backup_timestamp
    OR tanggal_input > p_backup_timestamp;
    
    -- Export new inquiries
    SELECT * INTO OUTFILE '/tmp/inquiry_backup.csv'
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    FROM contact_inquiry
    WHERE tanggal_input > p_backup_timestamp;
    
    SELECT 'Incremental backup completed' as result;
END //
DELIMITER ;

-- =====================================================
-- PERFORMANCE MONITORING
-- =====================================================

-- SP: Monitor query performance
DELIMITER //
CREATE PROCEDURE sp_performance_report()
BEGIN
    SELECT 'TABLE STATISTICS' as section;
    
    SELECT 
        TABLE_NAME,
        TABLE_ROWS as row_count,
        ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as size_mb,
        ROUND(DATA_LENGTH / 1024 / 1024, 2) as data_mb,
        ROUND(INDEX_LENGTH / 1024 / 1024, 2) as index_mb,
        ROUND(((DATA_FREE / 1024 / 1024)), 2) as free_mb
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
    
    SELECT '--- INDEX STATISTICS ---' as index_stats;
    
    SELECT 
        TABLE_NAME,
        INDEX_NAME,
        SEQ_IN_INDEX as seq,
        COLUMN_NAME
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    ORDER BY TABLE_NAME, INDEX_NAME;
END //
DELIMITER ;

-- =====================================================
-- AUTOMATED MAINTENANCE SCHEDULE
-- =====================================================

-- SP: Run scheduled maintenance tasks
DELIMITER //
CREATE PROCEDURE sp_scheduled_maintenance()
BEGIN
    -- Log maintenance start
    INSERT INTO audit_log (action, tabel_name, created_at)
    VALUES ('MAINTENANCE_START', 'system', NOW());
    
    -- Clean old audit logs (keep 1 year)
    DELETE FROM audit_log
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Clean old email logs (keep 6 months)
    DELETE FROM email_sent
    WHERE sent_at < DATE_SUB(NOW(), INTERVAL 6 MONTH)
    AND status != 'failed';
    
    -- Clean spam inquiries (older than 3 months)
    DELETE FROM contact_inquiry
    WHERE status = 'spam'
    AND tanggal_input < DATE_SUB(NOW(), INTERVAL 3 MONTH);
    
    -- Update metrics
    INSERT INTO metrics (metric_name, metric_value, metric_date, metric_type)
    SELECT 
        'total_approved_testimonials' as metric_name,
        COUNT(*) as metric_value,
        CURDATE() as metric_date,
        'count' as metric_type
    FROM testimonial
    WHERE status_approve = 'approved';
    
    INSERT INTO metrics (metric_name, metric_value, metric_date, metric_type)
    SELECT 
        'avg_testimonial_rating' as metric_name,
        ROUND(AVG(rating) * 10, 0) as metric_value,
        CURDATE() as metric_date,
        'rating' as metric_type
    FROM testimonial
    WHERE status_approve = 'approved';
    
    -- Log maintenance end
    INSERT INTO audit_log (action, tabel_name, created_at)
    VALUES ('MAINTENANCE_END', 'system', NOW());
    
    SELECT 'Maintenance completed successfully' as result;
END //
DELIMITER ;

-- =====================================================
-- TESTING QUERIES - Run these to verify setup
-- =====================================================

-- SELECT '=== KPPSM Database Testing ===' as test_title;

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_testimonials FROM testimonial;
-- SELECT COUNT(*) as approved_testimonials FROM testimonial WHERE status_approve = 'approved';
-- SELECT COUNT(*) as total_inquiries FROM contact_inquiry;
-- SELECT COUNT(*) as total_services FROM services;
-- SELECT COUNT(*) as total_portfolio FROM portfolio;

-- SELECT 'Testing Stored Procedures...' as test_type;
-- CALL sp_database_health_check();
-- CALL sp_data_quality_report();
-- CALL sp_performance_report();
-- CALL sp_recovery_checklist();

-- =====================================================
-- DATABASE STATISTICS
-- =====================================================

-- Total tables: 15
-- Total views: 7
-- Total stored procedures: 7
-- Total triggers: 2
-- Total indexes: 30+
-- Sample records: 7 testimonials + supporting data
-- Database charset: utf8mb4 (full Unicode support)
-- Database collation: utf8mb4_unicode_ci

-- =====================================================
-- VERSION HISTORY
-- =====================================================

-- Version 2.1 (August 14, 2024) - MAINTENANCE & TESTING SUITE
-- - Added comprehensive verification queries
-- - Added database health check procedures
-- - Added data quality report generation
-- - Added spam cleanup procedures
-- - Extended sample data (20+ testimonials, 7 portfolio items)
-- - Added gallery images (7 images in 2 categories)
-- - Added 7 contact inquiries with different statuses
-- - Added 3 additional email templates
-- - Added 12 website settings
-- - Complete backup & recovery procedures
-- - Incremental backup functionality
-- - Performance monitoring procedures
-- - Automated maintenance scheduler
-- - Shell scripts for cron scheduling
-- - Recovery checklist & verification
-- - Comprehensive testing queries included

-- Version 2.0 (August 14, 2024)
-- - Complete production-ready schema
-- - Added user management with roles & permissions
-- - Added services management with benefits
-- - Added portfolio/gallery management
-- - Added books management
-- - Added contact inquiry system
-- - Added website settings
-- - Added metrics/analytics tables
-- - Added email template system
-- - Complete audit logging
-- - 7 comprehensive views
-- - 7 stored procedures
-- - 2 automated triggers
-- - Full indexing for performance
-- - Sample data included (7 testimonials)
-- - Complete documentation

-- Version 1.0 (Initial)
-- - Basic testimonial system

-- =====================================================
-- DATABASE FINAL STATISTICS
-- =====================================================

-- Total Tables: 15
-- Total Views: 7
-- Total Stored Procedures: 13
-- Total Triggers: 2
-- Total Indexes: 35+

-- TABLE LIST:
-- 1. users - Admin & staff management
-- 2. roles - Role definitions
-- 3. permissions - Permission definitions
-- 4. role_permissions - M:M relationship
-- 5. services - Layanan unggulan
-- 6. service_benefits - Service benefits
-- 7. books - Buku karya
-- 8. portfolio - Galeri kegiatan
-- 9. portfolio_gallery - Multiple images
-- 10. testimonial - Client testimonials (20+ samples)
-- 11. contact_inquiry - Inquiry tracking (7 samples)
-- 12. website_settings - Configuration store (12 settings)
-- 13. email_template - Email templates (5 templates)
-- 14. email_sent - Email log
-- 15. metrics - Analytics & metrics
-- 16. audit_log - Complete audit trail

-- VIEW LIST:
-- 1. v_approved_testimonials
-- 2. v_testimonials_by_rating
-- 3. v_testimonials_stats
-- 4. v_website_stats
-- 5. v_services_with_benefits
-- 6. v_inquiry_summary
-- 7. v_user_activity

-- STORED PROCEDURE LIST:
-- 1. sp_get_approved_testimonials - Pagination support
-- 2. sp_create_testimonial - Create with validation
-- 3. sp_update_testimonial_status - Update with reason
-- 4. sp_get_dashboard_stats - Dashboard statistics
-- 5. sp_create_inquiry - Create inquiry with logging
-- 6. sp_get_services_detail - Services with benefits
-- 7. sp_log_audit - Audit logging
-- 8. sp_database_health_check - Data integrity check
-- 9. sp_data_quality_report - Quality metrics
-- 10. sp_cleanup_old_spam - Maintenance cleanup
-- 11. sp_prepare_backup_info - Backup metadata
-- 12. sp_recovery_checklist - Post-restore verification
-- 13. sp_incremental_backup - Changed records backup
-- 14. sp_performance_report - Performance metrics
-- 15. sp_scheduled_maintenance - Automated maintenance

-- TRIGGER LIST:
-- 1. tr_testimonial_update - Auto timestamp update
-- 2. tr_testimonial_audit - Auto audit logging

-- SAMPLE DATA INCLUDED:
-- - 3 users (admin, moderator, staff)
-- - 3 roles with permissions
-- - 6 services with 9+ benefits
-- - 4 books
-- - 7 portfolio items with 7 gallery images
-- - 20 testimonials (15 approved, 2 pending, 1 rejected)
-- - 7 contact inquiries (various statuses)
-- - 5 email templates
-- - 12 website settings
-- - All with audit logging enabled

-- =====================================================
-- QUICK START - RUN THESE COMMANDS
-- =====================================================

-- 1. Create database & tables (execute entire script)
-- mysql -u root -p < database-schema.sql

-- 2. Verify installation
-- CALL sp_database_health_check();

-- 3. Generate quality report
-- CALL sp_data_quality_report();

-- 4. Check performance
-- CALL sp_performance_report();

-- 5. View recovery checklist
-- CALL sp_recovery_checklist();

-- 6. Test API endpoints
-- GET /api/v1/testimonials
-- GET /api/v1/services
-- POST /api/v1/contact-inquiry

-- =====================================================
-- PRODUCTION DEPLOYMENT CHECKLIST
-- =====================================================

-- [ ] Database created with correct character set
-- [ ] All tables verified with correct structure
-- [ ] All views created successfully
-- [ ] All stored procedures deployed
-- [ ] All triggers active
-- [ ] Indexes created for performance
-- [ ] Sample data loaded
-- [ ] sp_database_health_check() returns SUCCESS
-- [ ] Backup script configured
-- [ ] Cron job scheduled for automatic backups
-- [ ] Monitoring alerts configured
-- [ ] Email templates configured
-- [ ] JWT secret configured in .env
-- [ ] API endpoints tested and working
-- [ ] Website connected to database
-- [ ] Admin interface ready for use
-- [ ] Documentation reviewed by team

-- =====================================================
-- TROUBLESHOOTING GUIDE
-- =====================================================

-- Issue: "Table already exists" error
-- Solution: DROP DATABASE kppsm_website; before re-running script

-- Issue: "Foreign key constraint fails"
-- Solution: Run "SET FOREIGN_KEY_CHECKS = 0;" before import

-- Issue: "Character encoding mismatch"
-- Solution: Ensure MySQL client is running with: SET NAMES utf8mb4;

-- Issue: "Stored procedure not found"
-- Solution: Check DELIMITER, ensure procedure was created in correct database

-- Issue: "Permission denied" on backup files
-- Solution: Check directory permissions, use secure /var/backups/ directory

-- Issue: "Connection timeout" with large tables
-- Solution: Increase max_allowed_packet in my.cnf: max_allowed_packet=256M

-- =====================================================
-- MAINTENANCE SCHEDULE RECOMMENDATIONS
-- =====================================================

-- Daily:
-- - Run sp_scheduled_maintenance() at 3 AM
-- - Monitor email queue for failures
-- - Check for new spam inquiries

-- Weekly:
-- - Review sp_performance_report()
-- - Verify backup files created successfully
-- - Check audit_log for suspicious activity

-- Monthly:
-- - Run sp_data_quality_report()
-- - Archive old metrics (> 3 months)
-- - Review and optimize slow queries

-- Quarterly:
-- - Full database health check
-- - Update statistics on all tables
-- - Test disaster recovery procedure

-- Annually:
-- - Schema review and optimization
-- - Archive historical audit logs
-- - Performance tuning
-- - Security audit

-- =====================================================
-- SECURITY BEST PRACTICES
-- =====================================================

-- 1. Database Access
-- - Use strong passwords for database users
-- - Restrict database access by IP address
-- - Create separate users for: admin, app, backup
-- - Use SSL for remote connections

-- 2. Data Protection
-- - Enable binary logging for recovery
-- - Regular encrypted backups to external storage
-- - Keep backups tested and verified
-- - Implement row-level security if needed

-- 3. Audit & Compliance
-- - Monitor audit_log table regularly
-- - Archive audit logs monthly
-- - Review access logs quarterly
-- - Maintain compliance documentation

-- 4. Performance
-- - Monitor query performance monthly
-- - Use EXPLAIN on slow queries
-- - Keep statistics updated
-- - Archive old metrics data

-- =====================================================
-- END OF DATABASE SCHEMA v2.1 - PRODUCTION READY
-- COMPLETE MAINTENANCE & TESTING SUITE INCLUDED
-- =======================================================
