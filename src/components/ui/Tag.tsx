import { getThemeProperty, useThemeColor } from "@/hooks";
import { StyleSheet, type ViewProps } from "react-native";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type TagProps = ViewProps & {
  text: string;
};

export function Tag({ text, style, ...otherProps }: TagProps) {
  const backgroundColor = useThemeColor("backgroundAccent");

  return (
    <ThemedView style={[styles.tag, { backgroundColor }, style]} {...otherProps}>
      <ThemedText type={TextType.Small}>{text}</ThemedText>
    </ThemedView>
  );
}

const smallSpacing = getThemeProperty("smallSpacing");
const largeSpacing = getThemeProperty("largeSpacing");
const borderRadius = getThemeProperty("borderRadius");

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingVertical: smallSpacing,
    paddingHorizontal: largeSpacing / 1.5,
    borderRadius: borderRadius * 2,
  },
});
