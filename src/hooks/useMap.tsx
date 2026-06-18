import { Coordinates, Destination, Place, Trip } from "@/models";
import { createContext, ReactNode, useContext, useState } from "react";

interface MapContextType {
  focusTripMarkers: (trip?: Trip) => void;
  focusDestinationMarkers: (destination?: Destination) => void;
  focusPlaceMarker: (place?: Place) => void;
  focusedDestinationId?: string;
  centeredMarkers: Coordinates[];
  selectedMarker?: Place;
}
const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}
export const MapProvider = ({ children }: MapProviderProps) => {
  const [centeredMarkers, setCenteredMarkers] = useState<Coordinates[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Place>();
  const [focusedDestinationId, setFocusedDestinationId] = useState<string>();

  const focusPlaceMarker = (place?: Place) => {
    setSelectedMarker(place);
  };

  const focusDestinationMarkers = (destination?: Destination) => {
    if (!destination) {
      return;
    }
    const markers = [destination.coordinates];
    if (destination.activities?.length) {
      const activities = destination.activities.map((a) => a.coordinates);
      markers.push(...activities);
    }
    if (destination.accommodations?.length) {
      const accommodations = destination.accommodations.map((a) => a.coordinates);
      markers.push(...accommodations);
    }
    setCenteredMarkers(markers);
    const destinationPlace: Place = {
      id: destination.placeId,
      coordinates: destination.coordinates,
      name: destination.name,
    };
    setSelectedMarker(destinationPlace);
    setFocusedDestinationId(destination.id);
  };

  const focusTripMarkers = (trip?: Trip) => {
    const markers = trip?.destinations?.map((d) => d.coordinates) ?? [];

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
