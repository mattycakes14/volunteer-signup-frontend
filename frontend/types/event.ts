// ============================================================================
// EVENT TYPES
// ============================================================================
// Outreach events that volunteers sign up for

import { Site } from "./site";

/**
 * Capacity limits for an event
 *
 * - Easier to validate (all in one place)
 * - Can reuse for capacity checks
 * - Clear what capacity constraints exist
 */
export type EventCapacity = {
  scribe: number; // Max 1 (waitlist eligible)
  graduate: number; // Max 2-3 (waitlist eligible)
  preceptor: number; // Max 2 (hard cap)
  outreach_manager: number; // Max 2 (hard cap)
  dental_student: number; // Max 2 (hard cap)
};

/**
 * Current signup counts for an event
 *
 * - Frontend needs to show "2/3 spots filled"
 * - Backend calculates this, frontend displays it
 * - Separate from capacity (capacity = max, current = actual)
 */
export type EventSignupCounts = {
  scribe: number;
  graduate: number;
  preceptor: number;
  outreach_manager: number;
  dental_student: number;
};

/**
 * Complete event object
 *
 * - site_id: Foreign key (string UUID) stored in database
 * - site: Full Site object when you JOIN tables
 * - Backend can return either (with/without JOIN)
 * - Makes site optional so both work
 */
export type Event = {
  id: string;
  site_id: string; // Foreign key to sites table
  site?: Site; // Full site object (if joined)
  title: string; // e.g., "St. Vincent Week 3"
  description?: string; // Special notes/requirements
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  capacity: EventCapacity; // Max volunteers per role
  current_signups?: EventSignupCounts; // How many signed up (calculated)
  created_at: string;
  updated_at: string;
};

/**
 * Data to create a new event (admin only)
 *
 * WHY NO current_signups?
 * - That's calculated by the backend
 * - When creating, signups = 0 for everything
 */
export type CreateEventData = {
  site_id: string;
  title: string;
  description?: string;
  start_time: string; // Frontend will convert Date to ISO
  end_time: string;
  capacity: EventCapacity;
};

/**
 * Data to update an event (admin only)
 */
export type UpdateEventData = {
  site_id?: string;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  capacity?: EventCapacity;
};

/**
 * Event list item (lighter version for lists)
 *
 * - List views don't need ALL event details
 * - Lighter payload = faster loading
 * - Backend can return simplified version
 */
export type EventListItem = {
  id: string;
  title: string;
  site_name: string; // Just the name, not full object
  start_time: string;
  end_time: string;
  available_spots: number; // Total spots remaining
};
