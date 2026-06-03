import { getThemeProperty, useThemeColor } from "@/hooks";
import { StyleSheet, type ViewProps } from "react-native";
import { ThemedView } from "./ThemedView";

export function CardView({ style, ...otherProps }: ViewProps) {
  const borderColor = useThemeColor("border");
  return <ThemedView softBackground style={[cardStyle.card, { borderColor }, style]} {...otherProps} />;
}
const mediumSpacing = getThemeProperty("mediumSpacing");
const borderRadius = getThemeProperty("borderRadius");

const cardStyle = StyleSheet.create({
  card: {
    padding: mediumSpacing,
    borderRadius: borderRadius,
    borderWidth: 0.25,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  },
});
