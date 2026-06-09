import { Region } from "react-native-maps";

export const getRadiusFromRegion = (region: Region) => {
  const { latitude, longitude, latitudeDelta } = region;

  // 1. Find the coordinates for the top edge of the map viewport
  const topEdgeLat = latitude + latitudeDelta / 2;

  // 2. Earth's radius in kilometers (use 3958.8 for miles)
  const earthRadius = 6371;

  // 3. Convert degrees to radians
  const dLat = (topEdgeLat - latitude) * (Math.PI / 180);

  // 4. Haversine formula simplified for points on the same longitude
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const radiusInKm = earthRadius * c;

  // Google APIs usually expect radius in meters
  const radiusInMeters = radiusInKm * 1000;

  return radiusInMeters;
};
