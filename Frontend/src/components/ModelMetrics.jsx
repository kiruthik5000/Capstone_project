import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { modelMetrics, confusionMatrix, rocCurveData } from '../utils/dataSimulator';

const metricCards = [
  { label: 'Accuracy', value: modelMetrics.accuracy, format: 'pct', colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10', borderClass: 'border-cyan-500/20' },
  { label: 'Precision', value: modelMetrics.precision, format: 'pct', colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20' },
  { label: 'Recall', value: modelMetrics.recall, format: 'pct', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20' },
  { label: 'F1 Score', value: modelMetrics.f1, format: 'pct', colorClass: 'text-purple-400', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/20' },
  { label: 'FOR', value: modelMetrics.falseOmissionRate, format: 'raw', colorClass: 'text-orange-400', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/20' },
  { label: 'AUC-ROC', value: modelMetrics.auc, format: 'pct', colorClass: 'text-pink-400', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-500/20' },
];

const cmGrid = [
  { label: 'True Positive', value: confusionMatrix.truePositive, bg: 'bg-emerald-500/20', ring: 'ring-emerald-500/20' },
  { label: 'False Positive', value: confusionMatrix.falsePositive, bg: 'bg-red-500/15', ring: 'ring-red-500/20' },
  { label: 'False Negative', value: confusionMatrix.falseNegative, bg: 'bg-red-500/15', ring: 'ring-red-500/20' },
  { label: 'True Negative', value: confusionMatrix.trueNegative, bg: 'bg-emerald-500/20', ring: 'ring-emerald-500/20' },
];

export default function ModelMetrics() {
  return (
    <div>
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metricCards.map((m) => (
          <div key={m.label} className={`relative overflow-hidden p-5 rounded-xl border ${m.bgClass} ${m.borderClass}`}>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">{m.label}</p>
            <p className={`text-2xl font-bold ${m.colorClass}`}>
              {m.format === 'pct' ? `${(m.value * 100).toFixed(2)}%` : m.value.toFixed(4)}
            </p>
          </div>
        ))}
      </div>

      {/* Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm">
          <h3 className="text-base font-semibold text-white mb-2">Confusion Matrix</h3>
          <div className="flex gap-8 text-[11px] text-slate-500 mb-3 justify-center">
            <span>Predicted →</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 max-w-[280px] mx-auto">
            {cmGrid.map((cell) => (
              <div key={cell.label} className={`${cell.bg} rounded-xl p-5 text-center ring-1 ${cell.ring}`}>
                <p className="text-slate-400 text-[11px] font-medium mb-1">{cell.label}</p>
                <p className="text-white text-xl font-bold">{cell.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex text-[11px] text-slate-500 mt-3 justify-center">
            <span>Actual ↓</span>
          </div>
        </div>

        {/* ROC Curve */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm">
          <h3 className="text-base font-semibold text-white mb-4">
            ROC Curve <span className="text-cyan-400 text-sm font-normal">(AUC = {modelMetrics.auc})</span>
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={rocCurveData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="fpr"
                stroke="#475569"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'False Positive Rate', position: 'bottom', fill: '#64748b', fontSize: 11, offset: 5 }}
              />
              <YAxis
                stroke="#475569"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#94a3b8', fontSize: 12 }}
              />
              <ReferenceLine
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                stroke="#475569"
                strokeDasharray="6 4"
                strokeWidth={1}
              />
              <defs>
                <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="tpr"
                stroke="#22d3ee"
                fill="url(#rocGradient)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
