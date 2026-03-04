// Wrapper component managing new event button

"use client";
import { Plus } from "lucide-react";
import style from "@/app/(dashboard)/admin/events/Events.module.css";
import { useRouter } from "next/navigation";


export default function CreateEventButton() {
  const router = useRouter();

  return (
    <>
      <div className={style.createNewButton} onClick={() => router.push('/admin/events/new')} >
        <Plus size={18} />
        Create New Event
      </div>
    </>
  )
}
