// ============================================================================
// EVENT METRICS TYPES
// ============================================================================
// Post-event data entry by admins
// Matches backend EventMetricResponse / EventMetricCreate / EventMetricUpdate schemas

import { Event } from './event';

/**
 * Metrics recorded after an event
 *
 * Matches backend EventMetricResponse schema:
 * - number_of_grad (not grad_student_count)
 * - total_service_hours is a number (Decimal on backend)
 */
export type EventMetrics = {
  id: string;
  event_id: string; // Foreign key to events
  people_served: number; // How many people helped
  number_of_grad: number; // How many grad students showed up
  total_service_hours: number; // Total service hours (Decimal)
  notes?: string; // Any special observations
  created_at: string;
  updated_at: string;
};

/**
 * Event metric with event details
 *
 * Matches backend EventMetricWithEvent schema
 */
export type EventMetricsWithEvent = EventMetrics & {
  event?: Event;
};

/**
 * Data to create metrics (admin only)
 *
 * Matches backend EventMetricCreate schema
 */
export type CreateMetricsData = {
  event_id: string;
  people_served: number;
  number_of_grad: number;
  total_service_hours: number;
  notes?: string;
};

/**
 * Data to update metrics (admin only)
 *
 * Matches backend EventMetricUpdate schema
 */
export type UpdateMetricsData = {
  people_served?: number;
  number_of_grad?: number;
  total_service_hours?: number;
  notes?: string;
};
