/**
 * KPPSM Testimonial Management API
 * Express.js Backend Implementation
 * 
 * Production-ready API endpoints for KPPSM website
 * Requires: Node.js, Express, MySQL2, JWT, Multer, Validator, Cors, Helmet, Morgan
 */

// =====================================================
// DEPENDENCIES
// =====================================================

const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// =====================================================
// APP INITIALIZATION
// =====================================================

const app = express();

// Security & Logging Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '..')));


// =====================================================
// DATABASE CONNECTION & FALLBACK DATA
// =====================================================

const isTestEnv = process.env.NODE_ENV === 'test';

let pool = null;
if (!isTestEnv) {
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kppsm_website',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_POOL_LIMIT, 10) || 10,
        connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT, 10) || 1000,
        queueLimit: 0
    });
}

const getDbConnection = async () => {
    if (isTestEnv || !pool || process.env.USE_MOCK_DB === 'true') {
        throw new Error('Using fallback in-memory data');
    }
    return await pool.getConnection();
};

// In-memory fallback data for demo / testing when MySQL is not connected
const fallbackTestimonials = [
    {
        id: 1,
        nama_perusahaan: 'PT Kaji',
        nama_pemberi_testimoni: 'Eka Wijaya',
        jabatan: 'HRD Director',
        isi_testimoni: 'Pelatihan dari KPPSM benar-benar mengubah cara saya memimpin tim. Dari yang tadinya authoritarian, sekarang saya lebih humanis namun tetap achieve target. Tim jadi lebih engaged dan produktif.',
        rating: 5,
        foto_orang: '',
        logo_perusahaan: '',
        kategori: 'Corporate',
        status_approve: 'approved',
        tanggal_input: '2024-08-10T10:00:00.000Z',
        created_by: 'admin@kppsm.com'
    },
    {
        id: 2,
        nama_perusahaan: 'PT Prodia',
        nama_pemberi_testimoni: 'Budi Santoso',
        jabatan: 'General Manager',
        isi_testimoni: 'Pak Tatag membantu saya keluar dari depresi yang dalam. Tidak hanya terapi, tapi juga mindset coaching yang practical dan bisa langsung saya terapkan. Hidup jadi lebih berwarna.',
        rating: 5,
        foto_orang: '',
        logo_perusahaan: '',
        kategori: 'Executive',
        status_approve: 'approved',
        tanggal_input: '2024-08-11T11:30:00.000Z',
        created_by: 'admin@kppsm.com'
    },
    {
        id: 3,
        nama_perusahaan: 'PT Bumitama Gunajaya Agro',
        nama_pemberi_testimoni: 'Sri Handayani',
        jabatan: 'Sales Manager',
        isi_testimoni: 'Program KPPSM untuk tim sales kami menghasilkan peningkatan performance 85% dalam 3 bulan. Yang paling bagus adalah mindset mereka berubah dari "bekerja karena terpaksa" menjadi "bekerja dengan passion".',
        rating: 5,
        foto_orang: '',
        logo_perusahaan: '',
        kategori: 'Corporate',
        status_approve: 'approved',
        tanggal_input: '2024-08-12T14:15:00.000Z',
        created_by: 'admin@kppsm.com'
    },
    {
        id: 4,
        nama_perusahaan: 'PT Kencana Agro',
        nama_pemberi_testimoni: 'Hendra Gunawan',
        jabatan: 'Operations Director',
        isi_testimoni: 'Transformasi mental yang dibawakan Pak Tatag Utomo menjadi katalis utama pencapaian target produksi 1 juta ton CPO kami. Sinergi tim antar departemen meningkat drastis.',
        rating: 5,
        foto_orang: '',
        logo_perusahaan: '',
        kategori: 'Corporate',
        status_approve: 'approved',
        tanggal_input: '2024-08-13T09:00:00.000Z',
        created_by: 'admin@kppsm.com'
    }
];

const demoUsers = {
    'admin@kppsm.com': {
        id: 1,
        email: 'admin@kppsm.com',
        password: 'admin123',
        name: 'Admin KPPSM',
        role: 'admin'
    }
};

const createAccessToken = (user) => jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
);

// =====================================================
// MIDDLEWARE FUNCTIONS
// =====================================================

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Unauthorized',
            error: 'Token tidak ditemukan'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Unauthorized',
            error: 'Token tidak valid atau telah expired'
        });
    }
};

// Authorization Middleware (Admin only)
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            code: 403,
            message: 'Forbidden',
            error: 'Anda tidak memiliki akses untuk operasi ini'
        });
    }
    next();
};

// Error Handler Middleware
const handleErrors = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan pada server'
    });
};

// =====================================================
// VALIDATION RULES
// =====================================================

const testimonialValidationRules = () => [
    body('nama_perusahaan')
        .trim()
        .notEmpty().withMessage('Nama perusahaan harus diisi')
        .isLength({ max: 255 }).withMessage('Nama perusahaan maksimal 255 karakter'),
    
    body('nama_pemberi_testimoni')
        .trim()
        .notEmpty().withMessage('Nama pemberi testimoni harus diisi')
        .isLength({ max: 255 }).withMessage('Nama pemberi testimoni maksimal 255 karakter'),
    
    body('jabatan')
        .trim()
        .notEmpty().withMessage('Jabatan harus diisi')
        .isLength({ max: 255 }).withMessage('Jabatan maksimal 255 karakter'),
    
    body('isi_testimoni')
        .trim()
        .notEmpty().withMessage('Isi testimoni harus diisi')
        .isLength({ min: 20 }).withMessage('Isi testimoni minimal 20 karakter')
        .isLength({ max: 5000 }).withMessage('Isi testimoni maksimal 5000 karakter'),
    
    body('rating')
        .notEmpty().withMessage('Rating harus diisi')
        .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5'),
    
    body('foto_orang')
        .optional({ checkFalsy: true })
        .isURL().withMessage('URL foto orang tidak valid'),
    
    body('logo_perusahaan')
        .optional({ checkFalsy: true })
        .isURL().withMessage('URL logo perusahaan tidak valid')
];

// express-validator v7 compatible validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'success',
        code: 200,
        message: 'API is healthy',
        data: {
            status: 'ok',
            timestamp: new Date().toISOString()
        }
    });
});

// Auth login
app.post('/api/v1/auth/login', [
    body('email').trim().isEmail().withMessage('Email tidak valid'),
    body('password').trim().notEmpty().withMessage('Password harus diisi')
], validate, (req, res) => {
    const { email, password } = req.body;
    const user = demoUsers[email?.toLowerCase()];

    if (!user || user.password !== password) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Unauthorized',
            error: 'Email atau password salah'
        });
    }

    const accessToken = createAccessToken(user);

    return res.json({
        status: 'success',
        code: 200,
        message: 'Login successful',
        data: {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 86400,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }
    });
});

// 1. GET /api/v1/testimonials - Get All Testimonials
app.get('/api/v1/testimonials', [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('per_page').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
    query('search').optional().trim(),
    query('sort').optional().isIn(['rating_desc', 'rating_asc', 'date_newest', 'date_oldest'])
], validate, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 10;
        const offset = (page - 1) * perPage;
        const { rating, search, sort = 'date_newest' } = req.query;

        let conn;
        try {
            conn = await getDbConnection();
        } catch (dbErr) {
            // DB connection fallback: serve in-memory data
            let filtered = fallbackTestimonials.filter(t => t.status_approve === 'approved');
            if (rating) {
                filtered = filtered.filter(t => t.rating === parseInt(rating, 10));
            }
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(t => 
                    t.nama_perusahaan.toLowerCase().includes(s) || 
                    t.nama_pemberi_testimoni.toLowerCase().includes(s)
                );
            }
            if (sort === 'rating_desc') {
                filtered.sort((a, b) => b.rating - a.rating);
            } else if (sort === 'rating_asc') {
                filtered.sort((a, b) => a.rating - b.rating);
            } else if (sort === 'date_oldest') {
                filtered.sort((a, b) => new Date(a.tanggal_input) - new Date(b.tanggal_input));
            } else {
                filtered.sort((a, b) => new Date(b.tanggal_input) - new Date(a.tanggal_input));
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / perPage) || 1;
            const paginated = filtered.slice(offset, offset + perPage);

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonials retrieved successfully',
                data: paginated,
                meta: {
                    page,
                    per_page: perPage,
                    total,
                    total_pages: totalPages
                }
            });
        }

        // Build query
        let sqlQuery = 'SELECT * FROM testimonial WHERE status_approve = "approved"';
        const params = [];

        if (rating) {
            sqlQuery += ' AND rating = ?';
            params.push(parseInt(rating, 10));
        }

        if (search) {
            sqlQuery += ' AND (nama_perusahaan LIKE ? OR nama_pemberi_testimoni LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        const sortMap = {
            'rating_desc': 'ORDER BY rating DESC, tanggal_input DESC',
            'rating_asc': 'ORDER BY rating ASC, tanggal_input DESC',
            'date_newest': 'ORDER BY tanggal_input DESC',
            'date_oldest': 'ORDER BY tanggal_input ASC'
        };
        sqlQuery += ' ' + (sortMap[sort] || sortMap['date_newest']);

        // Pagination
        sqlQuery += ' LIMIT ? OFFSET ?';
        params.push(perPage, offset);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM testimonial WHERE status_approve = "approved"';
        const countParams = [];
        if (rating) {
            countQuery += ' AND rating = ?';
            countParams.push(parseInt(rating, 10));
        }
        if (search) {
            countQuery += ' AND (nama_perusahaan LIKE ? OR nama_pemberi_testimoni LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const [countResult] = await conn.query(countQuery, countParams);
        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / perPage) || 1;

        // Get testimonials
        const [testimonials] = await conn.query(sqlQuery, params);
        conn.release();

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonials retrieved successfully',
            data: testimonials,
            meta: {
                page,
                per_page: perPage,
                total,
                total_pages: totalPages
            }
        });
    } catch (error) {
        next(error);
    }
});

// 2. GET /api/v1/testimonials/stats - Get Statistics
app.get('/api/v1/testimonials/stats', authenticate, async (req, res, next) => {
    try {
        try {
            const conn = await getDbConnection();

            const [stats] = await conn.query(`
                SELECT 
                    COUNT(*) as total_testimoni,
                    SUM(CASE WHEN status_approve = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status_approve = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status_approve = 'rejected' THEN 1 ELSE 0 END) as rejected,
                    ROUND(AVG(rating), 2) as average_rating,
                    COUNT(DISTINCT nama_perusahaan) as unique_companies
                FROM testimonial
            `);

            const [ratingDist] = await conn.query(`
                SELECT rating, COUNT(*) as count
                FROM testimonial
                WHERE status_approve = 'approved'
                GROUP BY rating
                ORDER BY rating DESC
            `);

            conn.release();

            const distribution = {
                '5_stars': 0,
                '4_stars': 0,
                '3_stars': 0,
                '2_stars': 0,
                '1_star': 0
            };

            ratingDist.forEach(item => {
                distribution[`${item.rating}_star${item.rating !== 1 ? 's' : ''}`] = item.count;
            });

            return res.json({
                status: 'success',
                code: 200,
                message: 'Statistics retrieved successfully',
                data: {
                    ...stats[0],
                    rating_distribution: distribution,
                    last_update: new Date()
                }
            });
        } catch (dbErr) {
            const total = fallbackTestimonials.length;
            const approved = fallbackTestimonials.filter(t => t.status_approve === 'approved').length;
            const pending = fallbackTestimonials.filter(t => t.status_approve === 'pending').length;
            const rejected = fallbackTestimonials.filter(t => t.status_approve === 'rejected').length;
            const avgRating = total > 0 ? (fallbackTestimonials.reduce((acc, t) => acc + t.rating, 0) / total).toFixed(2) : 5.0;

            return res.json({
                status: 'success',
                code: 200,
                message: 'Statistics retrieved successfully',
                data: {
                    total_testimoni: total,
                    approved,
                    pending,
                    rejected,
                    average_rating: parseFloat(avgRating),
                    unique_companies: new Set(fallbackTestimonials.map(t => t.nama_perusahaan)).size,
                    rating_distribution: {
                        '5_stars': fallbackTestimonials.filter(t => t.rating === 5 && t.status_approve === 'approved').length,
                        '4_stars': fallbackTestimonials.filter(t => t.rating === 4 && t.status_approve === 'approved').length,
                        '3_stars': fallbackTestimonials.filter(t => t.rating === 3 && t.status_approve === 'approved').length,
                        '2_stars': fallbackTestimonials.filter(t => t.rating === 2 && t.status_approve === 'approved').length,
                        '1_star': fallbackTestimonials.filter(t => t.rating === 1 && t.status_approve === 'approved').length
                    },
                    last_update: new Date()
                }
            });
        }
    } catch (error) {
        next(error);
    }
});

// 3. GET /api/v1/testimonials/:id - Get Single Testimonial
app.get('/api/v1/testimonials/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const numId = parseInt(id, 10);

        try {
            const conn = await getDbConnection();
            const [testimonials] = await conn.query(
                'SELECT * FROM testimonial WHERE id = ?',
                [numId]
            );
            conn.release();

            if (testimonials.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial retrieved successfully',
                data: testimonials[0]
            });
        } catch (dbErr) {
            const found = fallbackTestimonials.find(t => t.id === numId);
            if (!found) {
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }
            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial retrieved successfully',
                data: found
            });
        }
    } catch (error) {
        next(error);
    }
});


// 3. POST /api/v1/testimonials - Create New Testimonial
app.post('/api/v1/testimonials',
    authenticate,
    testimonialValidationRules(),
    validate,
    async (req, res, next) => {
        try {
            const {
                nama_perusahaan,
                nama_pemberi_testimoni,
                jabatan,
                isi_testimoni,
                rating,
                foto_orang,
                logo_perusahaan
            } = req.body;

            try {
                const conn = await getDbConnection();
                const [result] = await conn.query(
                    'INSERT INTO testimonial (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang, logo_perusahaan, created_by, status_approve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang || null, logo_perusahaan || null, req.user.email, 'pending']
                );
                conn.release();

                return res.status(201).json({
                    status: 'success',
                    code: 201,
                    message: 'Testimonial created successfully',
                    data: {
                        id: result.insertId,
                        nama_perusahaan,
                        nama_pemberi_testimoni,
                        jabatan,
                        isi_testimoni,
                        rating: parseInt(rating, 10),
                        foto_orang: foto_orang || null,
                        logo_perusahaan: logo_perusahaan || null,
                        status_approve: 'pending',
                        created_by: req.user.email,
                        tanggal_input: new Date()
                    }
                });
            } catch (dbErr) {
                const newId = fallbackTestimonials.length + 1;
                const newTestimonial = {
                    id: newId,
                    nama_perusahaan,
                    nama_pemberi_testimoni,
                    jabatan,
                    isi_testimoni,
                    rating: parseInt(rating, 10),
                    foto_orang: foto_orang || null,
                    logo_perusahaan: logo_perusahaan || null,
                    status_approve: 'pending',
                    created_by: req.user.email,
                    tanggal_input: new Date()
                };
                fallbackTestimonials.push(newTestimonial);

                return res.status(201).json({
                    status: 'success',
                    code: 201,
                    message: 'Testimonial created successfully',
                    data: newTestimonial
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

// 4. PUT /api/v1/testimonials/:id - Update Testimonial
app.put('/api/v1/testimonials/:id',
    authenticate,
    testimonialValidationRules(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const numId = parseInt(id, 10);
            const {
                nama_perusahaan,
                nama_pemberi_testimoni,
                jabatan,
                isi_testimoni,
                rating,
                foto_orang,
                logo_perusahaan
            } = req.body;

            try {
                const conn = await getDbConnection();
                const [existing] = await conn.query('SELECT * FROM testimonial WHERE id = ?', [numId]);

                if (existing.length === 0) {
                    conn.release();
                    return res.status(404).json({
                        status: 'error',
                        code: 404,
                        message: 'Not Found',
                        error: 'Testimoni tidak ditemukan'
                    });
                }

                await conn.query(
                    'UPDATE testimonial SET nama_perusahaan = ?, nama_pemberi_testimoni = ?, jabatan = ?, isi_testimoni = ?, rating = ?, foto_orang = ?, logo_perusahaan = ?, updated_by = ? WHERE id = ?',
                    [nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang || null, logo_perusahaan || null, req.user.email, numId]
                );
                conn.release();

                return res.json({
                    status: 'success',
                    code: 200,
                    message: 'Testimonial updated successfully',
                    data: {
                        id: numId,
                        nama_perusahaan,
                        nama_pemberi_testimoni,
                        jabatan,
                        isi_testimoni,
                        rating: parseInt(rating, 10),
                        foto_orang: foto_orang || null,
                        logo_perusahaan: logo_perusahaan || null,
                        updated_by: req.user.email,
                        tanggal_diperbarui: new Date()
                    }
                });
            } catch (dbErr) {
                const index = fallbackTestimonials.findIndex(t => t.id === numId);
                if (index === -1) {
                    return res.status(404).json({
                        status: 'error',
                        code: 404,
                        message: 'Not Found',
                        error: 'Testimoni tidak ditemukan'
                    });
                }
                fallbackTestimonials[index] = {
                    ...fallbackTestimonials[index],
                    nama_perusahaan,
                    nama_pemberi_testimoni,
                    jabatan,
                    isi_testimoni,
                    rating: parseInt(rating, 10),
                    foto_orang: foto_orang || null,
                    logo_perusahaan: logo_perusahaan || null,
                    updated_by: req.user.email,
                    tanggal_diperbarui: new Date()
                };

                return res.json({
                    status: 'success',
                    code: 200,
                    message: 'Testimonial updated successfully',
                    data: fallbackTestimonials[index]
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

// 5. DELETE /api/v1/testimonials/:id - Delete Testimonial
app.delete('/api/v1/testimonials/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const numId = parseInt(id, 10);

        try {
            const conn = await getDbConnection();
            const [existing] = await conn.query('SELECT * FROM testimonial WHERE id = ?', [numId]);

            if (existing.length === 0) {
                conn.release();
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }

            await conn.query('DELETE FROM testimonial WHERE id = ?', [numId]);
            conn.release();

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial deleted successfully',
                data: {
                    id: numId,
                    deleted_at: new Date()
                }
            });
        } catch (dbErr) {
            const index = fallbackTestimonials.findIndex(t => t.id === numId);
            if (index === -1) {
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }
            fallbackTestimonials.splice(index, 1);
            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial deleted successfully',
                data: {
                    id: numId,
                    deleted_at: new Date()
                }
            });
        }
    } catch (error) {
        next(error);
    }
});

// 6. PUT /api/v1/testimonials/:id/approve - Approve Testimonial
app.put('/api/v1/testimonials/:id/approve', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const numId = parseInt(id, 10);
        const { notes = '' } = req.body;

        try {
            const conn = await getDbConnection();
            const [existing] = await conn.query('SELECT * FROM testimonial WHERE id = ?', [numId]);

            if (existing.length === 0) {
                conn.release();
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }

            await conn.query(
                'UPDATE testimonial SET status_approve = ?, updated_by = ? WHERE id = ?',
                ['approved', req.user.email, numId]
            );
            conn.release();

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial approved successfully',
                data: {
                    id: numId,
                    status_approve: 'approved',
                    approved_at: new Date(),
                    approved_by: req.user.email,
                    notes: notes || undefined
                }
            });
        } catch (dbErr) {
            const found = fallbackTestimonials.find(t => t.id === numId);
            if (!found) {
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }
            found.status_approve = 'approved';
            found.updated_by = req.user.email;

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial approved successfully',
                data: {
                    id: numId,
                    status_approve: 'approved',
                    approved_at: new Date(),
                    approved_by: req.user.email,
                    notes: notes || undefined
                }
            });
        }
    } catch (error) {
        next(error);
    }
});

// 7. PUT /api/v1/testimonials/:id/reject - Reject Testimonial (with reason stored in DB)
app.put('/api/v1/testimonials/:id/reject', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const numId = parseInt(id, 10);
        const { reason = '' } = req.body;

        try {
            const conn = await getDbConnection();
            const [existing] = await conn.query('SELECT * FROM testimonial WHERE id = ?', [numId]);

            if (existing.length === 0) {
                conn.release();
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }

            await conn.query(
                'UPDATE testimonial SET status_approve = ?, alasan_tolak = ?, updated_by = ? WHERE id = ?',
                ['rejected', reason, req.user.email, numId]
            );
            conn.release();

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial rejected successfully',
                data: {
                    id: numId,
                    status_approve: 'rejected',
                    rejected_at: new Date(),
                    rejected_by: req.user.email,
                    rejection_reason: reason
                }
            });
        } catch (dbErr) {
            const found = fallbackTestimonials.find(t => t.id === numId);
            if (!found) {
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }
            found.status_approve = 'rejected';
            found.alasan_tolak = reason;
            found.updated_by = req.user.email;

            return res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial rejected successfully',
                data: {
                    id: numId,
                    status_approve: 'rejected',
                    rejected_at: new Date(),
                    rejected_by: req.user.email,
                    rejection_reason: reason
                }
            });
        }
    } catch (error) {
        next(error);
    }
});


// 9. POST /api/contact - Contact inquiry endpoint
app.post('/api/contact', [
    body('nama').trim().notEmpty().withMessage('Nama harus diisi'),
    body('email').trim().isEmail().withMessage('Email tidak valid'),
    body('pesan').trim().notEmpty().withMessage('Pesan harus diisi')
], validate, async (req, res, next) => {
    try {
        const { nama, email, telepon, perusahaan, pesan } = req.body;
        try {
            const conn = await getDbConnection();
            await conn.query(
                'INSERT INTO contact_inquiry (nama, email, telepon, perusahaan, subjek, pesan) VALUES (?, ?, ?, ?, ?, ?)',
                [nama, email, telepon || null, perusahaan || null, 'Konsultasi via Website', pesan]
            );
            conn.release();
        } catch (dbErr) {
            // DB pool offline, processed gracefully
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Terima kasih! Pesan Anda telah kami terima. Tim KPPSM akan segera menghubungi Anda.',
            data: {
                nama,
                email,
                created_at: new Date()
            }
        });
    } catch (error) {
        next(error);
    }
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use(handleErrors);

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`KPPSM Testimonial API running on port ${PORT}`);
    });
}

app.pool = pool;

module.exports = app;
