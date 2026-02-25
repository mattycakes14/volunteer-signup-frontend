# Volunteer / Admin Portal — Design Doc

## Overview

A separate web portal that does two things:

1. Facilitates volunteer sign-up for undergrads/grad students (password-protected accounts)
2. Provides an admin dashboard to manage outreach events, volunteer sign-ups, and store event data

## **Context:** 6 outreach sites that occur weekly throughout the quarter.

## Tech Stack

- **Frontend:** Next.js
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Auth:** Supabase (abstracts hashing, enforces strict security)

## User Roles

### Volunteers (Undergrads & Grads)

1. Create account
2. Browse available outreach sites/events
3. Sign up for shifts (constrained: 1 undergrad scribe, 2–3 grad students)
4. View personal signup history (outreach events completed)

### Admins

1. Post new outreach events
2. Manage event capacity/attendance (put constraints on volunteers)
3. Input/update outreach site details
4. Access historical data/archives (allow manual input)

---

## Volunteer-Facing Features

### Account Creation & Login

- Email/password auth
- Role selection (Undergrad vs Grad student)
- Profile: name, email, phone (SMS potentially), year, major

### Event Discovery

- List view of upcoming outreach events
- Event cards show: site name, location, what they'll do, rules for sign-up, how to prepare, contacts

### Event Signup

- Capacity limits enforced
- Email confirmation sent
- Cancellation allowed anytime as long as it isn't 12 hours before the event
- Notifications to admin board if withdrawal occurs; notify the user

### Volunteer Dashboard

- Upcoming events signed up for
- Past events (time slots of events done)

---

## Admin-Facing Features

### Event Management

- Create new outreach event form:
  - Site selection (dropdown of saved/static sites)
  - Date/time
  - Volunteer capacity (undergrad scribes, grad students, preceptors)
  - Special notes/requirements/description
- Edit/delete events

### Post-Event Data Entry

- Admins record metric fields: people served, number of grad students, total service hours (grad students × length of outreach)
- Record per event occurrence (e.g. St. Vincent Week 1, St. Vincent Week 2…)

### Archive & Analytics

- List of past events
- Export volunteer data (CSV)

---

## Auth Rules

- Only allow signup for volunteers — admin users are created explicitly through the database
- Enforce `@uw.edu` email domain for volunteers

### Auth Workflow

- User creates account via FastAPI → receives Access Token + Refresh Token (stored in localStorage)
- Access token is short-lived; refresh token fetches a new access token before it expires
- API requests carry the access token, verified in FastAPI via JWT (Supabase key)

**⚠️ SECURITY NOTE:**

- localStorage is a **TEMPORARY** implementation for development
- **Production TODO:** Migrate to httpOnly cookies to prevent XSS token theft
- localStorage is vulnerable to JavaScript injection attacks
- httpOnly cookies cannot be accessed by JavaScript, providing better security

```
The Flow (Signup/Login)

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Next.js   │         │   FastAPI   │         │  Supabase   │
│  Frontend   │         │   Backend   │         │  Auth + DB  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  1. POST /auth/signup │                       │
       │──────────────────────>│                       │
       │   {email, password,   │                       │
       │    name, role, etc.}  │                       │
       │                       │                       │
       │                       │  2. Create auth.users │
       │                       │──────────────────────>│
       │                       │                       │
       │                       │  3. Returns session   │
       │                       │<──────────────────────│
       │                       │                       │
       │                       │  4. Create public.users in PostgreSQL
       │                       │     (if fails → delete auth.users)
       │                       │                       │
       │  5. Returns:          │                       │
       │   {access_token,      │                       │
       │    refresh_token,     │                       │
       │    user_id, email}    │                       │
       │<──────────────────────│                       │
       │                       │                       │

Subsequent API Requests:

┌─────────────┐         ┌─────────────┐
│   Next.js   │         │   FastAPI   │
│  Frontend   │         │   Backend   │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │  API request + JWT    │
       │──────────────────────>│
       │   (Authorization:     │
       │    Bearer <token>)    │
       │                       │
       │                       │  Validates JWT using
       │                       │  Supabase secret key
       │                       │
       │  Response             │
       │<──────────────────────│
```

**Key Points:**

- Frontend calls FastAPI routes (NOT Supabase directly)
- FastAPI handles both Supabase auth AND PostgreSQL user creation
- Atomic transaction: if public.users creation fails, auth.users is rolled back
- `@uw.edu` validation enforced server-side in FastAPI

### Route Protection

- **Client-side session guarding** is used instead of Next.js middleware
- Protected pages/components check for valid session on the browser side
- If session is invalid or expired, user is redirected to login page
- Session validation happens via `getSession()` or similar Supabase client methods
- This approach provides immediate feedback and keeps auth logic in components

---

## API Routes

### Public (no auth)

```
POST   /auth/signup
POST   /auth/signin
```

### Auth Required (any logged-in user, scoped to own data)

```
GET    /sites
GET    /sites/{id}
GET    /events
GET    /events/{id}
POST   /event-signups
GET    /event-signups            ← scoped to own
GET    /event-signups/{id}       ← scoped to own
PATCH  /event-signups/{id}       ← scoped to own
GET    /users/{id}               ← scoped to own profile
PATCH  /users/{id}               ← scoped to own profile
```

### Admin Only

```
POST   /events
PATCH  /events/{id}
DELETE /events/{id}
POST   /sites
PATCH  /sites/{id}
DELETE /sites/{id}
POST   /event-metrics
GET    /event-metrics
GET    /event-metrics/{id}
PATCH  /event-metrics/{id}
DELETE /event-metrics/{id}
GET    /users
DELETE /users/{id}
```
