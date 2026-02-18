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
import signoutIcon from "@/public/signout.png";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import type { User } from "@/types";

const defaultNavBarItems = [
  { label: "Dashboard", icon: dashboard, alt: "Home", route: ROUTES.DASHBOARD },
  { label: "Events", icon: events, alt: "Events", route: ROUTES.EVENTS },
  { label: "History", icon: history, alt: "History", route: ROUTES.HISTORY },
];

interface SidebarProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const router = useRouter();
  const [active, setActive] = useState<string>("Dashboard");
  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>{initials}</div>
      </div>
      <div className={styles.userName}>{user?.name}</div>
      <div className={styles.navBarContainer}>
        {defaultNavBarItems.map((item) => (
          <div
            className={`${styles.navLabelContainer} ${active === item.label ? styles.navLabelContainerActive : ""}`}
            key={item.label}
            onClick={() => {
              setActive(item.label);
              router.push(item.route);
            }}
          >
            <Image className={styles.navIcon} src={item.icon} alt={item.alt} />
            <span className={styles.navLabel}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.signOutWrapper} onClick={onSignOut}>
        <Image
          className={styles.signOutIcon}
          src={signoutIcon}
          alt="sign out"
        />
        <div className={styles.signOut}>Sign out</div>
      </div>
    </div>
  );
}
