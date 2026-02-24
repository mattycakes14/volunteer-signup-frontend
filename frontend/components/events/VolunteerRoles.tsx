import styles from "@/components/events/VolunteerRoles.module.css";
import { Site, EventWithDetails } from "@/types";
import { ArrowRight } from "lucide-react";

const TOTAL_SCRIBES = 1;
const TOTAL_GRAD = 2;
const TOTAL_PRECEPTORS = 2;

const VolunteerRoles = ({
  sites,
  event,
}: {
  sites: Site;
  event: EventWithDetails;
}) => {
  const scribesLeft = TOTAL_SCRIBES - event.confirmed_scribes;
  const gradsLeft = TOTAL_GRAD - event.confirmed_graduates;
  const preceptorsLeft = TOTAL_PRECEPTORS - event.confirmed_preceptors;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.scribesContainer}>
        <div className={styles.scribesWrapper}>
          <div className={styles.scribesTitle}>Undergrad Scribes</div>
          {scribesLeft === 0 ? (
            <div className={styles.pillFull}>Full</div>
          ) : (
            <div className={styles.pillOpen}>{scribesLeft} spots left</div>
          )}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(event.confirmed_scribes / TOTAL_SCRIBES) * 100}%`,
            }}
          ></div>
        </div>
        <div
          className={styles.numberFilled}
        >{`${event.confirmed_scribes}/${TOTAL_SCRIBES} Filled`}</div>
      </div>

      <div className={styles.gradsContainer}>
        <div className={styles.scribesWrapper}>
          <div className={styles.scribesTitle}>Grad Students</div>
          {gradsLeft === 0 ? (
            <div className={styles.pillFull}>Full</div>
          ) : (
            <div className={styles.pillOpen}>{gradsLeft} spots left</div>
          )}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(event.confirmed_graduates / TOTAL_GRAD) * 100}%`,
            }}
          ></div>
        </div>
        <div
          className={styles.numberFilled}
        >{`${event.confirmed_graduates}/${TOTAL_GRAD} Filled`}</div>
      </div>
      <div className={styles.preceptorContainer}>
        <div className={styles.scribesWrapper}>
          <div className={styles.scribesTitle}>Preceptors</div>
          {preceptorsLeft === 0 ? (
            <div className={styles.pillFull}>Full</div>
          ) : (
            <div className={styles.pillOpen}>{preceptorsLeft} spots left</div>
          )}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(event.confirmed_preceptors / TOTAL_PRECEPTORS) * 100}%`,
            }}
          ></div>
        </div>
        <div
          className={styles.numberFilled}
        >{`${event.confirmed_preceptors}/${TOTAL_PRECEPTORS} Filled`}</div>
      </div>
      <div className={styles.signUpButtonWrapper}>
        <div className={styles.buttonText}>Sign Up Now</div>
        <ArrowRight size={20} color="#ffffff" />
      </div>
      <div className={styles.volunteerCancellation}>
        You may cancel up to 12 hours before.
      </div>
    </div>
  );
};

export default VolunteerRoles;
