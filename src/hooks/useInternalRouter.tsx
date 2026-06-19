import { useGlobalSearchParams, useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";

interface RouterContextType {
  goToTrip: (tripId?: string) => void;
  goToDestination: (destinationId?: string) => void;
  goToPlace: (placeId?: string) => void;
  currentTripId?: string;
  currentDestinationId?: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface InternalRouterProviderProps {
  children: ReactNode;
}
export const InternalRouteProvider = ({ children }: InternalRouterProviderProps) => {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const [currentTripId, setCurrentTripId] = useState<string>();
  const [currentDestinationId, setCurrentDestinationId] = useState<string>();

  const goToTrip = (tripId?: string) => {
    if (!tripId || params.tripId === tripId) {
      return;
    }
    console.log("goToTrip", tripId);
    setCurrentTripId(tripId);
    setCurrentDestinationId(undefined);
    router.push({
      pathname: "/trip/TripOverview",
      params: { tripId },
    });
  };

  const goToDestination = (destinationId?: string) => {
    if (!destinationId || params.destinationId === destinationId) {
      return;
    }
    console.log("goToDestination", destinationId);
    setCurrentDestinationId(destinationId);
    router.push({
      pathname: "/trip/DestinationOverview",
      params: { destinationId },
    });
  };

  const goToPlace = (placeId?: string) => {
    if (!placeId || params.placeId === placeId) {
      return;
    }
    console.log("goToPlace", placeId);
    router.navigate({
      pathname: "/trip/PlaceDetails",
      params: { placeId },
    });
  };
  return (
    <RouterContext.Provider value={{ goToTrip, goToDestination, goToPlace, currentDestinationId, currentTripId }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useInternalRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useInternalRouteContext must be ysed within a InternalRouteProvider");
  }
  return context;
};
