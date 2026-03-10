import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function SimpleMap({lat, long, city}) {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, long], // Chennai
      zoom: 5,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    // Default marker
    L.marker([lat, long])
      .addTo(map)
      .bindPopup(city)
      .openPopup();

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [lat, long]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl shadow-md"
    />
  );
}