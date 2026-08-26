/* ==========================================================================
   KPPSM WEBSITE - MAIN JAVASCRIPT
   Interactive Features, Navigation, Lightbox & Contact Form Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MOBILE NAVIGATION & DRAWER ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);
        if (navOverlay) navOverlay.addEventListener('click', closeMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- 2. SMOOTH SCROLL & ACTIVE SCROLLSPY ---
    const sections = document.querySelectorAll('section[id], header[id]');
    
    function updateScrollSpy() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.getElementById('navbar');

        // Sticky Navbar shadow effect
        if (navbar) {
            if (scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link tracking
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();

    // Smooth Scroll with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    function openLightbox(imgSrc, title) {
        const existing = document.querySelector('.lightbox');
        if (existing) existing.remove();

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${imgSrc}" alt="${title || 'Dokumentasi KPPSM'}">
                <button class="lightbox-close" aria-label="Tutup Preview">&times;</button>
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

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.getAttribute('data-title') || '';
            if (img && img.src) {
                openLightbox(img.src, title);
            }
        });
    });

    // --- 4. TESTIMONIAL CAROUSEL & API HANDLER ---
    class TestimonialSlider {
        constructor() {
            this.container = document.getElementById('testimoni-container');
            this.staticContainer = document.getElementById('static-testimonials');
            this.controls = document.getElementById('testimoni-controls');
            this.prevBtn = document.getElementById('prev-testimoni');
            this.nextBtn = document.getElementById('next-testimoni');
            this.testimonials = [];
            this.currentIndex = 0;
            this.apiEndpoint = window.location.protocol === 'file:' 
                ? 'http://localhost:3000/api/v1/testimonials' 
                : '/api/v1/testimonials';

            this.init();
        }

        async init() {
            try {
                const response = await fetch(`${this.apiEndpoint}?page=1&per_page=9&sort=date_newest`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('API Unavailable');
                const result = await response.json();
                
                if (result && result.data && result.data.length > 0) {
                    this.testimonials = result.data;
                    this.renderCards();
                    this.attachEvents();
                    if (this.staticContainer) this.staticContainer.style.display = 'none';
                    if (this.controls) this.controls.style.display = 'flex';
                } else {
                    this.fallback();
                }
            } catch (err) {
                this.fallback();
            }
        }

        fallback() {
            if (this.container) this.container.style.display = 'none';
            if (this.controls) this.controls.style.display = 'none';
            if (this.staticContainer) this.staticContainer.style.display = 'grid';
        }

        renderCards() {
            if (!this.container || this.testimonials.length === 0) return;
            this.container.innerHTML = '';

            const itemsCount = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
            const total = this.testimonials.length;

            for (let i = 0; i < itemsCount; i++) {
                const index = (this.currentIndex + i) % total;
                const t = this.testimonials[index];
                this.container.appendChild(this.createCard(t));
            }
        }

        createCard(t) {
            const card = document.createElement('div');
            card.className = 'testimoni-card';

            const rating = parseInt(t.rating, 10) || 5;
            let stars = '';
            for (let s = 0; s < 5; s++) {
                stars += s < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }

            const sanitize = (str) => {
                const div = document.createElement('div');
                div.textContent = str || '';
                return div.innerHTML;
            };

            const initials = (t.nama_pemberi_testimoni || 'K')
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            card.innerHTML = `
                <div class="testimoni-top">
                    <div class="testimoni-stars">${stars}</div>
                    <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
                </div>
                <p class="testimoni-text">"${sanitize(t.isi_testimoni)}"</p>
                <div class="testimoni-author">
                    <div class="author-avatar">${initials}</div>
                    <div class="author-info">
                        <h4>${sanitize(t.nama_pemberi_testimoni)}</h4>
                        <p>${sanitize(t.jabatan)}, ${sanitize(t.nama_perusahaan)}</p>
                    </div>
                </div>
            `;
            return card;
        }

        attachEvents() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
                    this.renderCards();
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
                    this.renderCards();
                });
            }
            window.addEventListener('resize', () => this.renderCards());
        }
    }

    new TestimonialSlider();

    // --- 5. INTERACTIVE CONTACT FORM ---
    const contactForm = document.getElementById('kontak-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const namaInput = contactForm.querySelector('#nama');
            const emailInput = contactForm.querySelector('#email');
            const teleponInput = contactForm.querySelector('#telepon');
            const perusahaanInput = contactForm.querySelector('#perusahaan');
            const pesanInput = contactForm.querySelector('#pesan');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            let isValid = true;
            [namaInput, emailInput, teleponInput, pesanInput].forEach(input => {
                if (!input || !input.value.trim()) {
                    if (input) input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });

            if (emailInput && emailInput.value.trim() && !emailInput.value.includes('@')) {
                emailInput.classList.add('error');
                isValid = false;
            }

            if (!isValid) {
                alert('Mohon lengkapi semua kolom wajib dengan benar.');
                return;
            }

            const formData = {
                nama: namaInput.value.trim(),
                email: emailInput.value.trim(),
                telepon: teleponInput.value.trim(),
                perusahaan: perusahaanInput ? perusahaanInput.value.trim() : '',
                pesan: pesanInput.value.trim()
            };

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim Permintaan...';
            }

            try {
                const apiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
                const response = await fetch(`${apiBase}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Terima kasih! Permintaan konsultasi Anda telah berhasil dikirim. Tim Pak Tatag Utomo akan segera menghubungi Anda.');
                    contactForm.reset();
                } else {
                    throw new Error('Fallback WA');
                }
            } catch (err) {
                // Fallback direct WhatsApp integration
                const waMessage = `Halo Pak Tatag Utomo / KPPSM,%0A%0ASaya: *${encodeURIComponent(formData.nama)}*%0APerusahaan: *${encodeURIComponent(formData.perusahaan || '-')}*%0ANo. Kontak: *${encodeURIComponent(formData.telepon)}*%0AEmail: *${encodeURIComponent(formData.email)}*%0A%0AKebutuhan Pelatihan:%0A${encodeURIComponent(formData.pesan)}`;
                
                const proceedWA = confirm('Permintaan Anda tercatat. Ingin terhubung langsung via WhatsApp sekarang?');
                if (proceedWA) {
                    window.open(`https://wa.me/62818874430?text=${waMessage}`, '_blank');
                }
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    console.log('KPPSM Executive Portal Loaded Successfully.');
});
