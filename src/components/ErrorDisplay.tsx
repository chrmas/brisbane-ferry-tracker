interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Unable to Load Ferry Data</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Failed to connect to TransLink API. Please check your internet connection.'}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-translink-blue hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Try Again
          </button>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>If the problem persists, the TransLink API may be temporarily unavailable.</p>
        </div>
      </div>
    </div>
  );
}
