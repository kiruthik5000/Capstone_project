export default function Header({ systemStatus, activeAlerts }) {
  const isAlert = systemStatus === 'alert';

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
        NextGen-IDS
      </h1>
      <p className="text-slate-400 text-sm mb-6">Transformer-Based Semi-Supervised Intrusion Detection System</p>

      <div className="grid grid-cols-3 gap-4">
        <div className={`relative overflow-hidden p-5 rounded-xl border transition-all duration-500 ${
          isAlert
            ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/10'
            : 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
        }`}>
          <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${isAlert ? 'bg-red-500/20' : 'bg-emerald-500/20'}`} />
          <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">System Status</p>
          <p className={`text-xl font-bold ${isAlert ? 'text-red-400' : 'text-emerald-400'}`}>
            {isAlert ? '🔴 Alert' : '🟢 Normal'}
          </p>
        </div>

        <div className="relative overflow-hidden p-5 rounded-xl bg-slate-800/50 border border-slate-700/40">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
          <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Active Alerts</p>
          <p className="text-xl font-bold text-orange-400">{activeAlerts}</p>
        </div>

        <div className="relative overflow-hidden p-5 rounded-xl bg-slate-800/50 border border-slate-700/40">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
          <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Model Version</p>
          <p className="text-xl font-bold text-cyan-400">v2.0</p>
        </div>
      </div>
    </div>
  );
}
