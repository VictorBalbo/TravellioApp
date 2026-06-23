import { baseStyle } from "@/constants";
import { useThemeColor } from "@/hooks";
import { StyleSheet, ViewStyle } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface IconCaptionTextProps {
  text: string;
  icon?: keyof IconSymbols;
  iconSize?: number;
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
  iconSize,
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
    <ThemedView style={[baseStyle.inlineSectionGap, styles.container, containerStyle]}>
      {icon && <Icon name={icon} color={iconColor} size={iconSize} />}
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

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
  titleValue: {
    flex: 1,
  },
});
