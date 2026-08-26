import PocketBase from 'pocketbase';

// Default to local PocketBase instance (or VITE_POCKETBASE_URL if set in .env)
export const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

/**
 * Helper to check whether PocketBase backend is live and reachable.
 */
export async function checkBackendHealth(): Promise<{ ok: boolean; message: string }> {
  try {
    const health = await pb.health.check();
    return { ok: health.code === 200, message: 'PocketBase backend connected' };
  } catch {
    return { ok: false, message: 'Backend offline (run start-backend.bat)' };
  }
}
