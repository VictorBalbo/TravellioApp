import { Destination, Place } from "@/models";
import { createContext, ReactNode, useContext, useState } from "react";

interface MapContextType {
  fitDestination: (destination?: Destination) => void;
  fitPlace: (place?: Place) => void;
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

  const fitPlace = (place?: Place) => {
    if (place) {
      setSelectedMarker(place);
    } else {
      setSelectedMarker(undefined);
    }
  };

  const fitDestination = (destination?: Destination) => {
    if (!destination) {
      setCenteredMarkers([]);
      setSelectedMarker(undefined);
      return;
    }
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
  };

  return (
    <MapContext.Provider value={{ fitDestination, fitPlace, centeredMarkers, selectedMarker }}>
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
