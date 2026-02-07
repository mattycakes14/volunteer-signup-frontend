// ============================================================================
// EVENT METRICS TYPES
// ============================================================================
// Post-event data entry by admins

/**
 * Metrics recorded after an event
 *
 * WHY THESE FIELDS?
 * - Track impact: people_served
 * - Track volunteer participation: grad_student_count
 * - Calculate service hours: grad_student_count × event length
 *
 * WHY event_id AND NOT event?
 * - Metrics are always tied to one specific event
 * - Admin selects event from dropdown (only needs ID)
 * - Can join later if needed for display
 */
export type EventMetrics = {
  id: string;
  event_id: string;                    // Foreign key to events
  people_served: number;               // How many people helped
  grad_student_count: number;          // How many grad students showed up
  total_service_hours: number;         // grad_student_count × event duration
  notes?: string;                      // Any special observations
  created_at: string;
  updated_at: string;
};

/**
 * Data to create metrics (admin only)
 *
 * WHY NO total_service_hours?
 * - Backend calculates this: grad_student_count × (end_time - start_time)
 * - Don't make admin do math
 */
export type CreateMetricsData = {
  event_id: string;
  people_served: number;
  grad_student_count: number;
  notes?: string;
};

/**
 * Data to update metrics (admin only)
 */
export type UpdateMetricsData = {
  people_served?: number;
  grad_student_count?: number;
  notes?: string;
  // total_service_hours recalculated by backend
};
