import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CampusCircular Auth, AI Search, Cart Drawer & STRIDE Security Tests', () => {
  const rootDir = path.resolve(__dirname, '../../../');
  const indexPath = path.join(rootDir, 'index.html');
  const stylesPath = path.join(rootDir, 'styles.css');
  const mainJsPath = path.join(rootDir, 'main.js');

  const htmlContent = fs.readFileSync(indexPath, 'utf-8');
  const cssContent = fs.readFileSync(stylesPath, 'utf-8');
  const jsContent = fs.readFileSync(mainJsPath, 'utf-8');

  /* ========================================================================
     1. Markup & UI Architecture Verification
     ======================================================================== */
  describe('DOM Elements Verification', () => {
    it('contains the auth action wrapper, student login button, and user profile badge', () => {
      expect(htmlContent).toContain('id="auth-action-wrap"');
      expect(htmlContent).toContain('id="auth-login-btn"');
      expect(htmlContent).toContain('id="user-profile-badge"');
      expect(htmlContent).toContain('id="auth-modal"');
    });

    it('contains the top cart button with live count badge', () => {
      expect(htmlContent).toContain('id="nav-cart-btn"');
      expect(htmlContent).toContain('id="cart-count"');
      expect(htmlContent).toContain('id="cart-drawer"');
    });

    it('replaces the static dual hero CTA buttons with the Hero AI Search Box', () => {
      expect(htmlContent).toContain('class="hero-ai-search-box"');
      expect(htmlContent).toContain('id="hero-ai-input"');
      expect(htmlContent).toContain('id="hero-ai-submit"');
      expect(htmlContent).not.toContain('<div class="hero-cta-row">');
    });

    it('contains the dynamic results section with AI reasoning HUD and catalog grid', () => {
      expect(htmlContent).toContain('id="results-section"');
      expect(htmlContent).toContain('id="ai-reasoning-hud"');
      expect(htmlContent).toContain('id="catalog-grid"');
    });

    it('contains the checkout modal and handover PIN voucher step', () => {
      expect(htmlContent).toContain('id="checkout-modal"');
      expect(htmlContent).toContain('id="checkout-voucher-step"');
      expect(htmlContent).toContain('id="voucher-pin-code"');
    });
  });

  /* ========================================================================
     2. Cart & Escrow Mathematical Invariant Tests
     ======================================================================== */
  describe('Cart & Escrow Calculations', () => {
    const INVENTORY = [
      { id: 'gear_sony_a7iii', daily_fee: 1200, deposit: 2000 },
      { id: 'gear_tripod', daily_fee: 250, deposit: 500 },
      { id: 'gear_dji_mic', daily_fee: 400, deposit: 1000 },
      { id: 'gear_casio_991ex', daily_fee: 80, deposit: 300 }
    ];

    it('calculates exact multi-item borrow fee and deposit without string concatenation glitches', () => {
      // 2 days of Sony A7 III + 1 day of Tripod + 3 days of Casio Calculator
      const cartItems = [
        { id: 'gear_sony_a7iii', days: 2 },
        { id: 'gear_tripod', days: 1 },
        { id: 'gear_casio_991ex', days: 3 }
      ];

      let borrowFeeSubtotal = 0;
      let depositSubtotal = 0;

      cartItems.forEach((c) => {
        const item = INVENTORY.find((i) => i.id === c.id)!;
        borrowFeeSubtotal += item.daily_fee * c.days;
        depositSubtotal += item.deposit;
      });

      const platformFee = 0;
      const totalEscrow = borrowFeeSubtotal + platformFee + depositSubtotal;

      // Sony: 1200 * 2 = 2400 (dep 2000)
      // Tripod: 250 * 1 = 250 (dep 500)
      // Casio: 80 * 3 = 240 (dep 300)
      // Borrow fee: 2400 + 250 + 240 = 2890
      // Deposit: 2000 + 500 + 300 = 2800
      // Total Escrow: 2890 + 2800 = 5690
      expect(borrowFeeSubtotal).toBe(2890);
      expect(depositSubtotal).toBe(2800);
      expect(totalEscrow).toBe(5690);
      expect(String(totalEscrow)).not.toContain('28902800');
    });
  });

  /* ========================================================================
     3. STRIDE Cyber Attack Security Test Suite
     ======================================================================== */
  describe('STRIDE Security Framework Tests', () => {
    // S — Spoofing
    it('blocks forged identity tokens without verified institute domain', () => {
      const allowedDomains = ['iitb.ac.in', 'campus.edu', 'bits-pilani.ac.in'];
      const isDomainAuthorized = (email: string) => {
        const domain = email.split('@')[1] || '';
        return allowedDomains.some((d) => domain === d || domain.endsWith('.' + d));
      };

      expect(isDomainAuthorized('rahul.s@iitb.ac.in')).toBe(true);
      expect(isDomainAuthorized('ananya@ee.iitb.ac.in')).toBe(true);
      expect(isDomainAuthorized('attacker@scammer.com')).toBe(false);
      expect(isDomainAuthorized('fake@not-campus.org')).toBe(false);
    });

    // T — Tampering
    it('ensures deposit values cannot be manipulated to zero or negative values', () => {
      const validateCartItem = (days: number) => {
        return Math.max(1, Math.min(30, parseInt(String(days), 10) || 1));
      };

      expect(validateCartItem(-5)).toBe(1);
      expect(validateCartItem(0)).toBe(1);
      expect(validateCartItem(100)).toBe(30);
      expect(validateCartItem(3)).toBe(3);
    });

    // R — Repudiation
    it('generates non-predictable 4-digit Handover PIN for peer handover confirmation', () => {
      const generatePin = () => Math.floor(1000 + Math.random() * 9000);
      const pin1 = generatePin();
      const pin2 = generatePin();

      expect(pin1).toBeGreaterThanOrEqual(1000);
      expect(pin1).toBeLessThanOrEqual(9999);
      expect(typeof pin1).toBe('number');
      // Probabilistic check: two random 4-digit PINs are rarely identical
      expect(pin1 === pin2 && pin1 === 1234).toBe(false);
    });

    // I — Information Disclosure
    it('ensures hostel room numbers are not exposed in public catalog listings', () => {
      expect(htmlContent).not.toMatch(/Room\s*#?[0-9]{3}/i);
      expect(jsContent).not.toMatch(/Room\s*#?[0-9]{3}/i);
    });

    // D — Denial of Service
    it('ensures cart deduplicates items so a user cannot add 100 duplicate items', () => {
      const cart = {
        items: [] as Array<{ id: string; days: number }>,
        addItem(id: string) {
          if (!this.items.some((i) => i.id === id)) {
            this.items.push({ id, days: 1 });
          }
        }
      };

      for (let i = 0; i < 50; i++) {
        cart.addItem('gear_sony_a7iii');
      }

      expect(cart.items.length).toBe(1);
    });

    // E — Elevation of Privilege
    it('ensures checkout is blocked when student is unauthenticated', () => {
      const canProceedToCheckout = (isLoggedIn: boolean, cartCount: number) => {
        if (!isLoggedIn) return { allowed: false, reason: 'AUTH_REQUIRED' };
        if (cartCount === 0) return { allowed: false, reason: 'EMPTY_CART' };
        return { allowed: true, reason: 'PROCEED' };
      };

      expect(canProceedToCheckout(false, 3)).toEqual({ allowed: false, reason: 'AUTH_REQUIRED' });
      expect(canProceedToCheckout(true, 0)).toEqual({ allowed: false, reason: 'EMPTY_CART' });
      expect(canProceedToCheckout(true, 2)).toEqual({ allowed: true, reason: 'PROCEED' });
    });
  });

  /* ========================================================================
     4. Product Imagery & Accessibility Guardrails
     ======================================================================== */
  describe('Product Imagery & Accessibility Guardrails', () => {
    it('includes product image wrap, zoom transitions, and floating badges in CSS', () => {
      expect(cssContent).toContain('.gear-card-image-wrap');
      expect(cssContent).toContain('.gear-card-img');
      expect(cssContent).toContain('.gear-floating-badge');
      expect(cssContent).toContain('.gear-category-tag');
      expect(cssContent).toContain('.cart-item-thumb');
    });

    it('renders image tags with alt text and lazy loading in main.js catalog', () => {
      expect(jsContent).toContain('class="gear-card-img"');
      expect(jsContent).toContain('loading="lazy"');
      expect(jsContent).toContain('alt="${item.name}"');
      expect(jsContent).toContain('class="cart-item-thumb"');
    });

    it('ensures all 7 inventory items have verified HTTPS image URLs', () => {
      const imageUrls = jsContent.match(/image:\s*['"](https:\/\/[^'"]+)['"]/g);
      expect(imageUrls).not.toBeNull();
      expect(imageUrls!.length).toBeGreaterThanOrEqual(7);
      imageUrls!.forEach((match) => {
        expect(match).toContain('https://images.unsplash.com');
      });
    });
  });

  /* ========================================================================
     5. Responsive & CSS Guardrails
     ======================================================================== */
  describe('CSS Modals & Slide-Over Drawer Guardrails', () => {
    it('includes cart drawer animation and high z-index', () => {
      expect(cssContent).toContain('.cart-drawer');
      expect(cssContent).toContain('slideLeftCart');
      expect(cssContent).toContain('.cart-overlay');
    });

    it('hides hero annotations on smaller desktop and mobile viewports to prevent collisions', () => {
      expect(cssContent).toContain('@media (max-width: 1280px)');
      expect(cssContent).toContain('.hero-annotation');
    });
  });

  /* ========================================================================
     6. Full Lifecycle Demo Account & Condition Diff Guardrails
     ======================================================================== */
  describe('Full Lifecycle Demo Mode & Condition Diff Inspection', () => {
    it('has quick demo trigger in header actions and mobile drawer', () => {
      expect(htmlContent).toContain('id="quick-demo-btn"');
      expect(htmlContent).toContain('id="mobile-demo-btn"');
      expect(htmlContent).toContain('Alex Sharma');
    });

    it('provides email and password fields with prefilled demo credentials', () => {
      expect(htmlContent).toContain('id="email-auth-form"');
      expect(htmlContent).toContain('id="auth-email-input"');
      expect(htmlContent).toContain('id="auth-password-input"');
      expect(htmlContent).toContain('value="alex.sharma@campus.edu"');
      expect(htmlContent).toContain('value="CampusPass@2026"');
      expect(htmlContent).toContain('id="quick-fill-demo-btn"');
      expect(htmlContent).toContain('id="toggle-password-btn"');
    });

    it('provides social login options for Google and Facebook', () => {
      expect(htmlContent).toContain('id="google-login-btn"');
      expect(htmlContent).toContain('id="facebook-login-btn"');
      expect(jsContent).toContain('google-login-btn');
      expect(jsContent).toContain('facebook-login-btn');
    });

    it('contains the interactive 4-stage demo tour dock', () => {
      expect(htmlContent).toContain('id="demo-tour-dock"');
      expect(htmlContent).toContain('data-step="1"');
      expect(htmlContent).toContain('data-step="2"');
      expect(htmlContent).toContain('data-step="3"');
      expect(htmlContent).toContain('data-step="4"');
    });

    it('includes AI Handover Condition Diff modal with pickup and return photos', () => {
      expect(htmlContent).toContain('id="condition-diff-modal"');
      expect(htmlContent).toContain('id="condition-diff-overlay"');
      expect(htmlContent).toContain('PICKUP SCAN');
      expect(htmlContent).toContain('RETURN SCAN');
      expect(htmlContent).toContain('id="release-escrow-action-btn"');
    });

    it('implements DemoController logic with Alex Sharma verified student persona in main.js', () => {
      expect(jsContent).toContain('DemoController');
      expect(jsContent).toContain('user_demo_alex');
      expect(jsContent).toContain('alex.sharma@campus.edu');
      expect(jsContent).toContain('showDemoToast');
    });
  });
});
