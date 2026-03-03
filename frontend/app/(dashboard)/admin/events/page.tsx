"use client";
import style from "@/app/(dashboard)/admin/events/Events.module.css";
import EventsTable from "@/components/admin/EventsTable";
import MetricsForm from "@/components/admin/MetricsForm";
import CreateEventButton from "@/components/admin/CreateEventButton";


// Admin event list — manage all events (edit/delete)
export default function AdminEventsPage() {

  return (
    <div className={style.mainContainer}>
      <div className={style.firstSection}>
        <div className={style.titleWrapper}>
          <div className={style.eventsManagementText}>Events Management</div>
          <div className={style.subheaderText}>
            Manage schedules, sites, and volunteer allocation
          </div>
        </div>
        <CreateEventButton />
      </div>
      <EventsTable />
    </div>
  );
}
