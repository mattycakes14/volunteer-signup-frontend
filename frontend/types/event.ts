// Event, Site, EventSignup, EventMetrics types

// ============= SITES =============

export type Site = {
  id: string;
  name: string;
  location: string;
  description: string;
  contacts: string; // Contact info for the site
  created_at: string;
};

export type CreateSiteRequest = Omit<Site, 'id' | 'created_at'>;
export type UpdateSiteRequest = Partial<CreateSiteRequest>;

// ============= EVENTS =============

export type EventCapacity = {
  scribe: number;
  graduate: number;
  preceptor: number;
  outreach_manager: number;
  dental_student: number;
};

export type Event = {
  id: string;
  site_id: string;
  date: string; // ISO datetime string
  capacity: EventCapacity;
  description: string;
  created_at: string;
};

// Event with site data joined (for detail views)
export type EventWithSite = Event & {
  site: Site;
};

export type CreateEventRequest = Omit<Event, 'id' | 'created_at'>;
export type UpdateEventRequest = Partial<CreateEventRequest>;

// ============= EVENT SIGNUPS =============

export type SignupStatus = 'confirmed' | 'waitlisted' | 'cancelled';

export type EventSignup = {
  id: string;
  event_id: string;
  user_id: string;
  role: 'scribe' | 'graduate' | 'preceptor' | 'outreach_manager' | 'dental_student';
  status: SignupStatus;
  created_at: string;
  updated_at: string;
};

// Signup with event details (for user dashboard)
export type EventSignupWithEvent = EventSignup & {
  event: Event;
};

export type CreateSignupRequest = {
  event_id: string;
  role: EventSignup['role'];
};

export type UpdateSignupRequest = {
  status?: SignupStatus;
};

// ============= EVENT METRICS =============

export type EventMetrics = {
  id: string;
  event_id: string;
  people_served: number;
  grad_students_attended: number;
  total_service_hours: number; // grad_students × event_length
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateMetricsRequest = Omit<EventMetrics, 'id' | 'created_at' | 'updated_at'>;
export type UpdateMetricsRequest = Partial<CreateMetricsRequest>;
