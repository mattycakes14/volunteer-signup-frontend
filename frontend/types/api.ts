// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Standardized responses from your FastAPI backend

import { User } from './user';

/**
 * Generic API response wrapper
 *
 * WHY A GENERIC?
 * - Same pattern for all endpoints: { success, data, error }
 * - T = type of data (User, Event, etc.)
 * - Example: ApiResponse<User> means data is a User object
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;                            // Present if success = true
  error?: string;                      // Present if success = false
  message?: string;                    // Optional human-readable message
};

/**
 * Paginated list response
 *
 * WHY PAGINATION?
 * - Events list could get very long
 * - Don't load 1000 events at once
 * - Load 20 at a time, with total count
 */
export type PaginatedResponse<T> = {
  success: boolean;
  data?: T[];
  total: number;                       // Total items available
  page: number;                        // Current page
  per_page: number;                    // Items per page
  error?: string;
};

/**
 * Auth response (signup/signin)
 *
 * WHY THESE FIELDS?
 * - access_token: Short-lived JWT (15 min)
 * - refresh_token: Long-lived token to get new access_token
 * - user: Full user object so frontend knows who logged in
 *
 * WHERE TO STORE?
 * - localStorage (we'll handle this in auth.ts later)
 */
export type AuthResponse = {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  error?: string;
};

/**
 * Token refresh response
 *
 * WHY SEPARATE FROM AuthResponse?
 * - Refresh only returns new access_token
 * - Doesn't return user (you already have it)
 * - Smaller payload
 */
export type RefreshResponse = {
  success: boolean;
  access_token?: string;
  error?: string;
};

/**
 * Error response format
 *
 * WHY detail ARRAY?
 * - FastAPI validation errors return multiple issues
 * - Example: "email invalid" + "password too short"
 * - Each error has field (loc) and message (msg)
 */
export type ApiError = {
  detail: string | Array<{
    loc: string[];                     // Field path, e.g., ['body', 'email']
    msg: string;                       // Error message
    type: string;                      // Error type, e.g., 'value_error.email'
  }>;
};

/**
 * HTTP status codes you'll commonly use
 *
 * WHY AN ENUM?
 * - More readable: if (status === HttpStatus.UNAUTHORIZED)
 * - Autocomplete helps you remember codes
 * - Prevents typos: 401 vs 410
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,                      // Used for capacity violations
  INTERNAL_SERVER_ERROR = 500
}
