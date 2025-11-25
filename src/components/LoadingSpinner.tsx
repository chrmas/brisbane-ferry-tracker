export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-translink-blue rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-charcoal">Loading ferry data...</p>
        <p className="text-sm text-gray-600 mt-2">Fetching real-time positions from TransLink</p>
      </div>
    </div>
  );
}
