import styles from "@/components/dashboard/UpcomingEvents.module.css";
import Image from "next/image";
import timeIcon from "@/public/time.png";
import locationIcon from "@/public/location.png";
import roleIcon from "@/public/role.png";
import { useState } from "react";

// converting MM/MM/YY to month and day
const MONTHS: Record<number, string> = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

interface UpcomingEventProps {
  date: string;
  siteTitle: string;
  status: string;
  durationHours: string;
  location: string;
  role: string;
}

const UpcomingEvents = ({
  date,
  siteTitle,
  status,
  durationHours,
  location,
  role,
}: UpcomingEventProps) => {
  const [month] = useState<string>(() => MONTHS[parseInt(date.split("-")[1])]);
  const [day] = useState<number>(() => parseInt(date.split("-")[2]));

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.date}>
        <div className={styles.month}>{month}</div>
        <div className={styles.day}>{day}</div>
      </div>
      <div className={styles.descriptionContainer}>
        <div className={styles.titleAndStatusWrapper}>
          <div className={styles.title}>{siteTitle}</div>
          <div className={styles.status}>{status.toUpperCase()}</div>
        </div>
        <div className={styles.durationAndLocationAndRoleWrapper}>
          <div className={styles.duration}>
            <Image src={timeIcon} alt="time" className={styles.icon} />
            {durationHours}
          </div>
          <div className={styles.location}>
            <Image src={locationIcon} alt="location" className={styles.icon} />
            {location}
          </div>
          <div className={styles.role}>
            <Image src={roleIcon} alt="role" className={styles.icon} />
            {role}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
