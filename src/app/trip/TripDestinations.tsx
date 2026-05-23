import { TextType, ThemedText, ThemedView } from "@/components/ui";
import { getThemeProperty, useTripContext } from "@/hooks";
import { StyleSheet } from "react-native";

export default function TripDestinations() {
  const { trip, destinations } = useTripContext();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type={TextType.Title}>{trip?.name}</ThemedText>
    </ThemedView>
  );
}
const largeSpacing = getThemeProperty("largeSpacing");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: largeSpacing,
  },
});
