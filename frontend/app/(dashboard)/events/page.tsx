"use client";
// Event discovery — list of upcoming outreach events

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EventWithDetails } from "@/types";
import EventCard from "@/components/events/EventCard";
import Image from "next/image";
import styles from "@/app/(dashboard)/events/Events.module.css";

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await api.get<EventWithDetails[]>(
          "/events/signup-counts",
        );
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (loading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.eventContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.titleWrapper}>
          <div className={styles.upcomingOutreach}>Upcoming Outreach</div>
          <div className={styles.upcomingDesc}>
            Find and register for volunteer opportunities
          </div>
        </div>
        <div className={styles.inputWrapper}>
          <Image
            src="/search.png"
            alt="search"
            width={18}
            height={18}
            className={styles.searchIcon}
          />
          <input
            className={styles.searchFilter}
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
