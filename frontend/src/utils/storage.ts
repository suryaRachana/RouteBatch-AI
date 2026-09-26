import { Task } from '../types';

const STORAGE_KEY = 'routebatch_ai_tasks_v1';

export const INITIAL_DEFAULT_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    name: 'Metro Logistics Center',
    address: '700 5th Ave, Seattle, WA 98104',
    priority: 'High',
    deadline: '10:30 AM',
    notes: 'Gate access code: #4920. Contact Operations Manager on arrival.',
    completed: false,
    latitude: 47.6046,
    longitude: -122.3308,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-2',
    name: 'Harbor View Medical Supply Depot',
    address: '325 9th Ave, Seattle, WA 98104',
    priority: 'High',
    deadline: '11:45 AM',
    notes: 'Urgent medical inventory delivery. Use Bay 3.',
    completed: false,
    latitude: 47.6048,
    longitude: -122.3241,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-3',
    name: 'Pike Place Express Hub',
    address: '85 Pike St, Seattle, WA 98101',
    priority: 'Medium',
    deadline: '02:00 PM',
    notes: 'Pick up return packages from counter B.',
    completed: false,
    latitude: 47.6097,
    longitude: -122.3422,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-task-4',
    name: 'South Lake Tech Campus',
    address: '500 9th Ave N, Seattle, WA 98109',
    priority: 'Low',
    deadline: '04:30 PM',
    notes: 'Standard document drop-off at reception.',
    completed: false,
    latitude: 47.6231,
    longitude: -122.3392,
    createdAt: new Date().toISOString(),
  },
];

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with demo tasks on first launch
      saveTasksToStorage(INITIAL_DEFAULT_TASKS);
      return INITIAL_DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEFAULT_TASKS;
  } catch (e) {
    console.error('Failed to parse tasks from localStorage:', e);
    return INITIAL_DEFAULT_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}

export function clearTasksFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear tasks from localStorage:', e);
  }
}
