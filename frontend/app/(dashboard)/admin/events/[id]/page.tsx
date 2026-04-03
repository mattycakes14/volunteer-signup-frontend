// Edit existing outreach event
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import EventForm from "@/components/admin/EventForm";
import type { Event } from "@/types";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      const data = await api.get<Event>(`/events/${id}`);
      setEvent(data);
      console.log("This is the event");
      console.log(event);
    }
    fetchEvent();
  }, [id]);

  if (!event) return null;

  return <EventForm initialData={event} />;
}
