// Admin layout — role guard: redirects non-admins to /dashboard
"use client";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, getUserId } from "@/lib/auth";
import type { User } from "@/types";
import { UserRole } from "@/types";
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push(ROUTES.DASHBOARD);
      return;
    }

    async function checkAdmin() {
      const userId = getUserId();
      const user = await api.get<User>(`/users/${userId}`);
      if (user.role !== UserRole.ADMIN) {
        router.push(ROUTES.DASHBOARD);
      }
    }
    checkAdmin();
  }, []);

  return <>{children}</>;
}
