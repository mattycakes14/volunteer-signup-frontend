"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.LOGIN);
  }, []);

  return null;
}
