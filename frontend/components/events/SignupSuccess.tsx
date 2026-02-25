"use client";

import styles from "@/components/events/SignupSuccess.module.css";
import { EventSignup, EventWithDetails } from "@/types";

const SignupSuccess = ({
  signup,
  event,
  onClose,
}: {
  signup: EventSignup;
  event: EventWithDetails;
  onClose: () => void;
}) => {
  const isWaitlisted = signup.status === "waitlist";

  return (
    <div className={styles.container}>
      <div className={isWaitlisted ? styles.iconWrapperGrey : styles.iconWrapper}>
        <span className={isWaitlisted ? styles.hourglass : styles.checkmark}>
          {isWaitlisted ? "⏳" : "✓"}
        </span>
      </div>

      <h2 className={styles.heading}>
        {isWaitlisted ? "You're on the waitlist!" : "You're signed up!"}
      </h2>
      <p className={styles.subheading}>
        {isWaitlisted
          ? "We'll notify you if a spot opens up."
          : "We'll see you there. Check your email for a confirmation."}
      </p>

      <button className={styles.doneButton} onClick={onClose}>
        Done
      </button>
    </div>
  );
};

export default SignupSuccess;
