import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateAndSanitizeProfile,
  sanitizeProfileString,
  isSafeAvatarUrl,
  ALLOWED_DEPARTMENTS,
  ALLOWED_HOSTELS,
  ALLOWED_YEARS,
  PRESET_AVATARS
} from '../lib/profileValidation';
import { MOCK_USERS } from '../data/mockCampusData';
import { safeStorage } from '../lib/safeStorage';
import type { CampusUser } from '../types/campus';

describe('User Profile Management & Security Guardrails', () => {
  const baseUser: CampusUser = { ...MOCK_USERS.borrower };

  beforeEach(() => {
    safeStorage.resetDemoState();
  });

  describe('1. Field Validation & Normalization', () => {
    it('accepts valid profile updates across all parameters', () => {
      const validUpdates = {
        name: 'Aarav Gupta',
        rollNo: '24bcs099',
        department: ALLOWED_DEPARTMENTS[0],
        year: ALLOWED_YEARS[1],
        hostel: ALLOWED_HOSTELS[0],
        roomNo: 'B-204',
        avatarUrl: PRESET_AVATARS[2]
      };

      const result = validateAndSanitizeProfile(validUpdates, baseUser);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
      expect(result.sanitizedData.name).toBe('Aarav Gupta');
      expect(result.sanitizedData.rollNo).toBe('24BCS099'); // Uppercased
      expect(result.sanitizedData.roomNo).toBe('B-204');
      expect(result.sanitizedData.avatarUrl).toBe(PRESET_AVATARS[2]);
    });

    it('rejects short or empty name', () => {
      const result = validateAndSanitizeProfile({ name: ' ' }, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it('rejects name exceeding 60 characters', () => {
      const longName = 'A'.repeat(65);
      const result = validateAndSanitizeProfile({ name: longName }, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('cannot exceed 60');
    });

    it('rejects invalid or missing roll number', () => {
      const result = validateAndSanitizeProfile({ rollNo: '' }, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.rollNo).toBeDefined();
    });

    it('validates safe avatar URLs and rejects malformed strings', () => {
      expect(isSafeAvatarUrl('https://images.unsplash.com/photo-test')).toBe(true);
      expect(isSafeAvatarUrl('http://example.com/avatar.png')).toBe(true);
      expect(isSafeAvatarUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE=')).toBe(true);

      expect(isSafeAvatarUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeAvatarUrl('vbscript:msgbox(1)')).toBe(false);
      expect(isSafeAvatarUrl('not-a-valid-url')).toBe(false);
      expect(isSafeAvatarUrl('')).toBe(false);
    });
  });

  describe('2. STRIDE Threat Model & OWASP Top 10 Cyber Attacks', () => {
    it('STRIDE Tampering / OWASP A03: Sanitizes XSS script tags and HTML injection from name and hostel', () => {
      const maliciousInput = {
        name: '<script>alert("XSS")</script>Rohan',
        hostel: 'Aryabhatta <img src=x onerror=alert(1)> Hall'
      };

      const result = validateAndSanitizeProfile(maliciousInput, baseUser);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.name).toBe('Rohan');
      expect(result.sanitizedData.hostel).toBe('Aryabhatta  Hall');
    });

    it('STRIDE Tampering / OWASP A03: Blocks javascript: URI attack in avatarUrl', () => {
      const attackPayload = {
        avatarUrl: 'javascript:/*--></title></style></textarea>*/<svg/onload=alert`XSS`>'
      };

      const result = validateAndSanitizeProfile(attackPayload, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.avatarUrl).toBeDefined();
      expect(result.sanitizedData.avatarUrl).toBeUndefined();
    });

    it('STRIDE Elevation of Privilege: Blocks prototype pollution attempts', () => {
      const pollutionPayload = JSON.parse('{"__proto__": {"isAdmin": true}}');
      const result = validateAndSanitizeProfile(pollutionPayload, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.security).toBeDefined();
    });

    it('STRIDE Elevation of Privilege: Prevents altering unmodifiable system fields (role, trustScore, walletBalance)', () => {
      const privilegeEscalation = {
        name: 'Rohan (Hacked)',
        role: 'admin',
        trustScore: 100,
        walletBalancePaise: 99999999,
        isVerified: true
      };

      const result = validateAndSanitizeProfile(privilegeEscalation, baseUser);
      expect(result.isValid).toBe(true);
      // Whitelist guarantees unauthorized fields are not present in sanitizedData
      expect((result.sanitizedData as Record<string, unknown>).role).toBeUndefined();
      expect((result.sanitizedData as Record<string, unknown>).trustScore).toBeUndefined();
      expect((result.sanitizedData as Record<string, unknown>).walletBalancePaise).toBeUndefined();
    });

    it('STRIDE Denial of Service (DoS): Handles extreme length payload without crashing or blowing limits', () => {
      const giantString = 'A'.repeat(50000);
      const sanitized = sanitizeProfileString(giantString);
      expect(sanitized.length).toBe(50000);

      const result = validateAndSanitizeProfile({ name: giantString }, baseUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });
  });

  describe('3. Persistence & State Storage Integration', () => {
    it('persists modified user profiles under users_map in safeStorage', () => {
      const initialUsers = safeStorage.getItem<Record<string, CampusUser>>('users_map', MOCK_USERS);
      expect(initialUsers.borrower.name).toBe('Rohan Sharma');

      const updatedUser: CampusUser = {
        ...initialUsers.borrower,
        name: 'Rohan Verma',
        department: 'Electronics & Communication',
        roomNo: 'Room 404'
      };

      safeStorage.setItem('users_map', {
        ...initialUsers,
        borrower: updatedUser
      });

      const reloadedUsers = safeStorage.getItem<Record<string, CampusUser>>('users_map', MOCK_USERS);
      expect(reloadedUsers.borrower.name).toBe('Rohan Verma');
      expect(reloadedUsers.borrower.department).toBe('Electronics & Communication');
      expect(reloadedUsers.borrower.roomNo).toBe('Room 404');
      // Lender profile should remain untouched
      expect(reloadedUsers.lender.name).toBe('Priya Patel');
    });
  });
});
