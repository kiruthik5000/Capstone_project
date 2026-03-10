import { benchmarkData } from '../utils/dataSimulator';

export default function BenchmarkTable() {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 mt-6 backdrop-blur-sm">
      <h2 className="text-base font-semibold text-white mb-1">Comparative Analysis</h2>
      <p className="text-slate-500 text-sm mb-5">Benchmarking against CNN-IDS baseline</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-4 border-b border-slate-700/40">Metric</th>
              <th className="text-left py-3 px-4 border-b border-slate-700/40">Baseline (CNN-IDS)</th>
              <th className="text-left py-3 px-4 border-b border-slate-700/40">NextGen-IDS</th>
              <th className="text-left py-3 px-4 border-b border-slate-700/40">Change</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkData.map((row) => {
              const isLower = row.metric === 'FOR';
              const isBetter = isLower ? row.model < row.baseline : row.model > row.baseline;
              const diff = isLower
                ? ((row.baseline - row.model) / row.baseline * 100).toFixed(1)
                : ((row.model - row.baseline) / row.baseline * 100).toFixed(1);

              return (
                <tr key={row.metric} className="border-b border-slate-700/20 hover:bg-slate-700/10 transition-colors">
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{row.metric}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{row.baseline.toFixed(4)}</td>
                  <td className={`py-3.5 px-4 font-mono font-bold ${isBetter ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {row.model.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isBetter
                        ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
                    }`}>
                      {isBetter ? '▲' : '▼'} {diff}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
