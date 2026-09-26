import React from 'react';
import { Route, Clock, Navigation, Zap, AlertCircle } from 'lucide-react';
import { RouteOptimizationResult } from '../types';

interface RouteSummaryProps {
  optimizationResult: RouteOptimizationResult;
  onOptimize: () => void;
  isOptimizing?: boolean;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  optimizationResult,
  onOptimize,
  isOptimizing = false,
}) => {
  const { stops, totalDistanceKm, estimatedTravelTimeMin, unmappedTasksCount } = optimizationResult;

  const hours = Math.floor(estimatedTravelTimeMin / 60);
  const mins = Math.round(estimatedTravelTimeMin % 60);
  const formattedTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Route Optimization Metrics
          </h3>
          <p className="text-xs text-slate-400">
            Algorithmic 2-Opt & Nearest-Neighbor sequence
          </p>
        </div>

        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-500/20 transition disabled:opacity-50"
        >
          <Route className="w-4 h-4" />
          <span>{isOptimizing ? 'Optimizing...' : 'Re-Optimize Route'}</span>
        </button>
      </div>

      {unmappedTasksCount > 0 && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {unmappedTasksCount} task(s) missing geocoded coordinates. Edit address to add them to map route.
          </span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            Total Stops
          </div>
          <div className="text-xl font-extrabold text-white">{stops.length}</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Route className="w-3.5 h-3.5 text-indigo-400" />
            Total Distance
          </div>
          <div className="text-xl font-extrabold text-white">
            {totalDistanceKm.toFixed(1)} <span className="text-sm font-normal text-slate-400">km</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Est. Travel Time
          </div>
          <div className="text-xl font-extrabold text-white">{formattedTime}</div>
        </div>
      </div>

      {/* Stop Sequence List */}
      {stops.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Optimized Sequence Order:
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {stops.map((stop, idx) => (
              <React.Fragment key={stop.task.id}>
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/70 text-xs shrink-0">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">
                    {stop.stopOrder}
                  </span>
                  <span className="font-medium text-slate-200 max-w-[120px] truncate">
                    {stop.task.name}
                  </span>
                </div>
                {idx < stops.length - 1 && (
                  <span className="text-slate-600 font-bold shrink-0">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 mt-2 italic">
        * Travel times are estimates calculated via Haversine distance algorithm assuming 35 km/h field speed + service buffer.
      </p>
    </div>
  );
};
