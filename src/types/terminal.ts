import { ServiceType } from './ferry';

export interface Terminal {
  stopId: string;
  name: string;
  position: {
    lat: number;
    lon: number;
  };
  address: string;
  suburb: string;
  services: ServiceType[];
  accessibility: {
    wheelchairAccessible: boolean;
    parking: boolean;
  };
  nearbyBusRoutes?: string[];
}
