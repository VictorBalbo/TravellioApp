import { ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";

export default function TripDetails() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Edits Trip to edit this screen.</ThemedText>
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
