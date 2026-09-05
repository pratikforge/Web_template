/**
 * Resilient, Zero-Crash LocalStorage Wrapper
 * Handles QuotaExceededError, private browsing blocks, corrupted JSON, and oversized payloads.
 */

const STORAGE_PREFIX = 'CAMPUS_CIRCULAR_V1_';
const MAX_PAYLOAD_BYTES = 500 * 1024; // 500KB guardrail against quota blowouts

export const cleanJsonReviver = (key: string, value: unknown): unknown => {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  return value;
};

class SafeStorageAdapter {
  private memoryFallback = new Map<string, string>();
  private isStorageAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__cc_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private getFullKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  setItem<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);

    // Guardrail: Reject payloads exceeding 500KB (e.g. accidental base64 images)
    if (serialized.length > MAX_PAYLOAD_BYTES) {
      throw new Error(`Payload exceeds safety threshold: ${serialized.length} bytes (max: ${MAX_PAYLOAD_BYTES})`);
    }

    const fullKey = this.getFullKey(key);

    if (this.isStorageAvailable) {
      try {
        window.localStorage.setItem(fullKey, serialized);
        return;
      } catch (err) {
        console.warn(`[SafeStorage] localStorage write failed for ${key}, falling back to memory:`, err);
      }
    }

    this.memoryFallback.set(fullKey, serialized);
  }

  getItem<T>(key: string, fallback: T): T {
    const fullKey = this.getFullKey(key);

    let raw: string | null = null;
    if (this.isStorageAvailable) {
      try {
        raw = window.localStorage.getItem(fullKey);
      } catch (err) {
        console.warn(`[SafeStorage] localStorage read failed for ${key}:`, err);
      }
    }

    if (!raw && this.memoryFallback.has(fullKey)) {
      raw = this.memoryFallback.get(fullKey) || null;
    }

    if (!raw) return fallback;

    try {
      return JSON.parse(raw, cleanJsonReviver) as T;
    } catch (err) {
      console.error(`[SafeStorage] Corrupt JSON for key ${key}, using fallback:`, err);
      return fallback;
    }
  }

  removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    if (this.isStorageAvailable) {
      try {
        window.localStorage.removeItem(fullKey);
      } catch {}
    }
    this.memoryFallback.delete(fullKey);
  }

  clearAll(): void {
    if (this.isStorageAvailable) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
      } catch {}
    }
    this.memoryFallback.clear();
  }

  resetDemoState(): void {
    this.clearAll();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('campus_state_reset'));
    }
  }
}

export const safeStorage = new SafeStorageAdapter();
