import { ButtonType, IconCaptionText, Tag, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import "@/i18n";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView background style={styles.container}>
      <ThemedText>Edits src/app/index.tsx to edit this screen.</ThemedText>
      {/* <IconCaptionText value="Value" /> */}
      <IconCaptionText icon="info" text="Value" />
      <IconCaptionText icon="info" text="Values" caption="Title" />
      <Tag text="Tag Component" />
      <ThemedButton title="Add" icon="plus" type={ButtonType.Secondary} onPress={() => console.log("click")} />
      <ThemedButton title="Add" icon="plus" type={ButtonType.Secondary} round onPress={() => console.log("click")} />
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
