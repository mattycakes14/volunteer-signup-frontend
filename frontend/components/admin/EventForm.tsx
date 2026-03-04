// Event form — dual-mode: create (no initialData) or edit (with initialData)
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Site } from "@/types";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.css";
import { ArrowLeft, MapPin, Check } from "lucide-react";


export default function EventForm() {
  // Initialize Router
  const router = useRouter();

  // Initialize values for the input areas
  const [site_id, setSiteId] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [stateError, setError] = useState<Error | null>(null);

  // Make fetch request for list of sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await api.get<Site[]>("/sites");
        setSites(data);
      } catch (err) {
        setError((err as Error));
      }
    };
    fetchSites();
  }, []
  );

  // onSubmit handler function
  async function handleSubmit(e: React.FormEvent) {
    // Stop page from refreshing
    e.preventDefault()
    try {
      const res = await api.post("/events/",
        {
          site_id: site_id,
          date: date,
          start_time: start_time,
          end_time: end_time,
          notes: notes
        }
      );
      router.push('/admin/events');
    } catch (error) {
      console.log("Form submit attempt failed");
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
      <div className={styles.dashboardLink} onClick={() => router.push('/admin')}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Create New Event</h1>
          <p>Schedule a new medical outreach session for volunteers</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2>EVENT LOGISTICS</h2>
            <div className={styles.field}>
              <label>Event Site</label>
              <div className={styles.inputWrapper}>
                <MapPin size={16} className={styles.inputIcon} />
                <select value={site_id} onChange={(e) => setSiteId(e.target.value)}>
                  <option value="" disabled>Select a clinic location</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.timesRow}>
              <div className={styles.field}>
                <label>Event Date</label>
                <input type="date" onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Start</label>
                <input type="time" onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>End</label>
                <input type="time" onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h2>DETAILS</h2>
            <div className={styles.field}>
              <label>Event Description & Notes</label>
              <textarea onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className={styles.footer}>
            <button className={styles.cancelButton} type='button' onClick={() => router.push('/admin/events')}>Cancel</button>
            <button className={styles.submitButton} type="submit">
              <Check size={16} />
              Save Event
            </button>
          </div>
        </form >

      </div>

    </div>

  )

}
