/**
 * CampusCircular — Main Application Logic
 * Implements: Dummy Auth, AI Search & Catalog Recommendations, Slide-Over Cart Drawer, and Escrow Checkout.
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. Static Campus Gear Inventory
     ========================================================================== */
  const INVENTORY = [
    {
      id: 'gear_sony_a7iii',
      name: 'Sony Alpha A7 III Full-Frame Camera',
      category: 'MEDIA',
      owner: 'Hostel 3 (Rahul S.)',
      distance: '2 min walk',
      daily_fee: 1200,
      deposit: 2000,
      rating: 4.9,
      borrows: 34,
      badge: '🔥 Fest Top Pick',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      keywords: ['camera', 'reel', 'video', 'sony', 'shoot', 'film', 'media', 'fest']
    },
    {
      id: 'gear_tripod',
      name: 'Manfrotto Professional Video Tripod',
      category: 'MEDIA',
      owner: 'Hostel 4 (Cine Club)',
      distance: '3 min walk',
      daily_fee: 250,
      deposit: 500,
      rating: 4.8,
      borrows: 19,
      badge: '📹 Heavy Duty',
      image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80',
      keywords: ['tripod', 'reel', 'video', 'camera', 'stabilizer', 'stand']
    },
    {
      id: 'gear_dji_mic',
      name: 'DJI Mic 2 Wireless Dual Lavalier Kit',
      category: 'MEDIA',
      owner: 'Hostel 3 (Rahul S.)',
      distance: '2 min walk',
      daily_fee: 400,
      deposit: 1000,
      rating: 5.0,
      borrows: 27,
      badge: '⚡ Zero Lag Audio',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      keywords: ['mic', 'audio', 'sound', 'lavalier', 'reel', 'interview', 'wireless']
    },
    {
      id: 'gear_godox_light',
      name: 'Godox 18" Bi-Color LED Ring Light',
      category: 'EVENT',
      owner: 'Hostel 4 (SAC Room)',
      distance: '3 min walk',
      daily_fee: 200,
      deposit: 400,
      rating: 4.7,
      borrows: 15,
      badge: '💡 AC/DC Battery',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
      keywords: ['light', 'ring light', 'led', 'stage', 'reel', 'lighting', 'fest']
    },
    {
      id: 'gear_casio_991ex',
      name: 'Casio fx-991EX ClassWiz Calculator',
      category: 'TECH',
      owner: 'Hostel 12 (Ananya S.)',
      distance: '4 min walk',
      daily_fee: 80,
      deposit: 300,
      rating: 5.0,
      borrows: 42,
      badge: '🎯 Exam Approved',
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      keywords: ['calculator', 'casio', 'exam', 'classwiz', 'math', 'signals', 'endsem']
    },
    {
      id: 'gear_arduino_mega',
      name: 'Arduino Mega 2560 R3 + 45 Sensors',
      category: 'LAB',
      owner: 'Hostel 7 (Robotics Cell)',
      distance: '5 min walk',
      daily_fee: 250,
      deposit: 600,
      rating: 4.9,
      borrows: 22,
      badge: '🤖 Robotics Ready',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      keywords: ['arduino', 'robotics', 'sensors', 'lab', 'oscilloscope', 'circuit', 'engineering']
    },
    {
      id: 'gear_marlin_cycle',
      name: 'Trek Marlin 7 21-Speed Mountain Bike',
      category: 'MOBILITY',
      owner: 'Hostel 2 (Arjun M.)',
      distance: '1 min walk',
      daily_fee: 150,
      deposit: 500,
      rating: 4.8,
      borrows: 18,
      badge: '🚲 Dual Disc Brakes',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
      keywords: ['cycle', 'bicycle', 'commute', 'mobility', 'trek', 'bike']
    }
  ];

  /* ==========================================================================
     2. Cart State Management
     ========================================================================== */
  const CART_STORAGE_KEY = 'campuscircular_cart_items';

  const CartManager = {
    items: [],

    init() {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        this.items = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('Could not read cart from localStorage', e);
        this.items = [];
      }
      this.syncUI();
    },

    save() {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      } catch (e) {
        console.warn('Could not save cart to localStorage', e);
      }
      this.syncUI();
    },

    addItem(gearId) {
      const exists = this.items.find((item) => item.id === gearId);
      if (!exists) {
        this.items.push({ id: gearId, days: 1 });
        this.save();
      }
    },

    removeItem(gearId) {
      this.items = this.items.filter((item) => item.id !== gearId);
      this.save();
    },

    setDays(gearId, days) {
      const item = this.items.find((i) => i.id === gearId);
      if (item) {
        item.days = Math.max(1, parseInt(days, 10) || 1);
        this.save();
      }
    },

    hasItem(gearId) {
      return this.items.some((i) => i.id === gearId);
    },

    clear() {
      this.items = [];
      this.save();
    },

    getTotals() {
      let borrowFeeSubtotal = 0;
      let depositSubtotal = 0;

      this.items.forEach((cartItem) => {
        const gear = INVENTORY.find((g) => g.id === cartItem.id);
        if (gear) {
          borrowFeeSubtotal += gear.daily_fee * cartItem.days;
          depositSubtotal += gear.deposit;
        }
      });

      const platformFee = 0; // 0% take rate for peer student borrowing
      const totalEscrow = borrowFeeSubtotal + platformFee + depositSubtotal;

      return {
        count: this.items.length,
        borrowFee: borrowFeeSubtotal,
        platformFee,
        deposit: depositSubtotal,
        totalEscrow
      };
    },

    syncUI() {
      const totals = this.getTotals();

      // Top navbar badge count
      const badge = document.getElementById('cart-count');
      if (badge) badge.textContent = String(totals.count);

      const mobileBadge = document.querySelector('.mobile-cart-count');
      if (mobileBadge) mobileBadge.textContent = String(totals.count);

      const drawerBadge = document.getElementById('drawer-cart-count');
      if (drawerBadge) drawerBadge.textContent = `${totals.count} item${totals.count === 1 ? '' : 's'}`;

      // Render cart items inside drawer
      const container = document.getElementById('cart-items-container');
      const emptyState = document.getElementById('cart-empty-state');
      const footer = document.getElementById('cart-drawer-footer');

      if (container && emptyState && footer) {
        if (this.items.length === 0) {
          emptyState.hidden = false;
          container.innerHTML = '';
          footer.hidden = true;
        } else {
          emptyState.hidden = true;
          footer.hidden = false;

          container.innerHTML = this.items
            .map((cartItem) => {
              const gear = INVENTORY.find((g) => g.id === cartItem.id);
              if (!gear) return '';
              const lineTotal = gear.daily_fee * cartItem.days;
              return `
                <div class="cart-item-card" data-id="${gear.id}">
                  <div class="cart-item-top">
                    <div class="cart-item-meta-wrap">
                      <img class="cart-item-thumb" src="${gear.image}" alt="${gear.name}" />
                      <div class="cart-item-info">
                        <strong>${gear.name}</strong>
                        <span><i class="fa-solid fa-location-dot"></i> ${gear.owner}</span>
                      </div>
                    </div>
                    <button type="button" class="cart-item-remove-btn" data-remove="${gear.id}" aria-label="Remove item">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <div class="cart-item-controls">
                    <div class="duration-selector-wrap">
                      <label>Duration:</label>
                      <select class="duration-select" data-id="${gear.id}">
                        ${[1, 2, 3, 5, 7]
                          .map((d) => `<option value="${d}" ${d === cartItem.days ? 'selected' : ''}>${d} Day${d > 1 ? 's' : ''}</option>`)
                          .join('')}
                      </select>
                    </div>
                    <div class="cart-item-price-calc">
                      ₹${lineTotal} <span style="font-size:11px;color:var(--color-heather);">(+₹${gear.deposit} dep)</span>
                    </div>
                  </div>
                </div>
              `;
            })
            .join('');

          // Update footer math totals
          const borrowElem = document.getElementById('cart-borrow-subtotal');
          const depElem = document.getElementById('cart-deposit-subtotal');
          const totalElem = document.getElementById('cart-total-escrow');

          if (borrowElem) borrowElem.textContent = `₹${totals.borrowFee.toLocaleString('en-IN')}`;
          if (depElem) depElem.textContent = `₹${totals.deposit.toLocaleString('en-IN')}`;
          if (totalElem) totalElem.textContent = `₹${totals.totalEscrow.toLocaleString('en-IN')}`;
        }
      }

      // Update button states in catalog grid
      document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
        const id = btn.getAttribute('data-id');
        if (id) {
          if (this.hasItem(id)) {
            btn.classList.add('in-cart');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> In Cart';
          } else {
            btn.classList.remove('in-cart');
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
          }
        }
      });
    }
  };

  /* ==========================================================================
     3. Auth State Management (Dummy Student Portal)
     ========================================================================== */
  const AUTH_STORAGE_KEY = 'campuscircular_auth_session';

  const AuthManager = {
    user: null,

    init() {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        this.user = stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.warn('Could not read auth session', e);
        this.user = null;
      }
      this.syncUI();
    },

    login(profile) {
      this.user = profile;
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.warn('Could not save auth session', e);
      }
      this.syncUI();
      closeModal('auth');
    },

    logout() {
      this.user = null;
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {
        console.warn('Could not clear auth session', e);
      }
      this.syncUI();
    },

    isLoggedIn() {
      return Boolean(this.user);
    },

    updateProfile(updatedFields) {
      if (!this.user) return;
      this.user = {
        ...this.user,
        ...updatedFields
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.user));
      } catch (e) {
        console.warn('Could not save updated profile', e);
      }
      this.syncUI();
      closeModal('profile');
      showDemoToast('✓ Profile parameters updated and saved!');
    },

    syncUI() {
      const loginBtn = document.getElementById('auth-login-btn');
      const profileBadge = document.getElementById('user-profile-badge');
      const mobileLoginBtn = document.getElementById('mobile-login-btn');

      if (this.user) {
        if (loginBtn) loginBtn.hidden = true;
        if (profileBadge) {
          profileBadge.hidden = false;
          const avatar = document.getElementById('user-avatar');
          const name = document.getElementById('user-name');
          const fullName = document.getElementById('dropdown-full-name');
          const hostel = document.getElementById('dropdown-hostel');
          const rating = document.getElementById('dropdown-rating');

          if (avatar) avatar.textContent = this.user.avatar || 'ST';
          if (name) name.textContent = this.user.name.split(' ')[0] + ' ' + (this.user.name.split(' ')[1]?.[0] || '') + '.';
          if (fullName) fullName.textContent = this.user.name;
          if (hostel) hostel.textContent = `${this.user.hostel} • Roll: ${this.user.roll || '22B0042'}`;
          if (rating) rating.textContent = `⭐ ${this.user.rating || 4.9} Verified Student`;
        }
        if (mobileLoginBtn) {
          mobileLoginBtn.textContent = `Logged in as ${this.user.name.split(' ')[0]}`;
        }
      } else {
        if (loginBtn) loginBtn.hidden = false;
        if (profileBadge) profileBadge.hidden = true;
        if (mobileLoginBtn) mobileLoginBtn.textContent = 'Student Login';
      }
    }
  };

  /* ==========================================================================
     4. Catalog Rendering & Natural Language Search
     ========================================================================== */
  function renderCatalog(itemsToRender) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    if (itemsToRender.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fdfbfd; border-radius: 12px;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 32px; color: var(--color-heather); margin-bottom: 12px;"></i>
          <h4 style="font-family: var(--font-kaio); font-size: 18px; color: var(--color-aubergine);">No matching gear found</h4>
          <p style="color: var(--color-heather); font-size: 14px; margin-top: 4px;">Try searching for "reel kit", "camera", "casio calculator", or "robotics".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = itemsToRender
      .map((item) => {
        const inCart = CartManager.hasItem(item.id);
        return `
          <article class="gear-card" data-id="${item.id}" data-category="${item.category}">
            <div>
              <div class="gear-card-image-wrap">
                <span class="gear-category-tag">${item.category}</span>
                <span class="gear-floating-badge">${item.badge}</span>
                <img class="gear-card-img" src="${item.image}" alt="${item.name}" loading="lazy" />
              </div>
              <h3 class="gear-title">${item.name}</h3>
              <p class="gear-owner">
                <i class="fa-solid fa-location-dot"></i> ${item.owner} • <span style="color:var(--color-forest);font-weight:600;">${item.distance}</span>
              </p>
            </div>

            <div>
              <div class="gear-pricing-row">
                <div class="gear-daily-fee">
                  ₹${item.daily_fee.toLocaleString('en-IN')} <span>/ day</span>
                </div>
                <div class="gear-deposit-tag">
                  <i class="fa-solid fa-shield-check"></i> ₹${item.deposit.toLocaleString('en-IN')} dep
                </div>
              </div>

              <div class="gear-actions">
                <span class="gear-rating">⭐ ${item.rating} (${item.borrows})</span>
                <button type="button" class="add-to-cart-btn ${inCart ? 'in-cart' : ''}" data-id="${item.id}">
                  ${inCart ? '<i class="fa-solid fa-check"></i> In Cart' : '<i class="fa-solid fa-cart-plus"></i> Add to Cart'}
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    // Attach click listeners to Add to Cart buttons
    grid.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        if (id) {
          if (CartManager.hasItem(id)) {
            CartManager.removeItem(id);
          } else {
            CartManager.addItem(id);
            // Open cart drawer so user immediately sees their item in cart
            openCartDrawer();
          }
        }
      });
    });
  }

  function handleNaturalLanguageSearch(query) {
    if (!query || !query.trim()) {
      renderCatalog(INVENTORY);
      return;
    }

    const q = query.toLowerCase().trim();

    // Matching logic
    const matched = INVENTORY.filter((item) => {
      const inName = item.name.toLowerCase().includes(q);
      const inCategory = item.category.toLowerCase().includes(q);
      const inOwner = item.owner.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((k) => q.includes(k) || k.includes(q));
      return inName || inCategory || inOwner || inKeywords;
    });

    // Update Reasoning HUD
    const hudTitle = document.getElementById('reasoning-title');
    const hudDesc = document.getElementById('reasoning-desc');

    if (hudTitle && hudDesc) {
      if (q.includes('reel') || q.includes('fest') || q.includes('video') || q.includes('shoot')) {
        hudTitle.textContent = `Recommended Reel & Festival Shoot Bundle (${matched.length} items)`;
        hudDesc.textContent = `Deconstructed your need into 4 matching audio-visual essentials clustered within 250m across Hostel 3 & 4.`;
      } else if (q.includes('exam') || q.includes('calculator') || q.includes('casio')) {
        hudTitle.textContent = `Approved Exam Tech & Calculators (${matched.length} items)`;
        hudDesc.textContent = `Found exam-authorized ClassWiz calculators and accessories available for immediate pickup in Hostel 12.`;
      } else {
        hudTitle.textContent = `Search Results for "${query}" (${matched.length} items found)`;
        hudDesc.textContent = matched.length > 0
          ? `Showing campus items verified by peer escrow matching your request.`
          : `No matching campus gear found for your request. Try searching for specific equipment or categories.`;
      }
    }

    renderCatalog(matched);

    // Scroll smoothly to results
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ==========================================================================
     5. Modal Helpers
     ========================================================================== */
  function openModal(name) {
    const overlay = document.getElementById(`${name}-overlay`);
    const modal = document.getElementById(`${name}-modal`);
    if (overlay && modal) {
      overlay.hidden = false;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(name) {
    const overlay = document.getElementById(`${name}-overlay`);
    const modal = document.getElementById(`${name}-modal`);
    if (overlay && modal) {
      overlay.hidden = true;
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function openCartDrawer() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.hidden = false;
      drawer.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.hidden = true;
      drawer.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function showDemoToast(message) {
    let toast = document.getElementById('demo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'demo-toast';
      toast.className = 'demo-toast-popup';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);
  }

  /* ==========================================================================
     6. Event Bindings & Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    CartManager.init();
    AuthManager.init();
    renderCatalog(INVENTORY);

    // 2. Hero Search Input & Chips
    const searchInput = document.getElementById('hero-ai-input');
    const searchBtn = document.getElementById('hero-ai-submit');

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        handleNaturalLanguageSearch(searchInput.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleNaturalLanguageSearch(searchInput.value);
        }
      });
    }

    document.querySelectorAll('.prompt-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query && searchInput) {
          searchInput.value = query;
          handleNaturalLanguageSearch(query);
        }
      });
    });

    // 3. Category Filter Chips (Pills)
    document.querySelectorAll('.category-pills .pill-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.category-pills .pill-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const cat = chip.getAttribute('data-category');
        if (!cat || cat === 'ALL') {
          renderCatalog(INVENTORY);
        } else {
          const filtered = INVENTORY.filter((item) => item.category === cat);
          renderCatalog(filtered);
        }

        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 4. Cart Controls & Duration changes
    const navCartBtn = document.getElementById('nav-cart-btn');
    const mobileCartBtn = document.getElementById('mobile-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const exploreEmptyBtn = document.getElementById('explore-gear-from-empty');

    if (navCartBtn) navCartBtn.addEventListener('click', openCartDrawer);
    if (mobileCartBtn) mobileCartBtn.addEventListener('click', openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    if (exploreEmptyBtn) {
      exploreEmptyBtn.addEventListener('click', () => {
        closeCartDrawer();
        const catalog = document.getElementById('results-section');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Delegate cart item remove and duration changes
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
      cartContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-remove]');
        if (removeBtn) {
          const id = removeBtn.getAttribute('data-remove');
          if (id) CartManager.removeItem(id);
        }
      });

      cartContainer.addEventListener('change', (e) => {
        const select = e.target.closest('.duration-select');
        if (select) {
          const id = select.getAttribute('data-id');
          if (id) CartManager.setDays(id, select.value);
        }
      });
    }

    // 5. Auth Modal Controls
    const loginBtn = document.getElementById('auth-login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const closeAuthBtn = document.getElementById('close-auth-modal');
    const authOverlay = document.getElementById('auth-overlay');

    if (loginBtn) loginBtn.addEventListener('click', () => openModal('auth'));
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => openModal('auth'));
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => closeModal('auth'));
    if (authOverlay) authOverlay.addEventListener('click', () => closeModal('auth'));

    // Profile select cards
    document.querySelectorAll('.profile-select-card').forEach((card) => {
      card.addEventListener('click', () => {
        try {
          const profile = JSON.parse(card.getAttribute('data-profile') || '{}');
          AuthManager.login(profile);
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Replit Flow: Toggle between Provider Stack and Email Form
    const toggleEmailFlowBtn = document.getElementById('toggle-email-flow-btn');
    const replitBackBtn = document.getElementById('replit-back-to-providers-btn');
    const replitProviderStack = document.getElementById('replit-provider-stack');
    const emailAuthForm = document.getElementById('email-auth-form');

    if (toggleEmailFlowBtn && replitProviderStack && emailAuthForm) {
      toggleEmailFlowBtn.addEventListener('click', () => {
        replitProviderStack.hidden = true;
        emailAuthForm.hidden = false;
      });
    }

    if (replitBackBtn && replitProviderStack && emailAuthForm) {
      replitBackBtn.addEventListener('click', () => {
        emailAuthForm.hidden = true;
        replitProviderStack.hidden = false;
      });
    }

    // Switch Login / Sign up title toggle
    const replitSwitchLink = document.getElementById('replit-switch-login-link');
    const authModalTitle = document.getElementById('auth-modal-title');
    if (replitSwitchLink && authModalTitle) {
      replitSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (authModalTitle.textContent.includes('Create')) {
          authModalTitle.textContent = 'Log in to CampusCircular';
          replitSwitchLink.textContent = 'Create an account';
        } else {
          authModalTitle.textContent = 'Create a CampusCircular account';
          replitSwitchLink.textContent = 'Log in';
        }
      });
    }

    // Email & Password Form submit
    if (emailAuthForm) {
      emailAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('auth-email-input');
        const email = emailInput?.value.trim() || 'alex.sharma@campus.edu';

        if (email.toLowerCase().includes('alex')) {
          // Log in as Alex Sharma (Lead Demo Account)
          AuthManager.login({
            id: 'user_demo_alex',
            name: 'Alex Sharma',
            hostel: 'Hostel 3',
            roll: '22B0891',
            email: 'alex.sharma@campus.edu',
            rating: 5.0,
            avatar: 'AS',
            isDemo: true
          });
          showDemoToast('Welcome back, Alex! Signed in successfully.');
        } else {
          const namePart = email.split('@')[0];
          const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          AuthManager.login({
            id: `user_${Date.now()}`,
            name: formattedName,
            hostel: 'Hostel 4',
            roll: '23B0912',
            email,
            rating: 5.0,
            avatar: formattedName.slice(0, 2).toUpperCase()
          });
          showDemoToast(`Signed in as ${formattedName}`);
        }
      });
    }

    // 1. Google Social Login
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        AuthManager.login({
          id: 'user_google_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3',
          roll: '22B0891',
          email: 'alex.sharma@campus.edu',
          rating: 5.0,
          avatar: 'AS',
          provider: 'google'
        });
        showDemoToast('✓ Authenticated via Google (Alex Sharma)');
      });
    }

    // 2. GitHub Login
    const githubLoginBtn = document.getElementById('github-login-btn');
    if (githubLoginBtn) {
      githubLoginBtn.addEventListener('click', () => {
        AuthManager.login({
          id: 'user_github_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3',
          roll: '22B0891',
          email: 'alex.sharma@github.campus.edu',
          rating: 5.0,
          avatar: 'AS',
          provider: 'github'
        });
        showDemoToast('✓ Authenticated via GitHub (Alex Sharma)');
      });
    }

    // 3. X Login
    const xLoginBtn = document.getElementById('x-login-btn');
    if (xLoginBtn) {
      xLoginBtn.addEventListener('click', () => {
        AuthManager.login({
          id: 'user_x_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3',
          roll: '22B0891',
          email: 'alex.sharma@x.campus.edu',
          rating: 5.0,
          avatar: 'AS',
          provider: 'x'
        });
        showDemoToast('✓ Authenticated via X (Alex Sharma)');
      });
    }

    // 4. Apple Login
    const appleLoginBtn = document.getElementById('apple-login-btn');
    if (appleLoginBtn) {
      appleLoginBtn.addEventListener('click', () => {
        AuthManager.login({
          id: 'user_apple_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3',
          roll: '22B0891',
          email: 'alex.sharma@apple.campus.edu',
          rating: 5.0,
          avatar: 'AS',
          provider: 'apple'
        });
        showDemoToast('✓ Authenticated via Apple (Alex Sharma)');
      });
    }

    // 5. Single Sign-On (SSO) Login
    const ssoLoginBtn = document.getElementById('sso-login-btn');
    if (ssoLoginBtn) {
      ssoLoginBtn.addEventListener('click', () => {
        AuthManager.login({
          id: 'user_demo_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3',
          roll: '22B0891',
          email: 'alex.sharma@campus.edu',
          rating: 5.0,
          avatar: 'AS',
          provider: 'campus-sso'
        });
        showDemoToast('✓ Authenticated via Campus SSO (Alex Sharma)');
      });
    }

    // Toggle Password Visibility
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => {
        const passInput = document.getElementById('auth-password-input');
        if (!passInput) return;
        if (passInput.type === 'password') {
          passInput.type = 'text';
          togglePasswordBtn.textContent = 'Hide';
        } else {
          passInput.type = 'password';
          togglePasswordBtn.textContent = 'Show';
        }
      });
    }

    // User profile dropdown toggle & logout
    const profileBadge = document.getElementById('user-profile-badge');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileBadge && profileDropdown) {
      profileBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.hidden = !profileDropdown.hidden;
      });

      document.addEventListener('click', (e) => {
        if (!profileBadge.contains(e.target)) {
          profileDropdown.hidden = true;
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AuthManager.logout();
        if (profileDropdown) profileDropdown.hidden = true;
      });
    }

    // 5.5 Edit Profile Modal Logic
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileOverlay = document.getElementById('profile-overlay');
    const closeProfileBtn = document.getElementById('close-profile-modal');
    const cancelProfileBtn = document.getElementById('cancel-profile-btn');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editAvatarPreview = document.getElementById('edit-avatar-preview');
    const customAvatarInput = document.getElementById('profile-custom-avatar');
    const avatarPresetsContainer = document.getElementById('avatar-presets-container');

    function populateProfileForm() {
      if (!AuthManager.user) return;
      const u = AuthManager.user;

      const nameInput = document.getElementById('edit-name-input');
      const rollInput = document.getElementById('edit-roll-input');
      const deptSelect = document.getElementById('edit-dept-select');
      const yearSelect = document.getElementById('edit-year-select');
      const hostelSelect = document.getElementById('edit-hostel-select');
      const roomInput = document.getElementById('edit-room-input');
      const emailInput = document.getElementById('edit-email-input');
      const phoneInput = document.getElementById('edit-phone-input');
      const upiInput = document.getElementById('edit-upi-input');

      if (nameInput) nameInput.value = u.name || '';
      if (rollInput) rollInput.value = u.roll || '';
      if (deptSelect) deptSelect.value = u.department || 'Computer Science & Engineering';
      if (yearSelect) yearSelect.value = u.year || '3rd Year';
      if (hostelSelect) hostelSelect.value = u.hostel || 'Hostel 3 (Aryabhatta)';
      if (roomInput) roomInput.value = u.room || 'Wing B-4';
      if (emailInput) emailInput.value = u.email || '';
      if (phoneInput) phoneInput.value = u.phone || '+91 98765 43210';
      if (upiInput) upiInput.value = u.upiId || 'alex.sharma@okhdfcbank';

      const currentAvatar = u.avatar || 'AS';
      if (editAvatarPreview) editAvatarPreview.textContent = currentAvatar;
      if (customAvatarInput) customAvatarInput.value = '';

      if (avatarPresetsContainer) {
        avatarPresetsContainer.querySelectorAll('.avatar-preset-chip').forEach((chip) => {
          if (chip.getAttribute('data-preset') === currentAvatar) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });
      }
    }

    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileDropdown) profileDropdown.hidden = true;
        populateProfileForm();
        openModal('profile');
      });
    }

    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => closeModal('profile'));
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', () => closeModal('profile'));
    if (profileOverlay) profileOverlay.addEventListener('click', () => closeModal('profile'));

    // Avatar Presets Click Handler
    if (avatarPresetsContainer) {
      avatarPresetsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.avatar-preset-chip');
        if (chip) {
          avatarPresetsContainer.querySelectorAll('.avatar-preset-chip').forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          const preset = chip.getAttribute('data-preset') || 'AS';
          if (editAvatarPreview) editAvatarPreview.textContent = preset;
          if (customAvatarInput) customAvatarInput.value = '';
        }
      });
    }

    // Custom Avatar Input Handler
    if (customAvatarInput) {
      customAvatarInput.addEventListener('input', () => {
        const val = customAvatarInput.value.trim().toUpperCase();
        if (val) {
          if (editAvatarPreview) editAvatarPreview.textContent = val;
          if (avatarPresetsContainer) {
            avatarPresetsContainer.querySelectorAll('.avatar-preset-chip').forEach((c) => c.classList.remove('active'));
          }
        }
      });
    }

    // Profile Edit Form Submit Handler
    if (profileEditForm) {
      profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('edit-name-input');
        const rollInput = document.getElementById('edit-roll-input');
        const deptSelect = document.getElementById('edit-dept-select');
        const yearSelect = document.getElementById('edit-year-select');
        const hostelSelect = document.getElementById('edit-hostel-select');
        const roomInput = document.getElementById('edit-room-input');
        const emailInput = document.getElementById('edit-email-input');
        const phoneInput = document.getElementById('edit-phone-input');
        const upiInput = document.getElementById('edit-upi-input');

        const updatedProfile = {
          name: nameInput?.value.trim() || 'Alex Sharma',
          roll: (rollInput?.value.trim() || '22B0891').toUpperCase(),
          department: deptSelect?.value || 'Computer Science & Engineering',
          year: yearSelect?.value || '3rd Year',
          hostel: hostelSelect?.value || 'Hostel 3 (Aryabhatta)',
          room: roomInput?.value.trim() || 'Wing B-4',
          email: emailInput?.value.trim() || 'alex.sharma@campus.edu',
          phone: phoneInput?.value.trim() || '+91 98765 43210',
          upiId: upiInput?.value.trim() || 'alex.sharma@okhdfcbank',
          avatar: editAvatarPreview?.textContent.trim() || 'AS'
        };

        AuthManager.updateProfile(updatedProfile);
      });
    }

    // 6. Checkout Flow
    const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const confirmEscrowPayBtn = document.getElementById('confirm-escrow-pay-btn');
    const finishBookingBtn = document.getElementById('finish-booking-btn');

    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener('click', () => {
        if (!AuthManager.isLoggedIn()) {
          // Gated on student auth
          closeCartDrawer();
          openModal('auth');
          return;
        }

        const totals = CartManager.getTotals();
        if (totals.count === 0) return;

        closeCartDrawer();
        const modalTotal = document.getElementById('checkout-modal-total');
        if (modalTotal) modalTotal.textContent = `₹${totals.totalEscrow.toLocaleString('en-IN')}`;

        // Reset step
        const formStep = document.getElementById('checkout-form-step');
        const voucherStep = document.getElementById('checkout-voucher-step');
        if (formStep) formStep.hidden = false;
        if (voucherStep) voucherStep.hidden = true;

        openModal('checkout');
      });
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal('checkout'));
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', () => closeModal('checkout'));

    if (confirmEscrowPayBtn) {
      confirmEscrowPayBtn.addEventListener('click', () => {
        const totals = CartManager.getTotals();
        const formStep = document.getElementById('checkout-form-step');
        const voucherStep = document.getElementById('checkout-voucher-step');

        if (formStep && voucherStep) {
          formStep.hidden = true;
          voucherStep.hidden = false;

          // Generate random 4-digit PIN
          const pin = Math.floor(1000 + Math.random() * 9000);
          const pinElem = document.getElementById('voucher-pin-code');
          if (pinElem) pinElem.textContent = String(pin);

          const lockedElem = document.getElementById('voucher-escrow-locked');
          if (lockedElem) lockedElem.textContent = `₹${totals.totalEscrow.toLocaleString('en-IN')}`;

          const refElem = document.getElementById('voucher-booking-ref');
          if (refElem) refElem.textContent = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          // Clear cart after successful checkout
          CartManager.clear();
        }
      });
    }

    if (finishBookingBtn) {
      finishBookingBtn.addEventListener('click', () => {
        closeModal('checkout');
      });
    }

    // List idle gear CTA trigger
    const listGearBtn = document.getElementById('list-gear-cta-btn');
    if (listGearBtn) {
      listGearBtn.addEventListener('click', () => {
        if (!AuthManager.isLoggedIn()) {
          openModal('auth');
        } else {
          alert(`Welcome, ${AuthManager.user.name}! Your student listing portal is active for ${AuthManager.user.hostel}.`);
        }
      });
    }

    // 7. Interactive Demo Account Controller & Walkthrough
    const DemoController = {
      activeStage: 1,

      startDemo() {
        // 1. Log in as Alex Sharma (Verified Demo Persona)
        const demoUser = {
          id: 'user_demo_alex',
          name: 'Alex Sharma',
          hostel: 'Hostel 3 (Aryabhatta)',
          roll: '22B0891',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          room: 'Wing B-4',
          phone: '+91 98765 43210',
          upiId: 'alex.sharma@okhdfcbank',
          email: 'alex.sharma@campus.edu',
          rating: 5.0,
          avatar: 'AS',
          isDemo: true
        };
        AuthManager.login(demoUser);

        // 2. Pre-fill cart with Fest Reel Kit
        CartManager.items = [
          { id: 'gear_sony_a7iii', days: 2 },
          { id: 'gear_dji_mic', days: 2 }
        ];
        CartManager.save();
        CartManager.syncUI();
        renderCatalog(INVENTORY);

        // 3. Reveal Demo Walkthrough Dock
        const dock = document.getElementById('demo-tour-dock');
        if (dock) {
          dock.hidden = false;
          dock.classList.remove('minimized');
        }

        this.setStage(1);
        showDemoToast('⚡ Demo Mode Active: Alex Sharma (Hostel 3) logged in with Fest Reel Kit!');
      },

      setStage(stageNum) {
        this.activeStage = stageNum;
        document.querySelectorAll('.demo-step-btn').forEach((btn) => {
          const step = parseInt(btn.getAttribute('data-step') || '1', 10);
          if (step === stageNum) {
            btn.classList.add('active-step');
          } else {
            btn.classList.remove('active-step');
          }
        });

        if (stageNum === 1) {
          closeModal('checkout');
          closeModal('condition-diff');
          openCartDrawer();
        } else if (stageNum === 2) {
          closeCartDrawer();
          closeModal('condition-diff');
          const totals = CartManager.getTotals();
          const modalTotal = document.getElementById('checkout-modal-total');
          if (modalTotal) modalTotal.textContent = `₹${(totals.totalEscrow || 4600).toLocaleString('en-IN')}`;
          const formStep = document.getElementById('checkout-form-step');
          const voucherStep = document.getElementById('checkout-voucher-step');
          if (formStep) formStep.hidden = false;
          if (voucherStep) voucherStep.hidden = true;
          openModal('checkout');
        } else if (stageNum === 3) {
          closeCartDrawer();
          closeModal('checkout');
          openModal('condition-diff');
        } else if (stageNum === 4) {
          closeCartDrawer();
          closeModal('condition-diff');
          closeModal('checkout');
          showDemoToast('💸 Escrow Settled: ₹3,000 Refunded to alex.sharma@okhdfcbank instantly! Condition Diff: 99.8%');
        }
      },

      reset() {
        CartManager.clear();
        AuthManager.logout();
        closeCartDrawer();
        closeModal('checkout');
        closeModal('condition-diff');
        closeModal('auth');
        const dock = document.getElementById('demo-tour-dock');
        if (dock) dock.hidden = true;
        renderCatalog(INVENTORY);
        showDemoToast('Demo state reset. Ready for new demonstration.');
      }
    };

    // Attach Demo Event Handlers
    const quickDemoBtn = document.getElementById('quick-demo-btn');
    if (quickDemoBtn) quickDemoBtn.addEventListener('click', () => DemoController.startDemo());

    const mobileDemoBtn = document.getElementById('mobile-demo-btn');
    if (mobileDemoBtn) mobileDemoBtn.addEventListener('click', () => DemoController.startDemo());

    const authLoadDemoBtn = document.getElementById('auth-load-demo-btn');
    if (authLoadDemoBtn) authLoadDemoBtn.addEventListener('click', () => DemoController.startDemo());

    const demoDockMinimizeBtn = document.getElementById('demo-dock-minimize-btn');
    const demoTourDock = document.getElementById('demo-tour-dock');
    if (demoDockMinimizeBtn && demoTourDock) {
      demoDockMinimizeBtn.addEventListener('click', () => {
        demoTourDock.classList.toggle('minimized');
      });
    }

    const demoDockResetBtn = document.getElementById('demo-dock-reset-btn');
    if (demoDockResetBtn) demoDockResetBtn.addEventListener('click', () => DemoController.reset());

    document.querySelectorAll('.demo-step-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-step') || '1', 10);
        DemoController.setStage(step);
      });
    });

    const voucherOpenDiffBtn = document.getElementById('voucher-open-diff-btn');
    if (voucherOpenDiffBtn) {
      voucherOpenDiffBtn.addEventListener('click', () => {
        closeModal('checkout');
        DemoController.setStage(3);
      });
    }

    const closeConditionDiffBtn = document.getElementById('close-condition-diff-modal');
    const conditionDiffOverlay = document.getElementById('condition-diff-overlay');
    if (closeConditionDiffBtn) closeConditionDiffBtn.addEventListener('click', () => closeModal('condition-diff'));
    if (conditionDiffOverlay) conditionDiffOverlay.addEventListener('click', () => closeModal('condition-diff'));

    const releaseEscrowBtn = document.getElementById('release-escrow-action-btn');
    if (releaseEscrowBtn) {
      releaseEscrowBtn.addEventListener('click', () => {
        DemoController.setStage(4);
      });
    }

    // 8. Mobile Drawer Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileToggle && mobileOverlay && mobileDrawer) {
      const setMobileDrawer = (open) => {
        mobileToggle.setAttribute('aria-expanded', String(open));
        mobileOverlay.hidden = !open;
        mobileDrawer.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
      };

      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
        setMobileDrawer(!isOpen);
      });

      const drawerCloseBtn = mobileDrawer.querySelector('.drawer-close-btn');
      if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', () => setMobileDrawer(false));
      }

      mobileOverlay.addEventListener('click', () => setMobileDrawer(false));

      mobileDrawer.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('click', () => setMobileDrawer(false));
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMobileDrawer(false);
      });
    }

    // 9. ESC Key Global Dismissal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal('auth');
        closeModal('profile');
        closeModal('checkout');
        closeModal('condition-diff');
        closeCartDrawer();
      }
    });
  });
})();
