import React, { useState } from 'react';
import { Plus, Search, MapPin, CheckCircle } from 'lucide-react';
import { Task, OptimizedStop } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  optimizedStops: OptimizedStop[];
  onAddTask: () => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  optimizedStops,
  onAddTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  // Map stop orders for quick lookup
  const stopOrderMap = new Map<string, number>();
  optimizedStops.forEach((stop) => {
    stopOrderMap.set(stop.task.id, stop.stopOrder);
  });

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            Field Stops & Tasks ({tasks.length})
          </h2>
          <p className="text-xs text-slate-400">
            {pendingCount} pending, {completedCount} completed
          </p>
        </div>

        <button
          onClick={onAddTask}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-600/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search stops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-medium transition ${
              filter === 'completed'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List Items */}
      <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 flex-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-800 rounded-xl">
            <div className="p-3 bg-slate-800/60 rounded-full text-slate-500 mb-3">
              <CheckCircle className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">
              {tasks.length === 0
                ? 'No tasks yet. Add your first field task.'
                : 'No stops matching filter.'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {tasks.length === 0
                ? 'Click "Add Task" to enter stop addresses and priorities.'
                : 'Try clearing your search or switching filter tabs.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              stopOrder={stopOrderMap.get(task.id)}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
