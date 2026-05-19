import { ThemedText, ThemedView } from "@/components/ui";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Edits Explore to edit this screen.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
