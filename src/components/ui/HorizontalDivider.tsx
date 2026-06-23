import { ThemedView } from "@/components/ui/ThemedView";
import { baseStyle } from "@/constants";
import { useThemeColor } from "@/hooks";
import React from "react";
import { StyleSheet } from "react-native";

interface HorizontalDividerProps {
  thickness?: number;
  marginVertical?: number;
  marginBottom?: number;
  centerContent?: React.ReactNode;
}

export const HorizontalDivider = ({
  thickness = 1,
  marginVertical,
  marginBottom,
  centerContent,
}: HorizontalDividerProps) => {
  const color = useThemeColor("border");

  if (!centerContent) {
    return (
      <ThemedView
        style={[styles.divider, { backgroundColor: color, height: thickness, marginVertical, marginBottom }]}
      />
    );
  }

  return (
    <ThemedView style={[baseStyle.inlineSectionGap, { marginVertical, marginBottom }]}>
      <ThemedView style={[styles.line, { backgroundColor: color, height: thickness }]} />
      {centerContent}
      <ThemedView style={[styles.line, { backgroundColor: color, height: thickness }]} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
  },
  line: {
    flex: 1,
  },
});
