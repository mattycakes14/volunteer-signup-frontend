"use client";
import styles from "@/components/admin/DataTable.module.css";
import { api } from "@/lib/api";
import type { SignupWithDetails } from "@/types/event-signup";
import { useEffect, useState } from "react";

type ParsedSignup = {
  id: string;
  name: string;
  role: string;
  event: string;
  status: string;
  signedUpAt: string;
};

function parseSignups(data: SignupWithDetails[]): ParsedSignup[] {
  return data.map((signup) => ({
    id: signup.id,
    name: signup.user?.name ?? "Unknown",
    role: signup.role,
    event: signup.event?.site?.name ?? "Unknown Event",
    status: signup.status,
    signedUpAt: new Date(signup.created_at).toLocaleString(),
  }));
}

export default function DataTable() {
  const [signUps, setSignUps] = useState<ParsedSignup[]>([]);

  useEffect(() => {
    async function getVolunteers() {
      try {
        const response = await api.get<SignupWithDetails[]>(
          "/event-signups/recent",
        );
        setSignUps(parseSignups(response));
      } catch (err) {
        // TODO: display error for UI
      }
    }
    getVolunteers();
  }, []);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.recentSignUpsText}>Recent Signups</div>
      <div className={styles.volunteersSignUpText}>
        Latest volunteers registered for upcoming events
      </div>
      <table>
        <thead>
          <tr>
            <th className={styles.tableHeader}>VOLUNTEER</th>
            <th className={styles.tableHeader}>ROLE</th>
            <th className={styles.tableHeader}>EVENT</th>
            <th className={styles.tableHeader}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {signUps.map((item, index) => (
            <tr key={index}>
              <th className={`${styles.tableCell} ${styles.name}`}>{item.name}</th>
              <th className={`${styles.tableCell} ${styles.role}`}>{item.role}</th>
              <th className={`${styles.tableCell} ${styles.event}`}>{item.event}</th>
              <th className={styles.tableCell}><span className={styles.status}>{item.status}</span></th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
