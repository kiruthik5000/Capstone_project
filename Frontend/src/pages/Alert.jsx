import React, { useEffect, useState } from "react";
import MapDisplay from "../components/MapDisplay";
import { generateLatLong, generatePacket } from "../utils/dataSimulator";

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [mapInput, setMapInput] = useState({
    lat: 13.0827,
    long: 80.2707,
    city: "Chennai",
  });

  useEffect(() => {
    const temp = [];

    for (let i = 0; i < 5; i++) {
      const packet = generatePacket();
      if (packet.anomalyScore >= 0.75) {
        temp.push(packet);
      }
    }

    setAlerts(temp);
  }, []);
  const handleClick = () => {
    const city = generateLatLong();
    console.log(city);
    setMapInput({
      lat: city.lat,
      long: city.lng,
      city: city.city,
    });
  };  
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Threat Map
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Geospatial view of detected network intrusion events
        </p>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden">
        <MapDisplay lat={mapInput.lat} long={mapInput.long} city={mapInput.city} />
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-slate-700/40">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Detected Alerts
          </h2>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Source IP</th>
              <th className="px-4 py-3">Attack Type</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center px-4 py-6 text-slate-500"
                >
                  No high-severity alerts detected
                </td>
              </tr>
            ) : (
              alerts.map((alert, index) => (
                <tr 
                  key={index}
                  className="border-t border-slate-700/30 hover:bg-slate-800/40 transition"
                  onClick={()=> handleClick()}
                >
                  <td className="px-4 py-3 text-slate-200 font-mono">
                    {alert.sourceIP}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {alert.attackType}
                  </td>
                  <td className="px-4 py-3 font-semibold text-red-400">
                    {alert.anomalyScore.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alert;