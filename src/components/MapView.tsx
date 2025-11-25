import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Ferry } from '../types/ferry';
import type { Terminal } from '../types/terminal';
import type { FilterType } from '../types/ui';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, COLORS } from '../utils/constants';

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  ferries: Ferry[];
  terminals: Terminal[];
  selectedFerry: Ferry | null;
  selectedTerminal: Terminal | null;
  filterService: FilterType;
  onFerrySelect: (ferry: Ferry) => void;
  onTerminalSelect: (terminal: Terminal) => void;
}

// Create custom ferry icon
function createFerryIcon(bearing: number, serviceType: 'citycat' | 'cross-river', selected: boolean) {
  const color = serviceType === 'citycat' ? COLORS.cityCat : COLORS.crossRiver;
  const size = selected ? 40 : 32;

  return L.divIcon({
    html: `
      <div style="transform: rotate(${bearing}deg); width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 32 32" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2 L20 10 L16 28 L12 10 Z" stroke="white" stroke-width="1.5"/>
          <circle cx="16" cy="16" r="3" fill="white"/>
        </svg>
      </div>
    `,
    className: `ferry-icon${selected ? ' selected' : ''}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Create terminal icon
function createTerminalIcon(selected: boolean) {
  const color = selected ? '#4CAF50' : '#757575';
  const size = selected ? 28 : 24;

  return L.divIcon({
    html: `
      <div style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
          <path d="M12 6 L12 12 M12 12 L16 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `,
    className: 'terminal-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Component to handle map viewport
function MapController() {
  const map = useMap();

  useEffect(() => {
    // Reset view to default
    map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
  }, [map]);

  return null;
}

export function MapView({
  ferries,
  terminals,
  selectedFerry,
  selectedTerminal,
  filterService,
  onFerrySelect,
  onTerminalSelect,
}: MapViewProps) {
  // Filter ferries based on service type
  const filteredFerries = useMemo(() => {
    if (filterService === 'all') return ferries;
    return ferries.filter((f) => f.serviceType === filterService);
  }, [ferries, filterService]);

  // Filter terminals based on service type
  const filteredTerminals = useMemo(() => {
    if (filterService === 'all') return terminals;
    return terminals.filter((t) => t.services.includes(filterService));
  }, [terminals, filterService]);

  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-screen w-full"
      zoomControl={true}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController />

      {/* Ferry markers */}
      {filteredFerries.map((ferry) => (
        <Marker
          key={ferry.id}
          position={[ferry.position.lat, ferry.position.lon]}
          icon={createFerryIcon(
            ferry.position.bearing,
            ferry.serviceType,
            selectedFerry?.id === ferry.id
          )}
          eventHandlers={{
            click: () => onFerrySelect(ferry),
          }}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base">{ferry.routeName}</h3>
              <p className="text-sm text-gray-600">{ferry.trip.headsign}</p>
              <p className="text-xs text-gray-500 mt-1">
                Click ferry, then click a terminal to see arrival time
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Terminal markers */}
      {filteredTerminals.map((terminal) => (
        <Marker
          key={terminal.stopId}
          position={[terminal.position.lat, terminal.position.lon]}
          icon={createTerminalIcon(selectedTerminal?.stopId === terminal.stopId)}
          eventHandlers={{
            click: () => {
              if (selectedFerry) {
                onTerminalSelect(terminal);
              }
            },
          }}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base">{terminal.name}</h3>
              <p className="text-sm text-gray-600">{terminal.suburb}</p>
              <p className="text-xs text-gray-500 mt-1">{terminal.address}</p>
              {terminal.accessibility.wheelchairAccessible && (
                <p className="text-xs text-green-600 mt-1">♿ Wheelchair accessible</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
