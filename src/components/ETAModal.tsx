import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Ferry } from '@types/ferry';
import { Terminal } from '@types/terminal';
import { ETAResult } from '@types/eta';

interface ETAModalProps {
  ferry: Ferry;
  terminal: Terminal;
  eta: ETAResult;
  onClose: () => void;
  onRecalculate: () => void;
}

export function ETAModal({ ferry, terminal, eta, onClose, onRecalculate }: ETAModalProps) {
  // Auto-refresh ETA every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onRecalculate();
    }, 30000);

    return () => clearInterval(interval);
  }, [onRecalculate]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eta-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4">
            <div
              className={clsx(
                'w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl',
                ferry.serviceType === 'citycat' ? 'bg-blue-100' : 'bg-orange-100'
              )}
            >
              🚢
            </div>
          </div>

          <h2 id="eta-modal-title" className="text-2xl font-bold text-charcoal mb-2">
            {ferry.routeName}
          </h2>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <span>→</span>
            <span className="font-medium">{terminal.name}</span>
          </div>

          {/* ETA Display */}
          <div
            className={clsx(
              'text-4xl font-bold mb-2',
              eta.status === 'realtime' && 'text-green-600',
              eta.status === 'scheduled' && 'text-blue-600',
              eta.status === 'not-on-route' && 'text-gray-600',
              eta.status === 'passed' && 'text-orange-600',
              eta.status === 'error' && 'text-red-600'
            )}
          >
            {eta.displayText}
          </div>

          {/* Status indicators */}
          {eta.status === 'realtime' && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <span className="animate-pulse">●</span>
              Real-time estimate
            </div>
          )}

          {eta.status === 'scheduled' && (
            <div className="text-sm text-gray-600">Based on schedule (±2 min)</div>
          )}

          {eta.status === 'error' && (
            <div className="text-sm text-red-600">Unable to calculate arrival time</div>
          )}

          {/* Delay indicator */}
          {eta.delay && Math.abs(eta.delay) > 60 && (
            <div
              className={clsx(
                'mt-4 px-4 py-2 rounded-full text-sm inline-block',
                eta.delay > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              )}
            >
              {eta.delay > 0 ? 'Running late' : 'Running early'} by{' '}
              {Math.abs(Math.round(eta.delay / 60))} min
            </div>
          )}

          {/* Additional info */}
          <div className="mt-6 text-xs text-gray-500">
            Last updated: {new Date(eta.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
