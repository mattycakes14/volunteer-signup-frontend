// Dashboard layout — shared sidebar for all authenticated routes
// Route group (dashboard) does not appear in the URL
"use client";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // useEffect(() => {
  //   const userData = getSession();

  //   if (!userData) {
  //     router.push(ROUTES.HOME);
  //   }
  // }, []);
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
