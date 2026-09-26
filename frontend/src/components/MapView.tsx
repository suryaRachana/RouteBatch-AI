import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { OptimizedStop } from '../types';

interface MapViewProps {
  stops: OptimizedStop[];
  isLoading?: boolean;
}

// Auto-fits map bounds to display all stop markers cleanly
const MapBoundsFitter: React.FC<{ stops: OptimizedStop[] }> = ({ stops }) => {
  const map = useMap();

  useEffect(() => {
    if (stops.length === 0) return;

    const bounds = L.latLngBounds(
      stops.map((s) => [s.task.latitude!, s.task.longitude!])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [stops, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ stops, isLoading = false }) => {
  // Filter valid coordinates
  const validStops = useMemo(
    () => stops.filter((s) => s.task.latitude !== null && s.task.longitude !== null),
    [stops]
  );

  // Polyline coordinate array in optimized sequence
  const polylineCoordinates = useMemo(
    () => validStops.map((s) => [s.task.latitude!, s.task.longitude!] as [number, number]),
    [validStops]
  );

  // Default center (Seattle) if no stops available
  const defaultCenter: [number, number] = [47.6062, -122.3321];

  // Custom Leaflet DivIcon generator for numbered stop pins
  const createNumberedMarkerIcon = (stopOrder: number, priority: string) => {
    let bgColor = '#0284c7'; // Sky-600 default
    if (priority.toLowerCase() === 'high') bgColor = '#ef4444'; // Red-500
    if (priority.toLowerCase() === 'medium') bgColor = '#f59e0b'; // Amber-500

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background-color: ${bgColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          font-family: system-ui, sans-serif;
        ">
          ${stopOrder}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[450px] flex flex-col items-center justify-center p-6 text-center shadow-xl">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-slate-300">Rendering Leaflet Map...</p>
      </div>
    );
  }

  if (validStops.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[450px] flex flex-col items-center justify-center p-6 text-center shadow-xl">
        <div className="p-4 bg-slate-800/80 rounded-full text-slate-400 mb-3">
          <Compass className="w-8 h-8 text-sky-400" />
        </div>
        <h4 className="text-base font-bold text-slate-200">No Geocoded Stops Available</h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Add at least one valid stop address to view stops and route polyline on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[450px]">
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Interactive Field Map ({validStops.length} stops)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Med
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Low
          </span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full">
        <MapContainer
          center={
            validStops[0]
              ? [validStops[0].task.latitude!, validStops[0].task.longitude!]
              : defaultCenter
          }
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsFitter stops={validStops} />

          {/* Polyline connecting optimized route stops */}
          {polylineCoordinates.length >= 2 && (
            <Polyline
              positions={polylineCoordinates}
              pathOptions={{
                color: '#0284c7',
                weight: 4,
                opacity: 0.85,
                dashArray: '8, 8',
              }}
            />
          )}

          {/* Stop markers */}
          {validStops.map((stop) => (
            <Marker
              key={stop.task.id}
              position={[stop.task.latitude!, stop.task.longitude!]}
              icon={createNumberedMarkerIcon(stop.stopOrder, stop.task.priority)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mb-1">
                    <span className="bg-sky-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      #{stop.stopOrder}
                    </span>
                    <span>{stop.task.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-start gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-sky-600 shrink-0 mt-0.5" />
                    <span>{stop.task.address}</span>
                  </p>
                  {stop.task.deadline && (
                    <p className="text-xs text-amber-600 font-medium mb-1">
                      ⏰ Deadline: {stop.task.deadline}
                    </p>
                  )}
                  {stop.task.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-100 p-1.5 rounded">
                      "{stop.task.notes}"
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
