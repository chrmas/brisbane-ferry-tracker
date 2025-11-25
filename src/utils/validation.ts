import { Ferry } from '@types/ferry';
import { Terminal } from '@types/terminal';
import { isInBrisbaneBounds } from './mapUtils';

/**
 * Validate ferry data
 */
export function isValidFerry(ferry: any): ferry is Ferry {
  if (!ferry || typeof ferry !== 'object') return false;

  return (
    typeof ferry.id === 'string' &&
    typeof ferry.routeId === 'string' &&
    typeof ferry.routeName === 'string' &&
    (ferry.serviceType === 'citycat' || ferry.serviceType === 'cross-river') &&
    typeof ferry.position === 'object' &&
    typeof ferry.position.lat === 'number' &&
    typeof ferry.position.lon === 'number' &&
    isInBrisbaneBounds(ferry.position.lat, ferry.position.lon) &&
    typeof ferry.position.bearing === 'number' &&
    ferry.position.bearing >= 0 &&
    ferry.position.bearing < 360 &&
    typeof ferry.trip === 'object' &&
    typeof ferry.trip.tripId === 'string' &&
    typeof ferry.timestamp === 'number'
  );
}

/**
 * Validate terminal data
 */
export function isValidTerminal(terminal: any): terminal is Terminal {
  if (!terminal || typeof terminal !== 'object') return false;

  return (
    typeof terminal.stopId === 'string' &&
    typeof terminal.name === 'string' &&
    typeof terminal.position === 'object' &&
    typeof terminal.position.lat === 'number' &&
    typeof terminal.position.lon === 'number' &&
    isInBrisbaneBounds(terminal.position.lat, terminal.position.lon) &&
    Array.isArray(terminal.services)
  );
}

/**
 * Sanitize API response data
 */
export function sanitizeData<T>(
  data: any,
  validator: (item: any) => item is T
): T[] {
  if (!Array.isArray(data)) return [];
  return data.filter(validator);
}
