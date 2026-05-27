import { getThemeProperty } from "@/hooks";
import { Fragment, type ReactNode } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import { CardView } from "./CardView";
import HorizontalDivider from "./HorizontalDivider";

interface CardListProps<T> extends ViewProps {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

export function CardList<T>({
  data,
  renderItem,
  style,
  ...otherProps
}: CardListProps<T>) {
  return (
    <CardView style={[cardStyle.card, style]} {...otherProps}>
      {data.map((item, index) => (
        <Fragment key={index}>
          {renderItem(item, index)}
          {index !== data.length - 1 && <HorizontalDivider />}
        </Fragment>
      ))}
    </CardView>
  );
}
const smallSpacing = getThemeProperty("smallSpacing");
const borderRadius = getThemeProperty("borderRadius");

const cardStyle = StyleSheet.create({
  card: {
    padding: smallSpacing,
    borderRadius: borderRadius,
    gap: smallSpacing,
  },
});
