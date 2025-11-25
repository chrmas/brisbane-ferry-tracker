export type ServiceType = 'citycat' | 'cross-river';

export interface FerryPosition {
  lat: number;
  lon: number;
  bearing: number;
  speed?: number;
}

export interface TripInfo {
  tripId: string;
  headsign: string;
  direction: 0 | 1;
  routeId: string;
}

export interface Ferry {
  id: string;
  routeId: string;
  routeName: string;
  serviceType: ServiceType;
  position: FerryPosition;
  trip: TripInfo;
  timestamp: number;
  nextStop?: string;
}
