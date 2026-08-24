# KPPSM TESTIMONIAL MANAGEMENT API
## Dokumentasi Lengkap REST API

---

## 📋 DAFTAR ISI
1. [Pendahuluan](#pendahuluan)
2. [Authentication](#authentication)
3. [Base URL & Headers](#base-url--headers)
4. [Response Format](#response-format)
5. [Endpoints](#endpoints)
6. [Error Handling](#error-handling)
7. [Contoh Implementasi](#contoh-implementasi)
8. [Status Codes](#status-codes)

---

## Pendahuluan

API KPPSM Testimonial Management System memungkinkan Anda untuk:
- 📖 Membaca (GET) daftar testimoni
- ✍️ Membuat (POST) testimoni baru
- ✏️ Mengubah (PUT) testimoni yang ada
- 🗑️ Menghapus (DELETE) testimoni
- ✅ Menyetujui/Menolak testimoni

**Base API Version:** v1  
**Last Updated:** 2024-08-13  
**Environment:** Production

---

## Authentication

Semua request API harus menyertakan authentication token dalam header:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Mendapatkan Access Token

**Endpoint:** `POST /api/v1/auth/login`

```bash
curl -X POST https://api.kppsm.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kppsm.com",
    "password": "your_password"
  }'
```

**Response (Success):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
```

---

## Base URL & Headers

### Production
```
https://api.kppsm.com/v1
```

### Development
```
http://localhost:3000/api/v1
```

### Required Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

---

## Response Format

Semua response API mengikuti format yang konsisten:

### Success Response
```json
{
  "status": "success",
  "code": 200,
  "message": "Data retrieved successfully",
  "data": {
    // Response data here
  },
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "status": "error",
  "code": 400,
  "message": "Bad Request",
  "errors": [
    {
      "field": "rating",
      "message": "Rating harus antara 1-5"
    }
  ]
}
```

---

## Endpoints

### 1️⃣ GET /testimonials
**Deskripsi:** Mengambil daftar testimoni yang sudah disetujui

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Nomor halaman (default: 1) |
| per_page | integer | No | Item per halaman (default: 10, max: 100) |
| rating | integer | No | Filter berdasarkan rating (1-5) |
| search | string | No | Cari berdasarkan nama/perusahaan |
| sort | string | No | Sorting: 'rating_desc', 'rating_asc', 'date_newest', 'date_oldest' |

**Request:**
```bash
curl -X GET "https://api.kppsm.com/v1/testimonials?page=1&per_page=10&rating=5&sort=date_newest" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonials retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama_perusahaan": "PT Kaji",
      "nama_pemberi_testimoni": "Eka Wijaya",
      "jabatan": "HRD Director",
      "isi_testimoni": "Pelatihan dari KPPSM benar-benar mengubah cara saya memimpin tim...",
      "rating": 5,
      "foto_orang": "https://api.kppsm.com/uploads/foto_orang_1.jpg",
      "logo_perusahaan": "https://api.kppsm.com/uploads/logo_1.png",
      "tanggal_input": "2024-08-13T10:30:00Z",
      "status_approve": "approved"
    },
    {
      "id": 2,
      "nama_perusahaan": "PT Prodia",
      "nama_pemberi_testimoni": "Budi Santoso",
      "jabatan": "General Manager",
      "isi_testimoni": "Pak Tatag membantu saya keluar dari depresi yang dalam...",
      "rating": 5,
      "foto_orang": "https://api.kppsm.com/uploads/foto_orang_2.jpg",
      "logo_perusahaan": "https://api.kppsm.com/uploads/logo_2.png",
      "tanggal_input": "2024-08-12T15:45:00Z",
      "status_approve": "approved"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 7,
    "total_pages": 1
  }
}
```

---

### 2️⃣ GET /testimonials/{id}
**Deskripsi:** Mengambil detail testimoni berdasarkan ID

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID testimoni |

**Request:**
```bash
curl -X GET "https://api.kppsm.com/v1/testimonials/1" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonial retrieved successfully",
  "data": {
    "id": 1,
    "nama_perusahaan": "PT Kaji",
    "nama_pemberi_testimoni": "Eka Wijaya",
    "jabatan": "HRD Director",
    "isi_testimoni": "Pelatihan dari KPPSM benar-benar mengubah cara saya memimpin tim. Dari yang tadinya authoritarian, sekarang saya lebih humanis namun tetap achieve target. Tim jadi lebih engaged dan produktif.",
    "rating": 5,
    "foto_orang": "https://api.kppsm.com/uploads/foto_orang_1.jpg",
    "logo_perusahaan": "https://api.kppsm.com/uploads/logo_1.png",
    "tanggal_input": "2024-08-13T10:30:00Z",
    "tanggal_diperbarui": "2024-08-13T10:30:00Z",
    "status_approve": "approved",
    "created_by": "admin",
    "updated_by": "admin"
  }
}
```

---

### 3️⃣ POST /testimonials
**Deskripsi:** Membuat testimoni baru

**Request Body:**
```json
{
  "nama_perusahaan": "PT ABC Consulting",
  "nama_pemberi_testimoni": "Bambang Riyanto",
  "jabatan": "Vice President",
  "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan.",
  "rating": 5,
  "foto_orang": "https://example.com/foto.jpg",
  "logo_perusahaan": "https://example.com/logo.png"
}
```

**Request:**
```bash
curl -X POST "https://api.kppsm.com/v1/testimonials" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_perusahaan": "PT ABC Consulting",
    "nama_pemberi_testimoni": "Bambang Riyanto",
    "jabatan": "Vice President",
    "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan.",
    "rating": 5,
    "foto_orang": "https://example.com/foto.jpg",
    "logo_perusahaan": "https://example.com/logo.png"
  }'
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| nama_perusahaan | Required, String, Max 255 |
| nama_pemberi_testimoni | Required, String, Max 255 |
| jabatan | Required, String, Max 255 |
| isi_testimoni | Required, String, Min 20, Max 5000 |
| rating | Required, Integer, Between 1-5 |
| foto_orang | Optional, String (URL) |
| logo_perusahaan | Optional, String (URL) |

**Response (201 Created):**
```json
{
  "status": "success",
  "code": 201,
  "message": "Testimonial created successfully",
  "data": {
    "id": 8,
    "nama_perusahaan": "PT ABC Consulting",
    "nama_pemberi_testimoni": "Bambang Riyanto",
    "jabatan": "Vice President",
    "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan.",
    "rating": 5,
    "foto_orang": "https://example.com/foto.jpg",
    "logo_perusahaan": "https://example.com/logo.png",
    "tanggal_input": "2024-08-14T09:15:00Z",
    "status_approve": "pending",
    "created_by": "user@kppsm.com"
  }
}
```

---

### 4️⃣ PUT /testimonials/{id}
**Deskripsi:** Mengubah testimoni yang sudah ada

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID testimoni |

**Request Body:**
```json
{
  "nama_perusahaan": "PT ABC Consulting (Updated)",
  "nama_pemberi_testimoni": "Bambang Riyanto",
  "jabatan": "Senior Vice President",
  "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan. Hasilnya luar biasa!",
  "rating": 5,
  "foto_orang": "https://example.com/foto-updated.jpg",
  "logo_perusahaan": "https://example.com/logo-updated.png"
}
```

**Request:**
```bash
curl -X PUT "https://api.kppsm.com/v1/testimonials/8" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nama_perusahaan": "PT ABC Consulting (Updated)",
    "jabatan": "Senior Vice President",
    "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan. Hasilnya luar biasa!",
    "rating": 5
  }'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonial updated successfully",
  "data": {
    "id": 8,
    "nama_perusahaan": "PT ABC Consulting (Updated)",
    "nama_pemberi_testimoni": "Bambang Riyanto",
    "jabatan": "Senior Vice President",
    "isi_testimoni": "Program KPPSM sangat membantu meningkatkan team performance kami secara signifikan. Hasilnya luar biasa!",
    "rating": 5,
    "foto_orang": "https://example.com/foto-updated.jpg",
    "logo_perusahaan": "https://example.com/logo-updated.png",
    "tanggal_input": "2024-08-14T09:15:00Z",
    "tanggal_diperbarui": "2024-08-14T14:30:00Z",
    "status_approve": "pending",
    "updated_by": "user@kppsm.com"
  }
}
```

---

### 5️⃣ DELETE /testimonials/{id}
**Deskripsi:** Menghapus testimoni

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID testimoni |

**Request:**
```bash
curl -X DELETE "https://api.kppsm.com/v1/testimonials/8" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonial deleted successfully",
  "data": {
    "id": 8,
    "deleted_at": "2024-08-14T14:35:00Z"
  }
}
```

---

### 6️⃣ PUT /testimonials/{id}/approve
**Deskripsi:** Menyetujui testimoni (admin only)

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID testimoni |

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Testimoni berkualitas, lolos verifikasi"
}
```

**Request:**
```bash
curl -X PUT "https://api.kppsm.com/v1/testimonials/8/approve" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "notes": "Testimoni berkualitas, lolos verifikasi"
  }'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonial approved successfully",
  "data": {
    "id": 8,
    "status_approve": "approved",
    "approved_at": "2024-08-14T14:40:00Z",
    "approved_by": "admin@kppsm.com"
  }
}
```

---

### 7️⃣ PUT /testimonials/{id}/reject
**Deskripsi:** Menolak testimoni (admin only)

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID testimoni |

**Request Body:**
```json
{
  "status": "rejected",
  "reason": "Testimoni tidak sesuai dengan guidelines"
}
```

**Request:**
```bash
curl -X PUT "https://api.kppsm.com/v1/testimonials/8/reject" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "reason": "Testimoni tidak sesuai dengan guidelines"
  }'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Testimonial rejected successfully",
  "data": {
    "id": 8,
    "status_approve": "rejected",
    "rejected_at": "2024-08-14T14:45:00Z",
    "rejected_by": "admin@kppsm.com",
    "rejection_reason": "Testimoni tidak sesuai dengan guidelines"
  }
}
```

---

### 8️⃣ GET /testimonials/stats
**Deskripsi:** Mendapatkan statistik testimoni

**Request:**
```bash
curl -X GET "https://api.kppsm.com/v1/testimonials/stats" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_testimoni": 7,
    "approved": 7,
    "pending": 2,
    "rejected": 1,
    "average_rating": 4.86,
    "rating_distribution": {
      "5_stars": 6,
      "4_stars": 1,
      "3_stars": 0,
      "2_stars": 0,
      "1_star": 0
    },
    "unique_companies": 7,
    "last_update": "2024-08-14T14:45:00Z"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Format request tidak valid |
| 401 | Unauthorized | Token tidak valid atau expired |
| 403 | Forbidden | User tidak memiliki izin |
| 404 | Not Found | Resource tidak ditemukan |
| 422 | Unprocessable Entity | Validasi data gagal |
| 500 | Internal Server Error | Error server |

### Error Response Examples

**400 - Bad Request (Validation Error):**
```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "rating",
      "message": "Rating harus antara 1-5"
    },
    {
      "field": "isi_testimoni",
      "message": "Isi testimoni minimal 20 karakter"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "status": "error",
  "code": 401,
  "message": "Unauthorized",
  "error": "Token tidak valid atau telah expired. Silakan login kembali."
}
```

**404 - Not Found:**
```json
{
  "status": "error",
  "code": 404,
  "message": "Resource not found",
  "error": "Testimoni dengan ID 999 tidak ditemukan"
}
```

---

## Contoh Implementasi

### JavaScript (Fetch API)

```javascript
// Get All Testimonials
async function getTestimonials(page = 1, perPage = 10) {
    try {
        const response = await fetch(`https://api.kppsm.com/v1/testimonials?page=${page}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
    }
}

// Create New Testimonial
async function createTestimonial(testimonialData) {
    try {
        const response = await fetch('https://api.kppsm.com/v1/testimonials', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testimonialData)
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
    }
}

// Update Testimonial
async function updateTestimonial(id, updateData) {
    try {
        const response = await fetch(`https://api.kppsm.com/v1/testimonials/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating testimonial:', error);
        throw error;
    }
}

// Delete Testimonial
async function deleteTestimonial(id) {
    try {
        const response = await fetch(`https://api.kppsm.com/v1/testimonials/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
}

// Approve Testimonial
async function approveTestimonial(id, notes = '') {
    try {
        const response = await fetch(`https://api.kppsm.com/v1/testimonials/${id}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'approved', notes })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error approving testimonial:', error);
        throw error;
    }
}
```

### PHP Example

```php
<?php

class KPPSMTestimonialAPI {
    private $apiBase = 'https://api.kppsm.com/v1';
    private $accessToken;

    public function __construct($token) {
        $this->accessToken = $token;
    }

    // Get Testimonials
    public function getTestimonials($page = 1, $perPage = 10) {
        $url = $this->apiBase . "/testimonials?page={$page}&per_page={$perPage}";
        return $this->makeRequest('GET', $url);
    }

    // Create Testimonial
    public function createTestimonial($data) {
        $url = $this->apiBase . '/testimonials';
        return $this->makeRequest('POST', $url, $data);
    }

    // Update Testimonial
    public function updateTestimonial($id, $data) {
        $url = $this->apiBase . "/testimonials/{$id}";
        return $this->makeRequest('PUT', $url, $data);
    }

    // Delete Testimonial
    public function deleteTestimonial($id) {
        $url = $this->apiBase . "/testimonials/{$id}";
        return $this->makeRequest('DELETE', $url);
    }

    // Make HTTP Request
    private function makeRequest($method, $url, $data = null) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->accessToken,
                'Content-Type: application/json'
            ]
        ]);

        if ($data && in_array($method, ['POST', 'PUT'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status_code' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }
}

// Usage
$api = new KPPSMTestimonialAPI('your_access_token');
$testimonials = $api->getTestimonials(1, 10);
print_r($testimonials);

?>
```

---

## Rate Limiting

- **Limit:** 1000 requests per hour
- **Header:** `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Exceeded:** HTTP 429 Too Many Requests

---

## Pagination

Default pagination adalah 10 items per page. Maximum 100 items per page.

```
GET /testimonials?page=2&per_page=20
```

Response includes:
```json
{
  "meta": {
    "page": 2,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## Changelog

### Version 1.0.0
- ✅ Initial API release
- ✅ Basic CRUD operations
- ✅ Authentication & Authorization
- ✅ Pagination & Filtering
- ✅ Statistics endpoint

---

**Last Updated:** August 14, 2024  
**Support:** api-support@kppsm.com  
**Documentation:** https://docs.kppsm.com
