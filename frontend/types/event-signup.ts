// ============================================================================
// EVENT SIGNUP TYPES
// ============================================================================
// Junction table: connects users to events they've signed up for

import { VolunteerRole } from './user';
import { Event } from './event';
import { User } from './user';

/**
 * Status of a signup
 *
 * WHY THESE STATUSES?
 * - confirmed: Got a spot
 * - waitlist: Event was full, waiting for cancellation
 * - cancelled: User cancelled (within allowed timeframe)
 */
export enum SignupStatus {
  CONFIRMED = 'confirmed',
  WAITLIST = 'waitlist',
  CANCELLED = 'cancelled'
}

/**
 * A volunteer's signup for an event
 *
 * WHY event_id AND event?
 * - Same pattern as Event/Site relationship
 * - Database stores IDs, frontend often needs full objects
 * - Makes both patterns work
 */
export type EventSignup = {
  id: string;
  user_id: string;                     // Foreign key to users
  user?: User;                         // Full user object (if joined)
  event_id: string;                    // Foreign key to events
  event?: Event;                       // Full event object (if joined)
  volunteer_role: VolunteerRole;       // What role they're signing up as
  status: SignupStatus;
  created_at: string;
  updated_at: string;
};

/**
 * Data to create a signup (volunteer action)
 *
 * WHY NO user_id?
 * - Backend gets user_id from the JWT token
 * - Frontend just says "I want to sign up for event X as role Y"
 * - Backend figures out who "I" am
 */
export type CreateSignupData = {
  event_id: string;
  volunteer_role: VolunteerRole;
  // status will be set by backend based on capacity
};

/**
 * Data to update a signup
 *
 * WHY ONLY status?
 * - Users can only cancel (status -> cancelled)
 * - Can't change event or role (would need to cancel + create new)
 */
export type UpdateSignupData = {
  status: SignupStatus;
};

/**
 * Signup with event details (for volunteer dashboard)
 *
 * WHY THIS TYPE?
 * - Dashboard shows "Your Upcoming Events"
 * - Needs event details + signup status
 * - Pre-joined to save frontend work
 */
export type SignupWithEvent = EventSignup & {
  event: Event;                        // Always present (NOT optional)
};
