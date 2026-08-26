/**
 * Global shared TypeScript types
 * Add MVP-specific data contracts here once Problem Statement is finalized.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
}
