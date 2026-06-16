import { AutoComplete, Place } from "@/models";
import { getLocales } from "expo-localization";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const locales = getLocales();
const deviceLang = locales[0].languageCode ?? "en";

export class MapService {
  static getPlaceDetails = async (id: string): Promise<Place> => {
    const response = await fetch(`${BASE_URL}/places/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch place: ${response.status}`);
    }
    return response.json() as Promise<Place>;
  };

  static getAutoComplete = async (
    text: string,
    lat: number,
    lng: number,
    rad: number,
    signal: AbortSignal,
  ): Promise<AutoComplete[]> => {
    const url = `${BASE_URL}/Places/AutoComplete?text=${text}&lat=${lat}&lng=${lng}&radius=${rad}&language=${deviceLang}`;
    try {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        console.warn("Failed to fetch autocomplete:", response.status);
        return [];
      }
      return response.json() as Promise<AutoComplete[]>;
    } catch (e) {
      console.error(e);
      return [];
    }
  };
}
