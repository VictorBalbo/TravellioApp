import { getThemeProperty, useMapContext, useTripContext } from "@/hooks";
import { Place } from "@/models";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Map, { MapMarker, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { AutoCompleteInput, ThemedView } from "./ui";

export const MapView = () => {
  const mapRef = useRef<Map | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>();
  const markerRefs = useRef<Record<string, MapMarker | null>>({});
  const { activities, destinations, accommodations, transportations } = useTripContext();
  const [visibleMarkers, setVisibleMarkers] = useState<
    ("destinations" | "activities" | "accommodations" | "transportations")[]
  >(["destinations", "activities", "accommodations", "transportations"]);
  const router = useRouter();
  const params = useGlobalSearchParams();
  const { centeredMarkers, selectedMarker } = useMapContext();
  const [mapRegion, setMapRegion] = useState<Region>();

  // Fit all destinations on destination change
  useEffect(() => {
    if (destinations && isMapReady) {
      fitMapToMarkers(destinations.map((d) => d.place));
    }
  }, [destinations, isMapReady]);

  // Fit all centrilized markers
  useEffect(() => {
    if (centeredMarkers.length && isMapReady) {
      fitMapToMarkers(centeredMarkers);
    }
  }, [centeredMarkers, isMapReady]);

  // Show Callout for selected marker
  useEffect(() => {
    if (selectedMarker) {
      const ref = markerRefs.current[selectedMarker.id];
      if (ref) {
        ref.showCallout(); // iOS selection behavior
      }
    } else {
      Object.values(markerRefs.current).forEach((ref) => {
        if (ref) {
          ref.hideCallout(); // iOS selection behavior
        }
      });
    }
  }, [selectedMarker]);

  const fitMapToMarkers = (markers: Place[]) => {
    if (mapRef.current && markers.length) {
      if (markers.length === 1) {
        mapRef.current.animateToRegion({
          latitude: markers[0].coordinates.lat - 0.0075,
          longitude: markers[0].coordinates.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } else {
        mapRef.current.fitToCoordinates(
          markers.map((m) => ({
            latitude: m.coordinates.lat,
            longitude: m.coordinates.lng,
          })),
          {
            edgePadding: { top: 50, right: 50, bottom: 400, left: 50 },
            animated: true,
          },
        );
      }
    }
  };

  const onSelectDestination = (destinationId: string) => {
    if (params?.destinationId !== destinationId) {
      router.push({
        pathname: "/trip/DestinationOverview",
        params: { destinationId },
      });
    }
  };

  const onSelectPlace = (placeId: string) => {
    if (params?.placeId !== placeId) {
      router.push({
        pathname: "/trip/PlaceDetails",
        params: { placeId },
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Map
        ref={mapRef}
        collapsableChildren={false}
        style={styles.map}
        poiClickEnabled
        onPoiClick={(e) => console.log("POI", e)}
        onRegionChangeComplete={(r) => setMapRegion(r)}
        onMapReady={() => setIsMapReady(true)}
      >
        {visibleMarkers.includes("destinations") &&
          destinations?.map((d) => (
            <Marker
              key={d.placeId}
              ref={(ref) => {
                markerRefs.current[d.placeId] = ref;
              }}
              coordinate={{
                latitude: d.place.coordinates.lat,
                longitude: d.place.coordinates.lng,
              }}
              pinColor="blue"
              zIndex={15}
              onSelect={() => onSelectDestination(d.id)}
            ></Marker>
          ))}

        {visibleMarkers.includes("activities") &&
          activities
            ?.filter((a) => a.place)
            .map((a) => (
              <Marker
                key={a.placeId}
                ref={(ref) => {
                  markerRefs.current[a.placeId] = ref;
                }}
                // onSelect={() => onSelectActivity(a.place.id)}
                coordinate={{
                  latitude: a.place!.coordinates.lat,
                  longitude: a.place!.coordinates.lng,
                }}
                pinColor={a.place?.categories?.some((c) => c.includes("Restaurant")) ? "orange" : "red"}
                zIndex={0}
              />
            ))}

        {visibleMarkers.includes("accommodations") &&
          accommodations
            ?.filter((a) => a.place)
            .map((a) => (
              <Marker
                key={a.id}
                coordinate={{
                  latitude: a.place!.coordinates.lat,
                  longitude: a.place!.coordinates.lng,
                }}
                pinColor="green"
                zIndex={4}
              />
            ))}
      </Map>
      <SafeAreaView style={styles.searchContainer} edges={{ top: "maximum" }}>
        <AutoCompleteInput
          mapRegion={mapRegion}
          onSelect={(autoComplete) => {
            if (autoComplete.placeId) {
              onSelectPlace(autoComplete.placeId);
            }
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
};

const largeSpacing = getThemeProperty("largeSpacing");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: largeSpacing * 3,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
