"use client";

import styles from "@/components/events/VolunteerRoles.module.css";
import { Site, EventWithDetails, EventSignup, VolunteerRole } from "@/types";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import SignupModal from "@/components/events/SignupModal";

const VolunteerRoles = ({
  sites,
  event,
}: {
  sites: Site;
  event: EventWithDetails;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userSignup, setUserSignup] = useState<EventSignup | null>(null);

  useEffect(() => {
    async function fetchUserSignup() {
      try {
        const signups = await api.get<EventSignup[]>(
          "/event-signups/me/upcoming",
        );
        const match = signups.find(
          (s) => s.event_id === event.id && s.status !== "cancelled",
        );
        setUserSignup(match ?? null);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserSignup();
  }, [event.id]);

  async function handleWithdraw() {
    if (!userSignup) return;
    // TODO: get clarification on cancellations leading up to event date
    // const eventStart = new Date(`${event.date}T${event.start_time}`);
    // const hoursUntil = (eventStart.getTime() - Date.now()) / (1000 * 60 * 60);
    // if (hoursUntil < 12) {
    //   alert("Cannot withdraw within 12 hours of the event.");
    //   return;
    // }
    try {
      await api.patch(`/event-signups/${userSignup.id}`, {
        status: "canceled",
      });
      setUserSignup(null);
    } catch (err) {
      console.log(err);
    }
  }

  const roles = [
    {
      label: "Undergrad Scribes",
      max: 1,
      confirmed: event.confirmed_scribes,
      roleKey: VolunteerRole.SCRIBE,
    },
    {
      label: "Grad Students",
      max: 2,
      confirmed: event.confirmed_graduates,
      roleKey: VolunteerRole.GRADUATE,
    },
    {
      label: "Preceptors",
      max: 2,
      confirmed: event.confirmed_preceptors,
      roleKey: VolunteerRole.PRECEPTOR,
    },
    {
      label: "Outreach Managers",
      max: 2,
      confirmed: event.confirmed_outreach_managers,
      roleKey: VolunteerRole.OUTREACH_MANAGER,
    },
    {
      label: "Dental Students",
      max: 2,
      confirmed: event.confirmed_dental_students,
      roleKey: VolunteerRole.DENTAL_STUDENT,
    },
  ];

  return (
    <>
      <div className={styles.mainContainer}>
        {roles.map(({ label, max, confirmed, roleKey }) => {
          const spotsLeft = max - confirmed;
          const isUserRole = userSignup?.role === roleKey;
          return (
            <div key={label} className={styles.scribesContainer}>
              <div className={styles.scribesWrapper}>
                <div className={styles.scribesTitle}>
                  {label}
                  {isUserRole && (
                    <span className={styles.pillSignedUp}>Signed Up</span>
                  )}
                </div>
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

        {userSignup ? (
          <div
            className={styles.withdrawButtonWrapper}
            onClick={handleWithdraw}
          >
            <div className={styles.buttonText}>Withdraw</div>
          </div>
        ) : (
          <div
            className={styles.signUpButtonWrapper}
            onClick={() => setModalOpen(true)}
          >
            <div className={styles.buttonText}>Sign Up Now</div>
            <ArrowRight size={20} color="#ffffff" />
          </div>
        )}
        <div className={styles.volunteerCancellation}>
          You may cancel up to 12 hours before.
        </div>
      </div>

      <SignupModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Re-fetch signup state after modal closes (user may have just signed up)
          api
            .get<EventSignup[]>("/event-signups/me/upcoming")
            .then((signups) => {
              const match = signups.find(
                (s) => s.event_id === event.id && s.status !== "cancelled",
              );
              setUserSignup(match ?? null);
            });
        }}
        event={event}
      />
    </>
  );
};

export default VolunteerRoles;
