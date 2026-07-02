import { fontSize } from "@/constants/theme";
import { useThemeColor } from "@/hooks";
import { StyleSheet, Text, type TextProps } from "react-native";

export enum TextType {
  Display = "display",
  Title = "title",
  Headline = "headline",
  Body = "body",
  Footnote = "footnote",
  Caption = "caption",
}

export type ThemedTextProps = TextProps & {
  type?: TextType;
  color?: string;
};

export const ThemedText = ({ style, type = TextType.Body, color, ...rest }: ThemedTextProps) => {
  const defaultColor = useThemeColor("text");
  const helperTextColor = useThemeColor("caption");
  let textColor;
  let typeStyle;
  switch (type) {
    case TextType.Display:
      textColor = color ?? defaultColor;
      typeStyle = styles.display;
      break;
    case TextType.Title:
      textColor = color ?? defaultColor;
      typeStyle = styles.title;
      break;
    case TextType.Headline:
      textColor = color ?? defaultColor;
      typeStyle = styles.headline;
      break;
    case TextType.Body:
      textColor = color ?? defaultColor;
      typeStyle = styles.body;
      break;
    case TextType.Footnote:
      textColor = color ?? helperTextColor;
      typeStyle = styles.footnote;
      break;
    case TextType.Caption:
      textColor = color ?? helperTextColor;
      typeStyle = styles.caption;
      break;
  }
  return <Text style={[{ color: textColor }, typeStyle, style]} {...rest} />;
};

const styles = StyleSheet.create({
  display: {
    fontSize: fontSize.largeExtra, // Size: 32
    lineHeight: fontSize.largeExtra * 1.1875, // Height: 38
    fontWeight: "700", // Bold
  },
  title: {
    fontSize: fontSize.large, // Size: 24
    lineHeight: fontSize.large * 1.25, // Height: 30
    fontWeight: "700", // Bold
  },
  headline: {
    fontSize: fontSize.medium, // Size: 16
    lineHeight: fontSize.medium * 1.375, // Height: 22
    fontWeight: "600", // SemiBold
  },
  body: {
    fontSize: fontSize.medium, // Size: 16
    lineHeight: fontSize.medium * 1.5, // Height: 24
    fontWeight: "400", // Normal,
  },
  footnote: {
    fontSize: fontSize.medium * 0.875, // Size: 14
    lineHeight: fontSize.medium * 0.875 * 1.5, // Height: 21
    fontWeight: "400", // Normal
  },
  caption: {
    fontSize: fontSize.small, // Size: 12
    lineHeight: fontSize.small * 1.5, // Height: 18
    fontWeight: "400", // Normal
  },
});
