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
import { getUserId } from "@/lib/auth";
import { api } from "@/lib/api";
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

export default function DashboardPage() {
  const user = useContext(UserContext);
  const [upcomingEvents, setUpcomingEvents] = useState<SignupWithDetails[]>([]);
  const [parsedEvents, setParsedEvents] = useState<ParsedUpcomingEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [upcomingShifts, setUpcomingShifts] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);

  const metricCards = [
    { title: "Total Events", image: eventDashboard, metric: totalEvents },
    { title: "Upcoming Shifts", image: shifts, metric: upcomingShifts },
    { title: "Volunteer Hours", image: volunteer, metric: totalHours },
  ];

  useEffect(() => {
    const userId = getUserId();

    async function fetchUpcomingEvents() {
      const data = await api.get<SignupWithDetails[]>(
        "/event-signups/me/upcoming",
      );

      if (!Array.isArray(data)) return;

      setUpcomingEvents(data);

      // count confirmed upcoming shifts
      const confirmedCount = data.filter(
        (signup: SignupWithDetails) => signup.status === "confirmed",
      ).length;
      setUpcomingShifts(confirmedCount);

      // extracts nested objects from table joins (Signups, Events, and Sites)
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

    async function fetchCompletedCount() {
      const data = await api.get<{ count: number }>(
        "/event-signups/me/completed-count",
      );
      if (typeof data?.count === "number") setTotalEvents(data.count);
    }

    async function fetchTotalHours() {
      const data = await api.get<{ user_id: string; total_hours: number }>(
        `/users/${userId}/volunteer-hours`,
      );
      if (typeof data?.total_hours === "number")
        setTotalHours(data.total_hours);
    }

    fetchUpcomingEvents();
    fetchCompletedCount();
    fetchTotalHours();
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
