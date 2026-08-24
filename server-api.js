/**
 * KPPSM Testimonial Management API
 * Express.js Backend Implementation
 * 
 * This is a sample implementation of the API endpoints
 * Requires: Node.js, Express, MySQL2, JWT, Multer, Validator
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
require('dotenv').config();

// =====================================================
// APP INITIALIZATION
// =====================================================

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// =====================================================
// DATABASE CONNECTION
// =====================================================

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kppsm_website',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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
        .optional()
        .isURL().withMessage('URL foto orang tidak valid'),
    
    body('logo_perusahaan')
        .optional()
        .isURL().withMessage('URL logo perusahaan tidak valid')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
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
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

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
], async (req, res, next) => {
    try {
        const { page = 1, per_page = 10, rating, search, sort = 'date_newest' } = req.query;
        const offset = (page - 1) * per_page;

        const conn = await pool.getConnection();

        // Build query
        let query = 'SELECT * FROM testimonial WHERE status_approve = "approved"';
        const params = [];

        if (rating) {
            query += ' AND rating = ?';
            params.push(rating);
        }

        if (search) {
            query += ' AND (nama_perusahaan LIKE ? OR nama_pemberi_testimoni LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        const sortMap = {
            'rating_desc': 'ORDER BY rating DESC, tanggal_input DESC',
            'rating_asc': 'ORDER BY rating ASC, tanggal_input DESC',
            'date_newest': 'ORDER BY tanggal_input DESC',
            'date_oldest': 'ORDER BY tanggal_input ASC'
        };
        query += ' ' + sortMap[sort];

        // Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(per_page, offset);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM testimonial WHERE status_approve = "approved"';
        if (rating) {
            countQuery += ' AND rating = ?';
        }
        if (search) {
            countQuery += ' AND (nama_perusahaan LIKE ? OR nama_pemberi_testimoni LIKE ?)';
        }

        const [countResult] = await conn.query(countQuery, 
            rating ? [rating, ...(search ? [`%${search}%`, `%${search}%`] : [])] : (search ? [`%${search}%`, `%${search}%`] : [])
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / per_page);

        // Get testimonials
        const [testimonials] = await conn.query(query, params);

        conn.release();

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonials retrieved successfully',
            data: testimonials,
            meta: {
                page,
                per_page,
                total,
                total_pages: totalPages
            }
        });
    } catch (error) {
        next(error);
    }
});

// 2. GET /api/v1/testimonials/:id - Get Single Testimonial
app.get('/api/v1/testimonials/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const conn = await pool.getConnection();
        const [testimonials] = await conn.query(
            'SELECT * FROM testimonial WHERE id = ?',
            [id]
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

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonial retrieved successfully',
            data: testimonials[0]
        });
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

            const conn = await pool.getConnection();

            const [result] = await conn.query(
                'INSERT INTO testimonial (nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang, logo_perusahaan, created_by, status_approve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang, logo_perusahaan, req.user.email, 'pending']
            );

            conn.release();

            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Testimonial created successfully',
                data: {
                    id: result.insertId,
                    nama_perusahaan,
                    nama_pemberi_testimoni,
                    jabatan,
                    isi_testimoni,
                    rating,
                    foto_orang,
                    logo_perusahaan,
                    status_approve: 'pending',
                    created_by: req.user.email,
                    tanggal_input: new Date()
                }
            });
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
            const {
                nama_perusahaan,
                nama_pemberi_testimoni,
                jabatan,
                isi_testimoni,
                rating,
                foto_orang,
                logo_perusahaan
            } = req.body;

            const conn = await pool.getConnection();

            // Check if testimonial exists
            const [existing] = await conn.query(
                'SELECT * FROM testimonial WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                conn.release();
                return res.status(404).json({
                    status: 'error',
                    code: 404,
                    message: 'Not Found',
                    error: 'Testimoni tidak ditemukan'
                });
            }

            // Update
            await conn.query(
                'UPDATE testimonial SET nama_perusahaan = ?, nama_pemberi_testimoni = ?, jabatan = ?, isi_testimoni = ?, rating = ?, foto_orang = ?, logo_perusahaan = ?, updated_by = ? WHERE id = ?',
                [nama_perusahaan, nama_pemberi_testimoni, jabatan, isi_testimoni, rating, foto_orang, logo_perusahaan, req.user.email, id]
            );

            conn.release();

            res.json({
                status: 'success',
                code: 200,
                message: 'Testimonial updated successfully',
                data: {
                    id,
                    nama_perusahaan,
                    nama_pemberi_testimoni,
                    jabatan,
                    isi_testimoni,
                    rating,
                    foto_orang,
                    logo_perusahaan,
                    updated_by: req.user.email,
                    tanggal_diperbarui: new Date()
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// 5. DELETE /api/v1/testimonials/:id - Delete Testimonial
app.delete('/api/v1/testimonials/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const conn = await pool.getConnection();

        // Check if exists
        const [existing] = await conn.query(
            'SELECT * FROM testimonial WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            conn.release();
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Not Found',
                error: 'Testimoni tidak ditemukan'
            });
        }

        // Delete
        await conn.query('DELETE FROM testimonial WHERE id = ?', [id]);

        conn.release();

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonial deleted successfully',
            data: {
                id,
                deleted_at: new Date()
            }
        });
    } catch (error) {
        next(error);
    }
});

// 6. PUT /api/v1/testimonials/:id/approve - Approve Testimonial
app.put('/api/v1/testimonials/:id/approve', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes = '' } = req.body;

        const conn = await pool.getConnection();

        const [existing] = await conn.query(
            'SELECT * FROM testimonial WHERE id = ?',
            [id]
        );

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
            ['approved', req.user.email, id]
        );

        conn.release();

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonial approved successfully',
            data: {
                id,
                status_approve: 'approved',
                approved_at: new Date(),
                approved_by: req.user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

// 7. PUT /api/v1/testimonials/:id/reject - Reject Testimonial
app.put('/api/v1/testimonials/:id/reject', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason = '' } = req.body;

        const conn = await pool.getConnection();

        const [existing] = await conn.query(
            'SELECT * FROM testimonial WHERE id = ?',
            [id]
        );

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
            ['rejected', req.user.email, id]
        );

        conn.release();

        res.json({
            status: 'success',
            code: 200,
            message: 'Testimonial rejected successfully',
            data: {
                id,
                status_approve: 'rejected',
                rejected_at: new Date(),
                rejected_by: req.user.email,
                rejection_reason: reason
            }
        });
    } catch (error) {
        next(error);
    }
});

// 8. GET /api/v1/testimonials/stats - Get Statistics
app.get('/api/v1/testimonials/stats', authenticate, async (req, res, next) => {
    try {
        const conn = await pool.getConnection();

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

        res.json({
            status: 'success',
            code: 200,
            message: 'Statistics retrieved successfully',
            data: {
                ...stats[0],
                rating_distribution: distribution,
                last_update: new Date()
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

module.exports = app;
