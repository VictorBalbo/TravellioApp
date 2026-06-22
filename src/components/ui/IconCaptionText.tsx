import { getThemeProperty, useThemeColor } from "@/hooks";
import { StyleSheet, ViewStyle } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface IconCaptionTextProps {
  text: string;
  icon?: keyof IconSymbols;
  caption?: string;
  textType?: TextType;
  textNumberOfLines?: number;
  url?: string;
  invertCaptionText?: boolean;
  alignText?: "center" | "left" | "right";
  containerStyle?: ViewStyle;
}

export const IconCaptionText = ({
  icon,
  caption,
  url,
  text,
  textNumberOfLines = 1,
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
          <ThemedText type={TextType.Caption} style={{ textAlign: alignText }} numberOfLines={1}>
            {caption}
          </ThemedText>
        )}
        {url && (
          <ExternalLink
            href={url}
            displayText={text}
            numberOfLines={textNumberOfLines}
            style={{ textAlign: alignText }}
          />
        )}
        {!url && (
          <ThemedText type={textType} numberOfLines={textNumberOfLines} selectable style={{ textAlign: alignText }}>
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
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: "column",
  },
});
