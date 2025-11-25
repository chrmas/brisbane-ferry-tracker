# Product Requirements Document (PRD)
# Brisbane River Ferry Tracker

**Version:** 1.0
**Last Updated:** November 21, 2025
**Product Owner:** TBD
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Overview
Brisbane River Ferry Tracker is a real-time web application that displays the live positions of all ferries operating on the Brisbane River network. Users can view ferry locations on an interactive map, track their movement, and get estimated arrival times at specific terminals.

### 1.2 Product Vision
To provide Brisbane commuters and visitors with an intuitive, real-time visual interface for tracking CityCat and Cross River Ferry services, improving journey planning and reducing wait times at terminals.

### 1.3 Success Metrics
- **User Engagement:** 1000+ daily active users within 3 months
- **Performance:** Map loads in < 2 seconds
- **Accuracy:** Real-time positions update within 30 seconds of TransLink API
- **Uptime:** 99%+ availability

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. Display real-time ferry positions on Brisbane River
2. Show ferry direction of travel visually
3. Provide estimated arrival times for selected ferries
4. Enable filtering between service types (CityCat vs Cross River Ferry)

### 2.2 Secondary Goals
1. Mobile-responsive design for on-the-go access
2. Accessible interface (WCAG 2.1 AA compliance)
3. Fast load times and smooth performance
4. Educational value for tourists about Brisbane's ferry network

### 2.3 Non-Goals (Out of Scope for v1.0)
- Historical tracking/playback
- User accounts or personalization
- Trip planning with multiple legs
- Integration with bus/train networks
- Offline mode
- Native mobile apps (web-only for v1.0)
- Push notifications
- Ticketing or payment integration

---

## 3. Target Audience

### 3.1 Primary Users
- **Daily Commuters:** Professionals using CityCat for work commutes
- **Casual Users:** Occasional ferry riders checking arrival times
- **Tourists:** Visitors exploring Brisbane via river transport

### 3.2 User Personas

#### Persona 1: Sarah - The Daily Commuter
- **Age:** 32
- **Occupation:** Marketing Manager
- **Goal:** Minimize wait time at ferry terminal during morning commute
- **Pain Point:** Uncertainty about when next ferry will arrive
- **Usage Pattern:** Checks app 2-3 times daily, weekdays only

#### Persona 2: James - The Tourist
- **Age:** 28
- **Occupation:** Software Engineer (visiting from Sydney)
- **Goal:** Experience Brisbane's river network, plan sightseeing
- **Pain Point:** Unfamiliar with ferry routes and schedules
- **Usage Pattern:** Occasional use during weekend visit

#### Persona 3: Maria - The Flexible Worker
- **Age:** 45
- **Occupation:** Consultant with flexible hours
- **Goal:** Choose optimal departure time based on real-time ferry positions
- **Pain Point:** Wants to avoid just-missed ferries
- **Usage Pattern:** Checks app before leaving home/office

---

## 4. User Stories

### 4.1 Core User Stories

#### US-001: View Real-Time Ferry Positions
**As a** ferry user
**I want to** see all active ferries on a map in real-time
**So that** I can understand the current state of the ferry network

**Acceptance Criteria:**
- Map displays all currently operating ferries as icons
- Ferry positions update automatically every 10-30 seconds
- Map is centered on Brisbane River with appropriate zoom level
- Ferry icons are clearly visible and distinguishable from terminal markers

---

#### US-002: See Ferry Direction of Travel
**As a** ferry user
**I want to** see which direction each ferry is traveling
**So that** I know if it's heading towards or away from my location

**Acceptance Criteria:**
- Ferry icons display directional indicator (arrow or rotated icon)
- Direction updates in real-time as ferry moves
- Direction is visually clear at default zoom level
- Upstream/downstream direction is obvious

---

#### US-003: Filter by Service Type
**As a** ferry user
**I want to** filter between CityCat and Cross River Ferry services
**So that** I can focus on the service type relevant to my journey

**Acceptance Criteria:**
- Filter control is prominently displayed on the interface
- Options: "All Services", "CityCat Only", "Cross River Ferry Only"
- Filter applies immediately without page reload
- Filtered-out ferries are hidden from map
- Terminal markers may also filter based on service type
- Current filter state is visually indicated

---

#### US-004: Select Individual Ferry
**As a** ferry user
**I want to** click on a ferry to select it
**So that** I can get detailed information about that specific ferry

**Acceptance Criteria:**
- Clicking ferry icon selects it and highlights it visually
- Selected ferry displays information panel/popup
- Panel shows: route name, current direction, next stop
- Only one ferry can be selected at a time
- Clicking map background or another ferry deselects current selection
- Selected state is clearly visible (different color, larger icon, etc.)

---

#### US-005: Get Arrival Time Estimate
**As a** ferry user
**I want to** see when a selected ferry will arrive at a specific terminal
**So that** I can plan my journey accordingly

**Acceptance Criteria:**
- When ferry is selected, user can click on any terminal marker
- System displays estimated arrival time for that ferry at selected terminal
- Estimate shown in user-friendly format (e.g., "Arrives in 8 minutes" or "12:45 PM")
- If ferry won't stop at that terminal, display clear message
- Estimate updates in real-time as ferry moves
- Calculation considers ferry's current position and route

---

#### US-006: View Ferry Terminals
**As a** ferry user
**I want to** see all ferry terminal locations on the map
**So that** I can understand the ferry network and select destinations

**Acceptance Criteria:**
- All 22 ferry terminals display as distinct markers
- Terminal markers are visually different from ferry icons
- Clicking terminal shows: name, address, accessibility info, services
- Terminals remain visible when zooming/panning
- Terminal markers respect service type filter

---

#### US-007: Mobile Access
**As a** mobile user
**I want to** use the app on my smartphone
**So that** I can check ferry positions while on the go

**Acceptance Criteria:**
- Interface adapts to mobile screen sizes (responsive design)
- Map controls are touch-friendly (minimum 44x44px tap targets)
- Page loads and performs well on mobile connections
- Text is readable without zooming
- All features work on iOS Safari and Android Chrome

---

### 4.2 Secondary User Stories

#### US-008: Understand Map Legend
**As a** first-time user
**I want to** understand what different icons and colors mean
**So that** I can interpret the map correctly

**Acceptance Criteria:**
- Legend/key explains ferry icons, terminal markers, and colors
- Legend is accessible but not obtrusive
- Legend can be toggled on/off
- Icons in legend match those on map

---

#### US-009: Pan and Zoom Map
**As a** user
**I want to** pan and zoom the map
**So that** I can focus on specific areas of the river network

**Acceptance Criteria:**
- Standard map controls (zoom buttons, pinch-to-zoom, drag to pan)
- Map stays within reasonable bounds (focused on Brisbane River area)
- Zoom levels from full network view to individual terminal detail
- Reset button returns to default view

---

#### US-010: Handle Offline/Error States
**As a** user
**I want to** see clear error messages when data is unavailable
**So that** I understand why the app isn't working

**Acceptance Criteria:**
- Display user-friendly error if API is unreachable
- Show last successful update time
- Indicate if data is stale (>2 minutes old)
- Provide refresh button to retry

---

## 5. Functional Requirements

### 5.1 Map Display

#### FR-001: Map Initialization
- **Description:** Map loads centered on Brisbane River network
- **Priority:** P0 (Critical)
- **Details:**
  - Center coordinates: -27.4698°S, 153.0251°E
  - Default zoom level: 13 (shows full CityCat route)
  - Basemap: OpenStreetMap or similar
  - Projection: Web Mercator (EPSG:3857)

#### FR-002: Ferry Icon Display
- **Description:** Active ferries displayed as icons on map
- **Priority:** P0 (Critical)
- **Details:**
  - Icon design: Ferry/boat symbol
  - Size: Visible at zoom levels 11-16
  - Color coding:
    - CityCat: Blue (#0072CE - TransLink blue)
    - Cross River Ferry: Orange (#FF6B00)
  - Icons include directional arrow/rotation
  - Z-index: Above route lines, below popups

#### FR-003: Terminal Marker Display
- **Description:** All ferry terminals shown as markers
- **Priority:** P0 (Critical)
- **Details:**
  - Icon design: Anchor or dock symbol
  - Color: Neutral gray (#757575) when not selected
  - Active color: Green (#4CAF50) when clicked
  - Labels: Terminal name shown on hover or at high zoom
  - 22 terminals total (from Brisbane City Council data)

#### FR-004: Route Line Display
- **Description:** Ferry routes shown as lines on map
- **Priority:** P1 (High)
- **Details:**
  - Line width: 3-4px
  - Color: Semi-transparent blue (#0072CE, 40% opacity)
  - Style: Solid line for CityCat, dashed for Cross River
  - Data source: GTFS shapes.txt
  - Z-index: Below ferry icons

### 5.2 Real-Time Data Updates

#### FR-005: Fetch Vehicle Positions
- **Description:** Retrieve real-time ferry positions from TransLink API
- **Priority:** P0 (Critical)
- **Details:**
  - Endpoint: `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions`
  - Format: GTFS-RT Protocol Buffers
  - Update interval: 15 seconds
  - Timeout: 10 seconds
  - Retry logic: 3 attempts with exponential backoff

#### FR-006: Parse and Filter Data
- **Description:** Extract ferry-only data from API response
- **Priority:** P0 (Critical)
- **Details:**
  - Filter vehicles where route_type = 4 (Ferry)
  - Extract: vehicle_id, lat, lon, bearing, speed, route_id, trip_id
  - Match route_id to GTFS static data for service type
  - Handle missing/malformed data gracefully

#### FR-007: Animate Ferry Movement
- **Description:** Smoothly move ferry icons between position updates
- **Priority:** P2 (Medium)
- **Details:**
  - Interpolate position between API updates
  - Animation duration: 15 seconds (matching update interval)
  - Easing: Linear for constant speed
  - Update bearing/rotation during animation

### 5.3 User Interactions

#### FR-008: Ferry Selection
- **Description:** User can click ferry to select it
- **Priority:** P0 (Critical)
- **Details:**
  - Click target: Minimum 44x44px for touch devices
  - Selected state: Larger icon, different color, or outline
  - Info panel appears showing:
    - Route name (e.g., "CityCat - Upstream")
    - Current speed (if available)
    - Next scheduled stop
    - Direction (Upstream/Downstream or Cross River)
  - Deselect: Click map background, other ferry, or close button

#### FR-009: Terminal Selection for ETA
- **Description:** User clicks terminal to get arrival estimate for selected ferry
- **Priority:** P0 (Critical)
- **Details:**
  - Only active when a ferry is selected
  - Visual indicator: Cursor changes to pointer over terminals
  - Tooltip/hint: "Click terminal to see arrival time"
  - Display results in modal, popup, or side panel

#### FR-010: Service Type Filter
- **Description:** Toggle between All, CityCat, Cross River Ferry
- **Priority:** P0 (Critical)
- **Details:**
  - UI element: Button group or dropdown
  - Options:
    1. "All Services" (default)
    2. "CityCat Only"
    3. "Cross River Ferry Only"
  - Behavior:
    - Filter applies to both ferries and terminals
    - Maintains selection if possible (deselect if filtered out)
    - State persists in URL query parameter
  - Position: Top-right or top-left of map

### 5.4 Arrival Time Calculation

#### FR-011: ETA Algorithm
- **Description:** Calculate estimated arrival time for ferry at selected terminal
- **Priority:** P0 (Critical)
- **Details:**
  - **Inputs:**
    - Ferry current position (lat, lon)
    - Ferry current trip_id
    - Target terminal position
    - GTFS stop_times.txt (scheduled times)
  - **Method:**
    - Check if terminal is on ferry's current route
    - Calculate distance along route from current position to terminal
    - Use GTFS-RT trip updates for delay information
    - Fallback to scheduled time if no real-time data
  - **Output:**
    - "Arrives in X minutes" (if < 60 min)
    - "Arrives at HH:MM AM/PM" (if > 60 min)
    - "Does not stop at this terminal" (if not on route)
  - **Edge cases:**
    - Ferry already passed terminal: "Departed X minutes ago"
    - Ferry not in service: "Not in service"
    - Data unavailable: "Estimate unavailable"

#### FR-012: ETA Display
- **Description:** Show arrival estimate to user
- **Priority:** P0 (Critical)
- **Details:**
  - Display method: Modal, popup, or info panel
  - Information shown:
    - Ferry name/route
    - Terminal name
    - Estimated arrival time
    - Distance/stops until arrival (optional)
  - Auto-update: Recalculate every 30 seconds while displayed
  - Close action: X button, click outside, or ESC key

### 5.5 Static Data Management

#### FR-013: GTFS Static Data Loading
- **Description:** Load and parse GTFS static data on initialization
- **Priority:** P0 (Critical)
- **Details:**
  - Source: `https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip`
  - Files needed:
    - routes.txt (route names, types)
    - trips.txt (trip IDs, route IDs)
    - stops.txt (terminal locations, names)
    - stop_times.txt (schedules)
    - shapes.txt (route geometries)
  - Storage: Browser IndexedDB or in-memory
  - Update frequency: Daily or weekly
  - Fallback: Bundled version if download fails

#### FR-014: Ferry Terminal Data Loading
- **Description:** Load terminal locations and metadata
- **Priority:** P0 (Critical)
- **Details:**
  - Source: Brisbane City Council Open Data API
  - Fields: name, lat, lon, accessibility, parking, services
  - Format: GeoJSON or JSON
  - Caching: LocalStorage with 24-hour TTL

---

## 6. Non-Functional Requirements

### 6.1 Performance

#### NFR-001: Page Load Time
- **Requirement:** Initial page load completes in < 2 seconds on 4G connection
- **Measurement:** Lighthouse Performance score > 90
- **Priority:** P0

#### NFR-002: Map Responsiveness
- **Requirement:** Map pans and zooms at 60 FPS
- **Priority:** P1

#### NFR-003: Real-Time Update Latency
- **Requirement:** Ferry positions update within 30 seconds of TransLink API
- **Priority:** P0

#### NFR-004: Bundle Size
- **Requirement:** Initial JavaScript bundle < 300 KB (gzipped)
- **Priority:** P1

### 6.2 Scalability

#### NFR-005: Concurrent Users
- **Requirement:** Support 1000+ concurrent users without degradation
- **Priority:** P1
- **Implementation:** Client-side rendering, static hosting, CDN

#### NFR-006: API Rate Limits
- **Requirement:** Respect TransLink API (no documented limit, use reasonable polling)
- **Priority:** P0
- **Implementation:** 15-second polling interval, backend proxy if needed

### 6.3 Reliability

#### NFR-007: Uptime
- **Requirement:** 99% uptime (< 7.2 hours downtime/month)
- **Priority:** P1
- **Monitoring:** Uptime checks, error tracking (Sentry)

#### NFR-008: Error Handling
- **Requirement:** All API failures handled gracefully with user feedback
- **Priority:** P0

#### NFR-009: Data Staleness
- **Requirement:** Alert user if data is > 2 minutes old
- **Priority:** P1

### 6.4 Usability

#### NFR-010: Mobile Responsiveness
- **Requirement:** Fully functional on screens 320px wide and above
- **Priority:** P0
- **Breakpoints:** 320px (mobile), 768px (tablet), 1024px (desktop)

#### NFR-011: Accessibility
- **Requirement:** WCAG 2.1 AA compliance
- **Priority:** P1
- **Details:**
  - Keyboard navigation support
  - Screen reader compatibility
  - Color contrast ratios ≥ 4.5:1
  - ARIA labels on interactive elements

#### NFR-012: Browser Support
- **Requirement:** Works on latest 2 versions of major browsers
- **Priority:** P0
- **Browsers:**
  - Chrome/Edge (Chromium)
  - Firefox
  - Safari (iOS and macOS)

### 6.5 Security

#### NFR-013: HTTPS
- **Requirement:** All traffic over HTTPS
- **Priority:** P0

#### NFR-014: No User Data Collection
- **Requirement:** No personal data stored or transmitted (privacy-focused)
- **Priority:** P0
- **Exception:** Anonymous analytics (page views, feature usage)

#### NFR-015: API Key Security
- **Requirement:** If API keys needed, stored in environment variables, not client code
- **Priority:** P0
- **Note:** TransLink API requires no authentication currently

### 6.6 Maintainability

#### NFR-016: Code Quality
- **Requirement:** ESLint/Prettier configured, all code passes linting
- **Priority:** P1

#### NFR-017: Documentation
- **Requirement:** README with setup instructions, architecture diagram
- **Priority:** P1

#### NFR-018: Testing
- **Requirement:**
  - Unit tests for utility functions (ETA calculation, data parsing)
  - Integration tests for API interactions
  - E2E tests for critical user flows
- **Priority:** P2

---

## 7. User Interface Specifications

### 7.1 Layout

#### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────┐
│ Header                                              │
│ [Brisbane Ferry Tracker]           [About] [Help]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Filter: ⚫All ○CityCat ○Cross River]              │
│  ┌─────────────────────────────────────────┐       │
│  │                                         │       │
│  │                                         │       │
│  │                                         │       │
│  │          MAP AREA                       │       │
│  │        (Full Screen)                    │       │
│  │                                         │       │
│  │                                         │       │
│  │                                         │       │
│  │  [Legend]  [Zoom +/-]  [Reset View]    │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  Info Panel (appears when ferry selected):         │
│  ┌─────────────────────────────────────────┐       │
│  │ 🚢 CityCat - Upstream           [×]     │       │
│  │ Next Stop: Riverside                    │       │
│  │ Click a terminal to see arrival time    │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Footer: Data © TransLink QLD | Map © OSM           │
└─────────────────────────────────────────────────────┘
```

#### Mobile Layout (<768px)
```
┌───────────────────┐
│ Brisbane Ferries  │
│ [☰]               │
├───────────────────┤
│                   │
│ [Filter ▼]        │
│                   │
│                   │
│                   │
│    MAP            │
│   (Full           │
│    Screen)        │
│                   │
│                   │
│ [+]               │
│ [-]               │
│                   │
└───────────────────┘
│ Ferry Info Panel  │
│ (slides up)       │
└───────────────────┘
```

### 7.2 Visual Design

#### Color Palette
- **Primary:** #0072CE (TransLink Blue) - CityCat services
- **Secondary:** #FF6B00 (Orange) - Cross River Ferry
- **Success:** #4CAF50 (Green) - Selected terminals
- **Text:** #212121 (Dark Gray)
- **Text Secondary:** #757575 (Medium Gray)
- **Background:** #FFFFFF (White)
- **Map Background:** OpenStreetMap default colors

#### Typography
- **Font Family:**
  - Primary: "Segoe UI", "Roboto", "Helvetica Neue", sans-serif
  - Monospace: "Courier New", monospace (for times)
- **Sizes:**
  - H1 (App Title): 24px / 1.5rem
  - H2 (Panel Headers): 18px / 1.125rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem
  - Caption: 12px / 0.75rem

#### Icons
- **Ferry Icon:** Custom SVG boat/ferry shape with directional arrow
- **Terminal Icon:** Anchor or dock symbol
- **Filter Icons:** Service type badges
- **Map Controls:** Standard +/- zoom, compass, home button

### 7.3 Components

#### Component 1: Service Filter
- **Type:** Button group (radio-style)
- **States:** All (default), CityCat, Cross River
- **Appearance:**
  - Pills/rounded buttons
  - Active state: Filled with service color
  - Inactive state: Outline only
- **Position:** Top-left corner, above map
- **Mobile:** Dropdown select to save space

#### Component 2: Ferry Icon (Map Marker)
- **Default State:**
  - Size: 32x32px
  - Color: Blue (CityCat) or Orange (Cross River)
  - Rotation: Based on bearing from API
  - Shape: Ferry silhouette with arrow
- **Hover State:**
  - Size: 36x36px
  - Cursor: pointer
  - Tooltip: Route name
- **Selected State:**
  - Size: 40x40px
  - Border: 2px white outline
  - Pulsing animation (subtle)

#### Component 3: Terminal Marker
- **Default State:**
  - Size: 24x24px
  - Color: Gray (#757575)
  - Shape: Circular with anchor icon
- **Hover State (when ferry selected):**
  - Size: 28x28px
  - Color: Light green
  - Cursor: pointer
  - Tooltip: Terminal name
- **Active State (clicked for ETA):**
  - Color: Green (#4CAF50)
  - Border: 2px white

#### Component 4: Info Panel
- **Trigger:** Ferry selection
- **Position:**
  - Desktop: Overlay on map, bottom-left
  - Mobile: Slide-up sheet from bottom
- **Content:**
  - Ferry icon with route name
  - Current direction
  - Next stop
  - Instruction: "Click a terminal to see arrival time"
  - Close button (X)
- **Dimensions:**
  - Desktop: 320px wide, auto height
  - Mobile: Full width, min 150px height

#### Component 5: ETA Modal
- **Trigger:** Terminal click while ferry selected
- **Position:** Center of screen (desktop) or slide-up (mobile)
- **Content:**
  - Ferry route name
  - Terminal name
  - "Arrives in X minutes" or "Arrives at HH:MM"
  - Optional: Distance, number of stops
  - Close button
- **Dimensions:** 400px wide (desktop), 90% width (mobile)
- **Background:** Semi-transparent overlay (rgba(0,0,0,0.5))

#### Component 6: Legend
- **Trigger:** Legend button or always visible
- **Position:** Bottom-right corner
- **Content:**
  - Ferry icons (CityCat, Cross River)
  - Terminal icon
  - Route line samples
  - Color explanations
- **Dimensions:** 200px wide, auto height
- **Collapsible:** Yes (click to toggle)

#### Component 7: Map Controls
- **Zoom Controls:** +/- buttons, vertical stack
- **Reset View:** Home icon button
- **Position:** Right side of map
- **Styling:** White background, subtle shadow
- **Mobile:** Slightly larger tap targets (48x48px)

### 7.4 Interactions & Animations

#### Animation 1: Ferry Movement
- **Type:** Position interpolation
- **Duration:** 15 seconds (between API updates)
- **Easing:** Linear
- **Behavior:** Smooth transition from old to new position

#### Animation 2: Ferry Selection
- **Type:** Scale + pulse
- **Duration:** 300ms
- **Behavior:** Icon grows to selected size, subtle pulse every 2s

#### Animation 3: Info Panel Appearance
- **Desktop:** Fade in + slide up (200ms, ease-out)
- **Mobile:** Slide up from bottom (300ms, ease-out)

#### Animation 4: Modal Appearance
- **Desktop:** Fade in background (200ms) + scale modal (300ms, ease-out)
- **Mobile:** Slide up from bottom (300ms, ease-out)

#### Animation 5: Filter Change
- **Type:** Cross-fade
- **Duration:** 200ms
- **Behavior:** Old ferries fade out, new ferries fade in

---

## 8. Technical Architecture

### 8.1 Technology Stack

#### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Map Library:** Leaflet.js or MapLibre GL JS
- **State Management:** React Context API or Zustand
- **Styling:** Tailwind CSS or CSS Modules
- **Data Fetching:** Native fetch API with custom hooks
- **GTFS-RT Parsing:** gtfs-realtime-bindings (npm)

#### Backend (Optional Proxy)
- **Runtime:** Node.js 20+ or Cloudflare Workers
- **Framework:** Express.js or Hono
- **Purpose:**
  - Proxy GTFS-RT API (if CORS issues)
  - Cache static GTFS data
  - Pre-filter ferry-only data

#### Infrastructure
- **Hosting:** Vercel, Netlify, or Cloudflare Pages
- **CDN:** Automatic via hosting provider
- **Analytics:** Plausible or Simple Analytics (privacy-focused)
- **Monitoring:** Sentry for error tracking
- **CI/CD:** GitHub Actions

### 8.2 Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                      │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  React App                                 │   │
│  │                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │ Map Component│  │ Ferry State  │      │   │
│  │  │  (Leaflet)   │◄─┤  (Context)   │      │   │
│  │  └──────────────┘  └──────────────┘      │   │
│  │         ▲                  ▲              │   │
│  │         │                  │              │   │
│  │  ┌──────┴───────┐  ┌──────┴────────┐    │   │
│  │  │ UI Controls  │  │ Data Fetcher  │    │   │
│  │  │ (Filter,etc) │  │ (15s interval)│    │   │
│  │  └──────────────┘  └───────┬────────┘    │   │
│  │                            │              │   │
│  └────────────────────────────┼──────────────┘   │
│                               │                  │
└───────────────────────────────┼──────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │  TransLink GTFS-RT    │
                    │  Vehicle Positions    │
                    │  API                  │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌───────▼────────┐    ┌────────▼───────┐
            │ GTFS Static    │    │ BCC Ferry      │
            │ Data (ZIP)     │    │ Terminals API  │
            └────────────────┘    └────────────────┘
```

### 8.3 Key Algorithms

#### Algorithm 1: Ferry Position Update
```typescript
// Pseudocode
async function updateFerryPositions() {
  // 1. Fetch GTFS-RT data
  const response = await fetch(GTFS_RT_URL);
  const buffer = await response.arrayBuffer();
  const feed = parseFeedMessage(buffer);

  // 2. Filter for ferries only
  const ferries = feed.entity
    .filter(e => e.vehicle && isFerryRoute(e.vehicle.trip.routeId))
    .map(e => ({
      id: e.vehicle.vehicle.id,
      position: e.vehicle.position,
      trip: e.vehicle.trip,
      timestamp: e.vehicle.timestamp,
    }));

  // 3. Update state
  setFerryState(ferries);

  // 4. Animate to new positions
  animateFerries(ferries);
}

// Schedule every 15 seconds
setInterval(updateFerryPositions, 15000);
```

#### Algorithm 2: ETA Calculation
```typescript
// Pseudocode
function calculateETA(ferry: Ferry, terminal: Terminal): ETAResult {
  // 1. Verify terminal is on ferry's route
  const route = getRoute(ferry.tripId);
  const stopSequence = getStopSequence(route);

  if (!stopSequence.includes(terminal.stopId)) {
    return { status: 'not-on-route' };
  }

  // 2. Get current position in sequence
  const currentStopIndex = getCurrentStopIndex(ferry, stopSequence);
  const targetStopIndex = stopSequence.indexOf(terminal.stopId);

  // 3. Check if already passed
  if (targetStopIndex <= currentStopIndex) {
    return { status: 'passed', time: getLastDepartureTime(ferry, terminal) };
  }

  // 4. Calculate based on GTFS-RT trip updates
  const tripUpdate = getTripUpdate(ferry.tripId);
  if (tripUpdate && tripUpdate.stopTimeUpdate) {
    const stopUpdate = tripUpdate.stopTimeUpdate.find(
      su => su.stopId === terminal.stopId
    );
    if (stopUpdate && stopUpdate.arrival) {
      return {
        status: 'realtime',
        time: stopUpdate.arrival.time,
        delay: stopUpdate.arrival.delay,
      };
    }
  }

  // 5. Fallback to scheduled time + average delay
  const scheduledTime = getScheduledArrival(ferry.tripId, terminal.stopId);
  const avgDelay = getAverageDelay(ferry.routeId);

  return {
    status: 'scheduled',
    time: scheduledTime + avgDelay,
  };
}
```

### 8.4 Data Models

#### Ferry Model
```typescript
interface Ferry {
  id: string;                 // Vehicle ID
  routeId: string;            // Route identifier (e.g., "F1")
  routeName: string;          // Human-readable name
  serviceType: 'citycat' | 'cross-river';
  position: {
    lat: number;
    lon: number;
    bearing: number;          // 0-359 degrees
    speed: number;            // m/s
  };
  trip: {
    tripId: string;
    headsign: string;         // "Upstream" / "Downstream"
    direction: 0 | 1;
  };
  timestamp: number;          // Unix timestamp
  nextStop?: string;          // Stop ID
}
```

#### Terminal Model
```typescript
interface Terminal {
  stopId: string;             // From GTFS
  name: string;
  position: {
    lat: number;
    lon: number;
  };
  address: string;
  suburb: string;
  services: ('citycat' | 'cross-river')[];
  accessibility: {
    wheelchairAccessible: boolean;
    parking: boolean;
  };
  nearbyBusRoutes: string[];
}
```

#### ETA Result Model
```typescript
interface ETAResult {
  status: 'realtime' | 'scheduled' | 'not-on-route' | 'passed';
  time?: number;              // Unix timestamp
  delay?: number;             // Seconds
  displayText: string;        // "Arrives in 8 min" or "Does not stop here"
}
```

### 8.5 State Management

```typescript
// Global State (React Context or Zustand)
interface AppState {
  // Ferry data
  ferries: Ferry[];
  selectedFerry: Ferry | null;

  // Terminal data
  terminals: Terminal[];
  selectedTerminal: Terminal | null;

  // UI state
  filterService: 'all' | 'citycat' | 'cross-river';
  mapCenter: [number, number];
  mapZoom: number;
  showLegend: boolean;

  // Data status
  lastUpdate: number;
  isLoading: boolean;
  error: Error | null;

  // ETA
  currentETA: ETAResult | null;

  // Actions
  setFilterService: (filter: FilterType) => void;
  selectFerry: (ferry: Ferry | null) => void;
  selectTerminal: (terminal: Terminal | null) => void;
  updateFerries: (ferries: Ferry[]) => void;
  calculateETA: (ferry: Ferry, terminal: Terminal) => void;
}
```

---

## 9. API Integration

### 9.1 TransLink GTFS-RT API

#### Endpoint 1: Vehicle Positions
- **URL:** `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions`
- **Method:** GET
- **Authentication:** None
- **Response Format:** Protocol Buffer (GTFS-RT)
- **Polling Interval:** 15 seconds
- **Error Handling:**
  - Timeout: 10 seconds
  - Retry: 3 attempts with exponential backoff
  - Fallback: Show last known positions with staleness warning

#### Endpoint 2: Trip Updates
- **URL:** `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates`
- **Method:** GET
- **Purpose:** Real-time arrival predictions
- **Polling Interval:** 30 seconds (less frequent than positions)

### 9.2 GTFS Static Data

#### Resource: SEQ GTFS ZIP
- **URL:** `https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip`
- **Update Frequency:** Daily or weekly
- **Files Used:**
  - `routes.txt` - Route information
  - `trips.txt` - Trip definitions
  - `stops.txt` - Terminal locations
  - `stop_times.txt` - Schedules
  - `shapes.txt` - Route geometries (optional)
- **Caching Strategy:**
  - Download on app initialization
  - Store in IndexedDB
  - Check for updates daily via ETag or Last-Modified header
  - Fallback: Bundled static copy in app

### 9.3 Brisbane City Council Ferry Terminals API

#### Endpoint: Ferry Terminals Dataset
- **URL:** `https://prod-brisbane-queensland.opendatasoft.com/api/records/1.0/search/?dataset=ferry-terminals&rows=100`
- **Method:** GET
- **Response Format:** JSON
- **Update Frequency:** Once on load (data rarely changes)
- **Caching:** LocalStorage with 7-day TTL

---

## 10. User Experience Flows

### 10.1 Primary Flow: Check Ferry Arrival Time

```
User Story: Sarah wants to know when the next CityCat will arrive at Riverside terminal

1. User opens app
   └─> Map loads, showing all ferries and terminals

2. User clicks filter: "CityCat Only"
   └─> Map updates to show only CityCats
   └─> Cross River ferries disappear

3. User identifies nearest CityCat heading towards Riverside
   └─> Clicks on ferry icon

4. Ferry is selected
   └─> Icon enlarges and highlights
   └─> Info panel appears: "CityCat - Upstream, Next Stop: North Quay"
   └─> Message: "Click a terminal to see arrival time"

5. User clicks on Riverside terminal marker
   └─> ETA modal appears
   └─> Shows: "Arrives at Riverside in 8 minutes"

6. User notes the time, closes modal
   └─> Clicks X or taps outside modal
   └─> Returns to map view

Success: User knows ferry arrives in 8 minutes
```

### 10.2 Secondary Flow: Explore Ferry Network

```
User Story: James (tourist) wants to explore the ferry route

1. User opens app
   └─> Map shows all ferries and terminals

2. User pans and zooms map
   └─> Explores Brisbane River visually
   └─> Sees route lines connecting terminals

3. User clicks terminal marker (e.g., South Bank)
   └─> Popup shows: Terminal name, address, accessibility info

4. User clicks different ferries to see where they're going
   └─> Info panel updates with each selection
   └─> User understands Upstream vs Downstream directions

5. User clicks "Legend" to understand icon meanings
   └─> Legend panel appears explaining colors and symbols

Success: User understands ferry network layout and services
```

### 10.3 Error Flow: No Data Available

```
Scenario: API is down or network connection lost

1. User opens app
   └─> Map loads with basemap

2. App attempts to fetch ferry positions
   └─> Request times out after 10 seconds

3. App retries (3 attempts)
   └─> All attempts fail

4. Error message appears
   └─> "Unable to load ferry positions. Please check your connection."
   └─> Refresh button provided

5. User clicks Refresh
   └─> App retries fetch

6a. If successful:
    └─> Ferries appear, error message disappears

6b. If still failing:
    └─> Error persists
    └─> User can still explore static map and terminals
```

---

## 11. Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Basic map with static data

**Deliverables:**
- [ ] Project setup (React + Vite + TypeScript)
- [ ] Map integration (Leaflet.js)
- [ ] Load and display ferry terminals from BCC API
- [ ] Basic UI layout (header, map, footer)
- [ ] Responsive design (mobile + desktop)
- [ ] Attribution/licensing text

**Success Criteria:**
- Map displays 22 ferry terminals correctly
- App works on mobile and desktop
- Page loads in < 2 seconds

---

### Phase 2: Real-Time Ferries (Week 3-4)
**Goal:** Show live ferry positions

**Deliverables:**
- [ ] GTFS-RT API integration
- [ ] Protocol Buffer parsing
- [ ] Ferry data filtering (route_type = 4)
- [ ] Ferry icons on map with rotation
- [ ] Auto-update every 15 seconds
- [ ] Animation between updates
- [ ] Error handling and retry logic

**Success Criteria:**
- Ferries appear on map in correct positions
- Icons rotate to show direction
- Positions update smoothly
- No crashes if API fails

---

### Phase 3: Interactions (Week 5)
**Goal:** User can select ferries and terminals

**Deliverables:**
- [ ] Service type filter (All/CityCat/Cross River)
- [ ] Ferry selection interaction
- [ ] Info panel for selected ferry
- [ ] Terminal click interaction
- [ ] Map controls (zoom, reset)
- [ ] Legend component

**Success Criteria:**
- Filter works and updates map immediately
- User can select any ferry
- Info panel shows correct route information
- All interactions work on mobile

---

### Phase 4: ETA Calculation (Week 6-7)
**Goal:** Calculate and display arrival times

**Deliverables:**
- [ ] GTFS static data loading (routes, trips, stop_times)
- [ ] ETA algorithm implementation
- [ ] GTFS-RT trip updates integration
- [ ] ETA modal/display component
- [ ] Real-time ETA updates
- [ ] Edge case handling (passed stop, not on route, etc.)

**Success Criteria:**
- ETA calculation is accurate within 2 minutes
- All edge cases handled gracefully
- ETA updates while modal is open
- Clear messaging for all scenarios

---

### Phase 5: Polish & Launch (Week 8-9)
**Goal:** Production-ready application

**Deliverables:**
- [ ] Performance optimization
- [ ] Accessibility audit and fixes
- [ ] Cross-browser testing
- [ ] Analytics integration
- [ ] Error monitoring (Sentry)
- [ ] SEO optimization
- [ ] User documentation/help page
- [ ] Deployment to production

**Success Criteria:**
- Lighthouse scores: Performance > 90, Accessibility > 90
- Works on all major browsers
- Zero critical bugs
- Deployed and accessible

---

### Phase 6: Enhancements (Post-Launch)
**Goal:** Additional features based on user feedback

**Potential Features:**
- [ ] Route lines on map
- [ ] Multiple ferry selection/comparison
- [ ] Favorite terminals (LocalStorage)
- [ ] Share location feature
- [ ] PWA support (offline map, install prompt)
- [ ] Dark mode
- [ ] Service alerts display
- [ ] Historical data (if API provides)
- [ ] Trip planner (multi-leg journeys)

---

## 12. Testing Strategy

### 12.1 Unit Tests
**Scope:** Individual functions and utilities

**Test Cases:**
- GTFS-RT parsing functions
- ETA calculation algorithm
- Data filtering logic
- Time formatting utilities
- Coordinate transformations

**Tools:** Jest, Vitest

### 12.2 Integration Tests
**Scope:** API interactions and data flow

**Test Cases:**
- GTFS-RT API fetch and parse
- GTFS static data loading
- Ferry terminals API fetch
- State management (ferry selection, filtering)

**Tools:** Jest + MSW (Mock Service Worker)

### 12.3 End-to-End Tests
**Scope:** Critical user flows

**Test Cases:**
1. Load app and see ferries
2. Filter by service type
3. Select ferry and view info
4. Click terminal and see ETA
5. Mobile responsive interactions

**Tools:** Playwright or Cypress

### 12.4 Manual Testing
**Scope:** Visual, UX, cross-browser

**Test Matrix:**
| Device | Browser | Viewport |
|--------|---------|----------|
| Desktop | Chrome | 1920x1080 |
| Desktop | Firefox | 1920x1080 |
| Desktop | Safari | 1920x1080 |
| Mobile | iOS Safari | 375x667 |
| Mobile | Android Chrome | 360x640 |
| Tablet | iPad Safari | 768x1024 |

**Checklist:**
- [ ] All ferry icons visible
- [ ] Animations smooth
- [ ] Filter works correctly
- [ ] ETA calculations accurate
- [ ] Error states display properly
- [ ] Loading states work
- [ ] Touch interactions responsive

### 12.5 Accessibility Testing
**Tools:** axe DevTools, WAVE, Screen reader (NVDA/VoiceOver)

**Checklist:**
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader announcements
- [ ] Color contrast ratios
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Alt text for icons

### 12.6 Performance Testing
**Tools:** Lighthouse, WebPageTest

**Metrics:**
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] TTI (Time to Interactive) < 3.8s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Bundle size < 300KB gzipped

---

## 13. Launch Checklist

### Pre-Launch
- [ ] All Phase 1-5 deliverables complete
- [ ] Test suite passing (unit, integration, e2e)
- [ ] Manual testing on all target devices/browsers
- [ ] Accessibility audit complete, WCAG AA compliant
- [ ] Performance benchmarks met (Lighthouse > 90)
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured (privacy-focused)
- [ ] Domain registered (if custom domain)
- [ ] SSL certificate configured
- [ ] README and documentation complete
- [ ] Terms of service / privacy policy (if needed)
- [ ] Attribution text for data sources
- [ ] Meta tags for SEO and social sharing

### Launch
- [ ] Deploy to production (Vercel/Netlify)
- [ ] DNS configured and propagated
- [ ] Smoke test production environment
- [ ] Monitor error tracking
- [ ] Share with initial users for feedback

### Post-Launch
- [ ] Monitor analytics for usage patterns
- [ ] Track error rates and performance
- [ ] Collect user feedback
- [ ] Create public issue tracker (GitHub Issues)
- [ ] Plan Phase 6 enhancements based on feedback
- [ ] Announce on social media / Brisbane forums

---

## 14. Success Metrics & KPIs

### 14.1 Usage Metrics
- **Daily Active Users (DAU):** Target 500+ within month 1
- **Monthly Active Users (MAU):** Target 3,000+ within month 3
- **Session Duration:** Average > 2 minutes
- **Bounce Rate:** < 40%

### 14.2 Performance Metrics
- **Page Load Time:** P95 < 2.5 seconds
- **API Response Time:** P95 < 500ms
- **Error Rate:** < 1% of requests
- **Uptime:** > 99%

### 14.3 Engagement Metrics
- **Ferry Selections:** Average 3+ per session
- **ETA Queries:** Average 2+ per session
- **Filter Usage:** 40%+ of sessions use filter
- **Mobile vs Desktop:** Track ratio for optimization

### 14.4 Business Metrics (Long-term)
- **User Retention:** 30% return within 7 days
- **Word-of-mouth:** Direct traffic > 20%
- **Community Engagement:** GitHub stars, forum mentions
- **Potential monetization:** Premium features (Phase 7+)

---

## 15. Risk Assessment

### 15.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| TransLink API downtime | Medium | High | Cache last known positions, show staleness warning |
| API rate limiting introduced | Low | High | Implement backend proxy, reduce polling frequency |
| CORS restrictions | Medium | Medium | Backend proxy or CORS proxy service |
| GTFS data format changes | Low | High | Version detection, graceful degradation |
| Browser compatibility issues | Low | Medium | Thorough cross-browser testing, polyfills |
| Performance on low-end devices | Medium | Medium | Optimize bundle size, lazy loading, canvas rendering |

### 15.2 User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ETA inaccuracy | Medium | High | Clear disclaimer, show confidence level, use trip updates |
| Confusing UI for first-time users | Medium | Medium | Onboarding tutorial, clear instructions, legend |
| Mobile performance issues | Low | Medium | Responsive testing, touch-friendly controls |
| Accessibility barriers | Low | High | WCAG compliance, screen reader testing |

### 15.3 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low user adoption | Medium | High | Marketing, SEO, partnerships with Brisbane tourism |
| Competing apps | Low | Low | Focus on superior UX, unique features |
| Data licensing changes | Low | Medium | Monitor TransLink announcements, have contingency |

---

## 16. Assumptions & Dependencies

### 16.1 Assumptions
1. TransLink GTFS-RT API remains free and open
2. API data quality is sufficient for real-time tracking
3. Users have modern browsers (last 2 versions)
4. Mobile users have reasonable data connections (3G+)
5. Brisbane City Council terminal data remains available
6. GTFS specification remains stable

### 16.2 Dependencies
1. **TransLink Queensland:** GTFS-RT and static data APIs
2. **Brisbane City Council:** Ferry terminal location data
3. **OpenStreetMap:** Basemap tiles (or alternative provider)
4. **Third-party libraries:**
   - Leaflet.js or MapLibre GL JS
   - gtfs-realtime-bindings
   - React ecosystem
5. **Hosting provider:** Vercel, Netlify, or similar
6. **CDN:** For fast global asset delivery

---

## 17. Future Roadmap (Beyond v1.0)

### v1.1 - Enhanced Information (Q1 2026)
- Service alerts and disruption notices
- Historical on-time performance
- Crowding indicators (if data available)
- Weather integration (affects ferry service)

### v1.2 - Personalization (Q2 2026)
- Favorite terminals (saved in LocalStorage)
- Notifications for ferry approaching saved terminal
- Custom map views (save zoom/position)
- Recent searches

### v2.0 - Advanced Features (Q3 2026)
- Trip planner (multi-leg with bus/train)
- Offline mode (PWA with cached data)
- Dark mode
- Multi-language support (Chinese, Japanese for tourists)
- Integration with other Brisbane transport (bus, train)

### v2.1 - Community Features (Q4 2026)
- User-submitted ferry photos/reviews
- Real-time crowding reports from users
- Social sharing of routes/trips
- Gamification (ferry enthusiast badges)

### v3.0 - Predictive & AI (2027)
- ML-based ETA predictions (more accurate than scheduled)
- Demand forecasting
- Route optimization suggestions
- Historical pattern analysis

---

## 18. Appendices

### Appendix A: Glossary
- **CityCat:** High-frequency ferry service along main Brisbane River route
- **Cross River Ferry:** Short-route ferries connecting river banks
- **GTFS:** General Transit Feed Specification (static schedule data)
- **GTFS-RT:** GTFS Realtime (live vehicle positions and updates)
- **ETA:** Estimated Time of Arrival
- **Terminal:** Ferry stop/wharf/station
- **Trip:** A single ferry journey from start to end of route
- **Route:** The overall service pattern (e.g., CityCat Upstream)

### Appendix B: References
- TransLink Open Data: https://translink.com.au/about-translink/open-data
- GTFS Specification: https://gtfs.org/
- GTFS Realtime: https://gtfs.org/realtime/
- Brisbane City Council Open Data: https://www.data.brisbane.qld.gov.au/
- Leaflet.js Documentation: https://leafletjs.com/
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### Appendix C: Contact Information
- **Product Owner:** [TBD]
- **Tech Lead:** [TBD]
- **Designer:** [TBD]
- **Data Source Support:** opendata@translink.com.au

### Appendix D: Changelog
- **v1.0 (2025-11-21):** Initial PRD creation

---

## 19. Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | TBD | | |
| Tech Lead | TBD | | |
| Designer | TBD | | |
| Stakeholder | TBD | | |

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**
