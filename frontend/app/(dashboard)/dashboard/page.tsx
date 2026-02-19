// Volunteer dashboard — upcoming signups + past events
"use client";

import styles from "./Dashboard.module.css";
import MetricContainer from "@/components/dashboard/MetricContainer";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import eventDashboard from "@/public/eventDashboard.png";
import shifts from "@/public/shifts.png";
import volunteer from "@/public/volunteer.png";

// user prop being passed from layout
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/(dashboard)/layout";
import { getAccessToken } from "@/lib/auth";
import type { SignupWithDetails } from "@/types/event-signup";

type ParsedUpcomingEvent = {
  id: string;
  siteName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: string;
  role: string;
  status: string;
};

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const min = m.toString().padStart(2, "0");
  return `${hour}:${min} ${period}`;
}

// TODO: this is hardcoded, query the number of signups by user (total events), the number of signups where status is upcoming (upcoming shifts)
// Volunteer hour logic needs db schema changes
const metricCards = [
  { title: "Total Events", image: eventDashboard, metric: 12 },
  { title: "Upcoming Shifts", image: shifts, metric: 3 },
  { title: "Volunteer Hours", image: volunteer, metric: 48.5 },
];

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DashboardPage() {
  const user = useContext(UserContext);
  const [upcomingEvents, setUpcomingEvents] = useState<SignupWithDetails[]>([]);
  const [parsedEvents, setParsedEvents] = useState<ParsedUpcomingEvent[]>([]);

  useEffect(() => {
    const token = getAccessToken();

    async function fetchUpcomingEvents() {
      const res = await fetch(`${API_URL}/event-signups/me/upcoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("raw response:", data);

      if (!Array.isArray(data)) return;

      setUpcomingEvents(data);

      // extracts nested objects from table joins (Signups, Events, and  Sites)
      const parsed: ParsedUpcomingEvent[] = data.map(
        (signup: SignupWithDetails) => ({
          id: signup.id,
          siteName: signup.event?.site?.name ?? "Unknown",
          address: signup.event?.site?.address ?? "Unknown",
          date: signup.event?.date ?? "",
          startTime: signup.event?.start_time ?? "",
          endTime: signup.event?.end_time ?? "",
          durationHours:
            signup.event?.start_time && signup.event?.end_time
              ? `${formatTime(signup.event.start_time)} - ${formatTime(signup.event.end_time)}`
              : "",
          role: signup.role,
          status: signup.status,
        }),
      );
      setParsedEvents(parsed);
    }

    fetchUpcomingEvents();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.greetingText}>Good Morning</div>
      <div className={styles.welcomeText}>
        Welcome back, {user?.name?.split(" ")[0]}
      </div>
      <div className={styles.metricContainer}>
        {metricCards.map((card) => (
          <MetricContainer
            key={card.title}
            title={card.title}
            image={card.image}
            metric={card.metric}
          />
        ))}
      </div>
      <div className={styles.upcomingEvents}>Upcoming Events</div>
      {parsedEvents.map((event) => (
        <UpcomingEvents
          key={event.id}
          date={event.date}
          siteTitle={event.siteName}
          status={event.status}
          durationHours={event.durationHours}
          location={event.address}
          role={event.role}
        />
      ))}
    </div>
  );
}
