// ============================================================================
// SITE TYPES
// ============================================================================
// Outreach sites (St. Vincent, etc.) where events happen

/**
 * A physical location where outreach events occur
 *
 * WHY THESE FIELDS?
 * - Admins create sites once, reuse for many events
 * - Contains all info volunteers need to prepare
 */
export type Site = {
  id: string;                    // UUID
  name: string;                  // e.g., "St. Vincent de Paul"
  location: string;              // Address or building name
  description?: string;          // What volunteers will do
  preparation_notes?: string;    // How to prepare
  contact_info?: string;         // Site coordinator contact
  created_at: string;
  updated_at: string;
};

/**
 * Data to create a new site (admin only)
 */
export type CreateSiteData = {
  name: string;
  location: string;
  description?: string;
  preparation_notes?: string;
  contact_info?: string;
};

/**
 * Data to update a site (admin only)
 * All optional = PATCH request
 */
export type UpdateSiteData = {
  name?: string;
  location?: string;
  description?: string;
  preparation_notes?: string;
  contact_info?: string;
};
