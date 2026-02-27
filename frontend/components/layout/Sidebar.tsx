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

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  MapPin,
  Archive,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import type { User } from "@/types";

interface SidebarProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const defaultNavBarItems = [
    {
      label: "Dashboard",
      icon: dashboard,
      alt: "Home",
      route: ROUTES.DASHBOARD,
    },
    {
      label: "Browse Events",
      icon: events,
      alt: "Events",
      route: ROUTES.EVENTS,
    },
    { label: "History", icon: history, alt: "History", route: ROUTES.HISTORY },
  ];

  const adminNavBarItems = [
    {
      id: 1,
      label: "DASHBOARD",
      items: [
        { name: "Overview", icon: LayoutDashboard, route: ROUTES.ADMIN.ROOT },
      ],
    },
    {
      id: 2,
      label: "VOLUNTEER",
      items: [{ name: "Browse Events", icon: Calendar, route: ROUTES.EVENTS }],
    },
    {
      id: 3,
      label: "ADMINISTRATION",
      items: [
        {
          name: "Manage Events",
          icon: CalendarDays,
          route: ROUTES.ADMIN.EVENTS,
        },
        { name: "Manage Sites", icon: MapPin, route: ROUTES.ADMIN.SITES },
        { name: "Archive", icon: Archive, route: ROUTES.HISTORY },
      ],
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.role === "admin";
  const active =
    defaultNavBarItems.find((item) => pathname.startsWith(item.route))?.label ??
    "";
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
          <div className={styles.subtitle}>
            {isAdmin ? "Admin Portal" : "Volunteer Portal"}
          </div>
        </div>
      </div>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>{initials}</div>
      </div>
      <div className={styles.userName}>{user?.name}</div>
      <div className={styles.navBarContainer}>
        {isAdmin
          ? adminNavBarItems.map((item) => (
              <div key={item.id} className={styles.wholeContainer}>
                <div className={styles.subnavLabel}>{item.label}</div>
                {item.items.map((navItem, index) => {
                  const Icon = navItem.icon;
                  return (
                    <div
                      key={index}
                      className={styles.subNavContainer}
                      onClick={() => router.push(navItem.route)}
                    >
                      <Icon size={16} color="#94A3B8" />
                      <span className={styles.labelName}>{navItem.name}</span>
                    </div>
                  );
                })}
              </div>
            ))
          : defaultNavBarItems.map((item) => (
              <div
                className={`${styles.navLabelContainer} ${active === item.label ? styles.navLabelContainerActive : ""}`}
                key={item.label}
                onClick={() => {
                  router.push(item.route);
                }}
              >
                <Image
                  className={styles.navIcon}
                  src={item.icon}
                  alt={item.alt}
                />
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
