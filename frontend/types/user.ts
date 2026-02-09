// ============================================================================
// USER TYPES
// ============================================================================
// Matches PostgreSQL public.users table and Supabase auth.users

export enum UserRole {
  UNDERGRAD = "undergrad",
  GRAD = "grad",
  ADMIN = "admin",
}

/**
 * Volunteer-specific roles for event signups
 * These determine capacity constraints
 */
export enum VolunteerRole {
  SCRIBE = "scribe", // 1 max, then waitlist
  GRADUATE = "graduate", // 2-3, then waitlist
  PRECEPTOR = "preceptor", // 2 max, hard cap
  OUTREACH_MANAGER = "outreach_manager", // 2 max, hard cap
  DENTAL_STUDENT = "dental_student", // 2 max, hard cap
}

/**
 * Complete user object (what you get from the database)
 *
 * Matches backend UserResponse schema:
 * - id, email, name, phone_number, year, major, role
 * - email_verified: boolean from Supabase
 * - created_at, updated_at: timestamps
 */
export type User = {
  id: string; // UUID from Supabase auth
  email: string; // Must be @uw.edu
  name: string;
  role: string;
  phone_number: string; // For SMS notifications
  year: string; // e.g., "Junior", "1st year grad"
  major: string; // e.g., "Biology"
  email_verified: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

/**
 * Data needed to CREATE a new user (signup form)
 *
 * Matches backend AuthSignUpRequest schema
 */
export type CreateUserData = {
  email: string;
  password: string; // Only needed at creation (Supabase hashes it)
  name: string;
  role: string; // "undergrad" or "grad"
  phone_number: string;
  year: string;
  major: string;
};

/**
 * Data for UPDATING a user profile
 *
 * Matches backend UserUpdate schema — all fields optional (PATCH)
 */
export type UpdateUserData = {
  email?: string;
  name?: string;
  phone_number?: string;
  year?: string;
  major?: string;
  role?: string;
};
