"use client";
// Event detail — site info, signup button, capacity indicators

import styles from "@/app/(dashboard)/events/[id]/EventDetail.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { EventWithDetails } from "@/types";
import EventDetails from "@/components/events/EventDetails";
import Link from "next/link";


export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api.get<EventWithDetails>(
          `/events/${id}/signup-counts`,
        );
        setEvent(data);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.navigationContainer}>
        <Link href="/events" className={styles.navigate}>
          <span className="material-icons">arrow_back</span>
          Back to Events
        </Link>
        <div className={styles.slash}>/</div>
        <div className={styles.eventDetails}>Event Details</div>
      </div>
      <EventDetails event={event} />
    </div>
  );
}
