"use client";
// Admin site list — manage all outreach sites

import { useEffect, useState } from "react";
import styles from "@/app/(dashboard)/admin/sites/Sites.module.css";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Site } from "@/types";
import DeleteModal from "@/components/admin/DeleteModal";
import Toast from "@/components/admin/Toast";

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await api.get("/sites");
        setSites(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSites();
  }, []);

  const deleteSite = async (siteId: string) => {
    try {
      await api.delete(`/sites/${siteId}`);
      setSites((prev) => prev.filter((s) => s.id !== siteId));
      setIsDeleteOpen(false);
      setShowToast(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sectionWrapper}>
        <div>
          <div className={styles.siteTitle}>Site Management</div>
          <div className={styles.description}>
            Manage schedules, sites, and volunteer allocation
          </div>
        </div>
        <div className={styles.createSiteButton}>
          <Plus size={18} />
          Create New Site
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.headerSection}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchBar}
              placeholder="Search by site name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>SITE NAME</th>
              <th className={styles.tableHeader}>ADDRESS</th>
              <th className={styles.tableHeader}>FREQUENCY</th>
              <th className={styles.tableHeader}>CONTACTS</th>
              <th className={styles.tableHeader}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sites
              .filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((site) => (
                <tr key={site.id} className={styles.tableRow}>
                  <td className={styles.siteName}>{site.name}</td>
                  <td className={styles.cellText}>{site.address}</td>
                  <td className={styles.cellText}>{site.frequency}</td>
                  <td className={styles.cellText}>{site.contacts}</td>
                  <td className={styles.actions}>
                    <Pencil size={16} className={styles.editIcon} />
                    <Trash2
                      size={16}
                      className={styles.deleteIcon}
                      onClick={() => {
                        setSiteId(site.id);
                        setIsDeleteOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isDeleteOpen && (
        <DeleteModal
          onConfirm={deleteSite}
          onCancel={() => setIsDeleteOpen(false)}
          eventId={siteId}
        />
      )}
      {showToast && (
        <Toast
          message="Site deleted successfully"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
