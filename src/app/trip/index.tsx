import { StyleSheet } from "react-native";
import TripDestinations from "./TripDestinations";

export default function Index() {
  return <TripDestinations />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
