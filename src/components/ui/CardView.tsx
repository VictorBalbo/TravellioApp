import { radius, spacing } from "@/constants";
import { useThemeColor } from "@/hooks";
import { StyleSheet, type ViewProps } from "react-native";
import { ThemedView } from "./ThemedView";

export function CardView({ style, ...otherProps }: ViewProps) {
  const borderColor = useThemeColor("border");
  return <ThemedView softBackground style={[cardStyle.card, { borderColor }, style]} {...otherProps} />;
}

const cardStyle = StyleSheet.create({
  card: {
    padding: spacing.small,
    borderRadius: radius.medium,
    borderWidth: 0.5,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, .4)",
  },
});
