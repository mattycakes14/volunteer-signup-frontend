# Build Plan: Volunteer / Admin Portal

## Context
- Next.js 16 (app router), React 19, Tailwind v4, Supabase auth
- Backend (FastAPI) already built and available
- Lead dev: solid React, first time Next.js
- 2 junior devs: very new to frontend
- Design ref: `frontend/public/framer_design.png` (dark sidebar dashboard)
- Full spec: `claude.md` at repo root

## Key Next.js Concepts the Team Needs (before touching code)
1. **Route groups** — `(auth)/` and `(dashboard)/` are folder names that share a layout but do NOT appear in the URL
2. **Layout nesting** — each `layout.tsx` wraps everything below it. The sidebar lives in `(dashboard)/layout.tsx` so every page inside that group gets it automatically. Auth pages skip it because `(auth)/` has no layout.
3. **`@/` path alias** — already configured in tsconfig. `@/components/Sidebar` → `frontend/components/Sidebar.tsx`

---

## Target Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx                      # Root: <html><body>{children}</body></html>
│   ├── globals.css                     # Tailwind import + dark theme CSS vars
│   ├── page.tsx                        # "/" — redirects to /dashboard or /login based on session
│   ├── middleware.ts                   # Auth guard: no session + dashboard route → redirect /login
│   │
│   ├── (auth)/                         # Public pages — NO sidebar
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   └── (dashboard)/                    # Protected pages — shared sidebar layout
│       ├── layout.tsx                  # Renders <Sidebar /> + <main>{children}</main>
│       ├── dashboard/page.tsx          # Volunteer home: upcoming + past signups
│       ├── events/
│       │   ├── page.tsx                # Event listing (browse)
│       │   └── [id]/page.tsx           # Event detail + signup button
│       ├── history/page.tsx            # Volunteer signup history
│       └── admin/                      # Admin-only section
│           ├── layout.tsx              # Role guard: not admin → redirect /dashboard
│           ├── page.tsx                # Admin overview
│           ├── events/
│           │   ├── page.tsx            # Event list (manage)
│           │   ├── new/page.tsx        # Create event
│           │   └── [id]/
│           │       ├── page.tsx        # Edit event
│           │       └── metrics/page.tsx# Post-event data entry
│           ├── sites/
│           │   ├── page.tsx            # Site list
│           │   └── new/page.tsx        # Create site
│           └── archive/page.tsx        # Past events + CSV export
│
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx                 # Nav links, active state, role-aware
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx              # Validates @uw.edu
│   ├── events/
│   │   ├── EventCard.tsx               # Presentational: single event card
│   │   ├── EventList.tsx               # Maps events → EventCards
│   │   ├── SignupButton.tsx            # Capacity-aware, handles 409
│   │   └── CapacityBadge.tsx           # Visual slot indicator
│   └── admin/
│       ├── EventForm.tsx               # Dual-mode: create (no initialData) or edit (with initialData)
│       ├── SiteForm.tsx
│       ├── MetricsForm.tsx
│       └── DataTable.tsx               # Generic reusable table
│
├── lib/
│   ├── auth.ts                         # Supabase client + signUp/signIn/signOut/getSession
│   ├── api.ts                          # Fetch wrapper — attaches JWT to every request
│   ├── routes.ts                       # Central route strings object (no hardcoded URLs elsewhere)
│   └── capacity.ts                     # Pure functions: canSignUp(event, role) → allowed | waitlisted | full
│
└── types/
    ├── user.ts                         # User, UserRole
    ├── event.ts                        # Event, Site, EventSignup
    └── api.ts                          # Response/error envelope types
```

---

## Phase Breakdown

### Phase 0 — Fix Boilerplate (lead dev, do this first)
Must happen before anything else.

| File | Fix |
|---|---|
| `app/layout.tsx` | Remove `import Page from "./page"` and the `<Page />` in the body. Only `{children}` stays. |
| `app/globals.css` | Uncomment `@import "tailwindcss";`. Add dark theme CSS vars matching the Framer design (dark bg ~`#121212`, sidebar ~`#1a1a1a`, text white). |
| `app/layout.tsx` | Update metadata title to "Volunteer Portal". |

### Phase 1 — Auth Foundation (lead dev)
The structural backbone. Everything else depends on this.

- `lib/auth.ts` — Supabase client. `signUp` validates `@uw.edu` before calling Supabase. Exports session helpers.
- `lib/api.ts` — Fetch wrapper. Pulls access token from Supabase session, attaches as `Authorization: Bearer`. Reads `NEXT_PUBLIC_API_BASE_URL` from env.
- `types/` — Define `User`, `Event`, `Site`, `EventSignup`, API response types based on the FastAPI endpoints in claude.md.
- `app/middleware.ts` — Checks session. If route is inside `(dashboard)` and no session → redirect `/login`.
- `app/page.tsx` — Session check. Authenticated → redirect `/dashboard`. Not → redirect `/login`.
- `components/auth/LoginForm.tsx` + `SignupForm.tsx` — `'use client'`. Call auth.ts functions. Handle errors.
- `app/(auth)/login/page.tsx` + `signup/page.tsx` — Render the forms.
- `.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`

### Phase 2 — Dashboard Shell + Sidebar (JUNIOR-SAFE — can start as soon as Phase 0 is done)
Juniors don't need Phase 1 to be complete to build these. They are pure UI.

- `lib/routes.ts` — Object of route path strings. Single source of truth.
- `components/layout/Sidebar.tsx` — `'use client'` (needs `usePathname` for active link). Dark styled nav. Links use `next/link`. Nav items differ by role (volunteer vs admin) — can stub with props for now.
- `app/(dashboard)/layout.tsx` — Flex layout: `<Sidebar />` left, `<main>{children}</main>` right.
- `app/(dashboard)/dashboard/page.tsx` — Placeholder "Dashboard" heading to confirm sidebar works.

**Note on the Framer design:** The template nav says Home/About/Projects — map these to the actual portal nav: Dashboard, Events, History (volunteers) + Admin section (admins).

### Phase 3 — Volunteer Event Flow (mixed)

| Task | Who |
|---|---|
| `lib/capacity.ts` — Pure logic: scribes cap 1 (waitlist), grads 2-3 (waitlist), preceptors/managers/dental 2 (hard 409). No API calls. | Junior — good first real logic task |
| `components/events/CapacityBadge.tsx`, `EventCard.tsx`, `EventList.tsx` — Presentational | Junior |
| `components/events/SignupButton.tsx` — Calls capacity.ts + POST /event-signups + handles 409 | Lead |
| `app/(dashboard)/events/page.tsx` — Server component, fetches GET /events, passes to EventList | Lead (server-side fetching is the key Next.js difference from React) |
| `app/(dashboard)/events/[id]/page.tsx` — Fetches single event, renders detail + signup | Lead |
| `app/(dashboard)/history/page.tsx` — Fetches GET /event-signups, renders table | Junior (once fetch pattern is shown) |

### Phase 4 — Admin Section (mixed)

| Task | Who |
|---|---|
| `app/(dashboard)/admin/layout.tsx` — Role guard, redirects non-admins | Lead |
| `components/admin/EventForm.tsx` — Dual-mode create/edit form | Lead |
| `components/admin/SiteForm.tsx`, `MetricsForm.tsx` — Follow EventForm pattern | Junior |
| `components/admin/DataTable.tsx` — Generic reusable table (columns + data as props) | Junior |
| All admin `page.tsx` files (new/, [id]/, archive) — Wire up forms and tables | Junior |

### Phase 5 — Polish & Edge Cases (lead dev)
- Cancellation: disable cancel button if event < 12 hours away
- Loading skeletons + error boundaries on all data-fetching pages
- Responsive sidebar (hamburger on mobile)
- CSV export on archive page
- Email confirmation state after signup

---

## Critical Files (architectural hinges)
- `app/layout.tsx` — Bug here breaks everything. Fix first.
- `app/(dashboard)/layout.tsx` — Does not exist yet. This is what makes the sidebar layout sharing work.
- `app/middleware.ts` — Does not exist yet. Enforces route protection before any page renders.
- `lib/auth.ts` — Single source of truth for all Supabase interaction.
- `lib/capacity.ts` — Encodes the waitlist vs hard-cap business rules. Good candidate for unit tests.

---

## Verification
- After Phase 0: `npm run dev` should load without errors, Tailwind classes should work
- After Phase 1: Login/signup flow works end-to-end with Supabase, unauthenticated access to /dashboard redirects to /login
- After Phase 2: Sidebar renders on all dashboard pages, does NOT render on login/signup
- After Phase 3: Volunteers can browse events, sign up, see capacity, view history
- After Phase 4: Admins can CRUD events/sites, enter metrics, export archive
- After Phase 5: Edge cases (cancellation window, mobile, loading states) all handled
