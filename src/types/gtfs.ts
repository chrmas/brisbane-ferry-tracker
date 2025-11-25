export interface Route {
  routeId: string;
  routeShortName: string;
  routeLongName: string;
  routeType: number;
  routeColor?: string;
}

export interface Trip {
  tripId: string;
  routeId: string;
  serviceId: string;
  tripHeadsign: string;
  directionId: 0 | 1;
  shapeId?: string;
}

export interface StopTime {
  tripId: string;
  arrivalTime: string;
  departureTime: string;
  stopId: string;
  stopSequence: number;
}

export interface Stop {
  stopId: string;
  stopName: string;
  stopLat: number;
  stopLon: number;
}

export interface Shape {
  shapeId: string;
  shapePtLat: number;
  shapePtLon: number;
  shapePtSequence: number;
}

export interface GTFSData {
  routes: Map<string, Route>;
  trips: Map<string, Trip>;
  stops: Map<string, Stop>;
  stopTimes: Map<string, StopTime[]>;
  shapes?: Map<string, Shape[]>;
}
