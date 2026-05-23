import { ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";

export default function TripBudget() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is the Trip Budget Page.</ThemedText>
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
