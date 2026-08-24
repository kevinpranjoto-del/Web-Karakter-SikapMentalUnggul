/* =====================================
   KPPSM WEBSITE - MAIN JAVASCRIPT
   Interactive Features & API Integration
   ===================================== */

// =====================================
// 1. HAMBURGER MENU FUNCTIONALITY
// =====================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// =====================================
// 2. SMOOTH SCROLL & ACTIVE NAVIGATION
// =====================================

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, header');
    const scrollY = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id') || '';
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================================
// 3. NAVBAR STICKY EFFECT
// =====================================

const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 100) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// =====================================
// 4. TESTIMONIAL LOADING & CAROUSEL
// =====================================

class TestimonialManager {
    constructor() {
        this.container = document.getElementById('testimoni-container');
        this.staticContainer = document.getElementById('static-testimonials');
        this.controls = document.getElementById('testimoni-controls');
        this.currentIndex = 0;
        this.testimonials = [];
        this.apiEndpoint = window.location.protocol === 'file:'
            ? 'http://localhost:3000/api/v1/testimonials'
            : '/api/v1/testimonials';

        if (!this.container) {
            console.warn('Testimonial container not found');
            return;
        }

        this.init();
    }

    async init() {
        try {
            await this.fetchTestimonials();
            if (this.testimonials.length > 0) {
                this.displayTestimonials();
                this.attachEventListeners();
                if (this.staticContainer) {
                    this.staticContainer.style.display = 'none';
                }
                if (this.controls) {
                    this.controls.style.display = 'flex';
                }
            } else {
                this.handleError();
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.handleError();
        }
    }

    async fetchTestimonials() {
        try {
            const response = await fetch(`${this.apiEndpoint}?page=1&per_page=10&sort=date_newest`);
            if (!response.ok) throw new Error('Network response failed');
            
            const data = await response.json();
            this.testimonials = data.data || [];
            
            if (this.testimonials.length === 0) {
                console.warn('No testimonials found from API, using static fallback');
                this.handleError();
            }
        } catch (error) {
            console.warn('API unavailable, falling back to static testimonials:', error.message);
            this.handleError();
        }
    }

    displayTestimonials() {
        if (this.testimonials.length === 0) return;

        this.container.innerHTML = '';

        // Display up to 3 testimonials at a time
        const itemsPerPage = 3;
        const total = this.testimonials.length;
        const count = Math.min(itemsPerPage, total);
        const startIndex = this.currentIndex % total;
        
        for (let i = 0; i < count; i++) {
            const index = (startIndex + i) % total;
            const testimonial = this.testimonials[index];
            this.container.appendChild(this.createCard(testimonial));
        }
    }

    createCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimoni-card';

        // Create stars
        const starsHTML = this.createStars(testimonial.rating);

        // Escape HTML to prevent XSS
        const sanitize = (str) => {
            const div = document.createElement('div');
            div.textContent = str || '';
            return div.innerHTML;
        };

        const companyLogo = testimonial.logo_perusahaan 
            ? `<img src="${sanitize(testimonial.logo_perusahaan)}" alt="${sanitize(testimonial.nama_perusahaan)}" style="width: 30px; height: auto; margin-top: 5px;" onerror="this.style.display='none'">` 
            : '';

        const authorPhoto = testimonial.foto_orang 
            ? `<img src="${sanitize(testimonial.foto_orang)}" alt="${sanitize(testimonial.nama_pemberi_testimoni)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'">` 
            : '';

        card.innerHTML = `
            <div class="testimoni-stars">
                ${starsHTML}
            </div>
            <p class="testimoni-text">
                "${sanitize(testimonial.isi_testimoni)}"
            </p>
            <div class="testimoni-author">
                ${authorPhoto}
                <div class="author-info">
                    <h4>${sanitize(testimonial.nama_pemberi_testimoni)}</h4>
                    <p>${sanitize(testimonial.jabatan)}, ${sanitize(testimonial.nama_perusahaan)}</p>
                    ${companyLogo}
                </div>
            </div>
        `;

        return card;
    }

    createStars(rating) {
        let starsHTML = '';
        const numRating = parseInt(rating, 10) || 5;
        for (let i = 0; i < 5; i++) {
            if (i < numRating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }

    attachEventListeners() {
        const prevBtn = document.getElementById('prev-testimoni');
        const nextBtn = document.getElementById('next-testimoni');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
    }

    nextPage() {
        if (this.testimonials.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.displayTestimonials();
    }

    previousPage() {
        if (this.testimonials.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.displayTestimonials();
    }

    handleError() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        if (this.controls) {
            this.controls.style.display = 'none';
        }
        if (this.staticContainer) {
            this.staticContainer.style.display = 'grid';
        }
    }
}

// =====================================
// 5. GALLERY LIGHTBOX
// =====================================

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        if (this.galleryItems.length > 0) {
            this.init();
        }
    }

    init() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && img.src && !img.classList.contains('img-fallback')) {
                    this.openLightbox(img.src);
                }
            });
        });
    }

    openLightbox(src) {
        // Remove existing lightbox if any
        const existing = document.querySelector('.lightbox');
        if (existing) existing.remove();

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="Gallery Preview" onerror="this.parentElement.innerHTML='<p style=\\'color:white;padding:2rem\\'>Gambar belum tersedia</p>'">
                <button class="lightbox-close" aria-label="Tutup">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);
        lightbox.style.display = 'flex';

        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => lightbox.remove());
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });

        // Close on ESC key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }
}

// =====================================
// 6. FORM HANDLING & VALIDATION
// =====================================

class FormHandler {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            alert('Harap isi semua field wajib dengan benar.');
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        this.submitForm(data);
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea');
        for (let input of inputs) {
            if (input.required && !input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else if (input.type === 'email' && input.value.trim() && !input.value.includes('@')) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        }
        return isValid;
    }

    async submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim Pesan...';
        }

        try {
            const apiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
            const response = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resData = await response.json().catch(() => ({}));

            if (response.ok) {
                alert(resData.message || 'Terima kasih! Pesan Anda telah kami terima. Tim KPPSM akan segera menghubungi Anda.');
                this.form.reset();
            } else {
                alert(resData.error || resData.message || 'Terjadi kesalahan saat mengirim pesan. Silakan hubungi kami via WhatsApp.');
            }
        } catch (error) {
            console.error('Form submission network error:', error);
            // Fallback direct WhatsApp inquiry
            const msg = `Halo Pak Tatag / KPPSM, saya ${data.nama || ''} ingin berkonsultasi mengenai: ${data.pesan || ''}`;
            if (confirm('Pesan tersimpan. Ingin melanjutkan konsultasi langsung via WhatsApp?')) {
                window.open(`https://wa.me/62818874430?text=${encodeURIComponent(msg)}`, '_blank');
            }
            this.form.reset();
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }
}

// =====================================
// 7. SCROLL REVEAL ANIMATION
// =====================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .buku-card, .value-card, .gallery-item');
        if (this.elements.length > 0 && 'IntersectionObserver' in window) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
}

// =====================================
// 8. WHATSAPP INTEGRATION HELPER
// =====================================

class WhatsAppHelper {
    static openChat(phoneNumber, message = '') {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    static addToWindow() {
        window.openWhatsApp = (phone, msg) => this.openChat(phone, msg);
    }
}

WhatsAppHelper.addToWindow();

// =====================================
// 9. UTILITY FUNCTIONS
// =====================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// =====================================
// 10. CUSTOM STYLES FOR LIGHTBOX
// =====================================

const lightboxStyles = `
    .lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 36px;
        cursor: pointer;
        transition: all 0.3s ease;
        line-height: 1;
    }

    .lightbox-close:hover {
        color: #e8852a;
        transform: scale(1.2);
    }

    @media (max-width: 768px) {
        .lightbox-close {
            top: -35px;
            right: 5px;
            font-size: 30px;
        }
    }
`;

if (!document.getElementById('lightbox-injected-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'lightbox-injected-styles';
    styleSheet.textContent = lightboxStyles;
    document.head.appendChild(styleSheet);
}

// =====================================
// 11. INITIALIZATION ON DOM READY
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Testimonials
    new TestimonialManager();

    // 2. Initialize Lightbox
    new GalleryLightbox();

    // 3. Initialize Contact Form Handler
    new FormHandler('#kontak-form');

    // 4. Initialize Scroll Reveal
    new ScrollReveal();

    // 5. Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + (window.scrollY || window.pageYOffset) - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('KPPSM Website initialized successfully');
});
