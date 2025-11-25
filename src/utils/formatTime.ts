import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a timestamp to a human-readable time
 * @param timestamp Unix timestamp in milliseconds
 * @param showSeconds Whether to show seconds
 */
export function formatTime(timestamp: number, showSeconds = false): string {
  const formatString = showSeconds ? 'h:mm:ss a' : 'h:mm a';
  return format(timestamp, formatString);
}

/**
 * Format a timestamp as relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true });
}

/**
 * Format minutes until arrival
 * @param timestamp Target arrival timestamp
 * @returns Formatted string like "Arrives in 8 min" or "Arrives at 12:45 PM"
 */
export function formatArrivalTime(timestamp: number): string {
  const minutesUntil = Math.floor((timestamp - Date.now()) / 60000);

  if (minutesUntil < 0) {
    return `Departed ${Math.abs(minutesUntil)} min ago`;
  }

  if (minutesUntil < 60) {
    return `Arrives in ${minutesUntil} min`;
  }

  return `Arrives at ${formatTime(timestamp)}`;
}

/**
 * Parse GTFS time string (HH:MM:SS) to milliseconds from midnight
 */
export function parseGTFSTime(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Convert GTFS time to timestamp for today
 */
export function gtfsTimeToTimestamp(timeStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime() + parseGTFSTime(timeStr);
}
