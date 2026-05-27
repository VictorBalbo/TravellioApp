import { getThemeProperty } from "@/hooks";
import { StyleSheet } from "react-native";
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
}

export const IconTitleValue = ({
  icon,
  title,
  url,
  value,
  valueType = TextType.Text,
  displayTitleAfterText,
}: IconTitleValueProps) => {
  return (
    <ThemedView style={styles.container}>
      {icon && <Icon name={icon} />}
      <ThemedView
        style={[
          styles.titleValue,
          displayTitleAfterText ? { flexDirection: "column-reverse" } : {},
        ]}
      >
        {title && <ThemedText type={TextType.Small}>{title}</ThemedText>}
        {url && <ExternalLink href={url} displayText={value} />}
        {!url && (
          <ThemedText type={valueType} numberOfLines={2} selectable>
            {value}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const smallSpacing = getThemeProperty("smallSpacing");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: smallSpacing,
  },
  titleValue: {
    flexGrow: 1,
    flexDirection: "column",
  },
});

export default IconTitleValue;
