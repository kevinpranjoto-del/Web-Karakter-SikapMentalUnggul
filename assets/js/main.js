/**
 * ============================================================================
 * KPPSM F.X. POERWOPOESPITO - MAIN JAVASCRIPT
 * Module: Blue Navbar, Mobile Drawer, Accordions, Tabs, Testimonials,
 *         711 Training Log Interactive Table, & Full Owner Edit System
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. GLOBAL STATE & CONFIG
  // ==========================================================================
  const OWNER_PASSWORD = 'kppsm1992';
  const STORAGE_KEY = 'kppsm_owner_edits_v1';
  const SESSION_KEY = 'kppsm_owner_session_active';

  let isOwner = false;
  let editMode = false;

  // Training Table State
  let trainingData = [];
  let filteredTrainingData = [];
  let trainingCurrentPage = 1;
  let trainingRowsPerPage = 20;
  let trainingSearchQuery = '';
  let trainingFilterYear = 'all';
  let trainingFilterType = 'all';

  // ==========================================================================
  // 2. INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initMobileNavigation();
    initAccordions();
    initTabs();
    initTestimonials();
    initTrainingTable();
    initOwnerSystem();
  });

  // ==========================================================================
  // 3. SCROLL REVEAL ANIMATION
  // ==========================================================================
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('show');
              }, index * 35);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      fadeElements.forEach((el) => observer.observe(el));
    } else {
      fadeElements.forEach((el) => el.classList.add('show'));
    }
  }

  // ==========================================================================
  // 4. NAVBAR (WARNA BACKGROUND BIRU) & SCROLL EFFECT
  // ==========================================================================
  function initNavbarScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ==========================================================================
  // 5. MOBILE DRAWER NAVIGATION & SUBMENUS
  // ==========================================================================
  function initMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const iconOpen = document.getElementById('iconOpen');
    const iconClose = document.getElementById('iconClose');
    let isMenuOpen = false;

    if (!hamburgerBtn || !mobileMenu) return;

    // Toggle Mobile Drawer
    hamburgerBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('open', isMenuOpen);
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', isMenuOpen);
        iconClose.classList.toggle('hidden', !isMenuOpen);
      }
      hamburgerBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
    });

    // Close menu when clicking navigation links
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.remove('open');
        if (iconOpen && iconClose) {
          iconOpen.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Mobile Submenu Accordions
    document.querySelectorAll('.mobile-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        const chev = btn.querySelector('.chev');

        if (target) {
          const isOpen = target.classList.toggle('open');
          if (chev) chev.classList.toggle('rot', isOpen);
        }
      });
    });
  }

  // ==========================================================================
  // 6. ACCORDIONS (METODE & SIFAT PELATIHAN)
  // ==========================================================================
  function initAccordions() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const body = document.getElementById(targetId);
        const icon = btn.querySelector('.accordion-icon');
        const isCurrentlyOpen = body && body.classList.contains('open');

        if (body) body.classList.toggle('open');
        if (icon) icon.classList.toggle('open');
        btn.setAttribute('aria-expanded', isCurrentlyOpen ? 'false' : 'true');
      });
    });
  }

  // ==========================================================================
  // 7. TAB SWITCHER (KEUNGGULAN KAMI)
  // ==========================================================================
  function initTabs() {
    window.switchTab = function (tabName) {
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById(`tab-${tabName}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });

      const select = document.getElementById('tabSelect');
      if (select && select.value !== tabName) {
        select.value = tabName;
      }
    };
  }

  // ==========================================================================
  // 8. TESTIMONIAL FILTER SWITCHER
  // ==========================================================================
  function initTestimonials() {
    window.filterTesti = function (category) {
      document.querySelectorAll('.testi-filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.category === category);
      });

      const cards = document.querySelectorAll('.testi-card');
      cards.forEach((card) => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.classList.add('fade-in', 'show');
        } else {
          card.style.display = 'none';
        }
      });

      const partnerContainer = document.getElementById('testiPartnerContainer');
      if (partnerContainer) {
        if (category === 'all' || category === 'Partner') {
          partnerContainer.style.display = 'block';
        } else {
          partnerContainer.style.display = 'none';
        }
      }
    };
  }

  // ==========================================================================
  // 9. DATA PENGALAMAN TRAINING (711 ROWS FROM PDF + REAL-TIME CONTROLLER)
  // ==========================================================================
  function initTrainingTable() {
    // 1. Load initial data from window.KPPSM_TRAINING_DATA
    if (window.KPPSM_TRAINING_DATA && Array.isArray(window.KPPSM_TRAINING_DATA)) {
      trainingData = JSON.parse(JSON.stringify(window.KPPSM_TRAINING_DATA));
    } else {
      trainingData = [];
    }

    // 2. Check for custom additions/edits from localStorage
    const stored = getStoredEdits();
    if (stored && stored.customTrainingData && Array.isArray(stored.customTrainingData)) {
      trainingData = stored.customTrainingData;
    }

    populateYearFilter();
    populateTypeFilter();
    setupTableEventListeners();
    applyTrainingFilters();
  }

  function populateYearFilter() {
    const yearSelect = document.getElementById('trainingYearFilter');
    if (!yearSelect) return;

    const years = Array.from(new Set(trainingData.map(d => d.tahun).filter(Boolean))).sort((a, b) => b - a);
    
    // Preserve "Semua Tahun" option
    yearSelect.innerHTML = '<option value="all">Semua Tahun (1992 - 2025)</option>';
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `Tahun ${y}`;
      yearSelect.appendChild(opt);
    });
  }

  function populateTypeFilter() {
    const typeSelect = document.getElementById('trainingTypeFilter');
    if (!typeSelect) return;

    const types = Array.from(new Set(trainingData.map(d => d.tipe).filter(Boolean))).sort();
    
    typeSelect.innerHTML = '<option value="all">Semua Jenis Kegiatan</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    });
  }

  function setupTableEventListeners() {
    const searchInput = document.getElementById('trainingSearchInput');
    const yearSelect = document.getElementById('trainingYearFilter');
    const typeSelect = document.getElementById('trainingTypeFilter');
    const perPageSelect = document.getElementById('trainingPerPageSelect');
    const prevBtn = document.getElementById('trainingPrevBtn');
    const nextBtn = document.getElementById('trainingNextBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        trainingSearchQuery = e.target.value.trim().toLowerCase();
        trainingCurrentPage = 1;
        applyTrainingFilters();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        trainingFilterYear = e.target.value;
        trainingCurrentPage = 1;
        applyTrainingFilters();
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        trainingFilterType = e.target.value;
        trainingCurrentPage = 1;
        applyTrainingFilters();
      });
    }

    if (perPageSelect) {
      perPageSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        trainingRowsPerPage = val === 'all' ? 9999 : parseInt(val, 10);
        trainingCurrentPage = 1;
        applyTrainingFilters();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (trainingCurrentPage > 1) {
          trainingCurrentPage--;
          renderTrainingTable();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTrainingData.length / trainingRowsPerPage) || 1;
        if (trainingCurrentPage < totalPages) {
          trainingCurrentPage++;
          renderTrainingTable();
        }
      });
    }
  }

  function applyTrainingFilters() {
    filteredTrainingData = trainingData.filter(item => {
      // 1. Search Query Filter
      if (trainingSearchQuery) {
        const fullStr = `${item.no} ${item.tahun} ${item.bulan} ${item.tanggal} ${item.kota} ${item.perusahaan} ${item.peserta} ${item.tipe} ${item.keterangan}`.toLowerCase();
        if (!fullStr.includes(trainingSearchQuery)) {
          return false;
        }
      }

      // 2. Year Filter
      if (trainingFilterYear !== 'all' && item.tahun !== trainingFilterYear) {
        return false;
      }

      // 3. Type Filter
      if (trainingFilterType !== 'all' && item.tipe !== trainingFilterType) {
        return false;
      }

      return true;
    });

    renderTrainingTable();
  }

  function getBadgeClass(tipe) {
    if (!tipe) return 'badge-tipe-lainnya';
    const t = tipe.toLowerCase();
    if (t.includes('training')) return 'badge-tipe-training';
    if (t.includes('follow')) return 'badge-tipe-followup';
    if (t.includes('seminar')) return 'badge-tipe-seminar';
    if (t.includes('test') || t.includes('betest')) return 'badge-tipe-betest';
    return 'badge-tipe-lainnya';
  }

  function renderTrainingTable() {
    const tbody = document.getElementById('trainingLogBody');
    const counter = document.getElementById('trainingCounterText');
    const paginationWrap = document.getElementById('trainingPaginationPages');
    const prevBtn = document.getElementById('trainingPrevBtn');
    const nextBtn = document.getElementById('trainingNextBtn');

    if (!tbody) return;

    const total = filteredTrainingData.length;
    const totalPages = Math.ceil(total / trainingRowsPerPage) || 1;

    if (trainingCurrentPage > totalPages) trainingCurrentPage = totalPages;
    if (trainingCurrentPage < 1) trainingCurrentPage = 1;

    const startIdx = (trainingCurrentPage - 1) * trainingRowsPerPage;
    const endIdx = Math.min(startIdx + trainingRowsPerPage, total);
    const pagedData = filteredTrainingData.slice(startIdx, endIdx);

    // Update Counter text
    if (counter) {
      if (total === 0) {
        counter.innerHTML = 'Tidak ada data yang cocok dengan pencarian / filter';
      } else {
        counter.innerHTML = `Menampilkan <span class="font-bold text-navy">${startIdx + 1}&ndash;${endIdx}</span> dari <span class="font-bold text-hijau">${total}</span> data training (${trainingData.length} total arsip)`;
      }
    }

    // Render Table Rows
    if (pagedData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-10 text-gray-500 font-medium">
            <i class="fas fa-search text-gray-300 text-3xl mb-3 block"></i>
            Data tidak ditemukan untuk kata kunci tersebut. Coba sesuaikan kata kunci atau filter tahun.
          </td>
        </tr>
      `;
    } else {
      const isContentEditable = editMode ? 'true' : 'false';
      let html = '';

      pagedData.forEach((item, index) => {
        const zebra = (index % 2 === 0) ? 'bg-white' : 'bg-gray-50/70';
        const badgeClass = getBadgeClass(item.tipe);
        const originalIndex = trainingData.findIndex(d => d.no === item.no);

        html += `
          <tr class="border-b border-gray-200/80 hover:bg-emerald-50/40 transition ${zebra}" data-record-no="${item.no}" data-raw-idx="${originalIndex}">
            <td class="owner-cell px-3 sm:px-4 py-3 text-gray-500 font-semibold text-xs sm:text-sm text-center" contenteditable="${isContentEditable}" data-field="no">${item.no}</td>
            <td class="owner-cell px-3 sm:px-4 py-3 font-bold text-navy text-xs sm:text-sm" contenteditable="${isContentEditable}" data-field="tahun">${item.tahun}</td>
            <td class="owner-cell px-3 sm:px-4 py-3 text-gray-700 text-xs sm:text-sm whitespace-nowrap" contenteditable="${isContentEditable}" data-field="bulanTanggal">
              ${item.bulan} ${item.tanggal}
            </td>
            <td class="owner-cell px-3 sm:px-4 py-3 text-gray-800 font-medium text-xs sm:text-sm" contenteditable="${isContentEditable}" data-field="kota">
              <span class="inline-flex items-center gap-1"><i class="fas fa-map-marker-alt text-emas text-xs"></i> ${item.kota}</span>
            </td>
            <td class="owner-cell px-3 sm:px-4 py-3 font-bold text-gray-900 text-xs sm:text-sm" contenteditable="${isContentEditable}" data-field="perusahaan">
              ${item.perusahaan}
            </td>
            <td class="owner-cell px-3 sm:px-4 py-3 text-gray-700 text-xs sm:text-sm" contenteditable="${isContentEditable}" data-field="peserta">
              ${item.peserta || '-'}
            </td>
            <td class="owner-cell px-3 sm:px-4 py-3 text-xs sm:text-sm" contenteditable="${isContentEditable}" data-field="tipe">
              <span class="badge-training ${badgeClass}">${item.tipe}</span>
            </td>
            <td class="owner-cell px-3 sm:px-4 py-3 text-gray-500 text-xs italic" contenteditable="${isContentEditable}" data-field="keterangan">
              ${item.keterangan || '-'}
            </td>
            <td class="px-2 py-3 text-center">
              <button type="button" class="tlog-row-delete" onclick="window.ownerDeleteTrainingRow(${item.no})" title="Hapus baris ini">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    }

    // Pagination controls
    if (prevBtn) prevBtn.disabled = trainingCurrentPage <= 1;
    if (nextBtn) nextBtn.disabled = trainingCurrentPage >= totalPages;

    if (paginationWrap) {
      renderPaginationButtons(paginationWrap, totalPages, trainingCurrentPage);
    }
  }

  function renderPaginationButtons(container, totalPages, current) {
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (current >= totalPages - 3) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', current - 1, current, current + 1, '...', totalPages];
      }
    }

    let buttonsHtml = '';
    pages.forEach(p => {
      if (p === '...') {
        buttonsHtml += `<span class="px-2 py-1 text-gray-400 text-xs">...</span>`;
      } else {
        const active = p === current ? 'active' : '';
        buttonsHtml += `<button type="button" class="pagination-btn ${active}" onclick="window.gotoTrainingPage(${p})">${p}</button>`;
      }
    });

    container.innerHTML = buttonsHtml;
  }

  window.gotoTrainingPage = function (page) {
    trainingCurrentPage = page;
    renderTrainingTable();
    const tableEl = document.getElementById('pengalaman');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ==========================================================================
  // 10. OWNER EDIT & LOGIN SYSTEM
  // ==========================================================================
  function showOwnerToast(msg, duration = 2400) {
    const t = document.getElementById('ownerToast');
    if (!t) return;
    t.innerHTML = `<i class="fas fa-check-circle text-base"></i> <span>${msg}</span>`;
    t.classList.add('show');
    setTimeout(() => {
      t.classList.remove('show');
    }, duration);
  }

  function getStoredEdits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function initOwnerSystem() {
    // Check if owner session is already active
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      isOwner = true;
      updateOwnerUI(true);
    }

    applyStoredChanges();
    addDeleteButtonsToTexts();
    wireImageControls();
  }

  // --- Modal & Login Triggers ---
  window.openOwnerLoginModal = function () {
    if (isOwner) {
      showOwnerToast('Anda sudah masuk dalam Mode Owner.');
      return;
    }
    const modal = document.getElementById('ownerLoginModal');
    const input = document.getElementById('ownerPasswordInput');
    const errorText = document.getElementById('ownerLoginError');
    if (modal) {
      modal.classList.add('open');
      if (errorText) errorText.classList.add('hidden');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  };

  window.closeOwnerLoginModal = function () {
    const modal = document.getElementById('ownerLoginModal');
    if (modal) modal.classList.remove('open');
  };

  window.submitOwnerLogin = function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById('ownerPasswordInput');
    const errorText = document.getElementById('ownerLoginError');
    const pw = input ? input.value.trim() : '';

    if (pw === OWNER_PASSWORD) {
      isOwner = true;
      sessionStorage.setItem(SESSION_KEY, 'true');
      closeOwnerLoginModal();
      updateOwnerUI(true);
      showOwnerToast('Login berhasil! Selamat datang, Owner KPPSM.');
    } else {
      if (errorText) {
        errorText.classList.remove('hidden');
        errorText.textContent = 'Password salah. Silakan coba lagi.';
      }
    }
  };

  window.ownerHandleLockClick = function () {
    if (isOwner) {
      ownerToggleEditMode();
    } else {
      openOwnerLoginModal();
    }
  };

  function updateOwnerUI(loggedIn) {
    const lockBtn = document.getElementById('ownerLockBtn');
    const toolbar = document.getElementById('ownerToolbar');
    const navLoginBtn = document.getElementById('navOwnerLoginBtn');

    if (lockBtn) {
      lockBtn.classList.toggle('logged-in', loggedIn);
      lockBtn.innerHTML = loggedIn ? '<i class="fas fa-unlock"></i>' : '<i class="fas fa-lock"></i>';
      lockBtn.title = loggedIn ? 'Mode Owner Aktif (Klik untuk ubah status Edit)' : 'Masuk sebagai Owner';
    }

    if (toolbar) {
      toolbar.classList.toggle('show', loggedIn);
    }

    if (navLoginBtn) {
      navLoginBtn.innerHTML = loggedIn
        ? '<i class="fas fa-user-shield text-xs"></i> <span>Owner: Aktif</span>'
        : '<i class="fas fa-lock text-xs"></i> <span>Login Owner</span>';
      navLoginBtn.classList.toggle('bg-emerald-700', loggedIn);
      navLoginBtn.classList.toggle('text-white', loggedIn);
    }
  }

  window.ownerLogout = function () {
    isOwner = false;
    editMode = false;
    sessionStorage.removeItem(SESSION_KEY);
    document.body.classList.remove('owner-edit-mode');
    updateOwnerUI(false);
    setContentEditable(false);

    const editBtn = document.getElementById('ownerEditToggleBtn');
    if (editBtn) {
      editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> <span>Mode Edit: OFF</span>';
      editBtn.classList.remove('active');
    }

    showOwnerToast('Anda telah keluar dari mode owner.');
  };

  // --- Toggle Edit Mode ---
  function setContentEditable(on) {
    document.querySelectorAll('[data-owner-text]').forEach((el) => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
    });
    document.querySelectorAll('.owner-cell').forEach((el) => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
    });
  }

  window.ownerToggleEditMode = function () {
    if (!isOwner) {
      openOwnerLoginModal();
      return;
    }

    editMode = !editMode;
    document.body.classList.toggle('owner-edit-mode', editMode);
    setContentEditable(editMode);

    const editBtn = document.getElementById('ownerEditToggleBtn');
    if (editBtn) {
      editBtn.innerHTML = editMode
        ? '<i class="fas fa-check"></i> <span>Mode Edit: ON</span>'
        : '<i class="fas fa-pencil-alt"></i> <span>Mode Edit: OFF</span>';
      editBtn.classList.toggle('active', editMode);
    }

    renderTrainingTable();

    showOwnerToast(
      editMode
        ? 'Mode Edit AKTIF! Klik teks/tabel untuk mengubah, tombol "×" untuk hapus teks, atau hover foto untuk ganti foto.'
        : 'Mode Edit NONAKTIF.'
    );
  };

  // --- Add Delete Buttons to Texts ---
  function addDeleteButtonsToTexts() {
    document.querySelectorAll('[data-owner-text]').forEach((el) => {
      if (el.querySelector(':scope > .ow-del-btn')) return;
      const btn = document.createElement('span');
      btn.className = 'ow-del-btn';
      btn.innerHTML = '&times;';
      btn.title = 'Hapus / Sembunyikan elemen ini';
      btn.contentEditable = 'false';

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm('Sembunyikan/Hapus teks ini dari halaman web?')) {
          el.setAttribute('data-owner-deleted', '1');
          el.style.display = 'none';
          showOwnerToast('Teks disembunyikan. Jangan lupa klik "Simpan Perubahan".');
        }
      });
      el.appendChild(btn);
    });
  }

  // --- Wire Image Controls ---
  function wireImageControls() {
    document.querySelectorAll('[data-owner-img]').forEach((img) => {
      if (img.closest('.ow-img-wrap')) return;

      const wrap = document.createElement('span');
      wrap.className = 'ow-img-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

      const controls = document.createElement('div');
      controls.className = 'ow-img-controls';

      const uploadBtn = document.createElement('button');
      uploadBtn.className = 'ow-img-upload-btn';
      uploadBtn.type = 'button';
      uploadBtn.innerHTML = '<i class="fas fa-camera"></i> <span>Ganti Foto</span>';

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          img.src = ev.target.result;
          showOwnerToast('Foto berhasil diganti! Klik "Simpan Perubahan" untuk menyimpan.');
        };
        reader.readAsDataURL(file);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'ow-img-delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i> <span>Hapus Foto</span>';
      deleteBtn.addEventListener('click', () => {
        if (confirm('Hapus foto ini dan ganti dengan placeholder?')) {
          img.src = 'https://placehold.co/600x450/1E40AF/D4AF37?text=Foto+Dihapus';
          showOwnerToast('Foto dihapus. Klik "Simpan Perubahan" untuk menyimpan.');
        }
      });

      controls.appendChild(uploadBtn);
      controls.appendChild(deleteBtn);
      wrap.appendChild(controls);
      wrap.appendChild(fileInput);
    });
  }

  // --- Hero Background Controls ---
  window.ownerUploadHeroPhoto = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const hero = document.getElementById('hero');
      if (hero) {
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(10, 37, 64, 0.92) 0%, rgba(46, 125, 50, 0.88) 100%), url('${ev.target.result}')`;
        showOwnerToast('Background Hero diganti! Jangan lupa klik "Simpan Perubahan".');
      }
    };
    reader.readAsDataURL(file);
  };

  window.ownerResetHeroPhoto = function () {
    if (!confirm('Kembalikan foto latar Hero ke default?')) return;
    const hero = document.getElementById('hero');
    if (hero) {
      hero.style.backgroundImage = '';
      showOwnerToast('Background Hero dikembalikan ke default.');
    }
  };

  // --- Training Table Row Management ---
  window.ownerAddTrainingRow = function () {
    if (!isOwner) return;

    const newNo = trainingData.length ? Math.max(...trainingData.map(d => Number(d.no) || 0)) + 1 : 1;
    const currentYear = new Date().getFullYear().toString();
    const currentMonthName = new Date().toLocaleString('id-ID', { month: 'Long' });

    const newRecord = {
      no: newNo,
      tahun: currentYear,
      bulan: currentMonthName || 'Januari',
      tanggal: '1',
      kota: 'Jakarta',
      perusahaan: 'Nama Perusahaan Baru',
      peserta: 'Staf & Manager',
      tipe: 'Training',
      keterangan: ''
    };

    trainingData.unshift(newRecord);
    populateYearFilter();
    applyTrainingFilters();
    trainingCurrentPage = 1;
    renderTrainingTable();

    showOwnerToast('Baris training baru ditambahkan di paling atas. Edit teksnya lalu klik "Simpan Perubahan".');
  };

  window.ownerDeleteTrainingRow = function (recordNo) {
    if (!confirm(`Hapus baris data training No. ${recordNo}?`)) return;

    trainingData = trainingData.filter(d => d.no !== recordNo);
    populateYearFilter();
    applyTrainingFilters();
    showOwnerToast(`Baris No. ${recordNo} dihapus. Jangan lupa klik "Simpan Perubahan".`);
  };

  // --- Save All Changes to LocalStorage ---
  window.ownerSaveChanges = function () {
    if (!isOwner) return;

    const data = {
      texts: {},
      deleted: {},
      images: {},
      heroImage: null,
      customTrainingData: []
    };

    // 1. Texts & Deletions
    document.querySelectorAll('[data-owner-text]').forEach((el) => {
      const id = el.getAttribute('data-owner-text');
      if (el.getAttribute('data-owner-deleted') === '1') {
        data.deleted[id] = true;
      } else {
        const clone = el.cloneNode(true);
        const delBtn = clone.querySelector('.ow-del-btn');
        if (delBtn) delBtn.remove();
        data.texts[id] = clone.innerHTML.trim();
      }
    });

    // 2. Images
    document.querySelectorAll('[data-owner-img]').forEach((img) => {
      const id = img.getAttribute('data-owner-img');
      if (id) {
        data.images[id] = img.getAttribute('src');
      }
    });

    // 3. Hero Background
    const hero = document.getElementById('hero');
    if (hero && hero.style.backgroundImage) {
      data.heroImage = hero.style.backgroundImage;
    }

    // 4. Capture any in-place table cell edits currently rendered
    document.querySelectorAll('#trainingLogBody tr[data-record-no]').forEach((tr) => {
      const recNo = parseInt(tr.getAttribute('data-record-no'), 10);
      const rec = trainingData.find(d => d.no === recNo);
      if (rec) {
        const noCell = tr.querySelector('[data-field="no"]');
        const thnCell = tr.querySelector('[data-field="tahun"]');
        const blnCell = tr.querySelector('[data-field="bulanTanggal"]');
        const kotaCell = tr.querySelector('[data-field="kota"]');
        const prsCell = tr.querySelector('[data-field="perusahaan"]');
        const pstCell = tr.querySelector('[data-field="peserta"]');
        const tipeCell = tr.querySelector('[data-field="tipe"]');
        const ketCell = tr.querySelector('[data-field="keterangan"]');

        if (thnCell) rec.tahun = thnCell.textContent.trim();
        if (prsCell) rec.perusahaan = prsCell.textContent.trim();
        if (pstCell) rec.peserta = pstCell.textContent.trim();
        if (tipeCell) rec.tipe = tipeCell.textContent.trim();
        if (ketCell) rec.keterangan = ketCell.textContent.trim();
      }
    });

    data.customTrainingData = trainingData;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showOwnerToast('✅ Semua perubahan berhasil disimpan di browser!');
    } catch (err) {
      alert('Gagal menyimpan (mungkin ukuran foto terlalu besar). Coba gunakan foto dengan resolusi lebih kecil.');
    }
  };

  // --- Apply Stored Changes on Load ---
  function applyStoredChanges() {
    const data = getStoredEdits();
    if (!data) return;

    // Apply texts
    if (data.texts) {
      Object.keys(data.texts).forEach((id) => {
        const el = document.querySelector(`[data-owner-text="${id}"]`);
        if (el) el.innerHTML = data.texts[id];
      });
    }

    // Apply deletions
    if (data.deleted) {
      Object.keys(data.deleted).forEach((id) => {
        const el = document.querySelector(`[data-owner-text="${id}"]`);
        if (el) {
          el.setAttribute('data-owner-deleted', '1');
          el.style.display = 'none';
        }
      });
    }

    // Apply images
    if (data.images) {
      Object.keys(data.images).forEach((id) => {
        const img = document.querySelector(`[data-owner-img="${id}"]`);
        if (img && data.images[id]) {
          img.src = data.images[id];
        }
      });
    }

    // Apply hero background
    if (data.heroImage) {
      const hero = document.getElementById('hero');
      if (hero) hero.style.backgroundImage = data.heroImage;
    }
  }

  // --- Reset All Stored Edits ---
  window.ownerResetAll = function () {
    if (!isOwner) return;
    if (!confirm('Kembalikan SELURUH teks, foto, dan data training ke versi asli? Perubahan tersimpan akan dihapus.')) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    showOwnerToast('Pengaturan direset. Memuat ulang halaman...');
    setTimeout(() => location.reload(), 600);
  };
})();
