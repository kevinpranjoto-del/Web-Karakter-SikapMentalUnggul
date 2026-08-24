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

// =====================================
// 2. SMOOTH SCROLL & ACTIVE NAVIGATION
// =====================================

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================================
// 3. NAVBAR STICKY EFFECT
// =====================================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

// =====================================
// 4. TESTIMONIAL LOADING & CAROUSEL
// =====================================

class TestimonialManager {
    constructor() {
        this.container = document.getElementById('testimoni-container');
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
            this.displayTestimonials();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.handleError();
        }
    }

    async fetchTestimonials() {
        try {
            const response = await fetch(`${this.apiEndpoint}?status=approved`);
            if (!response.ok) throw new Error('Network response failed');
            
            const data = await response.json();
            this.testimonials = data.data || [];
            
            if (this.testimonials.length === 0) {
                console.warn('No testimonials found, using static fallback');
                this.container.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            this.container.style.display = 'none';
        }
    }

    displayTestimonials() {
        if (this.testimonials.length === 0) return;

        this.container.innerHTML = '';

        // Display 3 testimonials at a time (or less if fewer available)
        const itemsPerPage = 3;
        const startIndex = this.currentIndex % this.testimonials.length;
        
        for (let i = 0; i < itemsPerPage && this.testimonials.length > 0; i++) {
            const index = (startIndex + i) % this.testimonials.length;
            const testimonial = this.testimonials[index];
            this.container.appendChild(this.createCard(testimonial));
        }
    }

    createCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimoni-card';

        // Create stars
        const starsHTML = this.createStars(testimonial.rating);

        // Create card HTML
        card.innerHTML = `
            <div class="testimoni-stars">
                ${starsHTML}
            </div>
            <p class="testimoni-text">
                "${testimonial.isi_testimoni}"
            </p>
            <div class="testimoni-author">
                ${testimonial.foto_orang ? `
                    <img src="${testimonial.foto_orang}" alt="${testimonial.nama_pemberi_testimoni}" 
                         style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                ` : ''}
                <div class="author-info">
                    <h4>${testimonial.nama_pemberi_testimoni}</h4>
                    <p>${testimonial.jabatan}, ${testimonial.nama_perusahaan}</p>
                    ${testimonial.logo_perusahaan ? `
                        <img src="${testimonial.logo_perusahaan}" alt="${testimonial.nama_perusahaan}" 
                             style="width: 30px; height: auto; margin-top: 5px;">
                    ` : ''}
                </div>
            </div>
        `;

        return card;
    }

    createStars(rating) {
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
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

        // Auto rotate every 5 seconds (optional)
        // setInterval(() => this.nextPage(), 5000);
    }

    nextPage() {
        this.currentIndex += 1;
        this.displayTestimonials();
    }

    previousPage() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.displayTestimonials();
    }

    handleError() {
        console.log('Using static testimonials as fallback');
        // Static testimonials dari HTML sudah ada
    }
}

// Initialize testimonial manager on page load
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialManager();
});

// =====================================
// 5. GALLERY LIGHTBOX (OPTIONAL)
// =====================================

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.openLightbox(e.target.src);
            });
        });
    }

    openLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="Gallery Image">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);
        lightbox.style.display = 'flex';

        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => {
            lightbox.remove();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
    }
}

// Initialize gallery lightbox
if (document.querySelectorAll('.gallery-item').length > 0) {
    new GalleryLightbox();
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
            alert('Harap isi semua field dengan benar');
            return;
        }

        const formData = new FormData(this.form);
        this.submitForm(formData);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        for (let input of inputs) {
            if (input.required && !input.value.trim()) {
                input.classList.add('error');
                return false;
            }
            input.classList.remove('error');
        }
        return true;
    }

    async submitForm(formData) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Terima kasih! Pesan Anda telah dikirim.');
                this.form.reset();
            } else {
                alert('Terjadi error. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Terjadi error. Silakan coba lagi nanti.');
        }
    }
}

// Initialize form handlers if forms exist
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan form selector sesuai dengan HTML Anda
    // new FormHandler('#kontak-form');
});

// =====================================
// 7. SCROLL REVEAL ANIMATION
// =====================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .buku-card, .value-card');
        this.init();
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
            rootMargin: '0px 0px -100px 0px'
        });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
}

// Initialize scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

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

// Format currency (for pricing if needed)
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
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
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }

    .lightbox-close {
        position: absolute;
        top: -30px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .lightbox-close:hover {
        color: #e8852a;
        transform: scale(1.2);
    }

    @media (max-width: 768px) {
        .lightbox-close {
            top: 10px;
            right: 10px;
            font-size: 30px;
        }
    }
`;

// Inject lightbox styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// =====================================
// 11. NAVIGATION ACTIVE STATE
// ===================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll untuk semua internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// =====================================
// 12. INITIALIZATION
// =====================================

console.log('KPPSM Website initialized successfully');
