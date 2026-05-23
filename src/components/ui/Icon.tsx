import { useThemeColor } from "@/hooks";
import { SymbolView, SymbolWeight } from "expo-symbols";
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
  plus: { ios: "x.circle", android: "close", web: "close" },
};

export type IconSymbols = {
  plus: IconSymbol;
};

type IconSymbol = {
  ios: "x.circle";
  android: "close";
  web: "close";
};
