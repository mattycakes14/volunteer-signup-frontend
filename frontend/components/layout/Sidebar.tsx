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
export default function Sidebar() {
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
          <div className="smallText">
            <Image className="dashboardIcons" src={home} alt="Home" />
            <span className="navLabel">Dashboard</span>
          </div>
          <div className="smallText">
            <Image className="dashboardIcons" src={event} alt="Events" />
            <span className="navLabel">Events</span>
          </div>
          <div className="smallText">
            <Image className="dashboardIcons" src={archive} alt="Archived" />
            <span className="navLabel">Archived</span>
          </div>
        </div>
      </div>
    </div>
  );
}
