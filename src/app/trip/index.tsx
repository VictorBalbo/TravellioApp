import { useInternalRouterContext, useTripContext } from "@/hooks";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { goToTrip } = useInternalRouterContext();
  const { trip } = useTripContext();

  useEffect(() => {
    goToTrip(trip?.id);
  }, [goToTrip, trip?.id]);

  return <ActivityIndicator />;
}
