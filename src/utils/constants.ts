// API URLs
export const GTFS_RT_VEHICLE_POSITIONS_URL =
  import.meta.env.VITE_GTFS_RT_URL ||
  'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions';

export const GTFS_RT_TRIP_UPDATES_URL =
  import.meta.env.VITE_GTFS_TRIP_UPDATES_URL ||
  'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates';

export const GTFS_STATIC_URL =
  import.meta.env.VITE_GTFS_STATIC_URL ||
  'https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip';

export const BCC_TERMINALS_URL =
  import.meta.env.VITE_BCC_TERMINALS_URL ||
  'https://prod-brisbane-queensland.opendatasoft.com/api/records/1.0/search/?dataset=ferry-terminals&rows=100';

// Polling intervals
export const FERRY_POSITION_POLL_INTERVAL = 15000; // 15 seconds
export const TRIP_UPDATES_POLL_INTERVAL = 30000; // 30 seconds

// Request timeouts
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;

// Cache keys
export const GTFS_STATIC_CACHE_KEY = 'gtfs_static_data';
export const TERMINALS_CACHE_KEY = 'ferry_terminals';

// Cache durations
export const GTFS_STATIC_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
export const TERMINALS_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Map defaults
export const DEFAULT_MAP_CENTER: [number, number] = [-27.4698, 153.0251];
export const DEFAULT_MAP_ZOOM = 13;

// Brisbane bounds (to validate ferry positions)
export const BRISBANE_BOUNDS = {
  north: -27.3,
  south: -27.6,
  east: 153.2,
  west: 152.9,
};

// Data staleness threshold
export const DATA_STALE_THRESHOLD = 2 * 60 * 1000; // 2 minutes

// Average delay for ETA fallback (in milliseconds)
export const AVERAGE_DELAY_MS = 2 * 60 * 1000; // 2 minutes

// Colors
export const COLORS = {
  cityCat: '#0072CE',
  crossRiver: '#FF6B00',
  charcoal: '#2D3436',
  cream: '#FDF5E6',
  golden: '#F5B800',
};
