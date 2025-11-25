import { create } from 'zustand';
import { Ferry } from '@types/ferry';
import { Terminal } from '@types/terminal';
import { GTFSData } from '@types/gtfs';
import { ETAResult } from '@types/eta';
import { FilterType } from '@types/ui';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, DATA_STALE_THRESHOLD } from '@utils/constants';
import { etaCalculator } from '@services/etaCalculator';

interface AppStore {
  // Ferry data
  ferries: Ferry[];
  selectedFerry: Ferry | null;

  // Terminal data
  terminals: Terminal[];
  selectedTerminal: Terminal | null;

  // GTFS static data
  gtfsData: GTFSData | null;

  // UI state
  filterService: FilterType;
  showLegend: boolean;
  mapCenter: [number, number];
  mapZoom: number;

  // Data status
  lastUpdate: number | null;
  isLoading: boolean;
  error: Error | null;
  dataStale: boolean;

  // ETA
  currentETA: ETAResult | null;

  // Actions
  setFerries: (ferries: Ferry[]) => void;
  selectFerry: (ferry: Ferry | null) => void;
  selectTerminal: (terminal: Terminal | null) => void;
  setTerminals: (terminals: Terminal[]) => void;
  setFilterService: (filter: FilterType) => void;
  setGTFSData: (data: GTFSData) => void;
  calculateETA: (ferry: Ferry, terminal: Terminal) => void;
  toggleLegend: () => void;
  setError: (error: Error | null) => void;
  setIsLoading: (loading: boolean) => void;
  updateDataStatus: () => void;
  resetSelection: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  ferries: [],
  selectedFerry: null,
  terminals: [],
  selectedTerminal: null,
  gtfsData: null,
  filterService: 'all',
  showLegend: false,
  mapCenter: DEFAULT_MAP_CENTER,
  mapZoom: DEFAULT_MAP_ZOOM,
  lastUpdate: null,
  isLoading: false,
  error: null,
  dataStale: false,
  currentETA: null,

  // Actions
  setFerries: (ferries) => {
    set({ ferries, lastUpdate: Date.now(), error: null });
    get().updateDataStatus();
  },

  selectFerry: (ferry) => {
    set({
      selectedFerry: ferry,
      selectedTerminal: null,
      currentETA: null,
    });
  },

  selectTerminal: (terminal) => {
    const { selectedFerry } = get();
    if (!selectedFerry || !terminal) {
      set({ selectedTerminal: null, currentETA: null });
      return;
    }

    set({ selectedTerminal: terminal });
    get().calculateETA(selectedFerry, terminal);
  },

  setTerminals: (terminals) => {
    set({ terminals });
  },

  setFilterService: (filter) => {
    set({ filterService: filter });

    // Deselect ferry if it's filtered out
    const { selectedFerry } = get();
    if (selectedFerry && filter !== 'all' && selectedFerry.serviceType !== filter) {
      get().resetSelection();
    }
  },

  setGTFSData: (data) => {
    set({ gtfsData: data });
    etaCalculator.setGTFSData(data);
  },

  calculateETA: (ferry, terminal) => {
    const eta = etaCalculator.calculate(ferry, terminal);
    set({ currentETA: eta });
  },

  toggleLegend: () => {
    set((state) => ({ showLegend: !state.showLegend }));
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  updateDataStatus: () => {
    const { lastUpdate } = get();
    if (!lastUpdate) {
      set({ dataStale: false });
      return;
    }

    const timeSinceUpdate = Date.now() - lastUpdate;
    set({ dataStale: timeSinceUpdate > DATA_STALE_THRESHOLD });
  },

  resetSelection: () => {
    set({
      selectedFerry: null,
      selectedTerminal: null,
      currentETA: null,
    });
  },
}));
