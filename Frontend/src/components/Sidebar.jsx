import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
      isActive
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900/80 border-r border-slate-700/40 p-6 flex flex-col backdrop-blur-sm">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-lg">🛡️</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">NextGen</h1>
            <p className="text-slate-500 text-xs">IDS Dashboard</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-[11px] uppercase tracking-widest font-semibold mb-3 px-2">Navigation</p>
      <nav className="flex flex-col gap-1.5 flex-1">
        <NavLink to="/" end className={linkClass}>
          <span className="text-base">📡</span>
          <span>Live Monitor</span>
        </NavLink>
        <NavLink to="/evaluation" className={linkClass}>
          <span className="text-base">📊</span>
          <span>Model Evaluation</span>
        </NavLink>
        <NavLink to="/alerts" className={linkClass}>
          <span className="text-base">🗺️</span>
          <span>Threat Map</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <p className="text-slate-500 text-xs">v2.0 · System Online</p>
        </div>
      </div>
    </aside>
  );
}
