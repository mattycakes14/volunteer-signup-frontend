// Capacity constraint logic (pure functions, no API calls)
//
// Waitlist-eligible:
//   scribe    — cap 1,   overflow → waitlist
//   graduate  — cap 2-3, overflow → waitlist
//
// Hard cap (reject 409):
//   preceptor        — max 2
//   outreach_manager — max 2
//   dental_student   — max 2
export {};
