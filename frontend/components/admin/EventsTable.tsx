"use client";
import { useEffect, useState } from "react";
import styles from "@/components/admin/EventsTable.module.css";
import { Search, Pencil, Trash2, File } from "lucide-react";
import { api } from "@/lib/api";
import type { EventWithSite, EventMetrics } from "@/types";
import DeleteModal from "@/components/admin/DeleteModal";
import Toast from "@/components/admin/Toast";
import MetricsForm from "@/components/admin/MetricsForm";

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (time: string) => {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${period}`;
};

const EventsTable = () => {
  const [events, setEvents] = useState<EventWithSite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithSite | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [existingMetrics, setExistingMetrics] = useState<EventMetrics | null>(
    null,
  );

  const deleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setIsDeleteOpen(false);
      setShowToast(true);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMetrics = async (eventId: string) => {
    try {
      const data = await api.get(`/event-metrics/by-event/${eventId}`);
      return data ?? null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const saveMetrics = async (
    eventId: string,
    peopleServed: number,
    numberOfGrad: number,
    totalServiceHours: number,
    notes: string,
  ): Promise<boolean> => {
    try {
      if (existingMetrics) {
        await api.patch(`/event-metrics/${existingMetrics.id}`, {
          people_served: peopleServed,
          number_of_grad: numberOfGrad,
          total_service_hours: totalServiceHours,
          notes: notes,
        });
      } else {
        await api.post("/event-metrics", {
          event_id: eventId,
          people_served: peopleServed,
          number_of_grad: numberOfGrad,
          total_service_hours: totalServiceHours,
          notes: notes,
        });
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get("/events/with-sites");
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((item) =>
    item.site.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerSection}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchBar}
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th className={styles.tableHeader}>SITE NAME</th>
            <th className={styles.tableHeader}>DATE & TIME</th>
            <th className={styles.tableHeader}>STATUS</th>
            <th className={styles.tableHeader}>LOCATION</th>
            <th className={styles.tableHeader}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((item, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.siteName}>{item.site.name}</td>
              <td className={styles.dateContainer}>
                <span className={styles.date}>{formatDate(item.date)}</span>
                <span className={styles.time}>
                  {formatTime(item.start_time)}–{formatTime(item.end_time)}
                </span>
              </td>
              <td>
                <span className={styles[item.status]}>{item.status}</span>
              </td>
              <td className={styles.address}>{item.site.address}</td>
              <td className={styles.actions}>
                <Pencil size={16} className={styles.editIcon} />
                <Trash2
                  onClick={() => {
                    setIsDeleteOpen(true);
                    setSelectedEvent(item);
                  }}
                  size={16}
                  className={styles.deleteIcon}
                />
                <File
                  onClick={async () => {
                    const metrics = await fetchMetrics(item.id);
                    setExistingMetrics(metrics);
                    console.log(existingMetrics);
                    setSelectedEvent(item);
                    setIsMetricsOpen(true);
                  }}
                  size={16}
                  className={styles.metricsIcon}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDeleteOpen && (
        <DeleteModal
          onConfirm={deleteEvent}
          onCancel={() => setIsDeleteOpen(false)}
          eventId={selectedEvent?.id ?? ""}
        />
      )}
      {isMetricsOpen && selectedEvent && (
        <MetricsForm
          key={selectedEvent.id}
          onCancel={() => setIsMetricsOpen(false)}
          onConfirm={saveMetrics}
          event={selectedEvent}
          existingMetrics={existingMetrics}
        />
      )}
      {showToast && (
        <Toast
          message="Event deleted successfully"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default EventsTable;
