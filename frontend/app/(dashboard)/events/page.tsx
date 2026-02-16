"use client";
// Event discovery — list of upcoming outreach events

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Event, Site } from "@/types";
import EventList from "@/components/events/EventList";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsData, sitesData] = await Promise.all([
          api.get<Event[]>("/events"),
          api.get<Site[]>("/sites"),
        ]);
        setEvents(eventsData);
        setSites(sitesData);
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
    <div>
      <EventList events={events} sites={sites} />
    </div>
  );
}
