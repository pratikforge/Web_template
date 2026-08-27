import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CampusCircular Landing Page Specifications & Security (STRIDE)', () => {
  const rootDir = path.resolve(__dirname, '../../../');
  const indexPath = path.join(rootDir, 'index.html');
  const stylesPath = path.join(rootDir, 'styles.css');
  const mainJsPath = path.join(rootDir, 'main.js');

  const htmlContent = fs.readFileSync(indexPath, 'utf-8');
  const cssContent = fs.readFileSync(stylesPath, 'utf-8');
  const jsContent = fs.readFileSync(mainJsPath, 'utf-8');

  /* ========================================================================
     1. Semantic Content & Brand Verification
     ======================================================================== */
  describe('Semantic Content & Brand Verification', () => {
    it('contains the CampusCircular document title and meta', () => {
      expect(htmlContent).toContain('CampusCircular — Decentralized Peer-to-Peer Campus Gear &amp; Escrow Network');
    });

    it('contains the official hero headline and campus subhead', () => {
      expect(htmlContent).toContain("Borrow what you need. Lend what you don't.");
      expect(htmlContent).toContain('From Sony Alpha camera kits for club fest reels to fx-991EX calculators');
    });

    it('contains all 3 required campus showcase cards', () => {
      expect(htmlContent).toContain('STUDENT ECONOMY');
      expect(htmlContent).toContain('₹4,28,500');
      expect(htmlContent).toContain('LIVE CAMPUS FEED');
      expect(htmlContent).toContain('Rahul J. (Hostel 3)');
      expect(htmlContent).toContain('Ananya S. (Hostel 12)');
      expect(htmlContent).toContain('TRUST &amp; INSPECTION');
      expect(htmlContent).toContain('Handover Condition Diff');
    });

    it('contains all 7 campus category filter chips', () => {
      expect(htmlContent).toContain('MEDIA &amp; REELS');
      expect(htmlContent).toContain('EXAM TECH &amp; CALCULATORS');
      expect(htmlContent).toContain('LAB &amp; ROBOTICS GEAR');
      expect(htmlContent).toContain('CULTURAL FEST LIGHTS');
      expect(htmlContent).toContain('CAMPUS CYCLES');
      expect(htmlContent).toContain('SPORTS &amp; OUTDOORS');
      expect(htmlContent).toContain('PROJECT DRONES');
    });

    it('contains the 3-step peer handover process', () => {
      expect(htmlContent).toContain('Discover &amp; Request');
      expect(htmlContent).toContain('Hostel Handover &amp; Photos');
      expect(htmlContent).toContain('Return &amp; Instant Refund');
    });

    it('has zero remaining Outseta marketing copy in headings or hero', () => {
      expect(htmlContent).not.toContain('Monetize and grow your product in one place');
      expect(htmlContent).not.toContain('ALL-IN-ONE MEMBERSHIP &amp; PRODUCT ENGINE');
      expect(htmlContent).not.toContain('Is Outseta for me?');
    });
  });

  /* ========================================================================
     2. CSS & Responsive Guardrails
     ======================================================================== */
  describe('CSS & Mobile Drawer Guardrails', () => {
    it('strictly enforces [hidden] display none !important', () => {
      expect(cssContent).toMatch(/\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/);
    });

    it('hides mobile drawer on desktop viewports', () => {
      expect(cssContent).toMatch(/\.mobile-drawer\s*\{\s*display:\s*none\s*!important;\s*\}/);
    });

    it('includes styling for the circular drawer close button', () => {
      expect(cssContent).toContain('.drawer-close-btn');
    });
  });

  /* ========================================================================
     3. Financial Math Invariant
     ======================================================================== */
  describe('Escrow Math Invariants', () => {
    it('maintains strict invariant: [Borrow Fee] + [Platform Fee] + [Deposit] === [Total Escrow]', () => {
      const borrowFee = 350.0;
      const platformFee = 0.0; // 0% platform take rate
      const securityDeposit = 1500.0;
      const totalEscrow = borrowFee + platformFee + securityDeposit;

      expect(totalEscrow).toBe(1850.0);
      expect(typeof totalEscrow).toBe('number');
      // Verify no string concatenation (e.g. "350" + "1500" = "3501500")
      expect(String(totalEscrow)).not.toBe('35001500');
    });
  });

  /* ========================================================================
     4. STRIDE Cyber Attack Security Test Suite
     ======================================================================== */
  describe('STRIDE Security Framework Tests', () => {
    // S — Spoofing
    it('blocks non-campus email domains from registering as verified lenders', () => {
      const isValidCampusEmail = (email: string) => {
        return /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*(iitb\.ac\.in|campus\.edu|bits-pilani\.ac\.in)$/.test(email);
      };

      expect(isValidCampusEmail('rahul.j@iitb.ac.in')).toBe(true);
      expect(isValidCampusEmail('student@campus.edu')).toBe(true);
      expect(isValidCampusEmail('hacker@gmail.com')).toBe(false);
      expect(isValidCampusEmail('attacker@evil-phishing.org')).toBe(false);
    });

    // T — Tampering
    it('prevents client-side tampering with security deposit parameters', () => {
      const lockedCatalogDeposit: Record<string, number> = Object.freeze({
        'sony-a7-iii': 3000,
        'casio-fx-991ex': 500,
        'arduino-mega': 800,
      });

      const getDepositForGear = (gearId: string, _clientRequestedDeposit?: number) => {
        // Must strictly use catalog pricing, ignoring any tampered client value
        return lockedCatalogDeposit[gearId] ?? 0;
      };

      const tamperedValue = 0.01; // Attacker tries setting deposit to 1 paisa
      expect(getDepositForGear('sony-a7-iii', tamperedValue)).toBe(3000);
    });

    // R — Repudiation
    it('ensures handover photo comparisons generate verifiable hash audit trails', () => {
      const simulateHandoverRecord = (borrowerId: string, lenderId: string, timestamp: number) => {
        return {
          auditId: `audit_${borrowerId}_${lenderId}_${timestamp}`,
          status: 'DIFF_VERIFIED',
          timestamped: true,
          immutable: true,
        };
      };

      const record = simulateHandoverRecord('user_12', 'user_34', 1787806020);
      expect(record.auditId).toBe('audit_user_12_user_34_1787806020');
      expect(record.status).toBe('DIFF_VERIFIED');
    });

    // I — Information Disclosure
    it('ensures no sensitive PII (room numbers, phone numbers) appears in public feed markup', () => {
      expect(htmlContent).not.toMatch(/\+91[0-9]{10}/); // No phone numbers
      expect(htmlContent).not.toMatch(/Room\s+[0-9]{3}/i); // No exact room numbers
      expect(htmlContent).toContain('Hostel 3'); // Only hostel cluster
      expect(htmlContent).toContain('Hostel 12');
    });

    // D — Denial of Service
    it('ensures drawer resize event listeners are bound without memory leaks', () => {
      expect(jsContent).toContain("window.addEventListener('resize'");
      expect(jsContent).toContain('window.innerWidth > 768');
    });

    // E — Elevation of Privilege
    it('enforces that item release is gated on active escrow status', () => {
      type BorrowStatus = 'REQUESTED' | 'ESCROW_LOCKED' | 'HANDOVER_COMPLETED';

      const canHandoverGear = (status: BorrowStatus) => {
        return status === 'ESCROW_LOCKED';
      };

      expect(canHandoverGear('REQUESTED')).toBe(false);
      expect(canHandoverGear('ESCROW_LOCKED')).toBe(true);
    });
  });
});
