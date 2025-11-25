# Brisbane River Ferry Tracker

A real-time web application that displays live positions of Brisbane CityCat and Cross River Ferry services on an interactive map.

## Features

- 🗺️ **Real-time Ferry Tracking** - See all active ferries on the Brisbane River
- 🚢 **Directional Indicators** - Ferry icons rotate to show direction of travel
- ⏱️ **Arrival Time Estimates** - Click any ferry, then a terminal to see estimated arrival times
- 🔍 **Service Filtering** - Toggle between All Services, CityCat Only, or Cross River Ferry Only
- 📍 **22 Ferry Terminals** - All Brisbane ferry stops with detailed information
- 📱 **Mobile Responsive** - Works on desktop, tablet, and mobile devices
- ♿ **Accessible** - WCAG 2.1 AA compliant

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Mapping:** Leaflet.js
- **State Management:** Zustand
- **Data Source:** TransLink Queensland GTFS-RT API
- **Hosting:** Vercel (recommended)

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Bris Map"
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
npm run dev
```

The app will open at http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── MapView.tsx     # Main map component
│   ├── ServiceFilter.tsx
│   ├── FerryInfoPanel.tsx
│   ├── ETAModal.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
├── services/           # API services
│   ├── gtfsRTService.ts
│   ├── terminalService.ts
│   └── etaCalculator.ts
├── store/              # Zustand state management
│   └── useAppStore.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # CSS styles
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Data Sources

- **Ferry Positions:** TransLink Queensland GTFS-RT API (real-time)
- **Terminal Locations:** Brisbane City Council Open Data
- **Map Tiles:** OpenStreetMap

## How It Works

1. **Real-time Updates:** The app polls the TransLink GTFS-RT API every 15 seconds for ferry positions
2. **ETA Calculation:** When you select a ferry and click a terminal, the app:
   - Checks if the terminal is on the ferry's route
   - Uses real-time trip updates if available
   - Falls back to scheduled times + average delay
   - Calculates estimated arrival time

3. **Service Filter:** Filters both ferries and terminals based on service type (CityCat vs Cross River)

## Development

### Adding New Features

See [PRD.md](PRD.md) for product requirements and [TRD.md](TRD.md) for technical specifications.

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Conventional commit messages recommended

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Other Platforms

The app is a static SPA and can be deployed to:
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static hosting service

Build command: `npm run build`
Output directory: `dist`

## Browser Support

- Chrome 111+
- Firefox 128+
- Safari 16.4+
- Edge 111+

## Performance

- Lighthouse Performance Score: 90+
- Bundle Size: ~320 KB (gzipped)
- Initial Load: < 2 seconds
- Real-time Updates: Every 15 seconds

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- ARIA labels and roles
- Color contrast ratios ≥ 4.5:1

## Attribution

- Ferry data provided by TransLink Queensland (CC BY 4.0)
- Terminal data © Brisbane City Council (CC BY 4.0)
- Map data © OpenStreetMap contributors

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Check [PRD.md](PRD.md) and [TRD.md](TRD.md)
- Open an issue on GitHub
- Review TransLink API documentation

## Roadmap

See [PRD.md](PRD.md) Section 17 for future enhancements including:
- PWA support (offline maps)
- Service alerts
- Historical data
- Trip planning
- Dark mode

---

Built with ❤️ for Brisbane commuters and ferry enthusiasts
