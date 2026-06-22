import { getThemeProperty, useThemeColor } from "@/hooks";
import { StyleSheet, ViewStyle } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface IconCaptionTextProps {
  icon?: keyof IconSymbols;
  caption?: string;
  url?: string;
  text: string;
  textType?: TextType;
  invertCaptionText?: boolean;
  alignText?: "center" | "left" | "right";
  containerStyle?: ViewStyle;
}

export const IconCaptionText = ({
  icon,
  caption,
  url,
  text,
  textType = TextType.Body,
  invertCaptionText,
  alignText = "left",
  containerStyle,
}: IconCaptionTextProps) => {
  const iconColor = useThemeColor("caption");
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {icon && <Icon name={icon} color={iconColor} />}
      <ThemedView style={[styles.titleValue, invertCaptionText ? { flexDirection: "column-reverse" } : {}]}>
        {caption && (
          <ThemedText type={TextType.Caption} style={{ textAlign: alignText }} numberOfLines={2}>
            {caption}
          </ThemedText>
        )}
        {url && <ExternalLink href={url} displayText={text} numberOfLines={1} style={{ textAlign: alignText }} />}
        {!url && (
          <ThemedText type={textType} numberOfLines={1} selectable style={{ textAlign: alignText }}>
            {text}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const mediumSpacing = getThemeProperty("mediumSpacing");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: mediumSpacing,
    flexShrink: 1,
  },
  titleValue: {
    flexGrow: 1,
    flexDirection: "column",
  },
});
