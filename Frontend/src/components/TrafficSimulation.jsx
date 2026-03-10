export default function TrafficSimulation({ packets }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 mb-6 backdrop-blur-sm">
      <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        Real-Time Traffic
        <span className="text-slate-500 text-xs font-normal ml-auto">Last 5 packets</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Flow ID</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Timestamp</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Features</th>
              <th className="text-left py-2.5 px-4 border-b border-slate-700/40">Anomaly Score</th>
            </tr>
          </thead>
          <tbody>
            {packets.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                  Waiting for incoming packets...
                </td>
              </tr>
            )}
            {packets.map((pkt, i) => (
              <tr
                key={pkt.flowId}
                className={`border-b border-slate-700/20 transition-all duration-300 ${
                  i === 0 ? 'bg-slate-700/20' : 'hover:bg-slate-700/10'
                }`}
              >
                <td className="py-3 px-4 text-slate-300 font-mono text-xs">{pkt.flowId}</td>
                <td className="py-3 px-4 text-slate-400">{pkt.timestamp}</td>
                <td className="py-3 px-4 text-slate-400">{pkt.featureVectorSize}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pkt.anomalyScore > 0.75 ? 'bg-red-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${pkt.anomalyScore * 100}%` }}
                      />
                    </div>
                    <span className={`font-mono font-bold text-xs ${
                      pkt.anomalyScore > 0.75 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {pkt.anomalyScore.toFixed(3)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
