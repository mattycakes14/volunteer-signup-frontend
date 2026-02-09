// ============================================================================
// TYPES INDEX
// ============================================================================
// Central export for all types
//
// WHY THIS FILE?
// - Cleaner imports: import { User, Event } from '@/types'
// - Instead of: import { User } from '@/types/user'
//               import { Event } from '@/types/event'
// - One place to see all available types

// User types
export {
  UserRole,
  VolunteerRole,
  type User,
  type CreateUserData,
  type UpdateUserData
} from './user';

// Site types
export {
  type Site,
  type CreateSiteData,
  type UpdateSiteData
} from './site';

// Event types
export {
  type Event,
  type EventWithDetails,
  type CreateEventData,
  type UpdateEventData
} from './event';

// Event signup types
export {
  SignupStatus,
  type EventSignup,
  type SignupWithDetails,
  type CreateSignupData,
  type UpdateSignupData,
  type SignupWithEvent
} from './event-signup';

// Event metrics types
export {
  type EventMetrics,
  type EventMetricsWithEvent,
  type CreateMetricsData,
  type UpdateMetricsData
} from './event-metrics';

// API types
export {
  HttpStatus,
  type ApiResponse,
  type PaginatedResponse,
  type AuthResponse,
  type RefreshResponse,
  type ApiError
} from './api';
