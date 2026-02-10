"use client";
// Sidebar — navigation links, active state highlight, role-aware nav
// Volunteer nav: Dashboard, Events, History
// Admin nav: above + Admin section (Events, Sites, Archive)
import "./sidebar.css";
import Image from "next/image";
import home from "@/public/home.png";
import event from "@/public/event.png";
import archive from "@/public/inbox.png";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const defaultNavBarItems = [
  { label: "Dashboard", icon: home, alt: "Home", route: ROUTES.DASHBOARD },
  { label: "Events", icon: event, alt: "Events", route: ROUTES.EVENTS },
  { label: "Archived", icon: archive, alt: "Archived", route: ROUTES.HISTORY },
];

export default function Sidebar() {
  const router = useRouter();
  const [active, setActive] = useState<string>("Dashboard");
  return (
    <div className="sideBarWrapper">
      <div className="sideBarContainer">
        <div className="sideBarTag">
          <div className="smallText">ML</div>
          <div>
            <div className="smallText"> Matt Lau</div>
            <div className="smallText">Undergrad (Scribe)</div>
          </div>
        </div>
        <div className="sideBarList">
          {defaultNavBarItems.map((item) => (
            <div
              onClick={() => {
                setActive(item.label);
                router.push(item.route);
              }}
              key={item.label}
              className="smallText"
            >
              <Image
                className="dashboardIcons"
                src={item.icon}
                alt={item.alt}
              />
              <span className="navLabel">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
