// Event card — displays date, time, notes for a single event
import "./eventcard.css";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card">
      <div className="event-card-date">{event.date}</div>
      <div className="event-card-time">
        {event.start_time} - {event.end_time}
      </div>
      {event.notes && <div className="event-card-notes">{event.notes}</div>}
      <div className="event-card-status">{event.status}</div>
    </div>
  );
}
