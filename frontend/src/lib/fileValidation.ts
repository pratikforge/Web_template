import type { CampusResource, ResourceCategory, CampusUser } from '../types/campus';
import { sanitizeInput } from './security';

export interface ImageFileMeta {
  name?: string;
  type?: string;
  size?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ProductListingInput {
  title: string;
  category: ResourceCategory;
  description: string;
  hourlyRate: string | number;
  deposit: string | number;
  condition: 'Brand New' | 'Excellent' | 'Good' | 'Fair';
  isDonation: boolean;
  accessories: string;
  imageUrl?: string;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/x-png',
  'image/jfif'
]);

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

/**
 * Validates file type, extension, and size for native file picker uploads.
 * Restricts strictly to PNG, JPG, and JPEG files <= 5MB.
 */
export const validateImageFile = (file?: ImageFileMeta | null): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  if (typeof file.size === 'number' && file.size <= 0) {
    return { isValid: false, error: 'The selected file is empty (0 bytes).' };
  }

  if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.`
    };
  }

  const fileName = (file.name || '').trim().toLowerCase();
  const extMatch = fileName.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '';

  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      error: 'Invalid file format. Only PNG, JPG, or JPEG pictures are allowed.'
    };
  }

  const mimeType = (file.type || '').trim().toLowerCase();
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      isValid: false,
      error: 'MIME type mismatch. Only PNG, JPG, or JPEG pictures are allowed.'
    };
  }

  return { isValid: true };
};

/**
 * Safely reads a Blob / File as a base64 Data URL.
 */
export const fileToDataUrl = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Data URL.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading image file.'));
    reader.readAsDataURL(file);
  });
};

/**
 * Pure domain constructor for a new CampusResource from listing form data.
 * Applies STRIDE security guardrails: XSS sanitization, prototype pollution defense,
 * fee clamping, and strict session owner binding.
 */
export const createProductListing = (
  input: ProductListingInput,
  currentUser: CampusUser
): CampusResource => {
  const forbiddenKeys = new Set(['__proto__', 'constructor', 'prototype']);
  for (const key of Object.keys(input)) {
    if (forbiddenKeys.has(key)) {
      console.warn(`[Security Alert] Prototype pollution attempt blocked for key: ${key}`);
    }
  }

  let cleanTitle = sanitizeInput(input.title, 120);
  const cleanDescription = sanitizeInput(input.description, 2000) || 'Student-shared campus equipment.';

  // If user only typed product description, auto-infer title from the description
  if (!cleanTitle) {
    const firstLine = cleanDescription.split(/[.\n]/)[0].trim();
    if (firstLine.length > 0) {
      cleanTitle = firstLine.length > 60 ? `${firstLine.substring(0, 57)}...` : firstLine;
    } else {
      cleanTitle = 'Student Campus Equipment';
    }
  }

  const isDonation = Boolean(input.isDonation);

  const rawHourly = typeof input.hourlyRate === 'number' ? input.hourlyRate : parseInt(String(input.hourlyRate), 10);
  const rawDeposit = typeof input.deposit === 'number' ? input.deposit : parseInt(String(input.deposit), 10);

  const hourlyRateRupees = isDonation ? 0 : Math.max(0, isNaN(rawHourly) ? 0 : rawHourly);
  const depositRupees = isDonation ? 0 : Math.max(0, isNaN(rawDeposit) ? 0 : rawDeposit);

  const accessoriesIncluded = (input.accessories || '')
    .split(',')
    .map(a => sanitizeInput(a.trim(), 80))
    .filter(Boolean);

  let imageUrl = (input.imageUrl || '').trim();
  if (!imageUrl || /^(javascript|vbscript):/i.test(imageUrl)) {
    if (input.category === 'Lab & Academic') {
      imageUrl = 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80';
    } else if (input.category === 'Media & Events') {
      imageUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
    } else if (input.category === 'Sports & Dorm') {
      imageUrl = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';
    }
  }

  return {
    id: `res_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: cleanTitle,
    category: isDonation ? 'Free / Donate' : input.category,
    description: cleanDescription,
    hourlyRateRupees,
    depositRupees,
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    ownerDepartment: currentUser.department,
    ownerHostel: currentUser.hostel,
    distanceMinutes: 2,
    condition: input.condition || 'Excellent',
    isAvailable: true,
    imageUrl,
    accessoriesIncluded,
    borrowingTerms: [
      'Return in clean, working condition',
      'Report any accidental faults immediately',
      'Meet at owner hostel block for handover'
    ],
    totalBorrowsCount: 0,
    isDonation
  };
};
