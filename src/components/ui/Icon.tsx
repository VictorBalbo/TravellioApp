import { useThemeColor } from "@/hooks";
import {
  AndroidSymbol,
  SFSymbol,
  SymbolView,
  SymbolWeight,
} from "expo-symbols";
import { ViewStyle } from "react-native";

/**
 * Renders a platform-aware symbol icon that resolves to the appropriate
 * SFSymbol (iOS), AndroidSymbol (Android and Web) based on the provided name.
 *
 * Props:
 * - `name`: key from IconSymbols dictionary
 * - `size`: icon dimensions in pixels (default: 24)
 * - `color`: icon tint color (defaults to theme's activeTint)
 * - `style`: optional view style overrides
 * - `weight`: symbol weight/thickness (default: 'regular')
 */
export const Icon = ({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: keyof IconSymbols;
  size?: number;
  color?: string;
  style?: ViewStyle;
  weight?: SymbolWeight;
}) => {
  const defaultColor = useThemeColor("activeTint");
  if (!color) {
    color = defaultColor;
  }

  const iconConfig = symbolMapping[name];

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={iconConfig}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
};

const symbolMapping: IconSymbols = {
  close: { ios: "xmark", android: "close", web: "close" },
  building: { ios: "building.2.fill", android: "apartment", web: "apartment" },
  house: { ios: "house.fill", android: "house", web: "house" },
  ticket: {
    ios: "ticket.fill",
    android: "local_activity",
    web: "local_activity",
  },
  map: { ios: "map.fill", android: "map", web: "map" },
  pin: { ios: "mappin.and.ellipse", android: "pin_drop", web: "pin_drop" },
  arrival: {
    ios: "airplane.arrival",
    android: "flight_land",
    web: "flight_land",
  },
  chevronDown: {
    ios: "chevron.down",
    android: "expand_more",
    web: "expand_more",
  },
};

export type IconSymbols = {
  close: IconSymbol;
  building: IconSymbol;
  house: IconSymbol;
  ticket: IconSymbol;
  map: IconSymbol;
  pin: IconSymbol;
  arrival: IconSymbol;
  chevronDown: IconSymbol;
};

type IconSymbol = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
};
