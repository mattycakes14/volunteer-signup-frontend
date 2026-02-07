"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }, []);

  return null;
}
