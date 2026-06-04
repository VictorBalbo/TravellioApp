import { ThemedText, ThemedView } from "@/components/ui";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabTwoScreen() {
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
