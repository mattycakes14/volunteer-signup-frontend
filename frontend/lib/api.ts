// ============================================================================                                                        // ROUTES
// ============================================================================
// Central source of truth for all frontend route paths.
// Use these constants instead of hardcoded strings throughout the app.

export const ROUTES = {
  // public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",

  // volunteer routes (protected)
  DASHBOARD: "/dashboard",
  EVENTS: "/events",
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  HISTORY: "/history",

  // admine routes (protected + admin role only)
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

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.ADMIN.ROOT);
}

export function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(
    ROUTES.DASHBOARD || ROUTES.EVENTS || ROUTES.EVENT_DETAIL || ROUTES.HISTORY,
  );
}
