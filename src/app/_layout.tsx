import { useThemeColor } from "@/hooks/useTheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
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
          <NativeTabs.Trigger.Icon sf="house.fill" md="house" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="trip">
          <NativeTabs.Trigger.Label>Trip</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="suitcase.fill" md="luggage" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
