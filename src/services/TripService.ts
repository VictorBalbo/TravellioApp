import { Destination, Trip } from "@/models";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export class TripService {
  static getTripData = async (tripId: string): Promise<Trip> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.status}`);
    }
    return response.json() as Promise<Trip>;
  };
  static getDestinationData = async (tripId: string, destinationId: string): Promise<Destination> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations/${destinationId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.status}`);
    }
    return response.json() as Promise<Destination>;
  };

  static setDestinationData = async (tripId: string, destination: Destination): Promise<Destination> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations`, {
      method: "POST",
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.status}`);
    }
    return response.json() as Promise<Destination>;
  };
  static getPhotoForPlace = (keys?: string[]) => {
    if (keys?.length) {
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/${keys[0]}`;
    } else {
      return;
    }
  };
  static getMediumPhotoForPlace = (keys?: string[]) => {
    if (keys?.length) {
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageMedium/${keys[0]} 1200w`;
    }
  };
}
