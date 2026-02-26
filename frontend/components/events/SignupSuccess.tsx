"use client";

import styles from "@/components/events/SignupSuccess.module.css";
import { EventSignup, EventWithDetails } from "@/types";
import { X } from "lucide-react";

const SignupSuccess = ({
  signup,
  event,
  onClose,
  isMaxedOut,
}: {
  signup: EventSignup;
  event: EventWithDetails;
  onClose: () => void;
  isMaxedOut: boolean;
}) => {
  const isWaitlisted = signup?.status === "waitlist";

  console.log(isMaxedOut);

  if (isMaxedOut) {
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapperRed}>
          <X size={28} color="#dc2626" strokeWidth={3} />
        </div>
        <h2 className={styles.heading}>Signup limit reached</h2>
        <p className={styles.subheading}>
          You have reached the maximum of 2 signups across all outreach sites.
        </p>
        <button className={styles.doneButton} onClick={onClose}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={isWaitlisted ? styles.iconWrapperGrey : styles.iconWrapper}
      >
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
