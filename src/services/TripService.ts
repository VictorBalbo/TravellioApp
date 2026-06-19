import { Activity, Destination, Trip } from "@/models";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export class TripService {
  static getTripData = async (tripId: string): Promise<Trip> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.status}`);
    }
    return response.json() as Promise<Trip>;
  };
  static setDestination = async (tripId: string, destination: Destination): Promise<Destination> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      throw new Error(`Failed to set Destination: ${response.status}`);
    }
    return response.json() as Promise<Destination>;
  };
  static deleteDestination = async (tripId: string, destinationId: string) => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations/${destinationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Destination: ${response.status}`);
    }
    return;
  };

  static setActivity = async (tripId: string, destinationId: string, activity: Activity): Promise<Activity> => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations/${destinationId}/Activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    if (!response.ok) {
      throw new Error(`Failed to set Activity: ${response.status}`);
    }
    return response.json() as Promise<Activity>;
  };

  static deleteActivity = async (tripId: string, destinationId: string, activityId: string) => {
    const response = await fetch(`${BASE_URL}/Trips/${tripId}/Destinations/${destinationId}/Activities/${activityId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Activity: ${response.status}`);
    }
    return;
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
