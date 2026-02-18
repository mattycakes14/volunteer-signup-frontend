"use client";
// Sidebar — navigation links, active state highlight, role-aware nav
// Volunteer nav: Dashboard, Events, History
// Admin nav: above + Admin section (Events, Sites, Archive)
import styles from "./Sidebar.module.css";
import Image from "next/image";
import smallIcon from "@/public/smallIconWithOutStyles.png";
import dashboard from "@/public/dashboard.png";
import events from "@/public/events.png";
import history from "@/public/history.png";
import settings from "@/public/settings.png";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import type { User } from "@/types";

const defaultNavBarItems = [
  { label: "Dashboard", icon: dashboard, alt: "Home", route: ROUTES.DASHBOARD },
  { label: "Events", icon: events, alt: "Events", route: ROUTES.EVENTS },
  { label: "Archived", icon: history, alt: "Archived", route: ROUTES.HISTORY },
];

interface SidebarProps {
  user: User | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const [active, setActive] = useState<string>("Dashboard");

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.titleContainer}>
        <Image
          className={styles.smallIcon}
          src={smallIcon}
          alt="Small Icon Here"
        />
        <div>
          <div className={styles.title}>UDSM Outreach</div>
          <div className={styles.subtitle}>Volunteer Portal</div>
        </div>
      </div>
      <div className={styles.Icon}>{}</div>
      <div className={styles.userName}>{user?.name}</div>
    </div>
  );
}
