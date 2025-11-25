import { useEffect } from 'react';
import { MapView } from '@components/MapView';
import { Navigation } from '@components/Navigation';
import { Footer } from '@components/Footer';
import { ServiceFilter } from '@components/ServiceFilter';
import { FerryInfoPanel } from '@components/FerryInfoPanel';
import { ETAModal } from '@components/ETAModal';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { ErrorDisplay } from '@components/ErrorDisplay';
import { DataStaleWarning } from '@components/DataStaleWarning';
import { useAppStore } from '@store/useAppStore';
import { gtfsRTService } from '@services/gtfsRTService';
import { terminalService } from '@services/terminalService';

function App() {
  const {
    ferries,
    terminals,
    selectedFerry,
    selectedTerminal,
    filterService,
    currentETA,
    isLoading,
    error,
    dataStale,
    lastUpdate,
    setFerries,
    setTerminals,
    selectFerry,
    selectTerminal,
    setFilterService,
    calculateETA,
    setError,
    setIsLoading,
    resetSelection,
  } = useAppStore();

  // Initialize app - load terminals and start ferry polling
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);

      try {
        // Load terminals
        const terminalData = await terminalService.loadTerminals();
        setTerminals(terminalData);

        // Start polling for ferry positions
        gtfsRTService.startPolling((ferryData) => {
          setFerries(ferryData);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err as Error);
      }
    }

    initialize();

    // Cleanup on unmount
    return () => {
      gtfsRTService.stopPolling();
    };
  }, [setFerries, setTerminals, setError, setIsLoading]);

  // Handle retry after error
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Render error state
  if (error && !ferries.length) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  // Render loading state
  if (isLoading && !ferries.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navigation />

      <MapView
        ferries={ferries}
        terminals={terminals}
        selectedFerry={selectedFerry}
        selectedTerminal={selectedTerminal}
        filterService={filterService}
        onFerrySelect={selectFerry}
        onTerminalSelect={selectTerminal}
      />

      <ServiceFilter filterService={filterService} onFilterChange={setFilterService} />

      {selectedFerry && <FerryInfoPanel ferry={selectedFerry} onClose={resetSelection} />}

      {selectedFerry && selectedTerminal && currentETA && (
        <ETAModal
          ferry={selectedFerry}
          terminal={selectedTerminal}
          eta={currentETA}
          onClose={() => selectTerminal(null)}
          onRecalculate={() => calculateETA(selectedFerry, selectedTerminal)}
        />
      )}

      {dataStale && lastUpdate && <DataStaleWarning lastUpdate={lastUpdate} />}

      <Footer />

      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ferries.length} ferries currently operating
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="sr-only">
          {error.message}
        </div>
      )}
    </div>
  );
}

export default App;
