// Event form — dual-mode: create (no initialData) or edit (with initialData)
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Site } from "@/types";
import { useRouter } from "next/navigation";


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
        if (data.length > 0) {
          setSiteId(data[0].id)
        }
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
    <form onSubmit={handleSubmit}>
      <div>
        <select value={site_id} onChange={(e) => setSiteId(e.target.value)}>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
        <input type="date" onChange={(e) => setDate(e.target.value)}></input>
        <input type="time" onChange={(e) => setStartTime(e.target.value)} />
        <input type="time" onChange={(e) => setEndTime(e.target.value)} />
        <input type="text" onChange={(e) => setNotes(e.target.value)} />
        <button type="submit">Save Event</button>
        <button type='button' onClick={() => router.push('/admin/events')}>Cancel</button>
      </div>
    </form >
  )

}
