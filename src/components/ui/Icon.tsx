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
type Props = {
  name: keyof IconSymbols;
  size?: number;
  color?: string;
  style?: ViewStyle;
  weight?: SymbolWeight;
  backgroundColor?: string;
};

export const Icon = ({ name, size = 24, color, style, weight = "regular", backgroundColor }: Props) => {
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
  chevronRight: IconSymbol = { ios: "chevron.right", android: "chevron_right" };
  arrowRight: IconSymbol = { ios: "arrow.right", android: "arrow_right" };

  building: IconSymbol = { ios: "building.2.fill", android: "apartment" };
  bed: IconSymbol = { ios: "bed.double.fill", android: "bed" };
  map: IconSymbol = { ios: "map.fill", android: "map" };
  arrival: IconSymbol = { ios: "airplane.arrival", android: "flight_land" };
  departure: IconSymbol = { ios: "airplane.departure", android: "flight_takeoff" };
  star: IconSymbol = { ios: "star.fill", android: "star" };
  plus: IconSymbol = { ios: "plus", android: "star" };
  trash: IconSymbol = { ios: "trash.fill", android: "star" };
  globe: IconSymbol = { ios: "globe.fill", android: "star" };
  info: IconSymbol = { ios: "info.circle.fill", android: "info" };
  phone: IconSymbol = { ios: "phone.fill", android: "phone" };

  // Transportations
  plane: IconSymbol = { ios: "airplane.up.forward", android: "flight" };
  train: IconSymbol = { ios: "train.side.front.car", android: "train" };
  bus: IconSymbol = { ios: "bus", android: "bus_alert" };
  car: IconSymbol = { ios: "car", android: "car_rental" };
  ship: IconSymbol = { ios: "shippingbox", android: "directions_boat" };
  // ActivityTypes
  ticket: IconSymbol = { ios: "ticket.fill", android: "local_activity" };
  pin: IconSymbol = { ios: "mappin", android: "pin_drop" };
  restaurant: IconSymbol = { ios: "fork.knife", android: "restaurant" };
  coffee: IconSymbol = { ios: "cup.and.heat.waves.fill", android: "coffee" };
  nightlife: IconSymbol = { ios: "wineglass.fill", android: "wine_bar" };
  bakery: IconSymbol = { ios: "fork.knife", android: "breakfast_dining" };
  museum: IconSymbol = { ios: "building.columns.fill", android: "museum" };
  nature: IconSymbol = { ios: "tree.fill", android: "museum" };
  beach: IconSymbol = { ios: "beach.umbrella.fill", android: "museum" };
  shopping: IconSymbol = { ios: "bag.fill", android: "museum" };
  tour: IconSymbol = { ios: "map.fill", android: "museum" };
  activity: IconSymbol = { ios: "mappin", android: "museum" };
  camera: IconSymbol = { ios: "camera", android: "museum" };
  wellness: IconSymbol = { ios: "peacesign", android: "museum" };
}

type IconSymbol = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web?: AndroidSymbol;
};
