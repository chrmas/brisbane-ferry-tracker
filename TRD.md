# Technical Requirements Document (TRD)
# Brisbane River Ferry Tracker

**Version:** 1.0
**Last Updated:** November 21, 2025
**Technical Lead:** TBD
**Status:** Draft
**Related Documents:** [PRD.md](PRD.md), [research.md](research.md)

---

## 1. Executive Summary

### 1.1 Document Purpose
This Technical Requirements Document defines the technical implementation details, architecture, and development standards for the Brisbane River Ferry Tracker web application. It translates the product requirements defined in the PRD into specific technical specifications.

### 1.2 Technical Overview
The Brisbane River Ferry Tracker is a real-time web mapping application built using modern web technologies. It consumes public GTFS-RT (General Transit Feed Specification - Realtime) data from TransLink Queensland to display live ferry positions on an interactive map.

### 1.3 Key Technical Decisions
- **Architecture:** Single Page Application (SPA) with optional serverless backend
- **Frontend Framework:** React 19+ with TypeScript
- **Build Tool:** Vite 7.0+
- **Styling:** Tailwind CSS 4.1+
- **Mapping Library:** Leaflet.js or MapLibre GL JS
- **Data Format:** GTFS-RT (Protocol Buffers) and GTFS Static (ZIP/CSV)
- **Hosting:** Vercel (serverless functions + CDN)
- **State Management:** React Context API or Zustand

---

## 2. Technology Stack

### 2.1 Core Technologies

#### Frontend
```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 5.7+",
  "build-tool": "Vite 7.0.6",
  "styling": "Tailwind CSS 4.1.0",
  "package-manager": "npm 10+"
}
```

**Rationale:**
- **React 19:** Latest stable version with improved performance and concurrent features
- **TypeScript:** Type safety, better IDE support, reduced runtime errors
- **Vite 7:** Fast HMR, optimized builds, native ES modules
- **Tailwind 4:** 10x faster with Oxide engine, CSS-first configuration

#### Mapping Libraries (Choose One)

**Option A: Leaflet.js (Recommended for v1.0)**
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1"
}
```
**Pros:** Mature, lightweight (39KB), excellent documentation, extensive plugin ecosystem
**Cons:** Canvas-based rendering (less performant with many markers)

**Option B: MapLibre GL JS (For v2.0+)**
```json
{
  "maplibre-gl": "^4.7.1",
  "react-map-gl": "^7.1.7"
}
```
**Pros:** WebGL rendering (60fps), vector tiles, smooth animations
**Cons:** Larger bundle (250KB), steeper learning curve

**Decision for v1.0:** Leaflet.js
- Simpler implementation
- Adequate performance for ~36 ferry markers
- Faster development time

### 2.2 Key Dependencies

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "gtfs-realtime-bindings": "^1.1.4",
    "zustand": "^5.0.2",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vite": "^7.0.6",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "@types/leaflet": "^1.9.14",
    "eslint": "^9.18.0",
    "prettier": "^3.4.2",
    "vitest": "^2.1.8"
  }
}
```

**Dependency Justifications:**
- `gtfs-realtime-bindings`: Official library for parsing GTFS-RT Protocol Buffers
- `zustand`: Lightweight (3KB), simple state management
- `clsx`: Conditional className utility (700B)
- `date-fns`: Date formatting for ETA display (tree-shakeable)

### 2.3 Development Environment

#### Required Software
- **Node.js:** 20.19+ or 22.12+ (required for Vite 7)
- **npm:** 10+ (bundled with Node.js)
- **Git:** 2.40+
- **Code Editor:** VS Code (recommended)

#### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 2.4 Backend/Infrastructure

#### Serverless Functions (Vercel)
```
api/
├── gtfs-proxy.ts          # Proxy GTFS-RT API (if CORS issues)
├── gtfs-static.ts         # Cache and serve GTFS static data
└── ferry-filter.ts        # Pre-filter ferry data (optional optimization)
```

**Runtime:** Node.js 20.x
**Max Duration:** 10 seconds
**Memory:** 1024 MB (default)

#### Hosting: Vercel
- **CDN:** Global edge network
- **Builds:** Automatic on git push
- **SSL:** Auto-configured
- **Analytics:** Optional (@vercel/analytics)
- **Cost:** Free tier (100GB bandwidth, 100 serverless hours)

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              React SPA (TypeScript)                        │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │ UI Layer     │  │ State Layer  │  │ Data Layer      │ │ │
│  │  │              │  │              │  │                 │ │ │
│  │  │ - Map View   │◄─┤ - Zustand    │◄─┤ - API Client   │ │ │
│  │  │ - Controls   │  │   Store      │  │ - GTFS Parser  │ │ │
│  │  │ - Modals     │  │ - Ferry State│  │ - Data Cache   │ │ │
│  │  │ - Info Panel │  │ - UI State   │  │ - WebWorker(?) │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │ │
│  │                                              │             │ │
│  └──────────────────────────────────────────────┼─────────────┘ │
│                                                 │               │
└─────────────────────────────────────────────────┼───────────────┘
                                                  │
                              ┌───────────────────┼───────────────┐
                              │                   ▼               │
                              │   ┌───────────────────────────┐   │
                              │   │ Vercel Serverless Edge    │   │
                              │   │ (Optional Proxy/Cache)    │   │
                              │   └───────────────────────────┘   │
                              │                   │               │
                              └───────────────────┼───────────────┘
                                                  │
                    ┌─────────────────────────────┼─────────────────────┐
                    │                             │                     │
            ┌───────▼────────┐         ┌──────────▼──────┐  ┌──────────▼─────────┐
            │ TransLink      │         │ TransLink       │  │ Brisbane City      │
            │ GTFS-RT API    │         │ GTFS Static     │  │ Council Terminals  │
            │ (Vehicle Pos.) │         │ (ZIP Download)  │  │ API (GeoJSON)      │
            └────────────────┘         └─────────────────┘  └────────────────────┘
```

### 3.2 Frontend Architecture (Component Tree)

```
App
├── Navigation
│   ├── Logo
│   ├── NavLinks
│   └── MobileMenu
│
├── MapView (Leaflet)
│   ├── BaseMap (Tile Layer)
│   ├── FerryMarkers[]
│   │   └── FerryIcon (rotated by bearing)
│   ├── TerminalMarkers[]
│   │   └── TerminalIcon
│   ├── RouteLine[] (optional)
│   ├── MapControls
│   │   ├── ZoomControl
│   │   ├── ResetViewButton
│   │   └── LegendButton
│   └── LoadingOverlay
│
├── ServiceFilter
│   ├── FilterButton (All)
│   ├── FilterButton (CityCat)
│   └── FilterButton (Cross River)
│
├── FerryInfoPanel (conditional)
│   ├── FerryIcon
│   ├── RouteInfo
│   ├── NextStopInfo
│   └── CloseButton
│
├── ETAModal (conditional)
│   ├── ModalBackdrop
│   ├── ModalContent
│   │   ├── FerryDetails
│   │   ├── TerminalDetails
│   │   ├── ArrivalTime
│   │   └── CloseButton
│   └── Portal (to document.body)
│
├── Legend (toggleable)
│   ├── FerryLegendItem
│   ├── TerminalLegendItem
│   └── RouteLegendItem
│
├── ErrorBoundary
│   └── ErrorDisplay
│
└── Footer
    ├── Attribution
    └── DataSources
```

### 3.3 State Management Architecture

#### Global State (Zustand Store)

```typescript
// src/store/useAppStore.ts

interface AppStore {
  // Ferry data
  ferries: Ferry[];
  selectedFerry: Ferry | null;

  // Terminal data
  terminals: Terminal[];
  selectedTerminal: Terminal | null;

  // GTFS static data
  gtfsData: {
    routes: Map<string, Route>;
    trips: Map<string, Trip>;
    stopTimes: Map<string, StopTime[]>;
    shapes: Map<string, Shape[]>;
  } | null;

  // UI state
  filterService: 'all' | 'citycat' | 'cross-river';
  showLegend: boolean;
  mapCenter: [number, number];
  mapZoom: number;

  // Data status
  lastUpdate: number | null;
  isLoading: boolean;
  error: Error | null;
  dataStale: boolean; // true if > 2 minutes since update

  // ETA calculation
  currentETA: ETAResult | null;

  // Actions
  setFerries: (ferries: Ferry[]) => void;
  selectFerry: (ferry: Ferry | null) => void;
  selectTerminal: (terminal: Terminal | null) => void;
  setFilterService: (filter: FilterType) => void;
  setGtfsData: (data: GTFSData) => void;
  calculateETA: (ferry: Ferry, terminal: Terminal) => void;
  toggleLegend: () => void;
  setError: (error: Error | null) => void;
  updateDataStatus: () => void;
}
```

**Rationale for Zustand:**
- Minimal boilerplate compared to Redux
- No Context Provider wrapping needed
- Built-in TypeScript support
- DevTools integration available
- 3KB bundle size

#### Local State (Component-level)
Use React `useState` for:
- Form inputs
- Toggle states (modals, dropdowns)
- Animation states
- Component-specific UI state

### 3.4 Data Flow

#### 1. Application Initialization
```
1. User navigates to app URL
2. React app loads
3. Load GTFS static data (from cache or download)
4. Load ferry terminals from BCC API (from cache or fetch)
5. Initialize map at default position (-27.4698, 153.0251, zoom: 13)
6. Start GTFS-RT polling (every 15 seconds)
```

#### 2. Real-Time Ferry Position Update
```
Every 15 seconds:

1. Fetch GTFS-RT VehiclePositions
   └─> URL: https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions

2. Parse Protocol Buffer response
   └─> Use gtfs-realtime-bindings library

3. Filter for ferries only
   └─> Check route_type === 4 or route_id starts with 'F'

4. Transform to Ferry[] objects
   └─> Extract: id, lat, lon, bearing, speed, trip_id, route_id

5. Apply service filter (if active)
   └─> Filter by CityCat vs Cross River based on route data

6. Update Zustand store
   └─> store.setFerries(ferries)

7. React re-renders map with new positions
   └─> Markers animate from old to new positions (15s duration)

8. Update lastUpdate timestamp
   └─> store.updateDataStatus()
```

#### 3. Ferry Selection Flow
```
User clicks ferry marker:

1. onClick event fired on marker
2. store.selectFerry(ferry)
3. FerryInfoPanel component renders (conditional on selectedFerry)
4. Ferry marker changes visual state (larger, highlighted)
5. Terminal markers become interactive (cursor: pointer)
6. User can click terminal to calculate ETA
```

#### 4. ETA Calculation Flow
```
User clicks terminal (while ferry selected):

1. onClick event on terminal marker
2. store.selectTerminal(terminal)
3. store.calculateETA(selectedFerry, terminal)

   Algorithm:
   a. Get ferry's current trip_id
   b. Get trip's stop_sequence from GTFS static data
   c. Check if terminal.stop_id is in stop_sequence
   d. If not on route: return "Does not stop here"
   e. Get current position in sequence (based on ferry location)
   f. Check GTFS-RT TripUpdates for real-time arrival predictions
   g. If available: use real-time ETA
   h. Else: calculate based on scheduled time + average delay
   i. Format result: "Arrives in X min" or "Arrives at HH:MM"

4. store.currentETA = result
5. ETAModal renders with result
6. Auto-refresh ETA every 30 seconds while modal open
```

---

## 4. Data Models & Types

### 4.1 Core Data Types

```typescript
// src/types/ferry.ts

export interface Ferry {
  id: string;                    // Vehicle ID (e.g., "FERRY_001")
  routeId: string;               // Route identifier (e.g., "F1", "CRF_1")
  routeName: string;             // Human-readable name (e.g., "CityCat - Upstream")
  serviceType: 'citycat' | 'cross-river';
  position: FerryPosition;
  trip: TripInfo;
  timestamp: number;             // Unix timestamp (milliseconds)
  nextStop?: string;             // Stop ID of next terminal
}

export interface FerryPosition {
  lat: number;                   // Latitude (WGS84)
  lon: number;                   // Longitude (WGS84)
  bearing: number;               // 0-359 degrees (0 = North, 90 = East)
  speed?: number;                // Meters per second (optional)
}

export interface TripInfo {
  tripId: string;                // Unique trip identifier
  headsign: string;              // "Upstream" | "Downstream" | terminal name
  direction: 0 | 1;              // 0 = Outbound, 1 = Inbound
  routeId: string;
}

// src/types/terminal.ts

export interface Terminal {
  stopId: string;                // From GTFS (e.g., "STOP_001")
  name: string;                  // "Riverside", "South Bank", etc.
  position: {
    lat: number;
    lon: number;
  };
  address: string;
  suburb: string;
  services: ServiceType[];       // ['citycat'] or ['cross-river'] or both
  accessibility: {
    wheelchairAccessible: boolean;
    parking: boolean;
  };
  nearbyBusRoutes?: string[];
}

// src/types/gtfs.ts

export interface Route {
  routeId: string;
  routeShortName: string;
  routeLongName: string;
  routeType: number;             // 4 = Ferry
  routeColor?: string;
}

export interface Trip {
  tripId: string;
  routeId: string;
  serviceId: string;
  tripHeadsign: string;
  directionId: 0 | 1;
  shapeId?: string;
}

export interface StopTime {
  tripId: string;
  arrivalTime: string;           // "HH:MM:SS"
  departureTime: string;
  stopId: string;
  stopSequence: number;
}

export interface Shape {
  shapeId: string;
  shapePtLat: number;
  shapePtLon: number;
  shapePtSequence: number;
}

// src/types/eta.ts

export type ETAStatus = 'realtime' | 'scheduled' | 'not-on-route' | 'passed' | 'error';

export interface ETAResult {
  status: ETAStatus;
  time?: number;                 // Unix timestamp
  delay?: number;                // Seconds (positive = late, negative = early)
  displayText: string;           // "Arrives in 8 min" | "Does not stop here"
  confidence?: 'high' | 'medium' | 'low';
  lastUpdated: number;           // Unix timestamp
}

// src/types/ui.ts

export type ServiceType = 'citycat' | 'cross-river';
export type FilterType = 'all' | 'citycat' | 'cross-river';

export interface MapViewport {
  center: [number, number];      // [lat, lon]
  zoom: number;                  // 0-18
  bounds?: [[number, number], [number, number]];
}
```

### 4.2 API Response Types

```typescript
// src/types/api.ts

// GTFS-RT VehiclePosition (parsed from Protocol Buffer)
export interface GTFSRTVehiclePosition {
  id: string;
  vehicle: {
    trip: {
      tripId: string;
      routeId: string;
      directionId: 0 | 1;
      startTime?: string;
      startDate?: string;
    };
    position: {
      latitude: number;
      longitude: number;
      bearing?: number;
      speed?: number;
    };
    timestamp?: number;
    vehicle: {
      id: string;
      label?: string;
    };
  };
}

// GTFS-RT TripUpdate (for ETA predictions)
export interface GTFSRTTripUpdate {
  id: string;
  tripUpdate: {
    trip: {
      tripId: string;
      routeId: string;
    };
    stopTimeUpdate: {
      stopSequence: number;
      stopId: string;
      arrival?: {
        delay?: number;        // Seconds
        time?: number;         // Unix timestamp
      };
      departure?: {
        delay?: number;
        time?: number;
      };
    }[];
  };
}

// Brisbane City Council Ferry Terminals API
export interface BCCTerminalResponse {
  records: {
    fields: {
      terminal_name: string;
      geo_point_2d: [number, number]; // [lat, lon]
      street: string;
      suburb: string;
      accessibility: string;
      parking: string;
      services: string;           // "CityCat" | "Cross River Ferry" | "Both"
      nearby_bus_routes?: string;
    };
  }[];
}
```

---

## 5. API Integration Specifications

### 5.1 TransLink GTFS-RT API

#### Endpoint 1: Vehicle Positions

**URL:** `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions`

**Method:** GET

**Authentication:** None

**Response Format:** Protocol Buffer (application/x-protobuf)

**Request Headers:**
```typescript
{
  'Accept': 'application/x-protobuf'
}
```

**Polling Strategy:**
```typescript
// src/services/gtfsRTService.ts

const POLLING_INTERVAL = 15000; // 15 seconds
const TIMEOUT = 10000;          // 10 seconds
const MAX_RETRIES = 3;

export class GTFSRTService {
  private intervalId: NodeJS.Timeout | null = null;
  private retryCount = 0;

  async fetchVehiclePositions(): Promise<Ferry[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(GTFS_RT_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/x-protobuf' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const feed = parseFeedMessage(buffer);
      const ferries = filterAndTransformFerries(feed);

      this.retryCount = 0; // Reset on success
      return ferries;

    } catch (error) {
      if (this.retryCount < MAX_RETRIES) {
        this.retryCount++;
        await delay(Math.pow(2, this.retryCount) * 1000); // Exponential backoff
        return this.fetchVehiclePositions();
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  startPolling(callback: (ferries: Ferry[]) => void) {
    // Initial fetch
    this.fetchVehiclePositions().then(callback).catch(console.error);

    // Set up interval
    this.intervalId = setInterval(async () => {
      try {
        const ferries = await this.fetchVehiclePositions();
        callback(ferries);
      } catch (error) {
        console.error('Failed to fetch ferry positions:', error);
        // Continue polling despite errors
      }
    }, POLLING_INTERVAL);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
```

**Error Handling:**
- Network errors: Retry with exponential backoff
- Timeout: Abort request, retry
- Parse errors: Log error, use cached data
- 404/500 errors: Retry, show user message after 3 failures

#### Endpoint 2: Trip Updates (for ETA)

**URL:** `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates`

**Method:** GET

**Polling:** 30 seconds (less frequent than positions)

**Usage:** Fetch when user requests ETA for accuracy

### 5.2 GTFS Static Data

#### Download URL

**URL:** `https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip`

**Method:** GET

**Format:** ZIP archive containing CSV files

**Files Used:**
- `routes.txt` - Route definitions
- `trips.txt` - Trip information
- `stops.txt` - Terminal locations
- `stop_times.txt` - Schedules
- `shapes.txt` - Route geometries (optional)

**Caching Strategy:**

```typescript
// src/services/gtfsStaticService.ts

export class GTFSStaticService {
  private static CACHE_KEY = 'gtfs_static_data';
  private static CACHE_VERSION = '1';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  async loadGTFSData(): Promise<GTFSData> {
    // 1. Try IndexedDB cache first
    const cached = await this.getCachedData();
    if (cached && !this.isCacheExpired(cached)) {
      console.log('Using cached GTFS data');
      return cached.data;
    }

    // 2. Fetch from API
    console.log('Downloading GTFS data...');
    try {
      const data = await this.downloadAndParse();
      await this.cacheData(data);
      return data;
    } catch (error) {
      // 3. Fallback to bundled static copy
      console.warn('Failed to download, using bundled data');
      return this.loadBundledData();
    }
  }

  private async downloadAndParse(): Promise<GTFSData> {
    const response = await fetch(GTFS_STATIC_URL);
    const blob = await response.blob();

    // Unzip and parse CSV files
    const zip = await JSZip.loadAsync(blob);

    const routes = await this.parseCSV(await zip.file('routes.txt').async('text'));
    const trips = await this.parseCSV(await zip.file('trips.txt').async('text'));
    const stops = await this.parseCSV(await zip.file('stops.txt').async('text'));
    const stopTimes = await this.parseCSV(await zip.file('stop_times.txt').async('text'));

    return {
      routes: this.mapifyRoutes(routes),
      trips: this.mapifyTrips(trips),
      stops: this.mapifyStops(stops),
      stopTimes: this.groupStopTimesByTrip(stopTimes),
    };
  }

  private async cacheData(data: GTFSData) {
    const cacheEntry = {
      version: GTFSStaticService.CACHE_VERSION,
      timestamp: Date.now(),
      data
    };

    // Store in IndexedDB
    await idbKeyval.set(GTFSStaticService.CACHE_KEY, cacheEntry);
  }
}
```

**Bundle Fallback:**
- Include a pre-downloaded GTFS package in `public/data/gtfs-fallback.json`
- Minified and compressed
- Updated manually when GTFS data changes significantly

### 5.3 Brisbane City Council Terminals API

#### Endpoint

**URL:** `https://prod-brisbane-queensland.opendatasoft.com/api/records/1.0/search/?dataset=ferry-terminals&rows=100`

**Method:** GET

**Authentication:** None

**Response Format:** JSON

**Caching:**
```typescript
// src/services/terminalService.ts

export class TerminalService {
  private static CACHE_KEY = 'ferry_terminals';
  private static CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  async loadTerminals(): Promise<Terminal[]> {
    // Check localStorage cache
    const cached = localStorage.getItem(TerminalService.CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < TerminalService.CACHE_DURATION) {
        return data;
      }
    }

    // Fetch from API
    const response = await fetch(BCC_TERMINALS_URL);
    const json = await response.json();
    const terminals = this.transformBCCData(json);

    // Cache for 7 days
    localStorage.setItem(TerminalService.CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: terminals
    }));

    return terminals;
  }

  private transformBCCData(response: BCCTerminalResponse): Terminal[] {
    return response.records.map(record => ({
      stopId: this.generateStopId(record.fields.terminal_name), // Match with GTFS
      name: record.fields.terminal_name,
      position: {
        lat: record.fields.geo_point_2d[0],
        lon: record.fields.geo_point_2d[1],
      },
      address: record.fields.street,
      suburb: record.fields.suburb,
      services: this.parseServices(record.fields.services),
      accessibility: {
        wheelchairAccessible: record.fields.accessibility?.includes('wheelchair'),
        parking: record.fields.parking === 'Yes',
      },
      nearbyBusRoutes: record.fields.nearby_bus_routes?.split(',').map(s => s.trim()),
    }));
  }
}
```

---

## 6. Component Specifications

### 6.1 MapView Component

**File:** `src/components/MapView.tsx`

**Purpose:** Main map container with ferry/terminal markers

**Props:**
```typescript
interface MapViewProps {
  ferries: Ferry[];
  terminals: Terminal[];
  selectedFerry: Ferry | null;
  selectedTerminal: Terminal | null;
  onFerrySelect: (ferry: Ferry) => void;
  onTerminalSelect: (terminal: Terminal) => void;
  filterService: FilterType;
}
```

**Implementation Details:**

```typescript
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom ferry icon
const createFerryIcon = (bearing: number, serviceType: ServiceType, selected: boolean) => {
  const color = serviceType === 'citycat' ? '#0072CE' : '#FF6B00';
  const size = selected ? 40 : 32;

  return L.divIcon({
    html: `
      <div style="
        transform: rotate(${bearing}deg);
        width: ${size}px;
        height: ${size}px;
      ">
        <svg viewBox="0 0 32 32" fill="${color}">
          <!-- Ferry SVG path -->
          <path d="M16,2 L20,10 L16,28 L12,10 Z" />
        </svg>
      </div>
    `,
    className: 'ferry-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

export const MapView: React.FC<MapViewProps> = ({
  ferries,
  terminals,
  selectedFerry,
  onFerrySelect,
  // ...
}) => {
  const filteredFerries = useMemo(() => {
    if (filterService === 'all') return ferries;
    return ferries.filter(f => f.serviceType === filterService);
  }, [ferries, filterService]);

  return (
    <MapContainer
      center={[-27.4698, 153.0251]}
      zoom={13}
      className="h-screen w-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Ferry markers */}
      {filteredFerries.map(ferry => (
        <Marker
          key={ferry.id}
          position={[ferry.position.lat, ferry.position.lon]}
          icon={createFerryIcon(
            ferry.position.bearing,
            ferry.serviceType,
            selectedFerry?.id === ferry.id
          )}
          eventHandlers={{
            click: () => onFerrySelect(ferry)
          }}
        />
      ))}

      {/* Terminal markers */}
      {terminals.map(terminal => (
        <Marker
          key={terminal.stopId}
          position={[terminal.position.lat, terminal.position.lon]}
          icon={terminalIcon(selectedTerminal?.stopId === terminal.stopId)}
          eventHandlers={{
            click: () => {
              if (selectedFerry) {
                onTerminalSelect(terminal);
              }
            }
          }}
        />
      ))}

      <MapControls />
      <AnimatedMarkers ferries={filteredFerries} />
    </MapContainer>
  );
};
```

**Performance Optimizations:**
- Use `useMemo` for filtered ferry list
- Memoize icon creation
- Debounce map move events
- Virtualize markers if count > 100 (unlikely for ferries)

### 6.2 FerryInfoPanel Component

**File:** `src/components/FerryInfoPanel.tsx`

**Purpose:** Display selected ferry information

**Design:**
```tsx
interface FerryInfoPanelProps {
  ferry: Ferry;
  onClose: () => void;
}

export const FerryInfoPanel: React.FC<FerryInfoPanelProps> = ({ ferry, onClose }) => {
  return (
    <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-xl p-6 max-w-sm z-1000 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center",
            ferry.serviceType === 'citycat' ? 'bg-blue-500' : 'bg-orange-500'
          )}>
            🚢
          </div>
          <div>
            <h3 className="font-bold text-lg text-charcoal">{ferry.routeName}</h3>
            <p className="text-sm text-gray-600">{ferry.trip.headsign}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {ferry.nextStop && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Next Stop:</span>
            <span className="font-medium">{getStopName(ferry.nextStop)}</span>
          </div>
        )}
        {ferry.position.speed && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Speed:</span>
            <span className="font-medium">{Math.round(ferry.position.speed * 3.6)} km/h</span>
          </div>
        )}
      </div>

      {/* Instruction */}
      <div className="bg-cream rounded-lg p-3 text-sm text-charcoal">
        💡 Click a terminal on the map to see arrival time
      </div>
    </div>
  );
};
```

**Mobile Variant:**
```tsx
// On mobile (< 768px), render as bottom sheet instead of fixed panel
const isMobile = window.innerWidth < 768;

{isMobile ? (
  <BottomSheet>
    <FerryInfoContent ferry={ferry} onClose={onClose} />
  </BottomSheet>
) : (
  <FerryInfoPanel ferry={ferry} onClose={onClose} />
)}
```

### 6.3 ETAModal Component

**File:** `src/components/ETAModal.tsx`

```typescript
interface ETAModalProps {
  ferry: Ferry;
  terminal: Terminal;
  eta: ETAResult;
  onClose: () => void;
}

export const ETAModal: React.FC<ETAModalProps> = ({ ferry, terminal, eta, onClose }) => {
  // Auto-refresh ETA every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      recalculateETA(ferry, terminal);
    }, 30000);

    return () => clearInterval(interval);
  }, [ferry.id, terminal.stopId]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4">
            <div className={clsx(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl",
              ferry.serviceType === 'citycat' ? 'bg-blue-100' : 'bg-orange-100'
            )}>
              🚢
            </div>
          </div>

          <h2 className="text-2xl font-bold text-charcoal mb-2">
            {ferry.routeName}
          </h2>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <span>{terminal.name}</span>
          </div>

          {/* ETA Display */}
          <div className={clsx(
            "text-5xl font-bold mb-2",
            eta.status === 'realtime' && 'text-green-600',
            eta.status === 'scheduled' && 'text-blue-600',
            eta.status === 'not-on-route' && 'text-gray-600'
          )}>
            {eta.displayText}
          </div>

          {eta.status === 'realtime' && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <span className="animate-pulse">●</span>
              Real-time estimate
            </div>
          )}

          {eta.status === 'scheduled' && (
            <div className="text-sm text-gray-600">
              Based on schedule
            </div>
          )}

          {eta.delay && Math.abs(eta.delay) > 60 && (
            <div className={clsx(
              "mt-4 px-4 py-2 rounded-full text-sm",
              eta.delay > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            )}>
              {eta.delay > 0 ? 'Running late' : 'Running early'} by {Math.abs(Math.round(eta.delay / 60))} min
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
```

### 6.4 ServiceFilter Component

**File:** `src/components/ServiceFilter.tsx`

```tsx
const filterOptions = [
  { value: 'all', label: 'All Services', icon: '🚢' },
  { value: 'citycat', label: 'CityCat', icon: '🔵' },
  { value: 'cross-river', label: 'Cross River', icon: '🟠' },
] as const;

export const ServiceFilter: React.FC = () => {
  const { filterService, setFilterService } = useAppStore();

  return (
    <div className="absolute top-24 left-4 z-1000 bg-white rounded-full shadow-lg p-1 flex gap-1">
      {filterOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setFilterService(option.value)}
          className={clsx(
            'px-4 py-2 rounded-full font-medium transition-all text-sm',
            filterService === option.value
              ? 'bg-golden text-white shadow-md'
              : 'text-charcoal hover:bg-cream'
          )}
        >
          <span className="mr-2">{option.icon}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
```

---

## 7. ETA Calculation Algorithm

### 7.1 Algorithm Implementation

```typescript
// src/services/etaCalculator.ts

export class ETACalculator {
  constructor(
    private gtfsData: GTFSData,
    private tripUpdates: Map<string, GTFSRTTripUpdate>
  ) {}

  calculate(ferry: Ferry, terminal: Terminal): ETAResult {
    // Step 1: Verify terminal is on ferry's route
    const trip = this.gtfsData.trips.get(ferry.trip.tripId);
    if (!trip) {
      return {
        status: 'error',
        displayText: 'Trip data unavailable',
        lastUpdated: Date.now(),
      };
    }

    const stopTimes = this.gtfsData.stopTimes.get(trip.tripId) || [];
    const terminalStopTime = stopTimes.find(st => st.stopId === terminal.stopId);

    // Step 2: Check if terminal is on route
    if (!terminalStopTime) {
      return {
        status: 'not-on-route',
        displayText: 'Does not stop here',
        lastUpdated: Date.now(),
      };
    }

    // Step 3: Get current position in stop sequence
    const currentStopSequence = this.estimateCurrentStopSequence(ferry, stopTimes);
    const targetStopSequence = terminalStopTime.stopSequence;

    // Step 4: Check if already passed
    if (targetStopSequence <= currentStopSequence) {
      const departureTime = this.getLastDepartureTime(ferry, terminal);
      const minutesAgo = Math.floor((Date.now() - departureTime) / 60000);
      return {
        status: 'passed',
        time: departureTime,
        displayText: `Departed ${minutesAgo} min ago`,
        lastUpdated: Date.now(),
      };
    }

    // Step 5: Try real-time prediction from GTFS-RT TripUpdates
    const tripUpdate = this.tripUpdates.get(ferry.trip.tripId);
    if (tripUpdate) {
      const stopUpdate = tripUpdate.tripUpdate.stopTimeUpdate.find(
        stu => stu.stopId === terminal.stopId
      );

      if (stopUpdate?.arrival?.time) {
        const arrivalTime = stopUpdate.arrival.time * 1000; // Convert to ms
        const minutesUntil = Math.floor((arrivalTime - Date.now()) / 60000);

        return {
          status: 'realtime',
          time: arrivalTime,
          delay: stopUpdate.arrival.delay,
          displayText: minutesUntil < 60
            ? `Arrives in ${minutesUntil} min`
            : `Arrives at ${format(arrivalTime, 'h:mm a')}`,
          confidence: 'high',
          lastUpdated: Date.now(),
        };
      }
    }

    // Step 6: Fallback to scheduled time + average delay
    const scheduledArrival = this.parseScheduledTime(
      terminalStopTime.arrivalTime,
      trip.serviceId
    );
    const avgDelay = this.calculateAverageDelay(ferry.routeId);
    const estimatedArrival = scheduledArrival + avgDelay;
    const minutesUntil = Math.floor((estimatedArrival - Date.now()) / 60000);

    return {
      status: 'scheduled',
      time: estimatedArrival,
      delay: avgDelay / 1000, // Convert to seconds
      displayText: minutesUntil < 60
        ? `Arrives in ~${minutesUntil} min`
        : `Arrives at ~${format(estimatedArrival, 'h:mm a')}`,
      confidence: 'medium',
      lastUpdated: Date.now(),
    };
  }

  private estimateCurrentStopSequence(ferry: Ferry, stopTimes: StopTime[]): number {
    // Find nearest stop based on ferry's current position
    const ferryPos = ferry.position;
    let nearestStop = stopTimes[0];
    let minDistance = Infinity;

    for (const stopTime of stopTimes) {
      const stop = this.gtfsData.stops.get(stopTime.stopId);
      if (!stop) continue;

      const distance = this.haversineDistance(
        ferryPos.lat,
        ferryPos.lon,
        stop.stopLat,
        stop.stopLon
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStop = stopTime;
      }
    }

    // If ferry is moving away from nearest stop, assume it departed
    const bearing = this.calculateBearing(
      ferryPos.lat,
      ferryPos.lon,
      nearestStop.stopLat,
      nearestStop.stopLon
    );
    const bearingDiff = Math.abs(bearing - ferryPos.bearing);

    if (bearingDiff > 90 && bearingDiff < 270) {
      // Moving away, likely departed this stop
      return nearestStop.stopSequence;
    }

    // Moving towards, hasn't arrived yet
    return nearestStop.stopSequence - 1;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private calculateAverageDelay(routeId: string): number {
    // In v1.0, use conservative estimate
    // In v2.0, calculate from historical data
    return 2 * 60 * 1000; // 2 minutes in milliseconds
  }
}
```

### 7.2 Edge Cases Handled

| Scenario | Detection | Response |
|----------|-----------|----------|
| Terminal not on route | `!stopTimes.includes(terminal.stopId)` | "Does not stop here" |
| Ferry already passed | `targetSequence <= currentSequence` | "Departed X min ago" |
| Real-time data unavailable | `!tripUpdate` | Use scheduled time + avg delay |
| Ferry not in service | `!ferry.trip` | "Not in service" |
| Data too old | `timestamp > 2 minutes` | Show staleness warning |
| Invalid trip_id | `!gtfsData.trips.has(tripId)` | "Trip data unavailable" |

---

## 8. File & Folder Structure

```
brisbane-ferry-tracker/
├── public/
│   ├── data/
│   │   └── gtfs-fallback.json       # Bundled GTFS data
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── MapView.tsx              # Main map component
│   │   ├── Navigation.tsx           # Header/nav
│   │   ├── ServiceFilter.tsx        # Filter controls
│   │   ├── FerryInfoPanel.tsx       # Ferry details panel
│   │   ├── ETAModal.tsx             # Arrival time modal
│   │   ├── Legend.tsx               # Map legend
│   │   ├── TerminalMarker.tsx       # Terminal map marker
│   │   ├── FerryMarker.tsx          # Ferry map marker
│   │   ├── ErrorBoundary.tsx        # Error handling
│   │   ├── LoadingSpinner.tsx       # Loading state
│   │   └── Footer.tsx               # Attribution footer
│   │
│   ├── services/
│   │   ├── gtfsRTService.ts         # GTFS-RT API client
│   │   ├── gtfsStaticService.ts     # GTFS static data loader
│   │   ├── terminalService.ts       # BCC terminals API
│   │   ├── etaCalculator.ts         # ETA calculation logic
│   │   └── mapUtils.ts              # Geo calculations
│   │
│   ├── store/
│   │   └── useAppStore.ts           # Zustand global state
│   │
│   ├── types/
│   │   ├── ferry.ts                 # Ferry types
│   │   ├── terminal.ts              # Terminal types
│   │   ├── gtfs.ts                  # GTFS types
│   │   ├── eta.ts                   # ETA types
│   │   └── api.ts                   # API response types
│   │
│   ├── hooks/
│   │   ├── useFerryPolling.ts       # Real-time ferry updates
│   │   ├── useGTFSData.ts           # GTFS data loading
│   │   ├── useETA.ts                # ETA calculation hook
│   │   └── useMediaQuery.ts         # Responsive breakpoints
│   │
│   ├── utils/
│   │   ├── formatTime.ts            # Time formatting
│   │   ├── parseGTFS.ts             # GTFS parsing helpers
│   │   ├── constants.ts             # App constants
│   │   └── validation.ts            # Data validation
│   │
│   ├── assets/
│   │   └── icons/
│   │       ├── ferry-icon.svg       # Ferry marker
│   │       └── terminal-icon.svg    # Terminal marker
│   │
│   ├── styles/
│   │   ├── app.css                  # Tailwind imports + custom
│   │   └── animations.css           # Custom animations
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── vite-env.d.ts               # Vite types
│
├── api/                             # Vercel serverless functions
│   ├── gtfs-proxy.ts               # GTFS-RT proxy (if CORS issues)
│   └── health.ts                   # Health check endpoint
│
├── tests/
│   ├── unit/
│   │   ├── etaCalculator.test.ts
│   │   ├── mapUtils.test.ts
│   │   └── parseGTFS.test.ts
│   ├── integration/
│   │   └── gtfsServices.test.ts
│   └── e2e/
│       └── userFlows.spec.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions
│
├── .vscode/
│   ├── settings.json
│   └── extensions.json
│
├── .env.example                     # Env var template
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
├── .gitignore
├── index.html                       # HTML entry
├── package.json
├── postcss.config.js                # PostCSS config
├── tailwind.config.js               # Tailwind config (optional for v4)
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── vercel.json                      # Vercel config
├── README.md                        # Project docs
├── PRD.md                           # Product requirements
└── TRD.md                           # This document
```

---

## 9. Configuration Files

### 9.1 package.json

```json
{
  "name": "brisbane-ferry-tracker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "gtfs-realtime-bindings": "^1.1.4",
    "zustand": "^5.0.2",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "idb-keyval": "^6.2.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "@types/leaflet": "^1.9.14",
    "@typescript-eslint/eslint-plugin": "^8.20.0",
    "@typescript-eslint/parser": "^8.20.0",
    "typescript": "^5.7.3",
    "vite": "^7.0.6",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49",
    "eslint": "^9.18.0",
    "prettier": "^3.4.2",
    "vitest": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "@playwright/test": "^1.49.1"
  }
}
```

### 9.2 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'gtfs-vendor': ['gtfs-realtime-bindings'],
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'gtfs-realtime-bindings'],
  },
});
```

### 9.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 9.4 postcss.config.js

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 9.5 tailwind.config.js (Optional for v4)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'translink-blue': '#0072CE',
        'ferry-orange': '#FF6B00',
        'charcoal': '#2D3436',
        'cream': '#FDF5E6',
        'golden': '#F5B800',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### 9.6 vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate" }
      ]
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### 9.7 .eslintrc.json

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## 10. Performance Requirements

### 10.1 Load Time Targets

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| First Contentful Paint (FCP) | < 1.8s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.8s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Total Blocking Time (TBT) | < 300ms | Lighthouse |
| Speed Index | < 3.4s | Lighthouse |

**Overall Lighthouse Score:** 90+ for Performance

### 10.2 Bundle Size Targets

| Bundle | Max Size (gzipped) | Notes |
|--------|-------------------|-------|
| Main bundle (vendor) | 200 KB | React, Leaflet, Zustand |
| App code | 100 KB | Components, logic |
| CSS | 20 KB | Tailwind (purged) |
| **Total** | **320 KB** | Initial load |

**Code Splitting Strategy:**
- Vendor chunk: React, ReactDOM, Leaflet
- Map chunk: Map components and utilities
- GTFS chunk: GTFS parsing and services
- Lazy load ETAModal (only when needed)

### 10.3 Runtime Performance

| Operation | Target | Notes |
|-----------|--------|-------|
| Ferry position update | < 100ms | Parse + render 36 ferries |
| Map pan/zoom | 60 FPS | Smooth interaction |
| Filter change | < 50ms | Instant feedback |
| ETA calculation | < 200ms | Including GTFS lookups |
| GTFS-RT API request | < 500ms | P95 response time |

### 10.4 Optimization Techniques

#### JavaScript Optimization
```typescript
// 1. Memoize expensive computations
const filteredFerries = useMemo(() => {
  return ferries.filter(f =>
    filterService === 'all' || f.serviceType === filterService
  );
}, [ferries, filterService]);

// 2. Debounce frequent events
const debouncedMapMove = useMemo(
  () => debounce((center, zoom) => {
    saveMapState(center, zoom);
  }, 500),
  []
);

// 3. Virtualize large lists (if needed)
// Not required for 36 ferries + 22 terminals, but keep in mind
```

#### Bundle Optimization
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'map-vendor': ['leaflet', 'react-leaflet'],
        'gtfs-vendor': ['gtfs-realtime-bindings'],
      },
    },
  },
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Remove console.logs in production
    },
  },
}
```

#### Asset Optimization
- Compress images with WebP format
- Use SVG for icons (smaller, scalable)
- Lazy load non-critical assets
- Preload critical fonts

#### Caching Strategy
```typescript
// Service Worker (optional for v2.0)
// Cache static GTFS data for 24 hours
// Cache map tiles aggressively
// Network-first for GTFS-RT API

// For v1.0, use browser caching:
// - IndexedDB for GTFS static data
// - LocalStorage for ferry terminals
// - In-memory cache for API responses (15s TTL)
```

---

## 11. Security Requirements

### 11.1 Data Security

**No User Data Collection:**
- No authentication/login required
- No personal data stored
- No cookies (except functional ones for theme preference)
- Privacy-first analytics only (Plausible or Simple Analytics)

**API Security:**
- TransLink API is public, no keys needed
- If implementing backend proxy:
  - Rate limiting (max 100 req/min per IP)
  - CORS restrictions (allow only production domain)
  - No sensitive data exposure in responses

### 11.2 Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.tile.openstreetmap.org;
  connect-src 'self' https://gtfsrt.api.translink.com.au https://prod-brisbane-queensland.opendatasoft.com;
  font-src 'self';
  frame-src 'none';
">
```

### 11.3 Dependency Security

**Automated Scanning:**
```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix"
  }
}
```

**GitHub Dependabot:**
- Enable automatic security updates
- Review PRs for major version bumps

### 11.4 Error Handling (No Sensitive Info Exposure)

```typescript
// Don't expose internal errors to users
try {
  await fetchGTFSData();
} catch (error) {
  console.error('GTFS fetch failed:', error); // Log internally
  setError(new Error('Unable to load ferry data. Please try again.')); // Generic user message
}
```

---

## 12. Accessibility Requirements

### 12.1 WCAG 2.1 AA Compliance

**Level AA Criteria:**
- Color contrast ≥ 4.5:1 for normal text
- Color contrast ≥ 3:1 for large text (18pt+)
- No content relies solely on color
- All interactive elements keyboard accessible
- Screen reader compatible

### 12.2 Semantic HTML

```tsx
// Use semantic elements
<nav aria-label="Main navigation">
<main>
  <section aria-labelledby="map-title">
    <h1 id="map-title">Brisbane Ferry Tracker</h1>
  </section>
</main>
<footer>
```

### 12.3 Keyboard Navigation

**Required keyboard support:**
- `Tab`: Navigate between interactive elements
- `Enter/Space`: Activate buttons
- `Escape`: Close modals
- `Arrow keys`: Pan map (optional, nice-to-have)

**Focus management:**
```tsx
// Trap focus in modal
useEffect(() => {
  if (isModalOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    firstElement?.focus();
  }
}, [isModalOpen]);
```

### 12.4 ARIA Labels

```tsx
// Ferry marker
<button
  aria-label={`${ferry.routeName} ferry heading ${ferry.trip.headsign}`}
  onClick={() => selectFerry(ferry)}
>
  <FerryIcon />
</button>

// Filter buttons
<button
  aria-pressed={filterService === 'citycat'}
  aria-label="Show CityCat ferries only"
>
  CityCat
</button>

// Map
<div
  role="application"
  aria-label="Interactive map of Brisbane River ferries"
>
  <Map />
</div>
```

### 12.5 Screen Reader Announcements

```tsx
// Live region for updates
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {ferries.length} ferries currently operating
</div>

// Error announcements
<div
  role="alert"
  aria-live="assertive"
  className="sr-only"
>
  {error?.message}
</div>
```

### 12.6 Color Contrast Compliance

| Element | Foreground | Background | Ratio | Pass |
|---------|-----------|------------|-------|------|
| Body text | #2D3436 | #FFFFFF | 12.6:1 | ✅ AAA |
| Button text | #FFFFFF | #F5B800 | 6.8:1 | ✅ AAA |
| Link text | #0072CE | #FFFFFF | 5.3:1 | ✅ AA |
| Secondary text | #757575 | #FFFFFF | 4.6:1 | ✅ AA |

---

## 13. Testing Strategy

### 13.1 Unit Tests (Vitest)

**Coverage Target:** 80%+ for business logic

**Test Files:**
```
tests/unit/
├── etaCalculator.test.ts       # ETA algorithm
├── mapUtils.test.ts            # Geo calculations
├── parseGTFS.test.ts           # GTFS parsing
├── formatTime.test.ts          # Time formatting
└── filterService.test.ts       # Ferry filtering logic
```

**Example Test:**
```typescript
// tests/unit/etaCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { ETACalculator } from '@services/etaCalculator';

describe('ETACalculator', () => {
  it('should return "not-on-route" when terminal not in stop sequence', () => {
    const calculator = new ETACalculator(mockGTFSData, new Map());
    const result = calculator.calculate(mockFerry, mockTerminalNotOnRoute);

    expect(result.status).toBe('not-on-route');
    expect(result.displayText).toBe('Does not stop here');
  });

  it('should calculate ETA from real-time trip updates', () => {
    const calculator = new ETACalculator(mockGTFSData, mockTripUpdates);
    const result = calculator.calculate(mockFerry, mockTerminal);

    expect(result.status).toBe('realtime');
    expect(result.confidence).toBe('high');
    expect(result.time).toBeGreaterThan(Date.now());
  });
});
```

### 13.2 Integration Tests

**Test API Interactions:**
```typescript
// tests/integration/gtfsServices.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { GTFSRTService } from '@services/gtfsRTService';

describe('GTFSRTService', () => {
  let service: GTFSRTService;

  beforeAll(() => {
    service = new GTFSRTService();
  });

  it('should fetch and parse vehicle positions', async () => {
    const ferries = await service.fetchVehiclePositions();

    expect(Array.isArray(ferries)).toBe(true);
    expect(ferries.length).toBeGreaterThan(0);
    expect(ferries[0]).toHaveProperty('id');
    expect(ferries[0]).toHaveProperty('position');
  });

  it('should filter only ferry vehicles', async () => {
    const ferries = await service.fetchVehiclePositions();

    ferries.forEach(ferry => {
      expect(['citycat', 'cross-river']).toContain(ferry.serviceType);
    });
  });
});
```

### 13.3 End-to-End Tests (Playwright)

**Critical User Flows:**
```typescript
// tests/e2e/userFlows.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Brisbane Ferry Tracker', () => {
  test('should load map with ferries and terminals', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Map loads
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // Ferries appear
    const ferryMarkers = page.locator('.ferry-icon');
    await expect(ferryMarkers).toHaveCount(greaterThan(0));

    // Terminals appear
    const terminalMarkers = page.locator('.terminal-icon');
    await expect(terminalMarkers).toHaveCount(22);
  });

  test('should filter ferries by service type', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click CityCat filter
    await page.click('button:has-text("CityCat")');

    // Only CityCat ferries visible
    const ferryMarkers = page.locator('.ferry-icon');
    await expect(ferryMarkers).toHaveAttribute('data-service-type', 'citycat');
  });

  test('should display ETA when ferry and terminal selected', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Select a ferry
    await page.click('.ferry-icon').first();

    // Info panel appears
    await expect(page.locator('.ferry-info-panel')).toBeVisible();

    // Click a terminal
    await page.click('.terminal-icon').first();

    // ETA modal appears
    await expect(page.locator('.eta-modal')).toBeVisible();
    await expect(page.locator('.eta-modal')).toContainText(/Arrives/);
  });
});
```

### 13.4 Accessibility Testing

**Automated (axe-core):**
```typescript
// tests/a11y/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Manual Testing Checklist:**
- [ ] Screen reader navigation (NVDA/JAWS/VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Zoom to 200% (text remains readable)
- [ ] Color blindness simulation (Deuteranopia, Protanopia)

### 13.5 Performance Testing

**Lighthouse CI:**
```yaml
# .github/workflows/ci.yml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

**Load Testing:**
```typescript
// Simulate 100 concurrent users
// Test GTFS-RT API polling impact
// Ensure no memory leaks during extended use
```

---

## 14. Deployment & DevOps

### 14.1 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Unit tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: E2E tests
        run: npm run test:e2e

      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.2 Environment Variables

**Development (.env.local):**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false
VITE_GTFS_RT_URL=https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions
```

**Production (Vercel):**
```
VITE_API_BASE_URL=https://brisbane-ferries.vercel.app/api
VITE_ENABLE_ANALYTICS=true
VITE_GTFS_RT_URL=https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions
```

### 14.3 Deployment Checklist

**Pre-deployment:**
- [ ] All tests passing
- [ ] No ESLint errors
- [ ] TypeScript compilation successful
- [ ] Bundle size within limits
- [ ] Lighthouse score > 90
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed

**Deployment:**
- [ ] Push to main branch
- [ ] GitHub Actions CI passes
- [ ] Vercel builds successfully
- [ ] Environment variables configured
- [ ] Production URL accessible

**Post-deployment:**
- [ ] Smoke test production site
- [ ] Verify GTFS-RT API connectivity
- [ ] Check ferry positions updating
- [ ] Test ETA calculations
- [ ] Monitor error tracking (Sentry)
- [ ] Check analytics (if enabled)

### 14.4 Monitoring & Logging

**Error Tracking (Sentry):**
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

**Analytics (Plausible):**
```html
<!-- index.html -->
<script defer data-domain="brisbane-ferries.vercel.app" src="https://plausible.io/js/script.js"></script>
```

**Uptime Monitoring:**
- Use UptimeRobot or similar
- Monitor main page + API endpoint
- Alert if down > 2 minutes

---

## 15. Browser & Device Support

### 15.1 Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 111+ | Full support |
| Firefox | 128+ | Full support |
| Safari | 16.4+ | Tailwind 4 requirement |
| Edge | 111+ | Chromium-based |
| Mobile Safari | 16.4+ | iOS 16+ |
| Chrome Mobile | Latest | Full support |

**Polyfills:** None required (modern browsers only)

### 15.2 Device Support

**Desktop:**
- Minimum resolution: 1024x768
- Optimal: 1920x1080 and above

**Tablet:**
- iPad (9th gen+)
- Android tablets (2020+)
- Minimum: 768px width

**Mobile:**
- iPhone 12+ (iOS 16+)
- Android phones (Android 10+)
- Minimum: 360px width

### 15.3 Responsive Breakpoints

```typescript
// Tailwind breakpoints
{
  'sm': '640px',   // Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Desktops
  'xl': '1280px',  // Large desktops
  '2xl': '1536px', // Extra large
}
```

**Mobile Optimizations:**
- Bottom sheet UI for info panels
- Larger tap targets (min 44x44px)
- Simplified filter (dropdown vs buttons)
- Optimized map controls

---

## 16. Documentation Requirements

### 16.1 Code Documentation

**JSDoc for complex functions:**
```typescript
/**
 * Calculates estimated arrival time for a ferry at a specific terminal
 *
 * @param ferry - The ferry object with current position and trip info
 * @param terminal - The destination terminal
 * @returns ETAResult with status, time, and display text
 *
 * @example
 * const eta = calculateETA(ferry, terminal);
 * console.log(eta.displayText); // "Arrives in 8 min"
 */
export function calculateETA(ferry: Ferry, terminal: Terminal): ETAResult {
  // ...
}
```

### 16.2 README.md

**Required Sections:**
- Project overview
- Features
- Tech stack
- Installation instructions
- Development setup
- Build/deployment
- Environment variables
- Contributing guidelines
- License

### 16.3 API Documentation

**Internal API docs:**
- Document all service classes
- Explain data flow
- Include example requests/responses
- Note rate limits and error codes

### 16.4 Component Storybook (Optional v2.0)

For visual component documentation and testing in isolation.

---

## 17. Maintenance & Support

### 17.1 Dependency Updates

**Schedule:**
- Weekly: Check for security updates
- Monthly: Update minor versions
- Quarterly: Review major version upgrades

**Process:**
```bash
# Check outdated packages
npm outdated

# Update non-breaking changes
npm update

# Test after updates
npm run test && npm run build
```

### 17.2 GTFS Data Updates

**TransLink GTFS Static:**
- Monitor for schema changes
- Update parser if format changes
- Refresh bundled fallback data quarterly

**Brisbane City Council Terminals:**
- Check for new terminals annually
- Update when service changes announced

### 17.3 Browser Compatibility

- Test on new browser releases
- Update browserslist if needed
- Monitor browser usage analytics

---

## 18. Future Technical Enhancements

### 18.1 Phase 2 Technical Features

**Progressive Web App (PWA):**
- Service worker for offline map tiles
- Install prompt
- Background sync for cached data

**WebSocket for Real-Time:**
- Replace polling with WebSocket connection
- Server pushes ferry updates
- Reduced latency and bandwidth

**Advanced Mapping:**
- Switch to MapLibre GL JS for WebGL rendering
- Custom vector tiles for Brisbane River
- 3D ferry models (optional)

### 18.2 Performance Optimizations

**Web Workers:**
```typescript
// Offload GTFS parsing to Web Worker
const worker = new Worker(new URL('./gtfs-worker.ts', import.meta.url));
worker.postMessage({ type: 'PARSE_GTFS', data: gtfsZip });
worker.onmessage = (e) => {
  const parsedData = e.data;
  // Update store
};
```

**IndexedDB for GTFS:**
- Store parsed GTFS data in IndexedDB
- Query with indexes for fast lookups
- Reduce memory footprint

### 18.3 Machine Learning (v3.0+)

**Predictive ETAs:**
- Train model on historical arrival times
- Account for traffic, weather, time of day
- Improve accuracy beyond scheduled times

---

## 19. Risk Mitigation

### 19.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GTFS-RT API downtime | Medium | High | Cache last positions, show staleness warning |
| CORS issues with API | Medium | Medium | Implement Vercel serverless proxy |
| Bundle size too large | Low | Medium | Code splitting, lazy loading, tree shaking |
| Map performance on mobile | Low | Medium | Use canvas renderer, optimize markers |
| GTFS format changes | Low | High | Version detection, schema validation |
| Browser incompatibility | Low | Low | Polyfills, feature detection, graceful degradation |

### 19.2 Data Quality Risks

**Inaccurate Ferry Positions:**
- Validate lat/lon within Brisbane bounds
- Discard positions with impossible speeds
- Show confidence indicator if data quality low

**Stale Data:**
- Display "Last updated X min ago"
- Yellow warning if > 2 minutes
- Red error if > 5 minutes

---

## 20. Acceptance Criteria

### 20.1 Functional Acceptance

- [ ] Map displays all active ferries in real-time
- [ ] Ferry icons rotate to show direction of travel
- [ ] Service filter works (All/CityCat/Cross River)
- [ ] Clicking ferry shows info panel
- [ ] Clicking terminal (when ferry selected) shows ETA
- [ ] ETA calculations are accurate within 2 minutes
- [ ] All 22 terminals display correctly
- [ ] Error states handled gracefully

### 20.2 Non-Functional Acceptance

- [ ] Page loads in < 2 seconds (Lighthouse)
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] Works on iOS Safari, Chrome, Firefox
- [ ] Mobile responsive (320px - 2560px)
- [ ] No console errors in production
- [ ] WCAG 2.1 AA compliant

### 20.3 Code Quality Acceptance

- [ ] TypeScript strict mode enabled
- [ ] ESLint passes with 0 errors
- [ ] Unit test coverage > 80%
- [ ] All E2E tests passing
- [ ] No security vulnerabilities (npm audit)
- [ ] Code reviewed by 1+ developer

---

## 21. Appendices

### 21.1 Glossary

- **GTFS:** General Transit Feed Specification (static schedule data)
- **GTFS-RT:** GTFS Realtime (live vehicle positions and updates)
- **Protocol Buffers:** Binary serialization format by Google
- **CityCat:** High-frequency ferry service on main Brisbane River route
- **Cross River Ferry:** Short-route ferries connecting river banks
- **ETA:** Estimated Time of Arrival
- **Trip:** A single ferry journey from start to end
- **Stop Sequence:** Ordered list of terminals on a route
- **Bearing:** Compass direction (0-359°, 0 = North)

### 21.2 Reference Links

**APIs & Data:**
- TransLink GTFS-RT: https://translink.com.au/about-translink/open-data/gtfs-rt
- Brisbane City Council Open Data: https://www.data.brisbane.qld.gov.au/
- GTFS Specification: https://gtfs.org/
- GTFS Realtime Reference: https://gtfs.org/realtime/

**Libraries:**
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Leaflet: https://leafletjs.com/
- Zustand: https://github.com/pmndrs/zustand
- Tailwind CSS: https://tailwindcss.com/

**Tools:**
- Vercel: https://vercel.com/docs
- Playwright: https://playwright.dev/
- Vitest: https://vitest.dev/
- ESLint: https://eslint.org/

### 21.3 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-21 | Initial TRD creation | TBD |

---

## 22. Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Technical Lead | TBD | | |
| Product Owner | TBD | | |
| QA Lead | TBD | | |
| DevOps Engineer | TBD | | |

---

**END OF TECHNICAL REQUIREMENTS DOCUMENT**
