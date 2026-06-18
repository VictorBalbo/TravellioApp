import { Accommodation, Activity, Destination, Transportation, Trip } from "@/models";
import { TripService } from "@/services";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface TripContextType {
  trip?: Trip;
  setTrip: (value: Trip) => void;
  activities?: Activity[];
  destinations?: Destination[];
  accommodations?: Accommodation[];
  transportations?: Transportation[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  // const [loading, setLoading] = useState<boolean>(false);
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const destinations = useMemo(() => trip?.destinations ?? [], [trip?.destinations]);
  const activities = useMemo(
    () => trip?.destinations?.flatMap((d) => d.activities).filter((a) => a !== undefined) ?? [],
    [trip?.destinations],
  );
  const accommodations = useMemo(
    () => trip?.destinations?.flatMap((d) => d.accommodations).filter((a) => a !== undefined) ?? [],
    [trip?.destinations],
  );
  const transportations = useMemo(() => trip?.transportations ?? [], [trip?.transportations]);

  useEffect(() => {
    const loadTrip = async (tripId: string) => {
      if (tripId === trip?.id) {
        return;
      }
      const loadedtrip = await TripService.getTripData(tripId);
      setTrip(loadedtrip);
    };
    const envRaw = process.env.EXPO_PUBLIC_TRIP_ID ?? "";
    loadTrip(envRaw);
  }, [trip]);

  return (
    <TripContext.Provider
      value={{
        trip,
        setTrip,
        activities,
        destinations,
        accommodations,
        transportations,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within an TripProvider");
  }
  return context;
};
