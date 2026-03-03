// Metrics form — post-event data: people served, grad students, service hours
"use client";
import { useState, useEffect } from "react";
import styles from "@/components/admin/MetricsForm.module.css";
import { Users, GraduationCap, Clock, CircleCheck } from "lucide-react";
import type { EventWithSite, EventMetrics } from "@/types";

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

interface MetricsFormProps {
  event: EventWithSite;
  existingMetrics: EventMetrics | null;
  onCancel: () => void;
  onConfirm: (
    eventId: string,
    peopleServed: number,
    numberOfGrad: number,
    totalServiceHours: number,
    notes: string,
  ) => Promise<boolean>;
}

export default function MetricsForm({
  event,
  existingMetrics,
  onCancel,
  onConfirm,
}: MetricsFormProps) {
  const [peopleServed, setPeopleServed] = useState<number>(
    existingMetrics?.people_served ?? 0,
  );
  const [numberOfGrad, setNumberOfGrad] = useState<number>(
    existingMetrics?.number_of_grad ?? 0,
  );
  const [totalServiceHours, setTotalServiceHours] = useState<number>(
    existingMetrics?.total_service_hours ?? 0,
  );
  const [notes, setNotes] = useState<string>(existingMetrics?.notes ?? "");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async () => {
    const success = await onConfirm(
      event.id,
      peopleServed,
      numberOfGrad,
      totalServiceHours,
      notes,
    );
    if (success) {
      setIsSuccess(true);
      setTimeout(() => onCancel(), 2000);
    }
  };

  const metricFields = [
    {
      labelText: "Community Members Served",
      inputImage: <Users size={16} />,
      value: peopleServed,

      onChange: (v: string) => {
        const n = Number(v);
        if (!isNaN(n)) setPeopleServed(n);
      },
    },
    {
      labelText: "Graduate Students Attended",
      inputImage: <GraduationCap size={16} />,
      value: numberOfGrad,

      onChange: (v: string) => {
        const n = Number(v);
        if (!isNaN(n)) setNumberOfGrad(n);
      },
    },
    {
      labelText: "Total Service Hours",
      inputImage: <Clock size={16} />,
      value: totalServiceHours,

      onChange: (v: string) => {
        const n = Number(v);
        if (!isNaN(n)) setTotalServiceHours(n);
      },
    },
  ];

  return (
    <div className={styles.overlay}>
      <div
        className={isSuccess ? styles.successContainer : styles.mainContainer}
      >
        {isSuccess ? (
          <div className={styles.successContent}>
            <CircleCheck size={48} className={styles.successIcon} />
            <div className={styles.successText}>
              {existingMetrics
                ? "Metrics Updated Successfully"
                : "Metrics Submitted Successfully"}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.postEventPill}>POST-EVENT REPORT</div>
              <div className={styles.eventName}>{event.site.name}</div>
              <div className={styles.eventDate}>{formatDate(event.date)}</div>
            </div>

            {metricFields.map((item, index) => (
              <label key={index} className={styles.label}>
                {item.labelText}
                <div className={styles.wrapperInput}>
                  {item.inputImage}
                  <input
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value)}
                  />
                </div>
              </label>
            ))}
            <label className={styles.label}>
              <div>
                Shift Notes <span className={styles.optional}>(Optional)</span>
              </div>
              <textarea
                className={styles.notesInput}
                value={notes}
                placeholder="Any additional mentions or incidents?"
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className={styles.buttonWrapper}>
              <div className={styles.cancelButton} onClick={onCancel}>
                Cancel
              </div>
              <div className={styles.confirmButton} onClick={handleSubmit}>
                {existingMetrics ? "Update Metrics" : "Submit Metrics"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
