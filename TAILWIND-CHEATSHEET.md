# Tailwind CSS Troubleshooting Guide & Cheatsheet

## 🚨 Tailwind v4 vs v3 - Updated January 2025

### Tailwind CSS v4 (Latest - Recommended)

**Latest Version:** 4.1.0 (January 2025)

**Installation for v4:**
```bash
# Install Tailwind v4 with new PostCSS plugin
npm install -D tailwindcss @tailwindcss/postcss postcss

# Initialize Tailwind (creates CSS config, not JS)
npx tailwindcss init
```

**PostCSS Config for v4:**
```js
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ New v4 syntax
  },
}
```

**Key v4 Changes:**
- CSS-first configuration (no more tailwind.config.js by default)
- 10x faster with Oxide engine
- Configure in CSS using `@theme` directive
- Requires modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+)

### Tailwind CSS v3 (Legacy - Still Supported)

**Latest v3:** 3.4.17

**Installation for v3:**
```bash
# Install Tailwind v3
npm install -D tailwindcss@3 postcss autoprefixer
```

**PostCSS Config for v3:**
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},  // ✅ v3 syntax
    autoprefixer: {},
  },
}
```

### 2. Classes Not Applying / CSS Not Loading

**Common Causes & Fixes:**

**a) Missing Tailwind directives in CSS:**
```css
/* src/index.css or src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**b) Incorrect content paths in config:**
```js
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ✅ Make sure this matches your file structure
  ],
  // ...
}
```

**c) CSS import missing in main entry:**
```jsx
// src/main.jsx or src/index.js
import './index.css'  // ⚠️ Don't forget this!
```

### 3. Custom Colors/Classes Not Working

**Error:** `Cannot apply unknown utility class`

**Fix:** Make sure custom colors are in theme.extend:
```js
// tailwind.config.js
export default {
  theme: {
    extend: {  // ⚠️ Use extend to keep default colors
      colors: {
        'golden': '#F5B800',
        'charcoal': '#2D3436'
      }
    }
  }
}
```

### 4. Production Build Missing Styles

**Cause:** PurgeCSS removing used classes

**Fix:** Ensure all dynamic classes are in safelist or avoid string concatenation:
```js
// ❌ Bad - PurgeCSS can't detect this
const color = 'red';
<div className={`text-${color}-500`}>

// ✅ Good - PurgeCSS can detect this
<div className={color === 'red' ? 'text-red-500' : 'text-blue-500'}>

// Or add to safelist in config:
export default {
  safelist: ['text-red-500', 'text-blue-500']
}
```

## 🚀 Quick Setup for New Projects

### Vite + React + Tailwind v4 (Recommended)
```bash
# Create Vite project with TypeScript
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install Tailwind v4
npm install -D tailwindcss @tailwindcss/postcss postcss

# Initialize Tailwind (creates app.css with @import)
npx tailwindcss init
```

### Essential Config Files for v4

**postcss.config.js:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**src/app.css (or index.css):**
```css
@import "tailwindcss";

/* Custom theme configuration in v4 */
@theme {
  --font-sans: Inter, system-ui, sans-serif;
  
  --color-primary: #F5B800;
  --color-charcoal: #2D3436;
  --color-cream: #FDF5E6;
}

/* Custom base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }
}
```

### Vite + React + Tailwind v3 (Legacy)
```bash
# Create Vite project
npm create vite@latest my-app -- --template react
cd my-app

# Install Tailwind v3
npm install -D tailwindcss@3 postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### v3 Config Files

**tailwind.config.js (v3 only):**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom colors, fonts, etc. here
    },
  },
  plugins: [],
}
```

## 🔧 Debugging Tips

### 1. Check Tailwind Version
```bash
npm list tailwindcss
# v4: tailwindcss@4.x.x with @tailwindcss/postcss
# v3: tailwindcss@3.x.x
```

### 2. Verify Build Process
```bash
# See if Tailwind is processing
npm run build
# Check if CSS file size is reasonable (should be > 10KB)
```

### 3. IntelliSense Not Working?
Install the Tailwind CSS IntelliSense VS Code extension and add to settings:
```json
{
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascript"
  }
}
```

## 📦 Package Versions That Work Well Together

### For Tailwind v4 (Latest)
```json
{
  "devDependencies": {
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.0.0-beta.1",
    "postcss": "^8.4.49",
    "vite": "^7.0.6"
  }
}
```

### For Tailwind v3 (Legacy)
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.32", 
    "autoprefixer": "^10.4.16",
    "vite": "^7.0.6"
  }
}
```

## 🎯 Common Gotchas

### v4 Specific
1. **No tailwind.config.js** - Configuration is now in CSS
2. **Different PostCSS plugin** - Use `@tailwindcss/postcss` not `tailwindcss`
3. **Modern browsers only** - Check browser requirements

### v3 Specific  
1. **Using v4 PostCSS config** - Won't work with v3
2. **JIT mode** - v3 has JIT by default, no need to enable

### Both Versions
1. **Using `/src/` paths in production** - Always import images properly for bundling
2. **Forgetting to restart dev server** after config changes
3. **Missing responsive prefixes** - Remember `md:`, `lg:`, etc.

## 💡 Pro Tips

1. **v4 is stable and fast** - 10x faster builds with Oxide engine
2. **Use v4 for new projects** - Better performance and simpler config
3. **Use clsx or classnames** for conditional classes
4. **Check Tailwind Play** (play.tailwindcss.com) to test classes quickly

---

**Updated January 2025:** Tailwind v4 is now stable and recommended for new projects!