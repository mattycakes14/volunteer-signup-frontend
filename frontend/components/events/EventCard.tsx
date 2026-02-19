// Event card — displays date, time, notes for a single event
import styles from "./EventCard.module.css";                                       
import { EventWithDetails } from "@/types";
import Button from "@/components/Button";
                                                                                     
  interface EventCardProps {                                                         
    event: EventWithDetails;                                                         
  }                                                                                  

  function formatTime(timeStr: string) {                                          
    const date = new Date(`2000-01-01T${timeStr}`);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit"  
    });                                                                             
  }

  function formatDate(dateStr: string) {                                          
    const date = new Date(dateStr + "T00:00:00");                                 
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });  
  }

  export default function EventCard({ event }: EventCardProps) {
    return (
      <div className={styles["event-card"]}>
        <div className={styles["event-card-status"]}>{event.status}</div>
        <div className={styles["event-card-name"]}>{event.site?.name}</div>
        <div className={styles["event-card-date"]}>{formatDate(event.date)} • {formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
        <div className = {styles["event-card-location"]}>Seattle, WA</div>
        {event.notes && <div className={styles["event-card-notes"]}>{event.notes}</div>}

        <div className={styles["capacity-section"]}>                                    
          <div className={styles["capacity-row"]}>
            <span>Scribe</span>                                                         
            <span className={styles["capacity-badge"]}>0/2</span>                       
          </div>                                                                        
          <div className={styles["capacity-row"]}>                                      
            <span>Graduate</span>
            <span className={styles["capacity-badge"]}>1/3</span>
          </div>
          <div className={styles["capacity-row"]}>
            <span>Preceptor</span>
            <span className={styles["capacity-badge"]}>0/2</span>
          </div>
        </div>

        <div className={styles["card-footer"]}>
          <Button className={styles["signup-btn"]}>Sign Up →</Button>
        </div>
      </div>
    );
  }

