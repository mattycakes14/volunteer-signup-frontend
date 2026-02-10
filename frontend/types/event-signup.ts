// ============================================================================
// EVENT SIGNUP TYPES
// ============================================================================
// Junction table: connects users to events they've signed up for
// Matches backend SignUpResponse / SignUpWithDetails / SignUpCreate / SignUpUpdate schemas

import { Event } from './event';
import { User } from './user';

/**
 * Status of a signup
 */
export enum SignupStatus {
  CONFIRMED = 'confirmed',
  WAITLIST = 'waitlist',
  CANCELLED = 'cancelled'
}

/**
 * A volunteer's signup for an event
 *
 * Matches backend SignUpResponse schema:
 * - role (string) not volunteer_role
 * - Includes user profile fields (email, name, phone_number, year, major)
 *   that are part of the backend SignUpBase schema
 */
export type EventSignup = {
  id: string;
  user_id: string; // Foreign key to users
  event_id: string; // Foreign key to events
  role: string; // Role at event (e.g., "scribe", "graduate")
  status: string; // "confirmed", "waitlist", "cancelled"
  email: string; // User's preferred email
  name: string; // User's name
  phone_number: string; // User's phone number
  year: string; // User's graduating year
  major: string; // User's current major
  created_at: string;
  updated_at: string;
};

/**
 * Signup with user and event details (for detailed views)
 *
 * Matches backend SignUpWithDetails schema
 */
export type SignupWithDetails = EventSignup & {
  user?: User;
  event?: Event;
};

/**
 * Data to create a signup (volunteer action)
 *
 * Matches backend SignUpCreate schema:
 * - user_id is optional (backend gets it from JWT)
 * - Includes user profile fields from SignUpBase
 */
export type CreateSignupData = {
  event_id: string;
  role: string;
  status?: string; // Defaults to "confirmed"
  email: string;
  name: string;
  phone_number: string;
  year: string;
  major: string;
  user_id?: string;
};

/**
 * Data to update a signup
 *
 * Matches backend SignUpUpdate schema
 */
export type UpdateSignupData = {
  role?: string;
  status?: string;
};

/**
 * Signup with event details (for volunteer dashboard)
 */
export type SignupWithEvent = EventSignup & {
  event: Event; // Always present (NOT optional)
};
