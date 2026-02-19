// Volunteer dashboard — upcoming signups + past events
"use client";

import styles from "./Dashboard.module.css";
import MetricContainer from "@/components/dashboard/MetricContainer";
import totalEventsImg from "@/public/events.png";
import upcomingShiftsImg from "@/public/event.png";
import volunteerHoursImg from "@/public/history.png";

// user prop being passed from layout
import { useContext } from "react";
import { UserContext } from "@/app/(dashboard)/layout";
const metricCards = [
  { title: "Total Events", image: totalEventsImg, metric: 12 },
  { title: "Upcoming Shifts", image: upcomingShiftsImg, metric: 3 },
  { title: "Volunteer Hours", image: volunteerHoursImg, metric: 48.5 },
];

export default function DashboardPage() {
  const user = useContext(UserContext);
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.greetingText}>Good Morning</div>
      <div className={styles.welcomeText}>
        Welcome back, {user?.name.substring(0, user?.name.indexOf(" "))}
      </div>
      {/* <div>
        {metricCards.map((card) => (
          <MetricContainer
            key={card.title}
            title={card.title}
            image={card.image}
            metric={card.metric}
          />
        ))}
      </div> */}
    </div>
  );
}
