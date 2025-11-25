# Single Page Web App Cheatsheet - Professional Services Website

## 🎯 Overview
This cheatsheet provides a template for building a modern, responsive single-page application for professional services (coaches, consultants, therapists, etc.) using React, Vite, Tailwind CSS, and Vercel.

## 🛠️ Tech Stack

### Core Technologies
```json
{
  "framework": "React 19.1.1",
  "build-tool": "Vite 7.0.6",
  "styling": "Tailwind CSS 4.1.0",
  "hosting": "Vercel",
  "language": "JavaScript (ES6+) / TypeScript"
}
```

### Key Dependencies
```json
{
  "dependencies": {
    "@mailchimp/mailchimp_marketing": "^3.0.80",  // Newsletter integration
    "clsx": "^2.1.1",                              // Conditional classNames
    "embla-carousel-react": "^8.6.0",              // Testimonials carousel
    "react-calendly": "^4.4.0"                     // Booking integration
  }
}
```

## 📁 Project Structure

```
project-root/
├── src/
│   ├── components/          # All React components
│   │   ├── Navigation.jsx   # Fixed header with scroll effects
│   │   ├── Hero.jsx        # Landing section with CTA
│   │   ├── Welcome.jsx     # About/intro section
│   │   ├── Services.jsx    # Services with tabs
│   │   ├── Consultation.jsx # Pricing/booking section
│   │   ├── Testimonials.jsx # Client reviews carousel
│   │   ├── Footer.jsx      # Contact, newsletter, links
│   │   └── Modal.jsx       # Reusable modal component
│   ├── content/            # Markdown files (legal docs)
│   ├── assets/
│   │   └── images/         # All image assets
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles/animations
│   └── main.jsx           # Entry point
├── api/                    # Vercel serverless functions
│   └── subscribe.js       # MailChimp integration
├── public/                # Static assets
├── index.html            # HTML template
└── Configuration files...
```

## 🎨 Design System

### Color Palette (Tailwind Config)
```javascript
colors: {
  'charcoal': '#2D3436',    // Primary text
  'cream': '#FDF5E6',       // Background accent
  'sage': '#87A96B',        // Accent color 1
  'coral': '#FF7F50',       // Accent color 2
  'golden': '#F5B800',      // CTA/Primary button
}
```

### Typography
```javascript
fontFamily: {
  'sans': ['Inter', 'sans-serif'],           // Body text
  'serif': ['Playfair Display', 'serif'],    // Headings
}
```

### Common Component Patterns

#### 1. Section Container
```jsx
<section id="section-name" className="py-20 bg-white">
  <div className="container mx-auto px-4 max-w-6xl">
    {/* Content */}
  </div>
</section>
```

#### 2. Responsive Grid
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grid items */}
</div>
```

#### 3. CTA Button
```jsx
<button className="bg-golden hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg">
  Call to Action
</button>
```

## 🧩 Essential Components

### 1. Navigation with Scroll Effects
```jsx
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
    )}>
      {/* Navigation content */}
    </nav>
  );
};
```

### 2. Hero Section Pattern
```jsx
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bannerImg} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Hero content */}
      </div>
    </section>
  );
};
```

### 3. Service Tabs
```jsx
const Services = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-cream rounded-full p-1 inline-flex">
        <button
          onClick={() => setActiveTab('tab1')}
          className={clsx(
            'px-6 py-3 rounded-full font-medium transition-all',
            activeTab === 'tab1' 
              ? 'bg-golden text-white shadow-md' 
              : 'text-charcoal hover:text-golden'
          )}
        >
          Tab 1
        </button>
      </div>
    </div>
  );
};
```

### 4. Testimonials Carousel
```jsx
import useEmblaCarousel from 'embla-carousel-react';

const Testimonials = () => {
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    duration: 30
  });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {testimonials.map((item, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            {/* Testimonial content */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🔌 Key Integrations

### 1. Calendly Popup Integration
```jsx
import { PopupButton } from 'react-calendly';

<PopupButton
  url="https://calendly.com/your-username"
  rootElement={document.getElementById('root')}
  text="Book a Consult"
  className="bg-golden text-white px-8 py-3 rounded-full hover:bg-yellow-600"
/>
```

### 2. MailChimp Newsletter (Serverless Function)
```javascript
// api/subscribe.js
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;
  
  try {
    await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME: firstName },
        tags: ['Website Signup'],
      }
    );
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 3. Newsletter Form Component
```jsx
const [formData, setFormData] = useState({ firstName: '', email: '' });
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      setFormData({ firstName: '', email: '' });
      // Show success message
    }
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

## 🚀 Deployment Setup

### 1. Environment Variables (Vercel)
```
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_LIST_ID=your-list-id
MAILCHIMP_SERVER_PREFIX=us11
```

### 2. Deployment Commands
```bash
# Initial setup
npm install
npm run build

# Deploy to Vercel
vercel --prod

# Or connect GitHub repo for auto-deploy
```

### 3. Vercel Configuration
```json
// vercel.json (optional)
{
  "functions": {
    "api/subscribe.js": {
      "maxDuration": 10
    }
  }
}
```

## 📱 Responsive Design Patterns

### Mobile-First Breakpoints
- Default: Mobile
- `md:` Medium screens (768px+)
- `lg:` Large screens (1024px+)
- `xl:` Extra large screens (1280px+)

### Common Responsive Patterns
```jsx
// Text sizing
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Padding/spacing
<div className="px-4 md:px-8 lg:px-12">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Flex direction
<div className="flex flex-col md:flex-row">
```

## ✅ Implementation Checklist

### Prerequisites
- [ ] Node.js 20.19+ or 22.12+ (required for Vite 7)

### Initial Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Tailwind CSS v4 and configure
- [ ] Set up component structure
- [ ] Add custom fonts (Google Fonts)
- [ ] Configure color palette

### Core Components
- [ ] Navigation with scroll effects
- [ ] Hero section with background image
- [ ] About/Welcome section
- [ ] Services section (with tabs if needed)
- [ ] Pricing/consultation cards
- [ ] Testimonials carousel
- [ ] Footer with newsletter signup

### Integrations
- [ ] Calendly PopupButton setup
- [ ] MailChimp serverless function
- [ ] Newsletter form with validation
- [ ] Contact information and social links

### Legal & Content
- [ ] Privacy Policy (markdown)
- [ ] Terms & Conditions (markdown)
- [ ] Modal component for legal docs
- [ ] SEO meta tags in index.html

### Deployment
- [ ] Create Vercel account
- [ ] Set environment variables
- [ ] Connect GitHub repo or use CLI
- [ ] Test serverless functions
- [ ] Configure custom domain (optional)

## 🎯 Best Practices

1. **Component Organization**: One component per file, clear naming
2. **State Management**: Use React hooks for local state
3. **Styling**: Tailwind utility classes, avoid inline styles
4. **Images**: Optimize before upload, use descriptive names
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
6. **Performance**: Lazy load images, minimize bundle size
7. **SEO**: Meta tags, semantic structure, descriptive content

## 🔧 Common Customizations

### Adding New Sections
1. Create component in `src/components/`
2. Import and add to `App.jsx`
3. Add navigation link if needed
4. Follow section container pattern

### Changing Colors
1. Update `tailwind.config.js`
2. Or use Tailwind arbitrary values: `bg-[#hexcode]`

### Adding Animations
```css
/* In App.css */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
```

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Calendly](https://www.npmjs.com/package/react-calendly)
- [Embla Carousel](https://www.embla-carousel.com/)

---

This cheatsheet provides a complete blueprint for building professional single-page websites with modern web technologies. Adapt components and styling to match specific brand requirements.