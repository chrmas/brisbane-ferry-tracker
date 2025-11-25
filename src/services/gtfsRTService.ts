import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import type { Ferry, ServiceType } from '../types/ferry';
import type { GTFSRTTripUpdate } from '../types/api';
import {
  GTFS_RT_VEHICLE_POSITIONS_URL,
  GTFS_RT_TRIP_UPDATES_URL,
  API_TIMEOUT,
  MAX_RETRIES,
  FERRY_POSITION_POLL_INTERVAL,
} from '../utils/constants';
import { isValidFerry } from '../utils/validation';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GTFSRTService {
  private intervalId: NodeJS.Timeout | null = null;
  private retryCount = 0;

  /**
   * Fetch and parse GTFS-RT vehicle positions
   */
  async fetchVehiclePositions(): Promise<Ferry[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(GTFS_RT_VEHICLE_POSITIONS_URL, {
        signal: controller.signal,
        headers: {
          Accept: 'application/x-protobuf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      );

      const ferries = this.filterAndTransformFerries(feed);
      this.retryCount = 0; // Reset on success

      return ferries;
    } catch (error) {
      if (this.retryCount < MAX_RETRIES) {
        this.retryCount++;
        console.warn(`Retry ${this.retryCount}/${MAX_RETRIES}`, error);
        await delay(Math.pow(2, this.retryCount) * 1000); // Exponential backoff
        return this.fetchVehiclePositions();
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch trip updates for ETA predictions
   */
  async fetchTripUpdates(): Promise<Map<string, GTFSRTTripUpdate>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(GTFS_RT_TRIP_UPDATES_URL, {
        signal: controller.signal,
        headers: {
          Accept: 'application/x-protobuf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      );

      const tripUpdates = new Map<string, GTFSRTTripUpdate>();

      feed.entity.forEach((entity) => {
        if (entity.tripUpdate) {
          const tripUpdate: GTFSRTTripUpdate = {
            id: entity.id,
            tripUpdate: {
              trip: {
                tripId: entity.tripUpdate.trip.tripId || '',
                routeId: entity.tripUpdate.trip.routeId || '',
              },
              stopTimeUpdate: (entity.tripUpdate.stopTimeUpdate || []).map((stu) => ({
                stopSequence: stu.stopSequence || 0,
                stopId: stu.stopId || '',
                arrival: stu.arrival
                  ? {
                      delay: stu.arrival.delay ?? undefined,
                      time: stu.arrival.time?.toNumber() ?? undefined,
                    }
                  : undefined,
                departure: stu.departure
                  ? {
                      delay: stu.departure.delay ?? undefined,
                      time: stu.departure.time?.toNumber() ?? undefined,
                    }
                  : undefined,
              })),
            },
          };
          tripUpdates.set(entity.tripUpdate.trip.tripId || '', tripUpdate);
        }
      });

      return tripUpdates;
    } catch (error) {
      console.error('Failed to fetch trip updates:', error);
      return new Map();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Filter and transform GTFS-RT feed entities to Ferry objects
   */
  private filterAndTransformFerries(
    feed: GtfsRealtimeBindings.transit_realtime.FeedMessage
  ): Ferry[] {
    const ferries: Ferry[] = [];

    feed.entity.forEach((entity) => {
      if (!entity.vehicle) return;

      const vehicle = entity.vehicle;
      const routeId = vehicle.trip?.routeId || '';

      // Filter for ferry routes (route_type = 4 or route_id starts with 'F')
      if (!this.isFerryRoute(routeId)) return;

      try {
        const ferry: Ferry = {
          id: vehicle.vehicle?.id || entity.id,
          routeId,
          routeName: this.getRouteName(routeId),
          serviceType: this.getServiceType(routeId),
          position: {
            lat: vehicle.position?.latitude || 0,
            lon: vehicle.position?.longitude || 0,
            bearing: vehicle.position?.bearing || 0,
            speed: vehicle.position?.speed,
          },
          trip: {
            tripId: vehicle.trip?.tripId || '',
            headsign: vehicle.trip?.directionId === 0 ? 'Upstream' : 'Downstream',
            direction: (vehicle.trip?.directionId as 0 | 1) || 0,
            routeId,
          },
          timestamp: vehicle.timestamp
            ? vehicle.timestamp.toNumber() * 1000
            : Date.now(),
        };

        if (isValidFerry(ferry)) {
          ferries.push(ferry);
        }
      } catch (error) {
        console.error('Failed to transform ferry entity:', error);
      }
    });

    return ferries;
  }

  /**
   * Check if route is a ferry route
   */
  private isFerryRoute(routeId: string): boolean {
    // Ferry routes typically start with 'F' or are specifically known ferry routes
    return (
      routeId.startsWith('F') ||
      routeId.includes('FERRY') ||
      routeId.includes('CITYCAT') ||
      routeId.includes('CRF')
    );
  }

  /**
   * Get human-readable route name
   */
  private getRouteName(routeId: string): string {
    if (routeId.includes('CITYCAT') || routeId === 'F1') {
      return 'CityCat';
    }
    if (routeId.includes('CRF') || routeId.startsWith('F')) {
      return 'Cross River Ferry';
    }
    return routeId;
  }

  /**
   * Determine service type from route
   */
  private getServiceType(routeId: string): ServiceType {
    if (routeId.includes('CITYCAT') || routeId === 'F1') {
      return 'citycat';
    }
    return 'cross-river';
  }

  /**
   * Start polling for ferry positions
   */
  startPolling(callback: (ferries: Ferry[]) => void): void {
    // Initial fetch
    this.fetchVehiclePositions()
      .then(callback)
      .catch((error) => console.error('Failed to fetch initial positions:', error));

    // Set up interval
    this.intervalId = setInterval(async () => {
      try {
        const ferries = await this.fetchVehiclePositions();
        callback(ferries);
      } catch (error) {
        console.error('Failed to fetch ferry positions:', error);
      }
    }, FERRY_POSITION_POLL_INTERVAL);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Singleton instance
export const gtfsRTService = new GTFSRTService();
