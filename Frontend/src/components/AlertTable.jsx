import { useEffect, useState } from "react";

export default function AlertTable({ alerts, onExportStart, onExportEnd }) {
  const [alert, setAlert] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const filtered = alerts.filter(a => a.anomalyScore >= 0.75);
    setAlert(filtered);
  }, [alerts]);

  const handleExport = () => {
    setIsExporting(true);
    if (onExportStart) onExportStart();
    setTimeout(() => {
      setIsExporting(false);
      if (onExportEnd) onExportEnd();
    }, 3000);
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm">
      <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        Interactive Alert Table
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            isExporting 
              ? 'bg-blue-500/50 text-white/70 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/20'
          }`}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Exporting...
            </span>
          ) : 'Export to Data'}
        </button>
        <span className="text-xs font-normal text-slate-500 ml-auto">{alert.length} entries</span>
      </h2>

      <div className="overflow-x-auto max-h-[360px] rounded-xl overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Timestamp</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Source IP</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Attack Type</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Score</th>
              {/* <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                  No alerts recorded yet
                </td>
              </tr>
            )}
            {alert.map((alert, i) => {
              const isAttack = alert.anomalyScore > 0.75;
              return (
                <tr
                  key={`${alert.flowId}-${i}`}
                  className={`border-b border-slate-700/20 transition-colors duration-200 ${isAttack
                    ? 'bg-red-500/[0.07] hover:bg-red-500/[0.14]'
                    : 'bg-emerald-500/[0.03] hover:bg-emerald-500/[0.07]'
                    }`}
                >
                  <td className="py-2.5 px-4 text-slate-300 text-xs">{alert.timestamp}</td>
                  <td className="py-2.5 px-4 text-slate-300 font-mono text-xs">{alert.sourceIP}</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${alert.attackType !== 'Normal'
                      ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
                      : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
                      }`}>
                      {alert.attackType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`font-mono font-bold text-xs ${isAttack ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                      {alert.anomalyScore.toFixed(3)}
                    </span>
                  </td>
                  {/* <td className="py-2.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${alert.status === 'Attack'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                      {alert.status}
                    </span>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
