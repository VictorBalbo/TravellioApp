import { useRef } from "react";
import { StyleSheet } from "react-native";
import Map from "react-native-maps";

export const MapView = () => {
  const mapRef = useRef<Map | null>(null);

  return <Map ref={mapRef} collapsableChildren={false} style={styles.map} />;
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
