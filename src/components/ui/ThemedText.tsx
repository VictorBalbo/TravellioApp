import { Theme } from "@/constants/theme";
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
    fontSize: Theme.base.textSize * 2, // Size: 32
    lineHeight: Theme.base.textSize * 2 * 1.1875, // Height: 38
    fontWeight: "700", // Bold
  },
  title: {
    fontSize: Theme.base.textSize * 1.5, // Size: 24
    lineHeight: Theme.base.textSize * 1.5 * 1.25, // Height: 30
    fontWeight: "700", // Bold
  },
  headline: {
    fontSize: Theme.base.textSize, // Size: 16
    lineHeight: Theme.base.textSize * 1.375, // Height: 22
    fontWeight: "600", // SemiBold
  },
  body: {
    fontSize: Theme.base.textSize, // Size: 16
    lineHeight: Theme.base.textSize * 1.5, // Height: 24
    fontWeight: "400", // Normal,
  },
  footnote: {
    fontSize: Theme.base.textSize * 0.875, // Size: 14
    lineHeight: Theme.base.textSize * 0.875 * 1.5, // Height: 21
    fontWeight: "400", // Normal
  },
  caption: {
    fontSize: Theme.base.textSize * 0.75, // Size: 12
    lineHeight: Theme.base.textSize * 0.75 * 1.5, // Height: 18
    fontWeight: "400", // Normal
  },
});
