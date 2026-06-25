import { ThemedView } from "@/components/ui/ThemedView";
import { baseStyle } from "@/constants";
import { useThemeColor } from "@/hooks";
import React from "react";
import { StyleSheet } from "react-native";
import { Tag } from "./Tag";

interface HorizontalDividerProps {
  thickness?: number;
  marginVertical?: number;
  marginBottom?: number;
  marginTop?: number;
  centerTagValue?: string;
}

export const HorizontalDivider = ({
  thickness = 1,
  marginVertical,
  marginTop,
  marginBottom,
  centerTagValue,
}: HorizontalDividerProps) => {
  const color = useThemeColor("border");

  if (!centerTagValue) {
    return (
      <ThemedView
        style={[styles.divider, { backgroundColor: color, height: thickness, marginVertical, marginBottom, marginTop }]}
      />
    );
  }

  return (
    <ThemedView style={[baseStyle.inlineSectionGap, { marginVertical, marginBottom, marginTop }]}>
      <ThemedView style={[styles.line, { backgroundColor: color, height: thickness }]} />
      <Tag text={centerTagValue} />
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
