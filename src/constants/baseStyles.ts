import { StyleSheet } from "react-native";
import { spacing } from "./theme";

export const baseStyle = StyleSheet.create({
  viewHeader: {
    paddingHorizontal: spacing.large,
  },
  viewBody: {
    padding: spacing.large,
    gap: spacing.large,
  },
  titleSectionGap: {
    gap: spacing.small,
  },
  smallGap: {
    gap: spacing.small,
  },
  inlineSectionGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
  },
  inlineSectionSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    justifyContent: "space-between",
  },
  columnSectionCentered: {
    flexDirection: "column",
    alignItems: "center",
  },
});
