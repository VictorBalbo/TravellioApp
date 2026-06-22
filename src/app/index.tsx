import { IconCaptionText, ThemedText, ThemedView } from "@/components/ui";
import "@/i18n";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView background style={styles.container}>
      <ThemedText>Edits src/app/index.tsx to edit this screen.</ThemedText>
      {/* <IconCaptionText value="Value" /> */}
      <IconCaptionText icon="info" text="Value" />
      <IconCaptionText icon="info" text="Values" caption="Title" />
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
