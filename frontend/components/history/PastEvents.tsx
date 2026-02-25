import styles from "@/components/history/PastEvents.module.css";
import { SignupWithDetails } from "@/types/event-signup";

type PastEventsProps = {
  signups: SignupWithDetails[];
};

const PastEvents = ({ signups }: PastEventsProps) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.pastEvents}>Past Events</div>
      <table>
        <thead>
          <tr>
            <th className={styles.headerTitle}>SITE/ LOCATION</th>
            <th className={styles.headerTitle}>DATE</th>
            <th className={styles.headerTitle}>ROLE</th>
            <th className={styles.headerTitle}>HOURS</th>
            <th className={styles.headerTitle}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((item, index) => (
            <tr key={index}>
              <td className={styles.siteName}>
                {item.event?.site?.name ?? "—"}
              </td>
              <td className={styles.eventDate}>{item.event?.date ?? "—"}</td>
              <td className={styles.role}>
                <span className={styles.rolePill}>{item.role}</span>
              </td>
              <td className={styles.hours}>
                {item.event?.start_time && item.event?.end_time
                  ? (() => {
                      const [sh, sm] = item.event.start_time
                        .split(":")
                        .map(Number);
                      const [eh, em] = item.event.end_time
                        .split(":")
                        .map(Number);
                      return (eh * 60 + em - (sh * 60 + sm)) / 60;
                    })()
                  : "—"}
              </td>
              <td className={styles.status}><span className={styles.statusPill}>{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PastEvents;
