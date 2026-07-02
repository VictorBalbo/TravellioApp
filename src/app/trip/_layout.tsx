// app/trip/_layout.tsx
import { MapView } from "@/components";
import { radius, spacing } from "@/constants";
import { MapProvider, TripProvider, useThemeColor } from "@/hooks";
import { InternalRouteProvider } from "@/hooks/useInternalRouter";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TripLayout() {
  const background = useThemeColor("background");
  const activeTint = useThemeColor("activeTint");

  const [fadeAnim] = useState(() => new Animated.Value(1));
  const pathName = usePathname();

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, pathName]);

  return (
    <InternalRouteProvider>
      <MapProvider>
        <TripProvider>
          <GestureHandlerRootView style={styles.container}>
            <MapView />
            <BottomSheet
              snapPoints={["50%", "20%", "93%"]}
              enableDynamicSizing={false}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              backgroundStyle={{ backgroundColor: background }}
              style={styles.bottomSheet}
              handleStyle={[
                styles.handleStyle,
                // Add transparency to the background
                { backgroundColor: background + "55" },
              ]}
              handleIndicatorStyle={{ backgroundColor: activeTint }}
            >
              <BottomSheetScrollView>
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                  <Slot />
                </Animated.View>
              </BottomSheetScrollView>
            </BottomSheet>
          </GestureHandlerRootView>
        </TripProvider>
      </MapProvider>
    </InternalRouteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    overflow: "hidden",
  },
  handleStyle: {
    position: "absolute",
    width: "100%",
    padding: spacing.small,
  },
});
