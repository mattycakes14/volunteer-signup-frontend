import styles from "@/components/events/EventDetails.module.css";
import { EventWithDetails } from "@/types";
import preparation from "@/public/preparation.png";

interface EventDetailsProps {
  event: EventWithDetails;
}

function formatTime(timeStr: string) {
  const date = new Date(`2000-01-01T${timeStr}`);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function parseDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return {
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.getDate(),
    year: date.getFullYear(),
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

const EventDetails = ({ event }: EventDetailsProps) => {
  const { month, day, year, weekday } = parseDate(event.date);
  const contacts = event.site?.contacts.split(",");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.firstContainer}>
        <div className={styles.titleSection}>
          <div className={styles.titleContainer}>{event.site?.name}</div>
          <div className={styles.descriptionSection}>
            {event.site?.frequency}
          </div>
          <div className={styles.descriptionSection}>
            <div className={styles.contactsTitle}>Contacts</div>
            <ul className={styles.contactsList}>
              {contacts?.map((contact, i) => (
                <li key={i}>{contact.trim()}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.date}>
          <div className={styles.month}>{month.toUpperCase()}</div>
          <div className={styles.day}>{day}</div>
          <div className={styles.year}>{year}</div>
        </div>
      </div>
      <div className={styles.secondContainer}>
        <div className={styles.timeAndLocationWrapper}>
          <div className={styles.timeContainer}>
            <div className={styles.timeWrapper}>
              <span className={`material-icons ${styles.timePicture}`}>
                schedule
              </span>
            </div>
            <div className={styles.dateAndTime}>
              <div className={styles.dateAndTimeText}>Date & Time</div>
              <div className={styles.actualDateAndTime}>
                {weekday} {month} {day}
              </div>
              <div className={styles.stardAndEnd}>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </div>
            </div>
          </div>
          <div className={styles.locationContainer}>
            <div className={styles.locationWrapper}>
              <span className={`material-icons ${styles.location}`}>place</span>
            </div>
            <div className={styles.locationInfo}>
              <div className={styles.locationText}>Location</div>
              <div className={styles.actualLocation}>{event.site?.address}</div>
              <div className={styles.map}>View on map</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.thirdContainer}>
        <div className={styles.aboutThisEventTitle}>About This Event</div>
        <div className={styles.description}>{event.site?.description}</div>
      </div>
      <div className={styles.fourthContainer}>
        <div className={styles.prepareContainer}>
          <div className={styles.prepareTitleContainer}>
            <div className={styles.prepareIcon}>
              <img
                className={styles.actualPrepareIcon}
                src={preparation.src}
                alt="preparation image"
              />
            </div>
            <div className={styles.prepareTitle}>
              How to Prepare/ Rules & Requirements
            </div>
          </div>
          <div className={styles.prepareContent}>
            {event.site?.preparation_notes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
