import { ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Edits src/app/index.tsx to edit this screen.</ThemedText>
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
