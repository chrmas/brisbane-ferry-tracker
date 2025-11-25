# Deploy Your SPA to Vercel

This guide covers deploying any Single Page Application built with the stack from SINGLE_PAGE_APP_CHEATSHEET.md (React + Vite + Tailwind CSS).

## Initial Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Initialize Project
```bash
# In your project root directory
vercel
```

Follow the prompts to:
- Link to existing project or create new
- Select your team/account
- Confirm project settings

## Deployment Checklist

Follow this checklist for every deployment:

### 1. Pre-deployment Checks
- [ ] Save all file changes
- [ ] Test locally with `npm run dev`
- [ ] Check browser console for errors/warnings
- [ ] Verify all features work as expected
- [ ] Run linting if configured (`npm run lint`)

### 2. Commit Changes
```bash
# Check what files have changed
git status

# Stage your changes
git add .
# OR stage specific files
git add src/components/[filename].jsx

# Commit with descriptive message
git commit -m "feat: add new feature" # or "fix: resolve issue"
```

### 3. Build the Project
```bash
# Create production build
npm run build

# Verify build output in dist/ directory
```

### 4. Deploy to Vercel

#### Option A: CLI Deployment
```bash
# Deploy to production
vercel --prod
```

#### Option B: Git Integration (Recommended)
1. Push to GitHub/GitLab/Bitbucket
2. Vercel auto-deploys on push to main branch
3. Preview deployments for pull requests

### 5. Post-deployment Verification
- [ ] Visit your production URL
- [ ] Test all modified features
- [ ] Check responsive design on mobile
- [ ] Verify third-party integrations (Calendly, forms, etc.)
- [ ] Test serverless functions if applicable

## Environment Variables

### Setting Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add required variables:

#### Common Variables for SPA Stack
```
# MailChimp Integration
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_LIST_ID=your-list-id
MAILCHIMP_SERVER_PREFIX=us11

# Other APIs (if applicable)
VITE_API_URL=https://api.yourdomain.com
VITE_PUBLIC_KEY=your-public-key
```

### Local Development
Create `.env.local` file (not committed to git):
```
MAILCHIMP_API_KEY=your-dev-api-key
MAILCHIMP_LIST_ID=your-dev-list-id
MAILCHIMP_SERVER_PREFIX=us11
```

## Common Deployment Scenarios

### Updating Content
1. Edit relevant component in `src/components/`
2. Follow deployment checklist
3. Changes appear immediately after deployment

### Updating Styles
1. Modify Tailwind classes in components
2. Or update `tailwind.config.js` for theme changes
3. Build and deploy

### Adding New Features
1. Create new components in `src/components/`
2. Update `App.jsx` to include new sections
3. Test thoroughly before deploying

### Updating Images
1. Add optimized images to `src/assets/images/`
2. Import in relevant components
3. Deploy (images included in build)

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
npm run build
```

### Deployment Errors
- Verify you're logged in: `vercel whoami`
- Ensure you're in project root directory
- Check `.vercel/` directory exists
- Review build logs in Vercel dashboard

### Environment Variable Issues
- Variables must be set in Vercel dashboard
- Restart deployment after adding variables
- Use `VITE_` prefix for client-side variables

### Changes Not Showing
1. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
2. Wait 1-2 minutes for CDN propagation
3. Check deployment status in Vercel dashboard
4. Verify you deployed to production (`--prod`)

## Project Configuration

### Vercel Settings (Auto-detected for Vite)
- **Framework Preset**: Vite
- **Build Command**: `vite build` or `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Optional vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Serverless Functions
Place in `api/` directory:
```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
```

## Performance Optimization

### Build Optimization
```json
// vite.config.js suggestions
{
  "build": {
    "rollupOptions": {
      "output": {
        "manualChunks": {
          "vendor": ["react", "react-dom"],
          "ui": ["clsx", "embla-carousel-react"]
        }
      }
    }
  }
}
```

### Image Optimization
- Use WebP format when possible
- Compress images before uploading
- Consider Vercel Image Optimization

## Custom Domain Setup

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS records with your provider:
   - A record: Point to Vercel IP
   - CNAME: Point to `cname.vercel-dns.com`
4. SSL certificate auto-configured

## Monitoring & Analytics

### Vercel Analytics (Optional)
```bash
npm install @vercel/analytics
```

```jsx
// In App.jsx or main.jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

### Build Logs
- View in Vercel dashboard
- Access via CLI: `vercel logs`

## Rollback Procedure

If deployment causes issues:

1. **Via Dashboard**: 
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback
   ```

## Best Practices

1. **Use Git Integration**: Automatic deployments on push
2. **Preview Deployments**: Test PRs before merging
3. **Environment Variables**: Never commit secrets
4. **Monitor Performance**: Check Vercel Analytics
5. **Regular Backups**: Keep local copies of important data
6. **Semantic Commits**: Use conventional commit messages

## Quick Reference

```bash
# Development
npm run dev                    # Start dev server

# Deployment
vercel                        # Deploy preview
vercel --prod                 # Deploy production

# Management
vercel env ls                 # List env variables
vercel domains ls             # List domains
vercel logs                   # View logs
vercel rollback              # Rollback deployment

# Project Info
vercel inspect [url]          # Inspect deployment
vercel ls                     # List deployments
```

---

This deployment guide covers the standard workflow for any SPA built with the React + Vite + Tailwind stack. Customize based on your specific project needs.