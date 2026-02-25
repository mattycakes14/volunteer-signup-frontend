// Event card — displays date, time, notes for a single event
import styles from "./EventCard.module.css";
import { EventWithDetails } from "@/types";
import Button from "@/components/Button";
import Link from "next/link";

interface EventCardProps {
  event: EventWithDetails;
}

function formatTime(timeStr: string) {
  const date = new Date(`2000-01-01T${timeStr}`);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EventCard({ event }: EventCardProps) {
  const roles = [
    { label: "Scribe",            max: 1, confirmed: event.confirmed_scribes },
    { label: "Graduate",          max: 3, confirmed: event.confirmed_graduates },
    { label: "Preceptor",         max: 2, confirmed: event.confirmed_preceptors },
    { label: "Dental Student",    max: 1, confirmed: event.confirmed_dental_students },
    { label: "Outreach Manager",  max: 1, confirmed: event.confirmed_outreach_managers },
  ];

  return (
    <div className={styles["event-card"]}>
      <div className={styles["event-card-status"]}>{event.status}</div>
      <div className={styles["event-card-name"]}>{event.site?.name}</div>
      <div className={styles["event-card-date"]}>
        {formatDate(event.date)} • {formatTime(event.start_time)} -{" "}
        {formatTime(event.end_time)}
      </div>
      <div className={styles["event-card-location"]}>{event.site?.address}</div>
      {event.notes && (
        <div className={styles["event-card-notes"]}>{event.notes}</div>
      )}

      <div className={styles["capacity-section"]}>
        {roles.map(({ label, max, confirmed }) => (
          <div key={label} className={styles["capacity-row"]}>
            <span>{label}</span>
            <span
              className={`${styles["capacity-badge"]} ${confirmed === max ? styles["capacity-badge--full"] : ""}`}
            >
              {confirmed}/{max}
            </span>
          </div>
        ))}
      </div>

      <Link href={`/events/${event.id}`} className={styles["card-footer"]}>
        <Button className={styles["signup-btn"]}>Sign Up →</Button>
      </Link>
    </div>
  );
}
