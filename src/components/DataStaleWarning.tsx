import { formatRelativeTime } from '@utils/formatTime';

interface DataStaleWarningProps {
  lastUpdate: number;
}

export function DataStaleWarning({ lastUpdate }: DataStaleWarningProps) {
  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-[1001] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg animate-slide-up">
      <div className="flex items-center gap-2 text-sm">
        <span>⚠️</span>
        <span>
          Data may be stale. Last updated {formatRelativeTime(lastUpdate)}
        </span>
      </div>
    </div>
  );
}
