export type ETAStatus = 'realtime' | 'scheduled' | 'not-on-route' | 'passed' | 'error';

export interface ETAResult {
  status: ETAStatus;
  time?: number;
  delay?: number;
  displayText: string;
  confidence?: 'high' | 'medium' | 'low';
  lastUpdated: number;
}
