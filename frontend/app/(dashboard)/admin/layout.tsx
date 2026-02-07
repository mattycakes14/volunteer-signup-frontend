// Admin layout — role guard: redirects non-admins to /dashboard
"use client";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { UserRole } from "@/types";
export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== UserRole.ADMIN) {
      router.push(ROUTES.DASHBOARD); // Not an admin → go back
    }
  }, []);
  return <>{children}</>;
}
