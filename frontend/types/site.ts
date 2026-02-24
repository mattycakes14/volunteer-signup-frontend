// ============================================================================
// SITE TYPES
// ============================================================================
// Outreach sites (St. Vincent, etc.) where events happen
// Matches backend SiteResponse / SiteCreate / SiteUpdate schemas

/**
 * A physical location where outreach events occur
 *
 * Matches backend SiteResponse schema
 */
export type Site = {
  id: string;                    // UUID
  name: string;                  // e.g., "St. Vincent de Paul"
  address: string;               // Address or building name
  description: string;           // What volunteers will do
  contacts: string;              // Site coordinator contact info
  frequency: string;             // How often events occur (e.g., "Weekly", "Monthly")
  preparation_notes?: string;    // Optional preparation instructions for volunteers
  created_at: string;
  updated_at: string;
};

/**
 * Data to create a new site (admin only)
 *
 * Matches backend SiteCreate schema
 */
export type CreateSiteData = {
  name: string;
  address: string;
  description: string;
  contacts: string;
  frequency: string;
};

/**
 * Data to update a site (admin only)
 * All optional = PATCH request
 *
 * Matches backend SiteUpdate schema
 */
export type UpdateSiteData = {
  name?: string;
  address?: string;
  description?: string;
  contacts?: string;
  frequency?: string;
};
