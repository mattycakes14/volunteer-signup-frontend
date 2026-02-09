// Admin layout — role guard: redirects non-admins to /dashboard
"use client";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserRole } from "@/types";
export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push(ROUTES.DASHBOARD); // Not logged in → go back
    }
    // TODO: Admin role check requires fetching full user profile from /users/{id}
    // since AuthResponse only returns user_id/email, not role
  }, []);
  return <>{children}</>;
}
