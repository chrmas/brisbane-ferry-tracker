# Getting Started with Brisbane Ferry Tracker

## Quick Start Guide

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** 20.19+ or 22.12+ ([Download](https://nodejs.org/))
- **npm** 10+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version  # Should show v20.19+ or v22.12+
npm --version   # Should show 10+
```

### 2. Installation

```bash
# Navigate to project directory
cd "c:\Users\7chri\DEV\Bris Map"

# Install dependencies
npm install
```

This will install all required packages including:
- React 19
- TypeScript 5.6+
- Vite 6
- Tailwind CSS 4
- Leaflet.js
- Zustand
- And all other dependencies

### 3. Run Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

Your browser should open automatically. If not, navigate to the URL manually.

### 4. Verify It Works

You should see:
1. A map of Brisbane River
2. Real-time ferry positions appearing as boat icons
3. Ferry terminal markers
4. A filter control at the top left

**Try it out:**
1. Click the "CityCat" filter to show only CityCat ferries
2. Click any ferry icon to see details
3. Click a terminal marker to see estimated arrival time

---

## Development Workflow

### Project Structure

```
src/
├── components/      # UI components
├── services/        # API services (GTFS-RT, terminals)
├── store/          # Zustand global state
├── types/          # TypeScript definitions
├── utils/          # Helper functions
└── styles/         # CSS (Tailwind)
```

### Making Changes

1. **Edit components** in `src/components/`
2. **Hot reload** updates automatically in browser
3. **Check console** for any errors
4. **TypeScript errors** will show in terminal and IDE

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output goes to `dist/` directory.

---

## Common Issues & Solutions

### Issue: "npm: command not found"

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Dependencies fail to install

**Solution:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

### Issue: TypeScript errors in IDE

**Solution:**
1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Ensure TypeScript version matches: Check `tsconfig.json`
3. Install recommended VS Code extensions

### Issue: Map not loading

**Solution:**
1. Check browser console for errors
2. Verify internet connection (fetches map tiles from OpenStreetMap)
3. Check if TransLink API is accessible

### Issue: No ferry positions showing

**Solution:**
1. Check browser console for API errors
2. TransLink API may be down (check [status](https://translink.com.au))
3. Ferries may not be operating (check time of day)

---

## Next Steps

### Customize the App

1. **Change colors:** Edit `src/styles/app.css` under `@theme`
2. **Modify map center:** Edit `DEFAULT_MAP_CENTER` in `src/utils/constants.ts`
3. **Adjust polling interval:** Edit `FERRY_POSITION_POLL_INTERVAL` in `src/utils/constants.ts`

### Add Features

See [PRD.md](PRD.md) Section 17 for planned features:
- Service alerts
- Dark mode
- PWA support (offline mode)
- Historical data

### Deploy to Production

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions to Vercel, Netlify, or other platforms.

Quick deploy to Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Resources

- **Product Requirements:** [PRD.md](PRD.md)
- **Technical Specs:** [TRD.md](TRD.md)
- **Research:** [research.md](research.md)
- **Deployment:** [DEPLOY.md](DEPLOY.md)

### External Documentation

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet.js](https://leafletjs.com/)
- [TransLink Open Data](https://translink.com.au/about-translink/open-data)

---

## Development Tips

### Hot Reload

Vite provides instant hot module replacement (HMR). Changes to:
- `.tsx` files → Instant UI update
- `.css` files → Instant style update
- Type changes → Requires browser refresh

### Debugging

1. **Browser DevTools:** F12 → Console/Network tabs
2. **React DevTools:** Install browser extension
3. **Source Maps:** Enabled in dev mode for debugging TypeScript

### Performance

Monitor in browser DevTools:
- **Network tab:** API requests every 15 seconds
- **Performance tab:** Check rendering performance
- **Lighthouse:** Run audit for scores

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name
```

---

## Getting Help

If you encounter issues:
1. Check console for error messages
2. Review [TRD.md](TRD.md) Section 19 (Risk Mitigation)
3. Check if issue is documented in this guide
4. Search GitHub issues (if repository is public)

---

**Happy coding! 🚢**
