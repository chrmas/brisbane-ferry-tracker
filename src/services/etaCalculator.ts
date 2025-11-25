import type { Ferry } from '../types/ferry';
import type { Terminal } from '../types/terminal';
import type { ETAResult } from '../types/eta';
import type { GTFSData, StopTime, Stop } from '../types/gtfs';
import type { GTFSRTTripUpdate } from '../types/api';
import { haversineDistance, calculateBearing } from '../utils/mapUtils';
import { formatArrivalTime, gtfsTimeToTimestamp } from '../utils/formatTime';
import { AVERAGE_DELAY_MS } from '../utils/constants';

export class ETACalculator {
  private gtfsData: GTFSData | null = null;
  private tripUpdates: Map<string, GTFSRTTripUpdate> = new Map();

  setGTFSData(data: GTFSData): void {
    this.gtfsData = data;
  }

  setTripUpdates(updates: Map<string, GTFSRTTripUpdate>): void {
    this.tripUpdates = updates;
  }

  /**
   * Calculate ETA for a ferry arriving at a terminal
   */
  calculate(ferry: Ferry, terminal: Terminal): ETAResult {
    // If no GTFS data available, return error
    if (!this.gtfsData) {
      return {
        status: 'error',
        displayText: 'Schedule data unavailable',
        lastUpdated: Date.now(),
      };
    }

    // Get trip information
    const trip = this.gtfsData.trips.get(ferry.trip.tripId);
    if (!trip) {
      console.warn('Trip not found:', ferry.trip.tripId);
      return this.fallbackScheduledETA(ferry, terminal);
    }

    // Get stop times for this trip
    const stopTimes = this.gtfsData.stopTimes.get(trip.tripId);
    if (!stopTimes || stopTimes.length === 0) {
      return this.fallbackScheduledETA(ferry, terminal);
    }

    // Check if terminal is on this route
    const terminalStopTime = stopTimes.find((st) => st.stopId === terminal.stopId);
    if (!terminalStopTime) {
      return {
        status: 'not-on-route',
        displayText: 'Does not stop here',
        lastUpdated: Date.now(),
      };
    }

    // Get current position in stop sequence
    const currentStopSequence = this.estimateCurrentStopSequence(ferry, stopTimes);
    const targetStopSequence = terminalStopTime.stopSequence;

    // Check if ferry already passed this stop
    if (targetStopSequence <= currentStopSequence) {
      return {
        status: 'passed',
        displayText: 'Already passed this stop',
        lastUpdated: Date.now(),
      };
    }

    // Try to get real-time ETA from trip updates
    const tripUpdate = this.tripUpdates.get(ferry.trip.tripId);
    if (tripUpdate) {
      const stopUpdate = tripUpdate.tripUpdate.stopTimeUpdate.find(
        (stu) => stu.stopId === terminal.stopId
      );

      if (stopUpdate?.arrival?.time) {
        const arrivalTime = stopUpdate.arrival.time * 1000;
        return {
          status: 'realtime',
          time: arrivalTime,
          delay: stopUpdate.arrival.delay,
          displayText: formatArrivalTime(arrivalTime),
          confidence: 'high',
          lastUpdated: Date.now(),
        };
      }
    }

    // Fallback to scheduled time + average delay
    return this.fallbackScheduledETA(ferry, terminal, terminalStopTime);
  }

  /**
   * Estimate which stop the ferry is currently near/passing
   */
  private estimateCurrentStopSequence(ferry: Ferry, stopTimes: StopTime[]): number {
    if (!this.gtfsData) return 0;

    const ferryPos = ferry.position;
    let nearestStop: { stop: Stop; stopTime: StopTime } | null = null;
    let minDistance = Infinity;

    for (const stopTime of stopTimes) {
      const stop = this.gtfsData.stops.get(stopTime.stopId);
      if (!stop) continue;

      const distance = haversineDistance(
        ferryPos.lat,
        ferryPos.lon,
        stop.stopLat,
        stop.stopLon
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStop = { stop, stopTime };
      }
    }

    if (!nearestStop) return 0;

    // Check if ferry is moving away from nearest stop (likely departed)
    const bearing = calculateBearing(
      ferryPos.lat,
      ferryPos.lon,
      nearestStop.stop.stopLat,
      nearestStop.stop.stopLon
    );

    const bearingDiff = Math.abs(bearing - ferryPos.bearing);

    // If ferry is moving away (bearing difference > 90°), assume it departed this stop
    if (bearingDiff > 90 && bearingDiff < 270) {
      return nearestStop.stopTime.stopSequence;
    }

    // Moving towards, hasn't arrived yet
    return Math.max(0, nearestStop.stopTime.stopSequence - 1);
  }

  /**
   * Fallback ETA calculation using scheduled time + average delay
   */
  private fallbackScheduledETA(
    _ferry: Ferry,
    _terminal: Terminal,
    stopTime?: StopTime
  ): ETAResult {
    if (!stopTime) {
      // No schedule data available
      return {
        status: 'error',
        displayText: 'Schedule unavailable',
        lastUpdated: Date.now(),
      };
    }

    try {
      const scheduledArrival = gtfsTimeToTimestamp(stopTime.arrivalTime);
      const estimatedArrival = scheduledArrival + AVERAGE_DELAY_MS;

      return {
        status: 'scheduled',
        time: estimatedArrival,
        delay: AVERAGE_DELAY_MS / 1000, // Convert to seconds
        displayText: formatArrivalTime(estimatedArrival),
        confidence: 'medium',
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error('Failed to parse scheduled time:', error);
      return {
        status: 'error',
        displayText: 'Unable to calculate arrival time',
        lastUpdated: Date.now(),
      };
    }
  }
}

// Singleton instance
export const etaCalculator = new ETACalculator();
