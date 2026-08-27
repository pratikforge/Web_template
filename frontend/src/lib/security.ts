/**
 * Defensive Security & Input Sanitization Engine
 * Protects against XSS (OWASP A03), Prototype Pollution (OWASP A08), and Protocol Smuggling.
 */

export const sanitizeInput = (input: unknown, maxLength: number = 300): string => {
  if (typeof input !== 'string') return '';

  // Strip script tags and HTML tags
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '&': return '&amp;';
        default: return char;
      }
    });

  // Enforce boundary length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned.trim();
};

export const safePatch = <T extends object>(
  target: T,
  patch: Record<string, unknown>,
  allowedKeys: string[]
): T => {
  const result = { ...target };
  const forbiddenKeys = new Set(['__proto__', 'constructor', 'prototype']);

  for (const key of Object.keys(patch)) {
    if (forbiddenKeys.has(key)) {
      console.warn(`[Security Alert] Prototype pollution attempt blocked for key: ${key}`);
      continue;
    }

    if (allowedKeys.includes(key)) {
      (result as Record<string, unknown>)[key] = patch[key];
    }
  }

  return result;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Explicitly reject dangerous schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return false;
  }

  // Allow secure http/https URLs or trusted relative paths
  if (/^https?:\/\/.+/i.test(trimmed)) {
    return true;
  }

  if (/^\/(assets|frames|images)\/.+/i.test(trimmed)) {
    return true;
  }

  return false;
};
