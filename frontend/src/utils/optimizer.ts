import { Task, OptimizedStop, RouteOptimizationResult } from '../types';
import { haversineDistance } from './haversine';

const AVERAGE_SPEED_KMH = 35; // Average urban travel speed in km/h
const SERVICE_TIME_PER_STOP_MIN = 8; // Average time spent per stop in minutes

export function optimizeRoute(tasks: Task[]): RouteOptimizationResult {
  // Filter active (uncompleted) tasks with valid lat/lng
  const validActiveTasks = tasks.filter(
    (t) => !t.completed && t.latitude !== null && t.longitude !== null
  );

  const unmappedTasksCount = tasks.filter(
    (t) => !t.completed && (t.latitude === null || t.longitude === null)
  ).length;

  if (validActiveTasks.length === 0) {
    return {
      stops: [],
      totalDistanceKm: 0,
      estimatedTravelTimeMin: 0,
      unmappedTasksCount,
    };
  }

  if (validActiveTasks.length === 1) {
    return {
      stops: [
        {
          stopOrder: 1,
          task: validActiveTasks[0],
          distanceFromPreviousKm: 0,
        },
      ],
      totalDistanceKm: 0,
      estimatedTravelTimeMin: SERVICE_TIME_PER_STOP_MIN,
      unmappedTasksCount,
    };
  }

  // 1. Nearest Neighbor Initialization with Priority Weighting
  const unvisited = [...validActiveTasks];
  
  // Pick starting point: High priority task nearest to center, or highest priority task
  unvisited.sort((a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority));
  
  const route: Task[] = [];
  let current = unvisited.shift()!;
  route.push(current);

  while (unvisited.length > 0) {
    let nextIndex = 0;
    let bestScore = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidate = unvisited[i];
      const dist = haversineDistance(
        current.latitude!,
        current.longitude!,
        candidate.latitude!,
        candidate.longitude!
      );

      // Distance penalty reduction for high priority tasks so urgent tasks are favored
      const priorityFactor = 1 / (0.5 + getPriorityScore(candidate.priority) * 0.25);
      const score = dist * priorityFactor;

      if (score < bestScore) {
        bestScore = score;
        nextIndex = i;
      }
    }

    current = unvisited.splice(nextIndex, 1)[0];
    route.push(current);
  }

  // 2. Apply 2-Opt Local Search Improvement to remove crossing paths
  const optimizedRoute = twoOptOptimize(route);

  // 3. Calculate metrics and build stop list
  let totalDistanceKm = 0;
  const stops: OptimizedStop[] = [];

  for (let i = 0; i < optimizedRoute.length; i++) {
    const task = optimizedRoute[i];
    let distFromPrev = 0;

    if (i > 0) {
      const prevTask = optimizedRoute[i - 1];
      distFromPrev = haversineDistance(
        prevTask.latitude!,
        prevTask.longitude!,
        task.latitude!,
        task.longitude!
      );
      totalDistanceKm += distFromPrev;
    }

    stops.push({
      stopOrder: i + 1,
      task,
      distanceFromPreviousKm: distFromPrev,
    });
  }

  // Driving time + stop service buffer
  const drivingTimeMin = (totalDistanceKm / AVERAGE_SPEED_KMH) * 60;
  const serviceTimeTotalMin = stops.length * SERVICE_TIME_PER_STOP_MIN;
  const estimatedTravelTimeMin = drivingTimeMin + serviceTimeTotalMin;

  return {
    stops,
    totalDistanceKm,
    estimatedTravelTimeMin,
    unmappedTasksCount,
  };
}

function getPriorityScore(priority: string): number {
  switch (priority.toLowerCase()) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
    default:
      return 1;
  }
}

/**
 * 2-Opt optimization algorithm to iteratively swap edges if it reduces total distance.
 */
function twoOptOptimize(route: Task[]): Task[] {
  if (route.length <= 3) return route;

  let bestRoute = [...route];
  let improved = true;
  let iterations = 0;
  const maxIterations = 50; // Cap to ensure high performance

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let k = i + 1; k < bestRoute.length; k++) {
        const delta = calculate2OptDelta(bestRoute, i, k);
        if (delta < -0.001) {
          // Perform 2-opt swap
          const newRoute = 2;
          bestRoute = swap2Opt(bestRoute, i, k);
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

function calculate2OptDelta(route: Task[], i: number, k: number): number {
  const pA = route[i];
  const pB = route[(i + 1) % route.length];
  const pC = route[k];
  const pD = route[(k + 1) % route.length];

  const currentDist =
    haversineDistance(pA.latitude!, pA.longitude!, pB.latitude!, pB.longitude!) +
    haversineDistance(pC.latitude!, pC.longitude!, pD.latitude!, pD.longitude!);

  const newDist =
    haversineDistance(pA.latitude!, pA.longitude!, pC.latitude!, pC.longitude!) +
    haversineDistance(pB.latitude!, pB.longitude!, pD.latitude!, pD.longitude!);

  return newDist - currentDist;
}

function swap2Opt(route: Task[], i: number, k: number): Task[] {
  const newRoute = route.slice(0, i + 1);
  const reversedSubsegment = route.slice(i + 1, k + 1).reverse();
  const rest = route.slice(k + 1);
  return [...newRoute, ...reversedSubsegment, ...rest];
}
