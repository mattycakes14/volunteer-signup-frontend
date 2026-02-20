// ============================================================================
// EVENT TYPES
// ============================================================================
// Outreach events that volunteers sign up for
// Matches backend EventResponse / EventWithDetails / EventCreate / EventUpdate schemas

import { Site } from "./site";

/**
 * Complete event object
 *
 * Matches backend EventResponse schema:
 * - Separate date, start_time, end_time fields
 * - notes instead of description/title
 * - status field for event state
 * - created_by tracks which admin created it
 */
export type Event = {
  id: string;
  site_id: string; // Foreign key to sites table
  created_by: string; // UUID of admin who created the event
  date: string; // Date string (YYYY-MM-DD)
  start_time: string; // Time string (HH:MM:SS)
  end_time: string; // Time string (HH:MM:SS)
  notes?: string; // Special notes/requirements
  status: string; // "upcoming", "completed", "cancelled"
  created_at: string;
  updated_at: string;
};

/**
 * Event with related site info and signup counts
 *
 * Matches backend EventWithDetails schema
 */
export type EventWithDetails = Event & {
  site?: Site;
  confirmed_scribes: number;
  confirmed_graduates: number;
  confirmed_preceptors: number;
};

/**
 * Data to create a new event (admin only)
 *
 * Matches backend EventCreate schema
 */
export type CreateEventData = {
  site_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  notes?: string;
  status?: string; // Defaults to "upcoming"
};

/**
 * Data to update an event (admin only)
 *
 * Matches backend EventUpdate schema — all fields optional (PATCH)
 */
export type UpdateEventData = {
  site_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  status?: string;
};
