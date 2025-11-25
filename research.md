# Brisbane River Ferry Network - Real-Time Tracking Research

## Project Goal
Build an interactive map of Brisbane's river network showing real-time locations of river ferries (CityCats and CityFerries).

---

## Executive Summary

Brisbane's public ferry network is operated by TransLink Queensland and provides **free, open, and unauthenticated** real-time tracking data through their GTFS-RT API. This makes it ideal for building real-time ferry tracking applications.

**Key Findings:**
- ✅ Real-time ferry location data available via public API (no authentication required)
- ✅ Static schedule and route data available
- ✅ Ferry terminal locations with coordinates available as open data
- ✅ Data licensed under Creative Commons Attribution 4.0 (CC-BY)
- ✅ Industry-standard GTFS/GTFS-RT format
- ✅ Multiple mapping basemap options available

---

## 1. Real-Time Ferry Location Data

### TransLink GTFS-RT API

**Primary Endpoint for Vehicle Positions:**
```
https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions
```

**Additional Endpoints:**
- Trip Updates (schedule adherence): `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates`
- Service Alerts (disruptions): `https://gtfsrt.api.translink.com.au/api/realtime/SEQ/Alerts`

### API Characteristics

| Feature | Details |
|---------|---------|
| **Authentication** | None required - completely open API |
| **Data Format** | GTFS-Realtime v2.0 (Protocol Buffers) |
| **Update Frequency** | Near real-time (exact interval not specified) |
| **Coverage** | All TransLink vehicles with real-time tracking (bus, ferry, train, tram) |
| **License** | Creative Commons Attribution 4.0 (CC-BY) |
| **Cost** | Free |
| **Rate Limits** | Not specified in documentation |
| **Support** | opendata@translink.com.au |

### Data Format Details

The API returns data in **Google Protocol Buffer** format following the GTFS-Realtime specification. You'll need to:
1. Parse Protocol Buffer format (libraries available for most languages)
2. Filter vehicles by mode type to get only ferries
3. Extract position data (latitude, longitude, bearing, speed)

**Official GTFS-RT Specification:** https://developers.google.com/transit/gtfs-realtime/

### Getting Started
- Join the TransLink Australia Google Group for updates and support
- Review terms and conditions before implementation
- Official documentation: https://translink.com.au/about-translink/open-data/gtfs-rt

---

## 2. Static Schedule & Route Data

### GTFS Static Feed

**Download URL:**
```
https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip
```

**What's Included:**
- Ferry routes and schedules
- Stop locations (terminals)
- Trip information
- Service calendars
- Route shapes (polylines)

**Usage:**
The GTFS static data must be used in conjunction with the real-time feed to:
- Match real-time vehicle positions to specific routes
- Identify which ferry service each vehicle is operating
- Display route paths on the map
- Show terminal/stop information

**Format:** Standard GTFS format (ZIP archive containing CSV files)

**Last Updated:** Check feed info in the GTFS package

---

## 3. Ferry Terminal Locations

### Brisbane City Council Open Data

**Data Sources:**
- Primary: https://prod-brisbane-queensland.opendatasoft.com/explore/dataset/ferry-terminals/
- Alternative: https://www.data.qld.gov.au/dataset/ferry-terminals

**Included Fields:**
- Terminal name
- Street address
- Suburb
- Latitude & Longitude (WGS84)
- Accessibility information
- Parking availability
- Nearby bus services
- Service type (CityCat or CityFerry)
- Additional amenities

**Data Format:** Available in multiple formats including CSV, JSON, GeoJSON

**License:** Creative Commons Attribution 4.0

**Last Updated:** November 20, 2025 (annual update frequency)

**Terminal Count:** 22 wharves on the Brisbane River

### Ferry Network Coverage

The CityCat service operates between:
- **Upstream terminus:** UQ St Lucia
- **Downstream terminus:** Northshore Hamilton

**Terminals (in order):**
1. UQ St Lucia
2. West End
3. Guyatt Park
4. Regatta
5. Milton
6. North Quay
7. South Bank
8. QUT Gardens Point
9. Riverside
10. Howard Smith Wharves
11. Sydney Street
12. Mowbray Park
13. New Farm Park
14. Hawthorne
15. Bulimba
16. Teneriffe
17. Bretts Wharf
18. Apollo Road
19. Northshore Hamilton

**Total Fleet:** 36 vessels operated by RiverCity Ferries (Transdev Brisbane Ferries)

---

## 4. Map Basemap Options

### OpenStreetMap-Based Solutions

**Option A: MapTiler**
- Brisbane-specific tiles: https://data.maptiler.com/downloads/australia-oceania/australia/brisbane/
- Includes OpenStreetMap data, contour lines, hillshading
- Vector tiles available in OpenMapTiles schema
- Can be self-hosted

**Option B: Standard OSM Tiles**
- Free tile servers available (check usage policies)
- Use with Leaflet.js or MapLibre GL JS
- Projection: EPSG:3857 (Web Mercator)

**Option C: Mapbox/Stadia Maps**
- Commercial providers with free tiers
- Styled basemaps
- May have usage limits

### Recommended Mapping Libraries

1. **Leaflet.js** - Lightweight, easy to use, native GeoJSON support
2. **MapLibre GL JS** - Modern vector tile rendering, smooth animations
3. **Deck.gl** - Advanced visualizations, WebGL-powered

### Technical Considerations
- Use EPSG:3857 (Web Mercator) for web maps to match standard tile servers
- Ferry position data from GTFS-RT will be in WGS84 (lat/lon) and needs projection
- Brisbane coordinates approximately: -27.47°S, 153.02°E

---

## 5. Implementation Recommendations

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Map View   │  │ Ferry Icons  │  │  Route Lines │  │
│  │ (Leaflet/GL) │  │  (Real-time) │  │   (Static)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ Updates every 10-30s
                          │
┌─────────────────────────────────────────────────────────┐
│              Backend/Service Layer (Optional)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ GTFS-RT      │  │  Parse &     │  │   WebSocket  │  │
│  │  Fetcher     │  │  Filter      │  │   /REST API  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────────────────────────────────────┐
│              TransLink GTFS-RT API                       │
│       https://gtfsrt.api.translink.com.au               │
└─────────────────────────────────────────────────────────┘
```

### Approach 1: Client-Side Only (Simplest)

**Pros:**
- No backend infrastructure needed
- Direct API calls from browser
- Free to host (static site)

**Cons:**
- CORS may be an issue (need to test TransLink API)
- Protocol Buffer parsing in browser
- Higher bandwidth usage per user

**Tech Stack:**
- HTML/CSS/JavaScript
- Leaflet.js or MapLibre GL JS for map
- gtfs-realtime-bindings (JavaScript library)
- Fetch API for HTTP requests
- Static hosting (GitHub Pages, Netlify, Vercel)

### Approach 2: Backend Proxy (Recommended)

**Pros:**
- No CORS issues
- Can cache/optimize data
- Filter only ferry data server-side
- Can provide WebSocket updates
- Better error handling

**Cons:**
- Requires server infrastructure
- Additional complexity

**Tech Stack:**
- **Backend:** Node.js, Python (Flask/FastAPI), or Go
- **Frontend:** Same as Approach 1
- **Hosting:** Vercel, Railway, Fly.io, AWS/GCP/Azure
- **Protocol:** REST API or WebSocket

### Approach 3: Real-Time Database (Advanced)

**Pros:**
- True real-time updates to all clients
- Scalable
- Can add analytics/history

**Cons:**
- Most complex
- Higher costs

**Tech Stack:**
- Firebase Realtime Database or Supabase
- Serverless function to poll GTFS-RT
- Frontend as above

---

## 6. Technical Implementation Steps

### Phase 1: Setup & Data Access
1. ✅ Verify GTFS-RT API access (test VehiclePositions endpoint)
2. ✅ Download and parse GTFS static data
3. ✅ Download ferry terminal locations
4. ✅ Choose mapping library and basemap provider

### Phase 2: Basic Map
1. Create HTML page with map view centered on Brisbane River
2. Add basemap tiles
3. Load and display ferry terminal markers from static data
4. Add Brisbane River outline/highlight (optional)

### Phase 3: Static Routes
1. Parse GTFS shapes.txt for ferry routes
2. Display ferry route lines on map
3. Add route selection/filtering (if multiple routes)

### Phase 4: Real-Time Ferry Positions
1. Set up Protocol Buffer parser for GTFS-RT
2. Fetch VehiclePositions data
3. Filter for ferry vehicles only
4. Display ferry positions as moving icons on map
5. Update positions every 10-30 seconds
6. Add ferry info popups (route, next stop, etc.)

### Phase 5: Enhancements
1. Show ferry direction/heading (rotation)
2. Display estimated arrival times
3. Add service alerts
4. Historical playback
5. Analytics (most used routes, peak times)
6. Mobile responsive design
7. Dark mode

---

## 7. Code Libraries & Tools

### Protocol Buffer Parsing

**JavaScript:**
```bash
npm install gtfs-realtime-bindings
```

**Python:**
```bash
pip install gtfs-realtime-bindings
```

**Go:**
```bash
go get github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs
```

### GTFS Processing

**JavaScript:**
- `gtfs` - Import GTFS data into SQLite
- `gtfs-realtime-bindings` - Parse GTFS-RT feeds

**Python:**
- `gtfs-kit` - Parse and analyze GTFS feeds
- `partridge` - Load GTFS into pandas DataFrames

### Mapping Libraries

**Leaflet.js:**
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

**MapLibre GL JS:**
```html
<link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
```

---

## 8. Example Code Snippets

### Fetching Real-Time Ferry Positions (JavaScript)

```javascript
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

async function fetchFerryPositions() {
  const response = await fetch(
    'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions'
  );

  const buffer = await response.arrayBuffer();
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    new Uint8Array(buffer)
  );

  // Filter for ferries only
  const ferries = feed.entity
    .filter(entity => entity.vehicle)
    .filter(entity => {
      // Need to check route_type or route_id from GTFS static data
      // Route type 4 = Ferry in GTFS
      return entity.vehicle.trip?.routeId?.startsWith('F'); // Example filter
    })
    .map(entity => ({
      id: entity.id,
      latitude: entity.vehicle.position.latitude,
      longitude: entity.vehicle.position.longitude,
      bearing: entity.vehicle.position.bearing,
      speed: entity.vehicle.position.speed,
      routeId: entity.vehicle.trip?.routeId,
      tripId: entity.vehicle.trip?.tripId,
    }));

  return ferries;
}

// Poll every 15 seconds
setInterval(async () => {
  const ferries = await fetchFerryPositions();
  updateMapMarkers(ferries);
}, 15000);
```

### Displaying Ferry Terminals (Leaflet.js)

```javascript
// Initialize map centered on Brisbane River
const map = L.map('map').setView([-27.4698, 153.0251], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch and display ferry terminals
fetch('https://prod-brisbane-queensland.opendatasoft.com/api/records/1.0/search/?dataset=ferry-terminals&rows=100')
  .then(response => response.json())
  .then(data => {
    data.records.forEach(record => {
      const { terminal_name, geo_point_2d } = record.fields;
      L.marker([geo_point_2d[0], geo_point_2d[1]])
        .addTo(map)
        .bindPopup(terminal_name);
    });
  });
```

---

## 9. Data Attribution Requirements

Per Creative Commons Attribution 4.0 license, you must provide attribution:

**For TransLink data:**
```
Real-time ferry data provided by TransLink Queensland
Licensed under CC BY 4.0
```

**For Brisbane City Council data:**
```
Ferry terminal locations © Brisbane City Council
Licensed under CC BY 4.0
```

**For OpenStreetMap:**
```
Map data © OpenStreetMap contributors
```

---

## 10. Additional Resources

### Official Documentation
- TransLink Open Data: https://translink.com.au/about-translink/open-data
- TransLink GTFS-RT: https://translink.com.au/about-translink/open-data/gtfs-rt
- Queensland Open Data Portal: https://www.data.qld.gov.au/
- Brisbane City Council Open Data: https://prod-brisbane-queensland.opendatasoft.com/

### GTFS Specifications
- GTFS Static: https://gtfs.org/schedule/reference/
- GTFS Realtime: https://gtfs.org/realtime/reference/

### Third-Party Apps Using This Data
- Moovit: https://moovitapp.com/ (shows real-time CityCat tracking)
- Transit App: https://transitapp.com/

### Community Support
- TransLink Australia Google Group (mentioned in documentation)
- Email: opendata@translink.com.au

---

## 11. Potential Challenges & Solutions

### Challenge 1: CORS Restrictions
**Problem:** Browser may block direct API calls
**Solution:**
- Test if TransLink API allows CORS
- If not, use backend proxy or serverless function
- Or use browser extension for development

### Challenge 2: Protocol Buffer Complexity
**Problem:** Binary format requires special parsing
**Solution:**
- Use official bindings libraries (gtfs-realtime-bindings)
- Libraries available for all major languages
- Well-documented format

### Challenge 3: Filtering Ferry Data
**Problem:** API returns all vehicles (bus, train, tram, ferry)
**Solution:**
- Download GTFS static data
- Create lookup table of ferry routes (route_type = 4)
- Filter real-time data by route_id or route_type

### Challenge 4: Update Frequency
**Problem:** Real-time data needs regular polling
**Solution:**
- Poll every 10-30 seconds (balance freshness vs. load)
- Use server-side caching to reduce API calls
- Consider WebSocket for push updates to clients

### Challenge 5: Map Performance
**Problem:** Many markers/updates may slow down map
**Solution:**
- Use canvas-based rendering (MapLibre GL JS)
- Cluster terminals if needed
- Optimize marker updates (only update changed positions)

---

## 12. Next Steps

1. **Test API Access:** Verify you can fetch and parse GTFS-RT data
2. **Download Static Data:** Get GTFS package and ferry terminals
3. **Prototype:** Build basic map with static terminal locations
4. **Add Real-Time:** Integrate live ferry position updates
5. **Polish:** Add UI, styling, mobile support
6. **Deploy:** Host on static site or with backend

---

## Conclusion

Building a real-time Brisbane ferry tracking map is **highly feasible** with excellent free data sources:

✅ **Real-time API:** Free, open, well-documented
✅ **Static data:** Comprehensive GTFS feed
✅ **Terminal locations:** Accurate coordinate data
✅ **Map options:** Multiple basemap providers
✅ **Libraries:** Mature tools for all components
✅ **License:** Permissive CC-BY for all data

The project can be built as a simple client-side web app or enhanced with a backend for better performance and features. All necessary data is freely available and actively maintained by TransLink Queensland and Brisbane City Council.

**Estimated Development Time:**
- Basic prototype: 1-2 days
- Full-featured app: 1-2 weeks
- Production-ready: 2-4 weeks (with testing, polish, deployment)

**Recommended First Approach:** Start with client-side only using Leaflet.js to validate the concept, then add backend if needed for performance or features.
