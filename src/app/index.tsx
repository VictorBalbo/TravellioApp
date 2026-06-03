import { IconTitleValue, ThemedText, ThemedView } from "@/components/ui";
import "@/i18n";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Edits src/app/index.tsx to edit this screen.</ThemedText>
      <IconTitleValue value="Value" />
      <IconTitleValue icon="info" value="Value" />
      <IconTitleValue icon="info" value="Value" title="Title" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
