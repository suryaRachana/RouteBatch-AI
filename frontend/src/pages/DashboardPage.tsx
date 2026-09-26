import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { TaskList } from '../components/TaskList';
import { TaskFormModal } from '../components/TaskFormModal';
import { RouteSummary } from '../components/RouteSummary';
import { MapView } from '../components/MapView';
import { AIAssistant } from '../components/AIAssistant';
import { Task, RouteOptimizationResult } from '../types';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { optimizeRoute } from '../utils/optimizer';

export const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Load tasks from LocalStorage on initial startup
  useEffect(() => {
    const stored = loadTasksFromStorage();
    setTasks(stored);
  }, []);

  // Save tasks to LocalStorage whenever tasks state updates
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Compute optimized route dynamically
  const optimizationResult: RouteOptimizationResult = useMemo(() => {
    return optimizeRoute(tasks);
  }, [tasks]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: taskData.name,
        address: taskData.address,
        priority: taskData.priority,
        deadline: taskData.deadline,
        notes: taskData.notes,
        completed: false,
        latitude: taskData.latitude,
        longitude: taskData.longitude,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleReOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      // Triggers re-computation
      setTasks((prev) => [...prev]);
      setIsOptimizing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Section 1: Top Metrics & Route Summary */}
        <RouteSummary
          optimizationResult={optimizationResult}
          onOptimize={handleReOptimize}
          isOptimizing={isOptimizing}
        />

        {/* Section 2: Main Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Management (5 Cols) */}
          <div className="lg:col-span-5 h-full">
            <TaskList
              tasks={tasks}
              optimizedStops={optimizationResult.stops}
              onAddTask={handleOpenAddModal}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Right Column: Interactive Map & AI Assistant (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Leaflet Map */}
            <MapView stops={optimizationResult.stops} />

            {/* AI Route Assistant */}
            <AIAssistant tasks={tasks} optimizationResult={optimizationResult} />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
};
