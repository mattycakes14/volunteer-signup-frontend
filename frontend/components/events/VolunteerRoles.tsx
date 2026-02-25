"use client";

import styles from "@/components/events/VolunteerRoles.module.css";
import { Site, EventWithDetails } from "@/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import SignupModal from "@/components/events/SignupModal";

const VolunteerRoles = ({
  sites,
  event,
}: {
  sites: Site;
  event: EventWithDetails;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const roles = [
    { label: "Undergrad Scribes", max: 1, confirmed: event.confirmed_scribes },
    { label: "Grad Students", max: 2, confirmed: event.confirmed_graduates },
    { label: "Preceptors", max: 2, confirmed: event.confirmed_preceptors },
    {
      label: "Outreach Managers",
      max: 2,
      confirmed: event.confirmed_outreach_managers,
    },
    {
      label: "Dental Students",
      max: 2,
      confirmed: event.confirmed_dental_students,
    },
  ];

  return (
    <>
      <div className={styles.mainContainer}>
        {roles.map(({ label, max, confirmed }) => {
          const spotsLeft = max - confirmed;
          return (
            <div key={label} className={styles.scribesContainer}>
              <div className={styles.scribesWrapper}>
                <div className={styles.scribesTitle}>{label}</div>
                {spotsLeft === 0 ? (
                  <div className={styles.pillFull}>Full</div>
                ) : (
                  <div className={styles.pillOpen}>{spotsLeft} spots left</div>
                )}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(confirmed / max) * 100}%` }}
                ></div>
              </div>
              <div
                className={styles.numberFilled}
              >{`${confirmed}/${max} Filled`}</div>
            </div>
          );
        })}

        <div
          className={styles.signUpButtonWrapper}
          onClick={() => setModalOpen(true)}
        >
          <div className={styles.buttonText}>Sign Up Now</div>
          <ArrowRight size={20} color="#ffffff" />
        </div>
        <div className={styles.volunteerCancellation}>
          You may cancel up to 12 hours before.
        </div>
      </div>

      <SignupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={event}
      />
    </>
  );
};

export default VolunteerRoles;
