import React from 'react';
import { MapPin, Clock, Edit2, Trash2, CheckCircle2, Circle, AlertTriangle, FileText } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  stopOrder?: number;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  stopOrder,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'low':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 shadow-md hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox / Completion Toggle */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 text-slate-400 hover:text-sky-400 transition"
          title={task.completed ? 'Mark incomplete' : 'Mark completed'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500 hover:text-sky-400" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {stopOrder !== undefined && !task.completed && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30">
                {stopOrder}
              </span>
            )}
            <h4
              className={`font-semibold text-sm truncate ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {task.name}
            </h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getPriorityBadgeClass(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{task.address}</span>
            {task.latitude === null && (
              <span className="text-amber-400 text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Unmapped
              </span>
            )}
          </div>

          {/* Deadline & Notes */}
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            {task.deadline && (
              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{task.deadline}</span>
              </div>
            )}
            {task.notes && (
              <div className="flex items-center gap-1 text-slate-400 truncate max-w-xs">
                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{task.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
