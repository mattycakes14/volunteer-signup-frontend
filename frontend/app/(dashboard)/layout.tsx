// Dashboard layout — shared sidebar for all authenticated routes
// Route group (dashboard) does not appear in the URL
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> — Phase 2 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
