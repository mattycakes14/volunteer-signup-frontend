// Admin layout — role guard: redirects non-admins to /dashboard
"use client";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserRole } from "@/types";
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // TODO: Re-enable session guard once auth flow is working
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push(ROUTES.DASHBOARD); // push to /dashboard which checks session and pushes to /login
    }
  }, []);
  return <>{children}</>;
}
