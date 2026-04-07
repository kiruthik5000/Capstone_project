import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import TrafficSimulation from '../components/TrafficSimulation';
import AnomalyChart from '../components/AnomalyChart';
import AlertTable from '../components/AlertTable';
import { generatePacket } from '../utils/dataSimulator';

let flowCounter = 10000;

export default function LiveMonitor() {
  const location = useLocation();
  const apiPackets = location.state?.packets ?? null; // packets passed from Simulate page

  const [packets, setPackets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState('normal');
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [toast, setToast] = useState(null);
  const [done, setDone] = useState(false);
  const [stopped, setStopped] = useState(false);
  const idxRef = useRef(0);
  const intervalRef = useRef(null);

  const startInterval = (delay) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      let pkt;

      if (apiPackets && apiPackets.length > 0) {
        if (idxRef.current >= apiPackets.length) {
          setDone(true);
          clearInterval(intervalRef.current);
          return;
        }
        const raw = apiPackets[idxRef.current];
        idxRef.current += 1;
        pkt = {
          flowId: raw.flowId || `FL-${++flowCounter}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          featureVectorSize: raw.featureVectorSize ?? 78,
          anomalyScore: raw.anomalyScore,
          sourceIP: raw.sourceIP,
          attackType: raw.attackType,
          status: raw.attackType !== 'Normal' ? 'Attack' : 'Normal',
        };
      } else {
        pkt = generatePacket();
      }

      setPackets(prev => [pkt, ...prev].slice(0, 5));
      setChartData(prev => [...prev, { time: pkt.timestamp, score: pkt.anomalyScore }].slice(-30));
      setAlerts(prev => [pkt, ...prev].slice(0, 50));

      if (pkt.anomalyScore > 0.75) {
        setSystemStatus('alert');
        setActiveAlerts(prev => prev + 1);
        setToast(`🚨 Intrusion Detected! Score: ${pkt.anomalyScore.toFixed(3)} | ${pkt.attackType} from ${pkt.sourceIP}`);
        setTimeout(() => setToast(null), 4000);
      }
    }, delay);
  };

  useEffect(() => {
    idxRef.current = 0;
    setPackets([]); setChartData([]); setAlerts([]);
    setSystemStatus('normal'); setActiveAlerts(0); setDone(false); setStopped(false);

    const delay = apiPackets ? 1000 : 2000;
    startInterval(delay);
    return () => clearInterval(intervalRef.current);
  }, [apiPackets]);

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setStopped(true);
  };

  const handleResume = () => {
    if (done) return;
    setStopped(false);
    const delay = apiPackets ? 1000 : 2000;
    startInterval(delay);
  };

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

      {/* Top bar: status + stop/resume */}
      <div className="mx-6 mt-4 flex items-center gap-3">

        {/* Status pill */}
        {done ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
            ✅ Simulation complete{apiPackets ? ` — all ${apiPackets.length} packets processed` : ''}
          </div>
        ) : stopped ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold">
            ⏸ Paused
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-cyan-400 opacity-70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <span className="text-cyan-400 text-xs font-semibold">
              {apiPackets ? `Live Simulation — ${idxRef.current} / ${apiPackets.length} packets` : 'Live Demo'}
            </span>
          </div>
        )}

        {/* Stop / Resume button */}
        {!done && (
          stopped ? (
            <button
              onClick={handleResume}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Resume
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold hover:bg-rose-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              Stop
            </button>
          )
        )}
      </div>

      <Header systemStatus={systemStatus} activeAlerts={activeAlerts} />
      <TrafficSimulation packets={packets} />
      <AnomalyChart dataPoints={chartData} />
      <AlertTable 
        alerts={alerts} 
        onExportStart={() => {
          if (!stopped && !done) handleStop();
        }}
        onExportEnd={() => {
          if (stopped && !done) handleResume();
          setToast("CSV file saved successfully!");
          setTimeout(() => setToast(null), 4000);
        }}
      />
    </div>
  );
}
