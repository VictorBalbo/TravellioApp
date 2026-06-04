import { Accommodation, Activity, Destination, Transportation, Trip } from "@/models";
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
    const envRaw = process.env.EXPO_PUBLIC_TRIP_JSON;

    if (!envRaw) {
      return;
    }

    try {
      const parsed = JSON.parse(envRaw as string) as Trip;
      setTrip(parsed);
    } catch (e) {
      console.warn(e);
    }
  }, []);

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
