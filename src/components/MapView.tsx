import { getThemeProperty, useInternalRouterContext, useMapContext, useTripContext } from "@/hooks";
import { Coordinates } from "@/models";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Map, { MapMarker, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { AutoCompleteInput, ThemedView } from "./ui";

export const MapView = () => {
  const mapRef = useRef<Map | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>();
  const [isMapReady, setIsMapReady] = useState<boolean>();
  const lastMarkerSelectionAt = useRef<number>(0);
  const markerRefs = useRef<Record<string, MapMarker | null>>({});
  const { activities, destinations, accommodations, transportations } = useTripContext();
  const [visibleMarkers, setVisibleMarkers] = useState<
    ("destinations" | "activities" | "accommodations" | "transportations")[]
  >(["destinations", "activities", "accommodations", "transportations"]);
  const { goToDestination, goToPlace } = useInternalRouterContext();
  const { centeredMarkers, selectedMarker, focusedDestinationId } = useMapContext();
  const isSelectedPlaceNew = useMemo(() => {
    return (
      !activities?.find((a) => a.placeId === selectedMarker?.id) &&
      !accommodations?.find((a) => a.placeId === selectedMarker?.id) &&
      !destinations?.find((d) => d.placeId === selectedMarker?.id)
    );
  }, [activities, accommodations, destinations, selectedMarker?.id]);
  // Fit all centrilized markers
  useEffect(() => {
    if (centeredMarkers.length && isMapReady) {
      fitMapToMarkers(centeredMarkers);
    }
  }, [centeredMarkers, isMapReady]);

  // Show Callout for selected marker
  useEffect(() => {
    const calloutMarker = () => {
      if (selectedMarker) {
        const ref = markerRefs.current[selectedMarker.id];
        if (ref) {
          ref.showCallout(); // iOS selection behavior
        }
      }
    };
    calloutMarker();

    // Avoid bug on iOS for selection propagation to different marker
    setTimeout(() => {
      calloutMarker();
    }, 500);
  }, [selectedMarker]);

  const fitMapToMarkers = (markers: Coordinates[]) => {
    if (mapRef.current && markers.length) {
      if (markers.length === 1) {
        mapRef.current.animateToRegion({
          latitude: markers[0].lat - 0.0075,
          longitude: markers[0].lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } else {
        mapRef.current.fitToCoordinates(
          markers.map((m) => ({
            latitude: m.lat,
            longitude: m.lng,
          })),
          {
            edgePadding: { top: 50, right: 50, bottom: 400, left: 50 },
            animated: true,
          },
        );
      }
    }
  };

  const handleMarkerSelect = (callback: () => void) => {
    const now = Date.now();
    if (now - lastMarkerSelectionAt.current < 600) {
      return;
    }
    lastMarkerSelectionAt.current = now;
    callback();
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
        {selectedMarker && isSelectedPlaceNew && (
          <Marker
            tracksViewChanges={false}
            ref={(ref) => {
              markerRefs.current[selectedMarker.id] = ref;
            }}
            coordinate={{
              latitude: selectedMarker.coordinates.lat,
              longitude: selectedMarker.coordinates.lng,
            }}
            pinColor="orange"
            zIndex={4}
          />
        )}
        {visibleMarkers.includes("destinations") &&
          destinations?.map((d) => (
            <Marker
              tracksViewChanges={false}
              key={d.placeId}
              ref={(ref) => {
                markerRefs.current[d.placeId] = ref;
              }}
              coordinate={{
                latitude: d.coordinates.lat,
                longitude: d.coordinates.lng,
              }}
              pinColor="blue"
              zIndex={5}
              onPress={() => handleMarkerSelect(() => goToDestination(d.id))}
            />
          ))}

        {visibleMarkers.includes("activities") &&
          activities
            ?.filter((a) => a.destinationId === focusedDestinationId)
            .map((a) => (
              <Marker
                tracksViewChanges={false}
                key={a.placeId}
                ref={(ref) => {
                  markerRefs.current[a.placeId] = ref;
                }}
                onPress={() => handleMarkerSelect(() => goToPlace(a.placeId))}
                coordinate={{
                  latitude: a.coordinates.lat,
                  longitude: a.coordinates.lng,
                }}
                pinColor={"red"}
                zIndex={0}
              />
            ))}

        {visibleMarkers.includes("accommodations") &&
          accommodations
            ?.filter((a) => a.destinationId === focusedDestinationId)
            .map((a) => (
              <Marker
                tracksViewChanges={false}
                key={a.id}
                coordinate={{
                  latitude: a.coordinates.lat,
                  longitude: a.coordinates.lng,
                }}
                pinColor="green"
                zIndex={1}
              />
            ))}
      </Map>
      <SafeAreaView style={styles.searchContainer} edges={{ top: "maximum" }}>
        <AutoCompleteInput
          mapRegion={mapRegion}
          onSelect={(autoComplete) => {
            if (autoComplete.placeId) {
              goToPlace(autoComplete.placeId);
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
