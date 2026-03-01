"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import styles from "@/app/(dashboard)/admin/Admin.module.css";
import type { SignupWithDetails } from "@/types/event-signup";
import { CalendarDays, User, Users } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

export default function AdminPage() {
  const [signUps, setSignups] = useState<SignupWithDetails[]>([]);
  const [numEvents, setNumEvents] = useState<number>();

  useEffect(() => {
    async function getTotalSignups() {
      try {
        const [signUps, numEvents] = await Promise.all([
          api.get<SignupWithDetails[]>("/event-signups"),
          api.get<{ count: number }>("/events/upcoming/count"),
        ]);
        setSignups(signUps);
        setNumEvents(numEvents.count);
      } catch (err) {
        // TODO: display UI message depending on error
      }
    }
    getTotalSignups();
  }, []);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.adminDashboardWrapper}>
        <div className={styles.admin}>Admin /</div>
        <div className={styles.dashboard}>Dashboard</div>
      </div>
      <div className={styles.overview}>Overview</div>
      <div className={styles.eventsAndSignupWrapper}>
        <div className={styles.upcomingEvents}>
          <CalendarDays className={styles.icon} />
          <div className={styles.eventCount}>{numEvents}</div>
          <div className={styles.eventCountText}>Upcoming Events</div>
        </div>
        <div className={styles.totalSignUps}>
          <Users className={styles.icon} />
          <div className={styles.signupCount}>{signUps?.length}</div>
          <div className={styles.signUpCountText}>Total Signups</div>
        </div>
      </div>
      <DataTable />
    </div>
  );
}
