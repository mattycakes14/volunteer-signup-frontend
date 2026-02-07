// ============================================================================
// ROUTES
// ============================================================================
// Central source of truth for all frontend route paths.
// Use these constants instead of hardcoded strings throughout the app.

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",

  // Volunteer routes (protected)
  DASHBOARD: "/dashboard",
  EVENTS: "/events",
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  HISTORY: "/history",

  // Admin routes (protected + admin role only)
  ADMIN: {
    ROOT: "/admin",
    EVENTS: "/admin/events",
    NEW_EVENT: "/admin/events/new",
    EDIT_EVENT: (id: string) => `/admin/events/${id}`,
    EVENT_METRICS: (id: string) => `/admin/events/${id}/metrics`,
    SITES: "/admin/sites",
    NEW_SITE: "/admin/sites/new",
    ARCHIVE: "/admin/archive",
  },
} as const;

// Helper to check if a path is an admin route
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.ADMIN.ROOT);
}

// Helper to check if a path is a protected route (requires auth)
export function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP];
  return !publicRoutes.includes(pathname);
}
