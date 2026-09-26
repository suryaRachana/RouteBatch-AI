import React, { useState, useEffect } from 'react';
import { X, MapPin, AlertCircle, Loader2, Clock, FileText, Flag } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { geocodeAddress } from '../services/geocoding';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => Promise<void>;
  editingTask?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  editingTask,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setAddress(editingTask.address);
      setPriority(editingTask.priority);
      setDeadline(editingTask.deadline || '');
      setNotes(editingTask.notes || '');
    } else {
      setName('');
      setAddress('');
      setPriority('Medium');
      setDeadline('');
      setNotes('');
    }
    setError(null);
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a task or stop name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter a location or street address.');
      return;
    }

    setIsGeocoding(true);

    try {
      // Perform Nominatim Address Geocoding
      const geoResult = await geocodeAddress(address);

      await onSaveTask({
        id: editingTask?.id,
        name: name.trim(),
        address: address.trim(),
        priority,
        deadline: deadline.trim() || undefined,
        notes: notes.trim() || undefined,
        completed: editingTask ? editingTask.completed : false,
        latitude: geoResult.latitude,
        longitude: geoResult.longitude,
      });

      onClose();
    } catch (geoErr: any) {
      setError(geoErr.message || 'Geocoding failed. Please verify the address.');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            {editingTask ? 'Edit Field Stop' : 'Add New Field Stop'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task / Location Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Distribution Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Address / Location (Geocoded via OpenStreetMap) *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 700 5th Ave, Seattle, WA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                required
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Coordinates will be automatically retrieved upon saving.
            </p>
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-sky-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Deadline / Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Field Notes / Access Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Gate code #4920, ask for Reception Desk B"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
              disabled={isGeocoding}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeocoding}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/25 transition disabled:opacity-50 text-sm"
            >
              {isGeocoding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Geocoding Address...</span>
                </>
              ) : (
                <span>{editingTask ? 'Save Changes' : 'Add Stop'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
