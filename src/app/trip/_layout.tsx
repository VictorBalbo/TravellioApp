// app/trip/_layout.tsx
import { MapView } from "@/components";
import { getThemeProperty, TripProvider, useThemeColor } from "@/hooks";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TripLayout() {
  const background = useThemeColor("background");
  const activeTint = useThemeColor("activeTint");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  return (
    <TripProvider>
      <GestureHandlerRootView style={styles.container}>
        <MapView />
        <BottomSheet
          snapPoints={["20%", "50%", "90%"]}
          enableDynamicSizing={false}
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
  );
}

const largeSpacing = getThemeProperty("largeSpacing");
const smallSpacing = getThemeProperty("smallSpacing");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: largeSpacing,
    borderTopRightRadius: largeSpacing,
    overflow: "hidden",
    marginHorizontal: smallSpacing,
  },
  handleStyle: {
    position: "absolute",
    width: "100%",
    padding: smallSpacing,
  },
});
