import { BaseScheme, ColorScheme, Theme } from "@/constants/theme";
import { useColorScheme } from "react-native";

const defaultColorScheme = "light";

export function useThemeColor(propertyName: keyof ColorScheme) {
  const currentTheme = getTheme();
  return Theme[currentTheme][propertyName];
}

export function getThemeProperty(propertyName: keyof BaseScheme) {
  return Theme.base[propertyName];
}

export function getTheme() {
  const colorScheme = useColorScheme();
  let currentTheme = colorScheme;
  if (currentTheme === "unspecified") {
    currentTheme = defaultColorScheme;
  }
  return currentTheme;
}
