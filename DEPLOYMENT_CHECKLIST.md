# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment Checklist

### 1. Installation & Setup
- [ ] Node.js 20.19+ or 22.12+ installed
- [ ] npm 10+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] No security vulnerabilities (`npm audit`)

### 2. Local Testing
- [ ] Development server runs successfully (`npm run dev`)
- [ ] Map loads and displays correctly
- [ ] Ferry positions appear on map
- [ ] Terminal markers visible
- [ ] Service filter works (All/CityCat/Cross River)
- [ ] Ferry selection shows info panel
- [ ] Terminal click shows ETA modal
- [ ] ETA calculations working
- [ ] No console errors
- [ ] Mobile responsive (test at 320px, 768px, 1024px)

### 3. Code Quality
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No unused imports or variables
- [ ] All TODO comments addressed

### 4. Build & Performance
- [ ] Production build succeeds (`npm run build`)
- [ ] Build output in `dist/` directory
- [ ] Bundle size < 500 KB
- [ ] Preview build works (`npm run preview`)
- [ ] Lighthouse Performance score > 85
- [ ] Lighthouse Accessibility score > 90

### 5. Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest) - if available
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 6. Functionality Testing
- [ ] API fetches work in production build
- [ ] Real-time polling works (check Network tab)
- [ ] Error handling works (simulate API failure)
- [ ] Loading states display correctly
- [ ] Data stale warning appears after 2 min
- [ ] Modal closes on Escape key
- [ ] Keyboard navigation works

### 7. Content & SEO
- [ ] Page title correct in browser tab
- [ ] Meta description present
- [ ] Favicon displays
- [ ] Open Graph tags (if added)
- [ ] Attribution footer visible
- [ ] Links to TransLink and OSM work

---

## Deployment Steps

### Option A: Deploy to Vercel

#### Prerequisites
- [ ] Vercel account created (https://vercel.com)
- [ ] Vercel CLI installed (`npm install -g vercel`)

#### Steps
1. [ ] Login to Vercel
   ```bash
   vercel login
   ```

2. [ ] Deploy to production
   ```bash
   vercel --prod
   ```

3. [ ] Note the deployment URL

4. [ ] Test deployed site
   - [ ] Site loads
   - [ ] Map appears
   - [ ] Ferries load
   - [ ] All features work

#### Vercel Dashboard Setup
- [ ] Navigate to project in Vercel dashboard
- [ ] Set production domain (if custom)
- [ ] Configure environment variables (if any)
- [ ] Enable analytics (optional)

---

### Option B: Deploy to Netlify

#### Prerequisites
- [ ] Netlify account created
- [ ] Netlify CLI installed (`npm install -g netlify-cli`)

#### Steps
1. [ ] Build the project
   ```bash
   npm run build
   ```

2. [ ] Deploy to Netlify
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. [ ] Configure in Netlify dashboard:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. [ ] Test deployed site

---

### Option C: Deploy to GitHub Pages

#### Prerequisites
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

#### Steps
1. [ ] Install gh-pages
   ```bash
   npm install --save-dev gh-pages
   ```

2. [ ] Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. [ ] Update `vite.config.ts`:
   ```typescript
   base: '/repository-name/'
   ```

4. [ ] Deploy
   ```bash
   npm run deploy
   ```

5. [ ] Configure GitHub Pages in repository settings
   - Source: `gh-pages` branch

---

## Post-Deployment Checklist

### 1. Smoke Testing
- [ ] Visit production URL
- [ ] Map loads within 2 seconds
- [ ] Ferry positions appear
- [ ] Click ferry → Info panel shows
- [ ] Click terminal → ETA modal shows
- [ ] Filter works correctly
- [ ] No JavaScript errors in console

### 2. Performance Testing
- [ ] Run Lighthouse audit on production
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90
- [ ] Check bundle sizes in Network tab
- [ ] Verify API calls happen every 15 seconds
- [ ] Check page load time (< 2s)

### 3. Mobile Testing
- [ ] Open on mobile device
- [ ] Map is interactive
- [ ] Buttons are tappable (min 44x44px)
- [ ] Info panel slides up correctly
- [ ] Modal displays properly
- [ ] No horizontal scrolling

### 4. Monitoring Setup
- [ ] Set up error tracking (Sentry - optional)
- [ ] Enable analytics (Vercel/Plausible - optional)
- [ ] Set up uptime monitoring (UptimeRobot - optional)
- [ ] Create alert for downtime

### 5. Documentation
- [ ] README updated with production URL
- [ ] GETTING_STARTED updated if needed
- [ ] Screenshots added (optional)
- [ ] Demo video recorded (optional)

---

## Rollback Plan

If deployment has issues:

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
- Go to Netlify dashboard
- Navigate to Deploys
- Find previous working deployment
- Click "Publish deploy"

### GitHub Pages
```bash
# Revert last commit
git revert HEAD
git push

# Redeploy
npm run deploy
```

---

## Common Post-Deployment Issues

### Issue: Ferries not showing
**Check:**
- [ ] API endpoint accessible from production
- [ ] CORS not blocking requests
- [ ] TransLink API operational
- [ ] Console shows specific error

**Fix:**
- If CORS issue: Consider backend proxy (see TRD.md Section 11)
- If API down: Wait for TransLink to restore service

### Issue: Map tiles not loading
**Check:**
- [ ] OpenStreetMap tile URL correct
- [ ] Internet connectivity
- [ ] Browser dev tools for 403/404 errors

**Fix:**
- Ensure `https://` in tile URL
- Check OSM usage policy compliance

### Issue: Build errors
**Check:**
- [ ] All dependencies installed
- [ ] Node version correct
- [ ] TypeScript errors resolved

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment variables missing
**Check:**
- [ ] `.env` file in production (Vercel/Netlify dashboard)
- [ ] Variable names prefixed with `VITE_`

**Fix:**
- Add variables in hosting dashboard
- Redeploy

---

## Success Criteria

Deployment is successful when:

✅ **All core features work:**
- Real-time ferry positions
- Service filtering
- Ferry selection
- ETA calculations
- Mobile responsive

✅ **Performance meets targets:**
- Page load < 2 seconds
- Lighthouse score > 90
- No console errors

✅ **Monitoring active:**
- Error tracking configured
- Analytics recording visits
- Uptime checks running

---

## Next Steps After Deployment

1. **Share the link!**
   - Post on social media
   - Share with Brisbane commuters
   - Submit to Brisbane subreddit (r/brisbane)

2. **Monitor usage**
   - Check analytics daily
   - Review error rates
   - Track user feedback

3. **Plan enhancements**
   - Review PRD.md Section 17 (Future Roadmap)
   - Prioritize based on user feedback
   - Implement v1.1 features

4. **Maintain**
   - Update dependencies monthly
   - Check TransLink API status
   - Monitor performance metrics

---

**🎉 Ready to deploy!**

Once deployed, update README.md with your production URL and share it with the world!
