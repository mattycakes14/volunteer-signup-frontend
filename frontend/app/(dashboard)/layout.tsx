// Dashboard layout — shared sidebar for all authenticated routes
// Route group (dashboard) does not appear in the URL
"use client";
import type { ReactNode } from "react";
import { getSession, getAccessToken, getUserId, signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import type { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.push(ROUTES.HOME);
      return;
    }

    async function fetchUser() {
      const userId = getUserId();
      const token = getAccessToken();

      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      console.log(data);
    }
    fetchUser();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar user={user} onSignOut={signOut} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
