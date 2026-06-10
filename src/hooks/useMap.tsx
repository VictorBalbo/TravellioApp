import { Destination, Place, Trip } from "@/models";
import { createContext, ReactNode, useContext, useState } from "react";

interface MapContextType {
  focusTripMarkers: (trip?: Trip) => void;
  focusDestinationMarkers: (destination?: Destination) => void;
  focusPlaceMarker: (place?: Place) => void;
  focusedDestinationId?: string;
  centeredMarkers: Place[];
  selectedMarker?: Place;
}
const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}
export const MapProvider = ({ children }: MapProviderProps) => {
  const [centeredMarkers, setCenteredMarkers] = useState<Place[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Place>();
  const [focusedDestinationId, setFocusedDestinationId] = useState<string>();

  const focusPlaceMarker = (place?: Place) => {
    setSelectedMarker(place);
  };

  const focusDestinationMarkers = (destination?: Destination) => {
    if (!destination?.place) {
      return;
    }
    console.log("focusDestinationMarkers", destination.place.name);
    const markers = [destination.place];
    if (destination.activities?.length) {
      const activities = destination.activities.filter((a) => a.place).map((a) => a.place!);
      markers.push(...activities);
    }
    if (destination.accommodations?.length) {
      const accommodations = destination.accommodations.filter((a) => a.place).map((a) => a.place!);
      markers.push(...accommodations);
    }
    setCenteredMarkers(markers);
    setSelectedMarker(destination.place);
    setFocusedDestinationId(destination.id);
  };

  const focusTripMarkers = (trip?: Trip) => {
    const markers = trip?.destinations?.filter((d) => d.place).map((d) => d.place!) ?? [];

    setCenteredMarkers(markers);
    setSelectedMarker(undefined);
    setFocusedDestinationId(undefined);
  };

  return (
    <MapContext.Provider
      value={{
        focusTripMarkers,
        focusDestinationMarkers,
        focusPlaceMarker,
        centeredMarkers,
        selectedMarker,
        focusedDestinationId,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be ysed within a MapProvider");
  }
  return context;
};
