// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Standardized responses from your FastAPI backend

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
 * Auth response (signup/signin/refresh)
 *
 * Matches backend AuthResponse schema:
 * - access_token/refresh_token: may be null until email is verified
 * - user_id: UUID of the authenticated user
 * - email: user's email
 * - email_verified: whether email has been verified
 */
export type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  user_id: string;
  email: string;
  email_verified: boolean;
};

/**
 * Token refresh response
 *
 * Backend uses the same AuthResponse schema for refresh,
 * so this is identical to AuthResponse.
 */
export type RefreshResponse = AuthResponse;

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
