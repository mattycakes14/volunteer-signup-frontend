"use client";
// Volunteer signup history — past and upcoming events signed up for
import styles from "@/app/(dashboard)/history/History.module.css";
import { Calendar, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { SignupWithDetails } from "@/types/event-signup";
import { useEffect, useState } from "react";
import PastEvents from "@/components/history/PastEvents";
import { getUserId } from "@/lib/auth";

export default function HistoryPage() {
  const [events, setEvents] = useState<SignupWithDetails[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  useEffect(() => {
    const getTotalCounts = async () => {
      const userId = getUserId();
      const response = await api.get<SignupWithDetails[]>(
        `/event-signups/user/${userId}`,
      );
      setEvents(response);
      setTotalEvents(response.length);
    };
    getTotalCounts();
  }, []);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.volunteerTitle}>Volunteer History</div>
      <div className={styles.volunteerDesc}>
        Track your contributions and verified hours
      </div>
      <div className={styles.eventsAndHoursContainer}>
        <div className={styles.events}>
          <div className={styles.eventTitleBox}>
            <div className={styles.eventsText}>EVENTS ATTENDED</div>
            <div className={styles.numericEvent}>{totalEvents}</div>
          </div>
          <div className={styles.calendarContainer}>
            <Calendar />
          </div>
        </div>
        <div className={styles.hours}>
          <div className={styles.hoursTitleBox}>
            <div className={styles.hoursText}>TOTAL HOURS</div>
            <div className={styles.numericHour}>48.5</div>
          </div>
          <div className={styles.clockContainer}>
            <Clock />
          </div>
        </div>
      </div>
      <PastEvents signups={events} />
    </div>
  );
}
