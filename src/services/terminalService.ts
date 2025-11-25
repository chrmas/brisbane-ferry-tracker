import { Terminal } from '@types/terminal';
import { BCCTerminalResponse } from '@types/api';
import { ServiceType } from '@types/ferry';
import {
  BCC_TERMINALS_URL,
  TERMINALS_CACHE_KEY,
  TERMINALS_CACHE_DURATION,
} from '@utils/constants';
import { isValidTerminal } from '@utils/validation';

export class TerminalService {
  /**
   * Load ferry terminals from BCC API or cache
   */
  async loadTerminals(): Promise<Terminal[]> {
    // Check localStorage cache
    const cached = this.getCachedTerminals();
    if (cached) {
      console.log('Using cached terminal data');
      return cached;
    }

    // Fetch from API
    try {
      console.log('Fetching terminal data from BCC API...');
      const response = await fetch(BCC_TERMINALS_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json: BCCTerminalResponse = await response.json();
      const terminals = this.transformBCCData(json);

      // Cache for future use
      this.cacheTerminals(terminals);

      return terminals;
    } catch (error) {
      console.error('Failed to fetch terminals:', error);
      // Return hardcoded fallback if API fails
      return this.getFallbackTerminals();
    }
  }

  /**
   * Get cached terminals from localStorage
   */
  private getCachedTerminals(): Terminal[] | null {
    try {
      const cached = localStorage.getItem(TERMINALS_CACHE_KEY);
      if (!cached) return null;

      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp > TERMINALS_CACHE_DURATION) {
        localStorage.removeItem(TERMINALS_CACHE_KEY);
        return null;
      }

      return data.filter(isValidTerminal);
    } catch (error) {
      console.error('Failed to read cached terminals:', error);
      return null;
    }
  }

  /**
   * Cache terminals to localStorage
   */
  private cacheTerminals(terminals: Terminal[]): void {
    try {
      localStorage.setItem(
        TERMINALS_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: terminals,
        })
      );
    } catch (error) {
      console.error('Failed to cache terminals:', error);
    }
  }

  /**
   * Transform BCC API response to Terminal objects
   */
  private transformBCCData(response: BCCTerminalResponse): Terminal[] {
    return response.records
      .map((record) => {
        const fields = record.fields;

        const terminal: Terminal = {
          stopId: this.generateStopId(fields.terminal_name),
          name: fields.terminal_name,
          position: {
            lat: fields.geo_point_2d[0],
            lon: fields.geo_point_2d[1],
          },
          address: fields.street,
          suburb: fields.suburb,
          services: this.parseServices(fields.services),
          accessibility: {
            wheelchairAccessible: fields.accessibility?.toLowerCase().includes('wheelchair') || false,
            parking: fields.parking?.toLowerCase() === 'yes',
          },
          nearbyBusRoutes: fields.nearby_bus_routes
            ? fields.nearby_bus_routes.split(',').map((r) => r.trim())
            : undefined,
        };

        return terminal;
      })
      .filter(isValidTerminal);
  }

  /**
   * Generate stop ID from terminal name (to match with GTFS)
   */
  private generateStopId(name: string): string {
    return name.toUpperCase().replace(/\s+/g, '_');
  }

  /**
   * Parse service types from BCC data
   */
  private parseServices(servicesStr: string): ServiceType[] {
    const services: ServiceType[] = [];
    const lower = servicesStr.toLowerCase();

    if (lower.includes('citycat')) {
      services.push('citycat');
    }
    if (lower.includes('cross river')) {
      services.push('cross-river');
    }

    // Default to citycat if unclear
    if (services.length === 0) {
      services.push('citycat');
    }

    return services;
  }

  /**
   * Fallback terminals (major stops only)
   */
  private getFallbackTerminals(): Terminal[] {
    return [
      {
        stopId: 'NORTH_QUAY',
        name: 'North Quay',
        position: { lat: -27.469, lon: 153.018 },
        address: 'North Quay',
        suburb: 'Brisbane City',
        services: ['citycat'],
        accessibility: { wheelchairAccessible: true, parking: false },
      },
      {
        stopId: 'SOUTH_BANK',
        name: 'South Bank',
        position: { lat: -27.476, lon: 153.018 },
        address: 'South Bank Parklands',
        suburb: 'South Brisbane',
        services: ['citycat'],
        accessibility: { wheelchairAccessible: true, parking: true },
      },
      {
        stopId: 'RIVERSIDE',
        name: 'Riverside',
        position: { lat: -27.467, lon: 153.027 },
        address: 'Eagle Street Pier',
        suburb: 'Brisbane City',
        services: ['citycat'],
        accessibility: { wheelchairAccessible: true, parking: false },
      },
      // Add more fallback terminals as needed
    ];
  }
}

// Singleton instance
export const terminalService = new TerminalService();
