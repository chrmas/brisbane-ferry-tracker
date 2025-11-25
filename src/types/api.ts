// GTFS-RT VehiclePosition (parsed from Protocol Buffer)
export interface GTFSRTVehiclePosition {
  id: string;
  vehicle: {
    trip: {
      tripId: string;
      routeId: string;
      directionId: 0 | 1;
      startTime?: string;
      startDate?: string;
    };
    position: {
      latitude: number;
      longitude: number;
      bearing?: number;
      speed?: number;
    };
    timestamp?: number;
    vehicle: {
      id: string;
      label?: string;
    };
  };
}

// GTFS-RT TripUpdate (for ETA predictions)
export interface GTFSRTTripUpdate {
  id: string;
  tripUpdate: {
    trip: {
      tripId: string;
      routeId: string;
    };
    stopTimeUpdate: {
      stopSequence: number;
      stopId: string;
      arrival?: {
        delay?: number;
        time?: number;
      };
      departure?: {
        delay?: number;
        time?: number;
      };
    }[];
  };
}

// Brisbane City Council Ferry Terminals API
export interface BCCTerminalResponse {
  records: {
    fields: {
      terminal_name: string;
      geo_point_2d: [number, number];
      street: string;
      suburb: string;
      accessibility: string;
      parking: string;
      services: string;
      nearby_bus_routes?: string;
    };
  }[];
}
