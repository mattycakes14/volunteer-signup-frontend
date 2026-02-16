# Volunteer / Admin Portal — Design Doc

## Overview
A separate web portal that does two things:
1. Facilitates volunteer sign-up for undergrads/grad students (password-protected accounts)
2. Provides an admin dashboard to manage outreach events, volunteer sign-ups, and store event data

**Context:** 6 outreach sites that occur weekly throughout the quarter.

**Design Template:** Google Stitch exports (see `frontend/designs/stitch/`) — each page has a `screen.png` screenshot and `code.html` with full Tailwind markup.

---

## Tech Stack
- **Frontend:** Next.js
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Auth:** Supabase (abstracts hashing, enforces strict security)

---

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

---

## Capacity Constraints

### Waitlist-eligible (confirmed cap → overflow goes to waitlist)
| Role     | Confirmed Cap | Over Cap |
|----------|---------------|----------|
| scribe   | 1             | waitlist |
| graduate | 2–3           | waitlist |

### Hard cap (no waitlist, reject at capacity)
| Role             | Max | Over Cap   |
|------------------|-----|------------|
| preceptor        | 2   | reject 409 |
| outreach_manager | 2   | reject 409 |
| dental_student   | 2   | reject 409 |

---

---

## Design System (from Stitch Exports)

### Design References
All UI designs live in `frontend/designs/stitch/`. Each subdirectory has:
- `screen.png` — visual screenshot of the page
- `code.html` — standalone HTML/Tailwind prototype (use for exact classes, markup structure, and styles)

### Pages Designed
| Directory | Page | Description |
|---|---|---|
| `login_page` | Login | Centered glass card, email/password form |
| `signup_page` | Sign Up | Split layout (promo left, form right), role toggle (Undergrad/Grad) |
| `volunteer_dashboard` | Volunteer Dashboard | Sidebar nav, stats cards, upcoming events list, promo banner |
| `browse_events` | Browse Events | Card grid, capacity badges per role, status pills |
| `event_details` | Event Details | Full event view, map, role selection with progress bars, sign up CTA |
| `volunteer_history` | Volunteer History | Table of past events with role/hours/status, export button |
| `admin_dashboard_overview` | Admin Overview | Stats, recent signups table, "Next Up" card, site approval widget |
| `admin_manage_events` | Admin Events | Table with site/date/status/volunteers/region, pagination |
| `admin_create_new_event` | Create Event | Form — site dropdown, date, capacity counters, description, notes |
| `admin_event_metrics` | Event Metrics | Post-event report — members served, grads attended, auto-calc hours, notes |

### Colors
| Token | Value | Usage |
|---|---|---|
| `primary` / `uw-purple` | `#1c0582` | Buttons, active nav, accents, links |
| `primary-hover` | `#2a0a9e` | Button hover states |
| `deep-purple` | `#2d2a4a` | Heading text |
| `soft-pink` | `#fcebef` | Background gradient start |
| `soft-blue` | `#f5fbff` | Background gradient mid |
| `background-light` | `#f8f8f5` | Page background fallback |

### Background
Radial gradient: `radial-gradient(circle at 0% 0%, #ffeef8 0%, #eef6ff 50%, #fdfce8 100%)`
Additional floating blurred circles (`bg-purple-200`, `bg-blue-100`, `bg-pink-100`) with `mix-blend-multiply filter blur-3xl opacity-30` for ambient color.

### Glassmorphism (core UI panels)
```css
background: rgba(255, 255, 255, 0.65);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
```

### Typography
- **Body font:** Inter (`font-display`)
- **Heading font:** League Spartan (`font-brand` / `font-heading`)
- Weights used: 300, 400, 500, 600, 700

### Border Radius
- Default: `1rem`
- Large: `2rem`
- XL: `3rem`
- Buttons/inputs: `rounded-full` (9999px)

### Icons
- Material Icons (`material-icons` class)
- Material Symbols Outlined (variable weight/fill)

### Button Style
```
rounded-full, font-bold, shadow-lg shadow-primary/30
hover: -translate-y-0.5, bg-primary/90
focus: ring-4 ring-primary/30
```

### Status Badges
| Status | Style |
|---|---|
| Open | `bg-green-100 text-green-700` |
| Confirmed | `bg-blue-100 text-blue-700` |
| Pending | `bg-orange-100 text-orange-700` |
| Filling Fast | `bg-accent-purple text-white` |
| Urgent Need | `bg-accent-purple text-white` + corner gradient |
| Waitlist | `bg-pink-100 text-pink-700` + dimmed opacity |
| Full | `bg-pink-100 text-pink-700` or `bg-slate-200 text-slate-500` |
| Past | dimmed row styling |

### Sidebar Nav Pattern
- Glass panel sidebar, ~w-72 on desktop, collapsible to icon-only ~w-20
- Active item: `bg-primary text-white rounded-full shadow-lg`
- Inactive: `text-gray-600 hover:bg-white/50 hover:text-primary rounded-full`
- User avatar + name at bottom, sign out button below nav

### Event Card Pattern (Browse Events)
- Glass panel, `rounded-[2rem]`, hover lift (`hover:-translate-y-1 hover:shadow-xl`)
- Date number in colored square top-left, status pill top-right
- Site name, time, location below
- Capacity section: role name + filled/total badge per role
- Full-width Sign Up button at bottom

---

## Reminders
- Maximum signup is **not** enforced at the database level — enforce at the frontend layer
- Supabase DB password is stored separately (not in repo)
