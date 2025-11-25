export type FilterType = 'all' | 'citycat' | 'cross-river';

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}
