import type { CampusUser } from '../types/campus';

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Partial<CampusUser>;
}

export const ALLOWED_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Civil & Environmental Engineering',
  'Design & Media Studies',
  'Biotechnology & Biomedical',
  'Management Studies (DoMS)',
  'Physics & Pure Sciences',
  'Student Affairs & Campus Life'
];

export const ALLOWED_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Postgraduate / Master\'s',
  'PhD / Research Scholar',
  'Faculty / Administration'
];

export const ALLOWED_HOSTELS = [
  'Aryabhatta Hall (Hostel 4)',
  'Kalpana Chawla Block (Hostel 2)',
  'Ramanujan Hostel (Hostel 1)',
  'Sarabhai Hall (Hostel 3)',
  'Gargi Hall (Hostel 5)',
  'Bhabha Research Block (Hostel 6)',
  'Off-Campus / Day Scholar',
  'Administrative Block'
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
];

const BLOCKED_PROPERTIES = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Sanitizes arbitrary string input by stripping active script/style blocks, HTML tags, and unsafe controls.
 */
export function sanitizeProfileString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip <script>...</script>
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Strip <style>...</style>
    .replace(/<[^>]*>?/gm, '')                                          // Strip remaining HTML tags
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')                       // Strip control chars
    .trim();
}

/**
 * Validates whether an avatar URL is safe (HTTP/HTTPS/data:image) and free from javascript pseudo-protocols.
 */
export function isSafeAvatarUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.length > 500) return false;

  // Block javascript: or vbscript: or data:text/html pseudo-protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('data:application/')
  ) {
    return false;
  }

  // Allow standard http/https or safe data:image formats
  try {
    if (trimmed.startsWith('data:image/')) {
      return true;
    }
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes and validates user profile updates against STRIDE & OWASP security risks.
 */
export function validateAndSanitizeProfile(
  rawUpdates: Record<string, unknown>,
  existingUser: CampusUser
): ProfileValidationResult {
  const errors: Record<string, string> = {};
  const sanitizedData: Partial<CampusUser> = {};

  // Prototype Pollution Guard
  for (const key of Object.keys(rawUpdates)) {
    if (BLOCKED_PROPERTIES.has(key)) {
      console.warn(`[Security Alert] Prototype pollution attempt blocked for key: ${key}`);
      return {
        isValid: false,
        errors: { security: 'Invalid property specified in profile payload.' },
        sanitizedData: {}
      };
    }
  }

  // 1. Full Name
  if (rawUpdates.name !== undefined) {
    const cleanName = sanitizeProfileString(rawUpdates.name);
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (cleanName.length > 60) {
      errors.name = 'Name cannot exceed 60 characters.';
    } else {
      sanitizedData.name = cleanName;
    }
  }

  // 2. Roll Number
  if (rawUpdates.rollNo !== undefined) {
    const cleanRollNo = sanitizeProfileString(rawUpdates.rollNo);
    if (!cleanRollNo || cleanRollNo.length < 2) {
      errors.rollNo = 'Roll number / ID is required.';
    } else if (cleanRollNo.length > 20) {
      errors.rollNo = 'Roll number cannot exceed 20 characters.';
    } else {
      sanitizedData.rollNo = cleanRollNo.toUpperCase();
    }
  }

  // 3. Department
  if (rawUpdates.department !== undefined) {
    const cleanDept = sanitizeProfileString(rawUpdates.department);
    if (!cleanDept || cleanDept.length < 2) {
      errors.department = 'Department is required.';
    } else if (cleanDept.length > 80) {
      errors.department = 'Department cannot exceed 80 characters.';
    } else {
      sanitizedData.department = cleanDept;
    }
  }

  // 4. Academic Year
  if (rawUpdates.year !== undefined) {
    const cleanYear = sanitizeProfileString(rawUpdates.year);
    if (!cleanYear || cleanYear.length < 2) {
      errors.year = 'Academic year is required.';
    } else if (cleanYear.length > 40) {
      errors.year = 'Academic year cannot exceed 40 characters.';
    } else {
      sanitizedData.year = cleanYear;
    }
  }

  // 5. Hostel
  if (rawUpdates.hostel !== undefined) {
    const cleanHostel = sanitizeProfileString(rawUpdates.hostel);
    if (!cleanHostel || cleanHostel.length < 2) {
      errors.hostel = 'Hostel or residence block is required.';
    } else if (cleanHostel.length > 60) {
      errors.hostel = 'Hostel cannot exceed 60 characters.';
    } else {
      sanitizedData.hostel = cleanHostel;
    }
  }

  // 6. Room Number
  if (rawUpdates.roomNo !== undefined) {
    const cleanRoomNo = sanitizeProfileString(rawUpdates.roomNo);
    if (!cleanRoomNo || cleanRoomNo.length < 1) {
      errors.roomNo = 'Room or wing number is required.';
    } else if (cleanRoomNo.length > 20) {
      errors.roomNo = 'Room number cannot exceed 20 characters.';
    } else {
      sanitizedData.roomNo = cleanRoomNo;
    }
  }

  // 7. Avatar URL
  if (rawUpdates.avatarUrl !== undefined) {
    const rawAvatar = typeof rawUpdates.avatarUrl === 'string' ? rawUpdates.avatarUrl.trim() : '';
    if (!rawAvatar) {
      // Default to existing or preset avatar
      sanitizedData.avatarUrl = existingUser.avatarUrl || PRESET_AVATARS[0];
    } else if (!isSafeAvatarUrl(rawAvatar)) {
      errors.avatarUrl = 'Please provide a valid http/https image URL or select a preset.';
    } else {
      sanitizedData.avatarUrl = rawAvatar;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}
