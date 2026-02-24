import styles from "@/components/events/Map.module.css";
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ location }: { location: string }) => {
  const mapRef = useRef(); // persists across re-renders without triggering re-renders (holds actual map)
  const mapContainerRef = useRef(); // where the map lives

  useEffect(() => {
    let ignore = false;

    const initMap = async () => {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`,
      );
      const data = await res.json();
      const [lng, lat] = data.features[0].center;

      if (ignore) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [lng, lat],
        zoom: 16,
        attributionControl: false,
      });

      new mapboxgl.Marker({ color: "#e53e3e" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    };

    initMap();

    return () => {
      ignore = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [location]);

  return <div className={styles.mapContainer} ref={mapContainerRef}></div>;
};

export default Map;
