import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { modelMetrics, confusionMatrix, rocCurveData } from '../utils/dataSimulator';
import lossImg from '../assets/loss_image.png';
import classificationImg from '../assets/classification_matrix.png';
import featureImg from '../assets/feature_importance.png';
import multiClassCmImg from '../assets/multi_class_cm.png';
import multiClassRocImg from '../assets/multi_class_roc.png';

/* ─── Lightbox ─── */
function Lightbox({ src, title, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full mx-4 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-700/50">
          <span className="text-slate-300 text-sm font-semibold">{title}</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-lg"
          >✕</button>
        </div>
        <div className="bg-slate-950 p-4">
          <img src={src} alt={title} className="w-full object-contain max-h-[80vh] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ─── Training Plot Card ─── */
function PlotCard({ src, title, description, accent, onExpand }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:border-cyan-500/40 hover:shadow-cyan-500/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40 bg-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent}`} />
          <h3 className="text-white text-sm font-semibold">{title}</h3>
        </div>
        <button
          onClick={onExpand}
          className="text-slate-500 hover:text-cyan-400 transition-colors text-xs flex items-center gap-1 font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Expand
        </button>
      </div>
      {/* Image */}
      <div
        className="relative cursor-pointer bg-white overflow-hidden"
        onClick={onExpand}
      >
        <img
          src={src}
          alt={title}
          className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ minHeight: '200px', maxHeight: '280px' }}
        />
        <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            🔍 Click to expand
          </span>
        </div>
      </div>
      {/* Description */}
      {description && (
        <p className="text-slate-500 text-xs px-4 py-2.5 border-t border-slate-700/30">{description}</p>
      )}
    </div>
  );
}

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

const trainingPlots = [
  {
    src: lossImg,
    title: 'Training & Validation Loss',
    description: 'Anomaly detection loss curve over 100 epochs — model converges smoothly with minimal overfitting.',
    accent: 'bg-blue-400',
  },
  {
    src: classificationImg,
    title: 'Classification Matrix',
    description: 'Visualised confusion matrix showing true vs predicted class distributions.',
    accent: 'bg-emerald-400',
  },
  {
    src: featureImg,
    title: 'Feature Importance',
    description: 'Top contributing features ranked by their impact on model predictions.',
    accent: 'bg-amber-400',
  },
  {
    src: multiClassCmImg,
    title: 'Multi-Class Confusion Matrix',
    description: 'Detailed view of correct vs incorrect classifications across multiple attack types.',
    accent: 'bg-purple-400',
  },
  {
    src: multiClassRocImg,
    title: 'Multi-Class ROC Curve',
    description: 'Performance overview showing true positive vs false positive rates per class.',
    accent: 'bg-pink-400',
  },
];

export default function ModelMetrics() {
  const [lightbox, setLightbox] = useState(null);
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

      {/* ── Training Insights ── */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          <h2 className="text-white text-base font-bold tracking-tight">Training Insights</h2>
          <span className="text-slate-500 text-xs font-normal ml-1">— click any plot to expand</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trainingPlots.map(plot => (
            <PlotCard
              key={plot.title}
              src={plot.src}
              title={plot.title}
              description={plot.description}
              accent={plot.accent}
              onExpand={() => setLightbox(plot)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
