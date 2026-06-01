import { useThemeColor } from "@/hooks";
import { AndroidSymbol, SFSymbol, SymbolView, SymbolWeight } from "expo-symbols";
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

  const symbolMapping = new IconSymbols();
  const iconConfig = symbolMapping[name];
  if (!iconConfig.web) {
    iconConfig.web = iconConfig.android;
  }

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

export class IconSymbols {
  close: IconSymbol = { ios: "xmark", android: "close" };

  chevronDown: IconSymbol = { ios: "chevron.down", android: "expand_more" };
  arrowRight: IconSymbol = { ios: "arrow.right", android: "arrow_right" };

  building: IconSymbol = { ios: "building.2.fill", android: "apartment" };
  bed: IconSymbol = { ios: "bed.double.fill", android: "bed" };
  ticket: IconSymbol = { ios: "ticket.fill", android: "local_activity" };
  map: IconSymbol = { ios: "map.fill", android: "map" };
  pin: IconSymbol = { ios: "mappin.and.ellipse", android: "pin_drop" };
  arrival: IconSymbol = { ios: "airplane.arrival", android: "flight_land" };
  departure: IconSymbol = { ios: "airplane.departure", android: "flight_takeoff" };
  plane: IconSymbol = { ios: "airplane.up.forward", android: "flight" };
  train: IconSymbol = { ios: "train.side.front.car", android: "train" };
  bus: IconSymbol = { ios: "bus", android: "bus_alert" };
  car: IconSymbol = { ios: "car", android: "car_rental" };
  ship: IconSymbol = { ios: "shippingbox", android: "directions_boat" };
  line: IconSymbol = { ios: "line.horizontal.3", android: "line_axis" };
}

type IconSymbol = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web?: AndroidSymbol;
};
