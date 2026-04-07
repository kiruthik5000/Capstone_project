import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* ══════════════════════════════════════════════════════════
   SHARED MINI COMPONENTS
══════════════════════════════════════════════════════════ */

function Lightbox({ src, alt, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-5xl w-full mx-4 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-700/50">
          <span className="text-slate-300 text-sm font-medium capitalize">{alt.replace(/_/g, ' ')}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700">✕</button>
        </div>
        <img src={src} alt={alt} className="w-full object-contain bg-slate-950 max-h-[80vh]" />
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v.count ?? v), 1);
  const colors = [
    { bar: 'from-cyan-400 to-blue-500', text: 'text-cyan-300' },
    { bar: 'from-rose-400 to-pink-600', text: 'text-rose-300' },
    { bar: 'from-amber-400 to-orange-500', text: 'text-amber-300' },
    { bar: 'from-violet-400 to-purple-600', text: 'text-violet-300' },
    { bar: 'from-emerald-400 to-teal-500', text: 'text-emerald-300' },
    { bar: 'from-sky-400 to-indigo-500', text: 'text-sky-300' },
  ];
  return (
    <div className="space-y-4">
      {entries.map(([label, v], i) => {
        const count = v.count ?? v;
        const pct = ((count / max) * 100).toFixed(1);
        const c = colors[i % colors.length];
        return (
          <div key={label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 text-xs font-medium truncate max-w-[55%]">{label}</span>
              <div className="flex items-center gap-2">
                {v.percentage != null && <span className={`text-xs font-semibold ${c.text}`}>{v.percentage}%</span>}
                <span className="text-white font-mono text-xs font-bold bg-slate-800 px-2 py-0.5 rounded-md">{count.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon, gradient, glow }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border border-slate-700/40 bg-slate-900/70 shadow-lg ${glow}`}>
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradient}`} />
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{label}</span>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-extrabold text-white font-mono tracking-tight">{Number(value).toLocaleString()}</p>
      </div>
    </div>
  );
}

function PlotCard({ plotKey, b64, onExpand }) {
  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl group transition-all duration-300 hover:border-cyan-500/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40 bg-slate-800/40">
        <p className="text-slate-300 text-xs font-semibold capitalize tracking-wide">{plotKey.replace(/_/g, ' ')}</p>
        <button onClick={() => onExpand(plotKey, b64)} className="text-slate-500 hover:text-cyan-400 transition-colors text-xs flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Expand
        </button>
      </div>
      <div className="relative cursor-pointer bg-slate-950 overflow-hidden" onClick={() => onExpand(plotKey, b64)}>
        <img src={`data:image/png;base64,${b64}`} alt={plotKey} className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" style={{ minHeight: '220px', maxHeight: '320px' }} />
        <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">🔍 Click to expand</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ color, children, sub }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${color} flex-shrink-0`} />
      <h2 className="text-white text-sm font-bold tracking-tight">{children}</h2>
      {sub && <span className="text-slate-500 text-xs font-normal ml-1">{sub}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BUILD PACKETS FROM API anomaly_results
══════════════════════════════════════════════════════════ */
const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'HTTPS'];
const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function buildPackets(r) {
  return r.ip.map((ip, i) => ({
    id: i,
    sourceIP: ip,
    anomalyScore: r.anomaly_score[i],
    attackType: r.attack_classified[i] === 'None' ? 'Normal' : r.attack_classified[i],
    prediction: r.anomaly_predicted[i],
    flowId: `FL-${ri(10000, 99999)}`,
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    featureVectorSize: ri(60, 78),
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  }));
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

// Cache state module-level so it persists when navigating between pages (but clears on hard refresh)
let cachedSimulateState = null;

export default function Simulate() {
  const navigate = useNavigate();
  const [networkName, setNetworkName] = useState(cachedSimulateState?.networkName || '');
  const [datasetSize, setDatasetSize] = useState(cachedSimulateState?.datasetSize || '');
  const [distribution, setDistribution] = useState(cachedSimulateState?.distribution || 'normal');
  const [distOpen, setDistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eda, setEda] = useState(cachedSimulateState?.eda || null);
  const [anomalyPackets, setAnomalyPackets] = useState(cachedSimulateState?.anomalyPackets || null);
  const [lightbox, setLightbox] = useState(null);

  // Sync state changes back to module cache
  useEffect(() => {
    cachedSimulateState = { networkName, datasetSize, distribution, eda, anomalyPackets };
  }, [networkName, datasetSize, distribution, eda, anomalyPackets]);

  const distOptions = [
    { value: 'normal', label: 'Normal', icon: '🌐', desc: 'Mirrors real-world traffic ratios' },
    { value: 'attack', label: 'Attack', icon: '⚖️', desc: 'Focused on attack samples per class' },
    { value: 'random', label: 'Random', icon: '🎲', desc: 'Fully random sampling' },
  ];
  const selectedDist = distOptions.find(o => o.value === distribution);

  const handleAnalyse = async () => {
    if (!networkName.trim() || !datasetSize.trim()) return;
    setLoading(true);
    setError(null);
    setEda(null);
    setAnomalyPackets(null);
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/analyze_data', {
        size: Number(datasetSize),
        dataset: networkName.trim(),
        distribution,
      });
      setEda(data.Eda_analysis ?? data);
      if (data.anomlay_results) setAnomalyPackets(buildPackets(data.anomlay_results));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reach the API.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = () => {
    navigate('/live_monitor', { state: { packets: anomalyPackets } });
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <>
      {lightbox && (
        <Lightbox src={`data:image/png;base64,${lightbox.b64}`} alt={lightbox.key} onClose={() => setLightbox(null)} />
      )}

      <div className="min-h-screen px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/30 mb-5">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Simulation Setup</h1>
            <p className="text-slate-400 mt-2 text-sm max-w-lg mx-auto">
              Configure your dataset, run EDA analysis, then launch the live simulation.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300" htmlFor="networkName">Network Name</label>
                <input id="networkName" type="text" value={networkName} onChange={e => setNetworkName(e.target.value)}
                  disabled={loading} placeholder="e.g. CIC-IDS-2017"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50 transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300" htmlFor="datasetSize">Dataset Size</label>
                <input id="datasetSize" type="number" value={datasetSize} onChange={e => setDatasetSize(e.target.value)}
                  disabled={loading} placeholder="e.g. 10000" min="1"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50 transition-all text-sm" />
              </div>
              <div className="space-y-2 sm:col-span-2 relative">
                <label className="block text-sm font-semibold text-slate-300">Distribution</label>
                <button type="button" disabled={loading} onClick={() => setDistOpen(o => !o)}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-left flex items-center justify-between gap-3 hover:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{selectedDist.icon}</span>
                    <span>
                      <span className="block text-white text-sm font-semibold">{selectedDist.label}</span>
                      <span className="block text-slate-500 text-xs">{selectedDist.desc}</span>
                    </span>
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${distOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {distOpen && (
                  <div className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                    {distOptions.map(opt => (
                      <button key={opt.value} type="button" onClick={() => { setDistribution(opt.value); setDistOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${opt.value === distribution ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-slate-800/70 border-l-2 border-transparent'}`}>
                        <span className="text-xl">{opt.icon}</span>
                        <span>
                          <span className={`block text-sm font-semibold ${opt.value === distribution ? 'text-cyan-300' : 'text-white'}`}>{opt.label}</span>
                          <span className="block text-slate-500 text-xs">{opt.desc}</span>
                        </span>
                        {opt.value === distribution && (
                          <svg className="ml-auto w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button id="btn-analyse" onClick={handleAnalyse}
              disabled={loading || !networkName.trim() || !datasetSize.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Analysing &amp; Predicting…</>
              ) : <>🔍 Analyse Dataset</>}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div><p className="font-semibold mb-0.5">Analysis Failed</p><p className="text-rose-300/80">{error}</p></div>
            </div>
          )}

          {/* EDA Results */}
          {eda && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-700/50" />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest px-2">📊 EDA Analysis</span>
                <div className="flex-1 h-px bg-slate-700/50" />
              </div>

              {eda.summary && (
                <div>
                  <SectionHeading color="from-cyan-400 to-blue-500">Dataset Summary</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total Records" value={eda.summary.total} icon="🗂️" gradient="bg-blue-500" glow="shadow-blue-500/10" />
                    <StatCard label="Benign" value={eda.summary.benign} icon="✅" gradient="bg-emerald-500" glow="shadow-emerald-500/10" />
                    <StatCard label="Attack" value={eda.summary.attack} icon="🚨" gradient="bg-rose-500" glow="shadow-rose-500/10" />
                  </div>
                </div>
              )}

              {eda.attack_distribution && Object.keys(eda.attack_distribution).length > 0 && (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <SectionHeading color="from-rose-400 to-pink-600">Attack Distribution</SectionHeading>
                  <BarChart data={eda.attack_distribution} />
                </div>
              )}

              {eda.features && Object.keys(eda.features).length > 0 && (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700/50">
                    <SectionHeading color="from-violet-400 to-purple-600">Feature Statistics</SectionHeading>
                  </div>
                  <div className="overflow-auto max-h-72">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-800/80 text-slate-400 text-xs">
                          <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Feature</th>
                          <th className="text-right py-3 px-6 font-semibold uppercase tracking-wider">Mean</th>
                          <th className="text-right py-3 px-6 font-semibold uppercase tracking-wider">Std Dev</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(eda.features).map(([feature, stats], i) => (
                          <tr key={feature} className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 ${i % 2 === 0 ? '' : 'bg-slate-800/20'}`}>
                            <td className="py-2.5 px-6 text-slate-300 font-mono text-xs">{feature}</td>
                            <td className="py-2.5 px-6 text-right text-cyan-400 font-mono text-xs font-semibold">{Number(stats.mean).toFixed(4)}</td>
                            <td className="py-2.5 px-6 text-right text-purple-400 font-mono text-xs font-semibold">{Number(stats.std).toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {eda.plots && Object.keys(eda.plots).length > 0 && (
                <div>
                  <SectionHeading color="from-amber-400 to-orange-500" sub="— click any plot to expand">Visual Analytics</SectionHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.entries(eda.plots).map(([key, b64], idx) => (
                      <div key={key} className={Object.keys(eda.plots).length % 2 !== 0 && idx === Object.keys(eda.plots).length - 1 ? 'md:col-span-2' : ''}>
                        <PlotCard plotKey={key} b64={b64} onExpand={(k, v) => setLightbox({ key: k, b64: v })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Start Simulation Button */}
              {anomalyPackets && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-700/50" />
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">Ready to simulate</span>
                    <div className="flex-1 h-px bg-slate-700/50" />
                  </div>
                  <button id="btn-start-simulation" onClick={handleStartSimulation}
                    className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                    🚀 Start Simulation
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
