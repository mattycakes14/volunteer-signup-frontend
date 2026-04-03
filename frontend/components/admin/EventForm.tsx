// Event form — dual-mode: create (no initialData) or edit (with initialData)
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Site, Event } from "@/types";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.css";
import { ArrowLeft, MapPin, Check } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface EventFormProps {
  initialData?: Event;
}

export default function EventForm({ initialData }: EventFormProps) {
  // initialData = editing page. Otherwise, brand new event form
  const isEditing = !!initialData;

  // Initialize Router
  const router = useRouter();

  // Initialize values for the input areas (pre-fill if editing)
  const [site_id, setSiteId] = useState(initialData?.site_id ?? "");
  const [sites, setSites] = useState<Site[]>([]);
  const [start_time, setStartTime] = useState(
    initialData?.start_time?.slice(0, 5) ?? "",
  );
  const [end_time, setEndTime] = useState(
    initialData?.end_time?.slice(0, 5) ?? "",
  );
  const [date, setDate] = useState(initialData?.date ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [stateError, setError] = useState<Error | null>(null);

  // Make fetch request for list of sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await api.get<Site[]>("/sites");
        setSites(data);
      } catch (err) {
        setError(err as Error);
      }
    };
    fetchSites();
  }, []);

  // onSubmit handler function
  async function handleSubmit(e: React.FormEvent) {
    // Stop page from refreshing
    e.preventDefault();
    try {
      const toHMS = (t: string) => (t.length === 5 ? `${t}:00` : t);
      const payload = {
        site_id: site_id,
        date: date,
        start_time: toHMS(start_time),
        end_time: toHMS(end_time),
        notes: notes,
      };
      if (isEditing) {
        console.log(initialData);
        console.log(initialData?.id);
        await api.patch(`/events/${initialData.id}`, payload);
      } else {
        await api.post("/events/", payload);
      }
      router.push("/admin/events");
    } catch (error) {
      setError(error instanceof Error ? error : new Error("sign in failed"));
    }
  }

  return (
    /* 
    Div to contain everything
    Header Div
    "Body Div", divided into three divs
      - Event Logistics
      - Details
      - Footer row with submit and cancel buttons
    */
    <div className={styles.page}>
      <div
        className={styles.dashboardLink}
        onClick={() => router.push(ROUTES.ADMIN.EVENTS)}
      >
        <ArrowLeft size={16} />
        Back to Events
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>{isEditing ? "Edit Event" : "Create New Event"}</h1>
          <p>
            {isEditing
              ? "Update the details for this outreach event"
              : "Schedule a new medical outreach session for volunteers"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2>EVENT LOGISTICS</h2>
            <div className={styles.field}>
              <label>Event Site</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <select
                  value={site_id}
                  onChange={(e) => setSiteId(e.target.value)}
                >
                  <option value="" disabled>
                    Select a clinic location
                  </option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.timesRow}>
              <div className={styles.field}>
                <label>Event Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Start</label>
                <input
                  type="time"
                  value={start_time}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>End</label>
                <input
                  type="time"
                  value={end_time}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h2>DETAILS</h2>
            <div className={styles.field}>
              <label>Event Description & Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => router.push("/admin/events")}
            >
              Cancel
            </button>
            <button className={styles.submitButton} type="submit">
              <Check size={16} />
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
