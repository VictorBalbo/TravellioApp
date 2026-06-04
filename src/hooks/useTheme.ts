import { BaseScheme, ColorScheme, Theme } from "@/constants/theme";
import { useColorScheme } from "react-native";

const defaultColorScheme = "light";

export function useThemeColor(propertyName: keyof ColorScheme) {
  const currentTheme = useTheme();
  return Theme[currentTheme][propertyName];
}

export function getThemeProperty(propertyName: keyof BaseScheme) {
  return Theme.base[propertyName];
}

function useTheme() {
  const colorScheme = useColorScheme();
  let currentTheme = colorScheme;
  if (currentTheme === "unspecified") {
    currentTheme = defaultColorScheme;
  }
  return currentTheme;
}
