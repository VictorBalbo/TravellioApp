import { Place } from "@/models";

const BASE_URL = "http://192.168.18.29:5000/api";

export class MapService {
  static getPlaceDetails = async (id: string): Promise<Place> => {
    const response = await fetch(`${BASE_URL}/places/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch place: ${response.status}`);
    }
    return response.json() as Promise<Place>;
  };
}
