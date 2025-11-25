# Quick Reference Card

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## 📁 Project Structure

```
src/
├── components/      # 10 UI components
├── services/        # 3 API services
├── store/          # Zustand state
├── types/          # 6 TS definitions
├── utils/          # 4 helper modules
└── styles/         # Tailwind CSS
```

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application |
| `src/components/MapView.tsx` | Leaflet map |
| `src/services/gtfsRTService.ts` | Ferry API |
| `src/store/useAppStore.ts` | Global state |
| `src/utils/constants.ts` | Config values |

---

## 🛠️ Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview build

# Code Quality
npm run type-check      # TypeScript check
npm run lint            # ESLint
npm run lint:fix        # Auto-fix linting
npm run format          # Prettier format

# Deployment
vercel --prod           # Deploy to Vercel
```

---

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
VITE_GTFS_RT_URL=https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions
```

### Constants
```typescript
// src/utils/constants.ts
DEFAULT_MAP_CENTER = [-27.4698, 153.0251]
FERRY_POSITION_POLL_INTERVAL = 15000
```

### Colors
```css
/* src/styles/app.css */
--color-translink-blue: #0072CE;
--color-ferry-orange: #FF6B00;
--color-golden: #F5B800;
```

---

## 📊 Data Flow

```
TransLink API (15s)
    ↓
gtfsRTService
    ↓
useAppStore (Zustand)
    ↓
React Components
    ↓
User Interface
```

---

## 🧩 Component Hierarchy

```
App
├── Navigation
├── MapView
│   ├── Ferry Markers (with Leaflet)
│   └── Terminal Markers
├── ServiceFilter
├── FerryInfoPanel (conditional)
├── ETAModal (conditional)
├── DataStaleWarning (conditional)
└── Footer
```

---

## 🔌 API Endpoints

```typescript
// Ferry Positions (real-time)
GET https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions
// Format: Protocol Buffer
// Polling: 15 seconds

// Terminals
GET https://prod-brisbane-queensland.opendatasoft.com/api/records/1.0/search/?dataset=ferry-terminals&rows=100
// Format: JSON
// Cache: 7 days
```

---

## 🎨 UI States

| State | Component | Trigger |
|-------|-----------|---------|
| Loading | LoadingSpinner | Initial load |
| Error | ErrorDisplay | API failure |
| Stale | DataStaleWarning | >2 min old data |
| Selected Ferry | FerryInfoPanel | Ferry click |
| ETA | ETAModal | Terminal click |

---

## 🐛 Debugging

### Common Issues

**No ferries showing:**
```typescript
// Check console for:
// - API errors
// - CORS issues
// - Network failures

// Verify:
console.log(ferries); // In useAppStore
```

**ETA not calculating:**
```typescript
// Check:
// - GTFS data loaded
// - Ferry selected
// - Terminal on route

// Debug:
console.log(gtfsData, selectedFerry, selectedTerminal);
```

**Map not loading:**
```html
<!-- Check Leaflet CSS loaded in index.html -->
<link rel="stylesheet" href="...leaflet.css" />
```

---

## 📈 Performance Tips

```typescript
// Use useMemo for expensive computations
const filteredFerries = useMemo(() =>
  ferries.filter(f => f.serviceType === filter),
  [ferries, filter]
);

// Optimize re-renders
React.memo(FerryMarker);

// Code splitting
const ETAModal = lazy(() => import('./ETAModal'));
```

---

## 🚢 Ferry Data Model

```typescript
interface Ferry {
  id: string;
  routeName: string;
  serviceType: 'citycat' | 'cross-river';
  position: {
    lat: number;
    lon: number;
    bearing: number;  // 0-359°
    speed?: number;
  };
  trip: {
    tripId: string;
    headsign: string;
    direction: 0 | 1;
  };
  timestamp: number;
}
```

---

## 📍 Terminal Data Model

```typescript
interface Terminal {
  stopId: string;
  name: string;
  position: { lat: number; lon: number };
  services: ServiceType[];
  accessibility: {
    wheelchairAccessible: boolean;
    parking: boolean;
  };
}
```

---

## 🎯 State Management

```typescript
// Zustand Store
const useAppStore = create((set, get) => ({
  // State
  ferries: [],
  selectedFerry: null,
  filterService: 'all',

  // Actions
  setFerries: (ferries) => set({ ferries }),
  selectFerry: (ferry) => set({ selectedFerry: ferry }),
  setFilterService: (filter) => set({ filterService: filter }),
}));

// Usage
const { ferries, selectFerry } = useAppStore();
```

---

## 🔐 Security

- ✅ No authentication needed (public API)
- ✅ No user data collected
- ✅ HTTPS enforced
- ✅ No API keys in client code
- ✅ CSP headers configured

---

## ♿ Accessibility

```tsx
// Keyboard navigation
<button
  onClick={onClick}
  aria-label="Select ferry"
  aria-pressed={selected}
>

// Screen reader
<div
  role="status"
  aria-live="polite"
  className="sr-only"
>
  {ferries.length} ferries operating
</div>

// Focus management
useEffect(() => {
  if (isModalOpen) {
    modalRef.current?.focus();
  }
}, [isModalOpen]);
```

---

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Desktops
xl: 1280px  // Large desktops

// Usage
<div className="px-4 md:px-8 lg:px-12">
```

---

## 🧪 Testing

```bash
# Manual testing checklist
- [ ] Ferries load and display
- [ ] Map interactive (pan/zoom)
- [ ] Filter works
- [ ] Ferry selection works
- [ ] ETA calculation works
- [ ] Mobile responsive
- [ ] No console errors
```

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| [README.md](README.md) | Overview & features |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick start |
| [PRD.md](PRD.md) | Product requirements |
| [TRD.md](TRD.md) | Technical specs |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Deploy guide |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete summary |

---

## 🌐 Deployment

```bash
# Vercel
vercel --prod

# Build output
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ferry-icon.svg
```

---

## 🎨 Customization Hot Spots

```typescript
// Change colors
src/styles/app.css → @theme

// Change polling interval
src/utils/constants.ts → FERRY_POSITION_POLL_INTERVAL

// Change map center
src/utils/constants.ts → DEFAULT_MAP_CENTER

// Change ferry icon
src/components/MapView.tsx → createFerryIcon()

// Add new service
src/types/ferry.ts → ServiceType
src/components/ServiceFilter.tsx → filterOptions
```

---

## 🔗 Useful Links

- **TransLink API:** https://translink.com.au/about-translink/open-data
- **GTFS Spec:** https://gtfs.org/
- **Leaflet Docs:** https://leafletjs.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Tailwind Docs:** https://tailwindcss.com/

---

## 🆘 Quick Fixes

### Ferry positions not updating
```typescript
// Check polling is active
console.log('Polling active:', gtfsRTService.intervalId !== null);

// Manually fetch
gtfsRTService.fetchVehiclePositions().then(console.log);
```

### Map tiles not loading
```typescript
// Check tile URL in MapView.tsx
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Ensure https:// not http://
```

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

**📖 For detailed info, see [TRD.md](TRD.md) and [PRD.md](PRD.md)**
