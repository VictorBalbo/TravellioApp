import { useThemeColor } from "@/hooks";
import { ExternalPathString, Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  displayText: string;
  inApp?: boolean;
};

export function ExternalLink({ href, displayText, inApp = false, children, ...rest }: Props) {
  const color = useThemeColor("link");
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as ExternalPathString}
      onPress={async (event) => {
        if (Platform.OS !== "web" && inApp) {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    >
      <ThemedText color={color} numberOfLines={1}>
        {displayText}
      </ThemedText>
    </Link>
  );
}
