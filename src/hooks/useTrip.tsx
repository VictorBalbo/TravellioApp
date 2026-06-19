import { Accommodation, Activity, Destination, Transportation, Trip } from "@/models";
import { TripService } from "@/services";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface TripContextType {
  trip?: Trip;
  activities?: Activity[];
  destinations?: Destination[];
  accommodations?: Accommodation[];
  transportations?: Transportation[];
  setTrip: (trip: Trip) => void;
  setDestination: (destination: Destination) => void;
  removeDestination: (destinationId: string) => void;
  setActivity: (destinationId: string, activity: Activity) => void;
  removeActivity: (destinationId: string, activityId: string) => void;
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

  const setDestination = (destination: Destination) => {
    if (!trip) return;
    const exists = trip.destinations?.some((d) => d.id === destination.id);
    const updated = exists
      ? trip.destinations?.map((d) => (d.id === destination.id ? destination : d))
      : [...(trip.destinations ?? []), destination];
    setTrip({ ...trip, destinations: updated });
  };

  const removeDestination = (destinationId: string) => {
    if (!trip) return;
    setTrip({ ...trip, destinations: trip.destinations?.filter((d) => d.id !== destinationId) });
  };

  const setActivity = (destinationId: string, activity: Activity) => {
    if (!trip) return;
    setTrip({
      ...trip,
      destinations: trip.destinations?.map((d) => {
        if (d.id !== destinationId) return d;
        const exists = d.activities?.some((a) => a.id === activity.id);
        const updated = exists
          ? d.activities?.map((a) => (a.id === activity.id ? activity : a))
          : [...(d.activities ?? []), activity];
        return { ...d, activities: updated };
      }),
    });
  };

  const removeActivity = (destinationId: string, activityId: string) => {
    if (!trip) return;
    setTrip({
      ...trip,
      destinations: trip.destinations?.map((d) =>
        d.id !== destinationId ? d : { ...d, activities: d.activities?.filter((a) => a.id !== activityId) },
      ),
    });
  };

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
        activities,
        destinations,
        accommodations,
        transportations,
        setTrip,
        setDestination,
        removeDestination,
        setActivity,
        removeActivity,
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
