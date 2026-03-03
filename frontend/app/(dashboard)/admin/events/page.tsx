"use client";

import style from "@/app/(dashboard)/admin/events/Events.module.css";
import { Plus } from "lucide-react";
import EventsTable from "@/components/admin/EventsTable";
import MetricsForm from "@/components/admin/MetricsForm";

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
        <div className={style.createNewButton}>
          <Plus size={18} />
          Create New Event
        </div>
      </div>
      <EventsTable />
    </div>
  );
}
