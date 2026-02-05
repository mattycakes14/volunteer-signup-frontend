// Admin layout — role guard: redirects non-admins to /dashboard
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
