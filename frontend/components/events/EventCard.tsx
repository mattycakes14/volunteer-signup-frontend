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

const MAX_SCRIBES = 1;
const MAX_GRADUATES = 3;
const MAX_PRECEPTORS = 2;

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className={styles["event-card"]}>
      <div className={styles["event-card-status"]}>{event.status}</div>
      <div className={styles["event-card-name"]}>{event.site?.name}</div>
      <div className={styles["event-card-date"]}>
        {formatDate(event.date)} • {formatTime(event.start_time)} -{" "}
        {formatTime(event.end_time)}
      </div>
      <div className={styles["event-card-location"]}>Seattle, WA</div>
      {event.notes && (
        <div className={styles["event-card-notes"]}>{event.notes}</div>
      )}

      <div className={styles["capacity-section"]}>
        <div className={styles["capacity-row"]}>
          <span>Scribe</span>
          <span
            className={`${styles["capacity-badge"]} ${event.confirmed_scribes === MAX_SCRIBES ? styles["capacity-badge--full"] : ""}`}
          >
            {event.confirmed_scribes}/{MAX_SCRIBES}
          </span>
        </div>
        <div className={styles["capacity-row"]}>
          <span>Graduate</span>
          <span
            className={`${styles["capacity-badge"]} ${event.confirmed_graduates === MAX_GRADUATES ? styles["capacity-badge--full"] : ""}`}
          >
            {event.confirmed_graduates}/{MAX_GRADUATES}
          </span>
        </div>
        <div className={styles["capacity-row"]}>
          <span>Preceptor</span>
          <span
            className={`${styles["capacity-badge"]} ${event.confirmed_preceptors === MAX_PRECEPTORS ? styles["capacity-badge--full"] : ""}`}
          >
            {event.confirmed_preceptors}/{MAX_PRECEPTORS}
          </span>
        </div>
      </div>

      <Link href={`/events/${event.id}`} className={styles["card-footer"]}>
        <Button className={styles["signup-btn"]}>Sign Up →</Button>
      </Link>
    </div>
  );
}
