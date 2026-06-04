import { Icon, PressableView, ThemedView } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { getThemeProperty, useThemeColor } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { PropsWithChildren } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  headerImageUrl: string;
  showHeaderImageGradient?: boolean;
  closeButtonCallback?: () => void;
  contentStyle?: ViewStyle;
}>;

export const HeroView = ({
  children,
  headerImageUrl,
  showHeaderImageGradient = true,
  closeButtonCallback,
  contentStyle,
}: Props) => {
  const background = useThemeColor("background");
  const { bottom } = useSafeAreaInsets();

  const router = useRouter();
  const onClose = closeButtonCallback ?? (() => router.back());

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, position: "relative" }}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.closeButtonContainer}>
          <PressableView onPress={onClose} style={styles.closeButton}>
            <Icon name="close" color={Colors.white} />
          </PressableView>
        </ThemedView>

        <ThemedView>
          <Image source={{ uri: headerImageUrl }} style={styles.headerImage} />
          {showHeaderImageGradient && (
            <LinearGradient
              colors={["transparent", background]}
              start={{ x: 0, y: 0.6 }}
              end={{ x: 0, y: 1 }}
              style={styles.headerGradient}
            />
          )}
        </ThemedView>
        <ThemedView style={[{ paddingBottom: bottom }, contentStyle]}>{children}</ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const borderRadius = getThemeProperty("borderRadius");
const mediumSpacing = getThemeProperty("mediumSpacing");
const largeSpacing = getThemeProperty("largeSpacing");
const HEADER_HEIGHT = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    zIndex: 1,
    top: largeSpacing * 2,
    right: largeSpacing,
  },
  closeButton: {
    backgroundColor: Colors.black + "B2",
    borderRadius: borderRadius * borderRadius,
    padding: mediumSpacing,
  },
  headerImage: {
    height: HEADER_HEIGHT,
    width: "100%",
  },
  headerGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
