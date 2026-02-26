"use client";

import styles from "@/components/events/VolunteerRoles.module.css";
import { EventWithDetails, EventSignup, VolunteerRole } from "@/types";
import { api, ApiError } from "@/lib/api";
import { useState, useEffect } from "react";
import SignupSuccess from "@/components/events/SignupSuccess";

const ROLE_LABELS: Record<VolunteerRole, string> = {
  [VolunteerRole.SCRIBE]: "Scribe (Undergrad)",
  [VolunteerRole.GRADUATE]: "Graduate",
  [VolunteerRole.PRECEPTOR]: "Preceptor",
  [VolunteerRole.OUTREACH_MANAGER]: "Outreach Manager",
  [VolunteerRole.DENTAL_STUDENT]: "Dental Student",
};
const SignupModal = ({
  isOpen,
  onClose,
  event,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: EventWithDetails;
}) => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EventSignup | null>(null);
  const [isMaxedOut, setIsMaxedOut] = useState(false);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    let hh = parseInt(hours);
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12;
    return `${hh}:${minutes} ${ampm}`;
  };

  async function handleSignUp() {
    setLoading(true);
    setError("");
    try {
      const data = await api.post<EventSignup>("/event-signups/", {
        event_id: event.id,
        role,
      });
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setIsMaxedOut(true);
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // disable scroll when component mounted. Unmounts, it will allow scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeModal() {
    setRole("");
    setError("");
    setResult(null);
    setIsMaxedOut(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeX} onClick={closeModal}>
          &times;
        </button>

        {result || isMaxedOut ? (
          <SignupSuccess
            signup={result!}
            event={event}
            onClose={closeModal}
            isMaxedOut={isMaxedOut}
          />
        ) : (
          <>
            <h2 className={styles.modalTitle}>Confirm Signup</h2>

            <div className={styles.eventCard}>
              <h3 className={styles.eventTitle}>
                {event.site?.name || "Site Name Not Found"}
              </h3>
              <div className={styles.eventMeta}>
                <span>
                  📅{" "}
                  {new Date(event.date.replace(/-/g, "/")).toLocaleDateString()}
                </span>
                <span>
                  🕒 {formatTime(event.start_time)} -{" "}
                  {formatTime(event.end_time)}
                </span>
              </div>
            </div>

            <div className={styles.roleSelection}>
              <label className={styles.sectionLabel}>SELECT YOUR ROLE</label>

              {Object.values(VolunteerRole).map((value, index) => (
                <label
                  key={index}
                  className={`${styles.roleOption} ${role === value ? styles.selectedRole : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={(e) => setRole(e.target.value)}
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.customRadio}></span>
                  <span className={styles.roleText}>
                    {ROLE_LABELS[value as VolunteerRole]}
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>ⓘ</span>
              <p>
                Please ensure your school/discipline and year are up to date in
                your profile. Accuracy is required for clinical credentialing.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.confirmButton} ${!role || loading ? styles.confirmButtonDisabled : ""}`}
                onClick={handleSignUp}
                disabled={!role || loading}
              >
                {loading ? "Processing..." : "Confirm Signup"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
