import { useState, useEffect } from 'react';
import Header from '../components/Header';
import TrafficSimulation from '../components/TrafficSimulation';
import AnomalyChart from '../components/AnomalyChart';
import AlertTable from '../components/AlertTable';
import { generatePacket } from '../utils/dataSimulator';

export default function LiveMonitor() {
  const [packets, setPackets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState('normal');
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const packet = generatePacket();

      setPackets((prev) => [packet, ...prev].slice(0, 5));
      setChartData((prev) => [...prev, { time: packet.timestamp, score: packet.anomalyScore }].slice(-30));
      setAlerts((prev) => [packet, ...prev].slice(0, 50));

      if (packet.anomalyScore > 0.75) {
        setSystemStatus('alert');
        setActiveAlerts((prev) => prev + 1);
        setToast(`🚨 Intrusion Detected! Score: ${packet.anomalyScore.toFixed(3)} | ${packet.attackType} from ${packet.sourceIP}`);
        setTimeout(() => setToast(null), 4000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-slide-in">
          <div className="bg-red-500/90 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl shadow-red-500/30 border border-red-400/40 text-sm font-medium">
            {toast}
          </div>
        </div>
      )}

      <Header systemStatus={systemStatus} activeAlerts={activeAlerts} />
      <TrafficSimulation packets={packets} />
      <AnomalyChart dataPoints={chartData} />
      <AlertTable alerts={alerts} />
    </div>
  );
}
