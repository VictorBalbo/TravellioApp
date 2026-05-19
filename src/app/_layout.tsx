import { useThemeColor } from "@/hooks/useTheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor("text");

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs labelStyle={{ selected: { color: textColor } }}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/home.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="trip/TripDetails">
          <NativeTabs.Trigger.Label>Trip</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require("@/assets/images/tabIcons/explore.png")}
            renderingMode="template"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
