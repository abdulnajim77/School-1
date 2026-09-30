/**
 * Geographic calculations and Geofencing utilities for SchoolSync
 * Uses the Haversine formula to compute exact great-circle distance between two GPS coordinates.
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Calculates distance in meters between two lat/lng coordinates using the Haversine formula
 */
export function calculateHaversineDistanceMeters(
  point1: LatLng,
  point2: LatLng
): number {
  const R = 6371000; // Radius of Earth in meters
  const lat1Rad = (point1.latitude * Math.PI) / 180;
  const lat2Rad = (point2.latitude * Math.PI) / 180;
  const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const deltaLng = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculates distance formatted nicely in meters or kilometers
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Calculates estimated time of arrival (in minutes) based on distance and average speed (km/h)
 * Default city school bus speed is ~25 km/h considering traffic and stops.
 */
export function calculateEtaMinutes(distanceMeters: number, averageSpeedKmh: number = 25): number {
  if (distanceMeters <= 50) return 0;
  const speedMps = (averageSpeedKmh * 1000) / 3600; // meters per second
  const seconds = distanceMeters / speedMps;
  const minutes = Math.ceil(seconds / 60);
  return Math.max(1, minutes);
}

/**
 * Calculates compass bearing from point 1 to point 2 (degrees 0-360)
 */
export function calculateBearing(point1: LatLng, point2: LatLng): number {
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;
  const deltaLng = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;
  return Math.round(brng);
}

/**
 * Linear interpolation between two coordinates
 */
export function interpolateLatLng(
  point1: LatLng,
  point2: LatLng,
  fraction: number
): LatLng {
  const f = Math.max(0, Math.min(1, fraction));
  return {
    latitude: point1.latitude + (point2.latitude - point1.latitude) * f,
    longitude: point1.longitude + (point2.longitude - point1.longitude) * f,
  };
}

/**
 * Format a modern timestamp (e.g. "8:04:32 AM" or "08:12 AM")
 */
export function formatTimeAmPm(date: Date = new Date(), includeSeconds: boolean = false): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 is 12
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  const secStr = seconds < 10 ? '0' + seconds : seconds;

  if (includeSeconds) {
    return `${hours}:${minStr}:${secStr} ${ampm}`;
  }
  return `${hours}:${minStr} ${ampm}`;
}
