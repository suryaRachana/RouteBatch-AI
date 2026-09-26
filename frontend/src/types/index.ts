export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  name: string;
  address: string;
  priority: TaskPriority;
  deadline?: string;
  notes?: string;
  completed: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface OptimizedStop {
  stopOrder: number;
  task: Task;
  distanceFromPreviousKm: number;
}

export interface RouteOptimizationResult {
  stops: OptimizedStop[];
  totalDistanceKm: number;
  estimatedTravelTimeMin: number;
  unmappedTasksCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}
