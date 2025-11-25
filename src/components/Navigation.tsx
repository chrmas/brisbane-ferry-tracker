import { useState, useEffect } from 'react';
import clsx from 'clsx';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-gradient-to-b from-black/30 to-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚢</span>
            <div>
              <h1
                className={clsx(
                  'text-xl font-bold transition-colors',
                  isScrolled ? 'text-charcoal' : 'text-white'
                )}
              >
                Brisbane Ferry Tracker
              </h1>
              <p
                className={clsx(
                  'text-xs transition-colors',
                  isScrolled ? 'text-gray-600' : 'text-gray-200'
                )}
              >
                Real-time CityCat & Cross River Ferry locations
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://translink.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'text-sm hover:underline transition-colors',
                isScrolled ? 'text-gray-600 hover:text-charcoal' : 'text-gray-200 hover:text-white'
              )}
            >
              TransLink
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
