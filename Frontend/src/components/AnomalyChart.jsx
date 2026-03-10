import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';

const WINDOW_SIZE = 30;

export default function AnomalyChart({ dataPoints }) {
  // Build a fixed-size array with numeric indices so the grid never shifts
  const window = [];
  const start = Math.max(0, dataPoints.length - WINDOW_SIZE);
  for (let i = 0; i < WINDOW_SIZE; i++) {
    const dataIdx = start + i - (WINDOW_SIZE - Math.min(dataPoints.length, WINDOW_SIZE));
    if (dataIdx >= 0 && dataIdx < dataPoints.length) {
      window.push({ idx: i, score: dataPoints[dataIdx].score, time: dataPoints[dataIdx].time });
    } else {
      window.push({ idx: i, score: null, time: '' });
    }
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 mb-6 backdrop-blur-sm">
      <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        Live Anomaly Monitor
        <span className="text-xs font-normal text-slate-500 ml-auto">Threshold: 0.75</span>
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={window} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="idx"
            type="number"
            domain={[0, WINDOW_SIZE - 1]}
            ticks={[0, 5, 10, 15, 20, 25, 29]}
            tick={false}
            stroke="#334155"
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            domain={[0, 1]}
            stroke="#475569"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#334155' }}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
            labelFormatter={(idx) => {
              const pt = window[idx];
              return pt?.time || '';
            }}
            itemStyle={{ color: '#22d3ee', fontSize: 13 }}
          />
          <ReferenceLine
            y={0.75}
            stroke="#ef4444"
            strokeDasharray="8 4"
            strokeWidth={1.5}
            label={{
              value: '⚠ 0.75',
              fill: '#ef4444',
              fontSize: 11,
              position: 'right',
            }}
          />
          <Line
            type="linear"
            dataKey="score"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
            activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
