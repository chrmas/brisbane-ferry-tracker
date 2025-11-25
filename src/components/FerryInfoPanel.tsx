import clsx from 'clsx';
import type { Ferry } from '../types/ferry';

interface FerryInfoPanelProps {
  ferry: Ferry;
  onClose: () => void;
}

export function FerryInfoPanel({ ferry, onClose }: FerryInfoPanelProps) {
  return (
    <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-xl p-6 max-w-sm z-[1000] animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center text-white text-xl',
              ferry.serviceType === 'citycat' ? 'bg-translink-blue' : 'bg-ferry-orange'
            )}
          >
            🚢
          </div>
          <div>
            <h3 className="font-bold text-lg text-charcoal">{ferry.routeName}</h3>
            <p className="text-sm text-gray-600">{ferry.trip.headsign}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {ferry.position.speed && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Speed:</span>
            <span className="font-medium">{Math.round(ferry.position.speed * 3.6)} km/h</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Direction:</span>
          <span className="font-medium">{ferry.position.bearing}°</span>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-cream rounded-lg p-3 text-sm text-charcoal">
        💡 Click a terminal on the map to see arrival time
      </div>
    </div>
  );
}
