"use client";

import styles from "@/components/events/VolunteerRoles.module.css";
import { Site, EventWithDetails, EventSignup, VolunteerRole, Event } from "@/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { format } from "path";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EventSignup | null>(null);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    let hh = parseInt(hours);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12; // Convert 0 to 12 for midnight and handle 13+
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  function closeModal() {
    setModalOpen(false);
    setRole("");
    setError("");
    setResult(null);
  }


  return (
    <>
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
        <div className={styles.signUpButtonWrapper} onClick={() => setModalOpen(true)}>
          <div className={styles.buttonText}>Sign Up Now</div>
          <ArrowRight size={20} color="#ffffff" />
        </div>
        <div className={styles.volunteerCancellation}>
          You may cancel up to 12 hours before.
        </div>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeX} onClick={closeModal}>&times;</button>

            <h2 className={styles.modalTitle}>Confirm Signup</h2>

            {/* Event Details Card */}
            <div className={styles.eventCard}>
              <h3 className={styles.eventTitle}>{event.site?.name || "Downtown Community Health Fair"}</h3>
              <div className={styles.eventMeta}>
                <span>📅 {new Date(event.date.replace(/-/g, '\/')).toLocaleDateString()}</span>
                <span>🕒 {formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
              </div>
            </div>

            <div className={styles.roleSelection}>
              <label className={styles.sectionLabel}>SELECT YOUR ROLE</label>

              {Object.entries(VolunteerRole)
                .filter(([key]) => ["SCRIBE", "GRADUATE", "PRECEPTOR"].includes(key)) // Only show these three
                .map(([key, value]) => (
                  <label key={value} className={`${styles.roleOption} ${role === value ? styles.selectedRole : ""}`}>
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
                      {/* Manually formatting for the specific "Scribe (Undergrad)" look */}
                      {key === "SCRIBE" ? "Scribe (Undergrad)" : key.charAt(0) + key.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>ⓘ</span>
              <p>Please ensure your school/discipline and year are up to date in your profile. Accuracy is required for clinical credentialing.</p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleSignUp}
                disabled={!role || loading}
              >
                {loading ? "Processing..." : "Confirm Signup"}
              </button>
              <button className={styles.cancelLink} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VolunteerRoles;
