import { Theme } from "@/constants/theme";
import { useThemeColor } from "@/hooks";
import { StyleSheet, Text, type TextProps } from "react-native";

export enum TextType {
  Title = "title",
  Subtitle = "subtitle",
  Text = "text",
  Bold = "bold",
  Link = "link",
  Small = "small",
}

export type ThemedTextProps = TextProps & {
  type?: TextType;
};

export const ThemedText = ({
  style,
  type = TextType.Text,
  ...rest
}: ThemedTextProps) => {
  const textColor = useThemeColor("text");
  const linkColor = useThemeColor("link");
  const helperTextColor = useThemeColor("helperText");
  let color;
  let typeStyle;
  switch (type) {
    case TextType.Title:
      color = textColor;
      typeStyle = styles.title;
      break;
    case TextType.Subtitle:
      color = textColor;
      typeStyle = styles.subtitle;
      break;
    case TextType.Text:
      color = textColor;
      typeStyle = styles.default;
      break;
    case TextType.Bold:
      color = textColor;
      typeStyle = styles.semiBold;
      break;
    case TextType.Link:
      color = linkColor;
      typeStyle = styles.link;
      break;
    case TextType.Small:
      color = helperTextColor;
      typeStyle = styles.small;
      break;
  }
  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
};

const styles = StyleSheet.create({
  title: {
    fontSize: Theme.base.textSize * 2,
    lineHeight: Theme.base.textSize * 2.5,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: Theme.base.textSize * 1.25,
    lineHeight: Theme.base.textSize * 1.5,
    fontWeight: "bold",
  },
  default: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
  },
  semiBold: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
    fontWeight: "600",
  },
  link: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
  },
  small: {
    fontSize: Theme.base.textSize * 0.75,
    lineHeight: Theme.base.textSize * 0.875,
  },
});
