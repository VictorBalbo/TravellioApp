import { getThemeProperty } from "@/hooks";
import { StyleSheet, ViewStyle } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface IconTitleValueProps {
  icon?: keyof IconSymbols;
  title?: string;
  url?: string;
  value: string;
  valueType?: TextType;
  displayTitleAfterText?: boolean;
  alignText?: "center" | "left" | "right";
  spaceTitleValue?: boolean;
  containerStyle?: ViewStyle;
}

export const IconTitleValue = ({
  icon,
  title,
  url,
  value,
  valueType = TextType.Text,
  displayTitleAfterText,
  alignText = "left",
  spaceTitleValue = false,
  containerStyle,
}: IconTitleValueProps) => {
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {icon && <Icon name={icon} />}
      <ThemedView
        style={[
          styles.titleValue,
          displayTitleAfterText ? { flexDirection: "column-reverse" } : {},
          spaceTitleValue ? { gap: smallSpacing } : {},
        ]}
      >
        {title && (
          <ThemedText type={TextType.Small} style={{ textAlign: alignText }} numberOfLines={2}>
            {title}
          </ThemedText>
        )}
        {url && <ExternalLink href={url} displayText={value} numberOfLines={1} style={{ textAlign: alignText }} />}
        {!url && (
          <ThemedText type={valueType} numberOfLines={1} selectable style={{ textAlign: alignText }}>
            {value}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const smallSpacing = getThemeProperty("smallSpacing");
const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: mediumSpacing,
    flexShrink: 1,
    borderColor: "red",
    borderWidth: 1,
  },
  titleValue: {
    flexGrow: 1,
    flexDirection: "column",
  },
});

export default IconTitleValue;
