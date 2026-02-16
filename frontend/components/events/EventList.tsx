// Event list — groups events by site, renders site containers with EventCards
import { Event, Site } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  sites: Site[];
}

export default function EventList({ events, sites }: EventListProps) {
  // Group events by site_id
  const eventsBySite = new Map<string, Event[]>();
  events.forEach((event) => {
    const existing = eventsBySite.get(event.site_id) || [];
    existing.push(event);
    eventsBySite.set(event.site_id, existing);
  });

  return (
    <div className="event-list">
      {sites.map((site) => {
        const siteEvents = eventsBySite.get(site.id) || [];
        if (siteEvents.length === 0) return null;

        return (
          <div key={site.id} className="site-container">
            <div className="site-header">
              <h2 className="site-name">{site.name}</h2>
              <p className="site-address">{site.address}</p>
              <p className="site-description">{site.description}</p>
              <p className="site-contacts">{site.contacts}</p>
            </div>
            <div className="site-events">
              {siteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
