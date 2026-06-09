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
  shiftContentUp?: number;
}>;

export const HeroView = ({
  children,
  headerImageUrl,
  showHeaderImageGradient = true,
  closeButtonCallback,
  contentStyle,
  shiftContentUp = 56,
}: Props) => {
  const background = useThemeColor("background");
  const borderColor = useThemeColor("border");
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
          <PressableView onPress={onClose} style={[styles.closeButton, { borderColor }]}>
            <Icon name="arrowLeft" color={Colors.white} />
          </PressableView>
        </ThemedView>

        <ThemedView>
          <Image source={{ uri: headerImageUrl }} style={styles.headerImage} />
          {showHeaderImageGradient && (
            <LinearGradient
              colors={["transparent", background]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={styles.headerGradient}
            />
          )}
        </ThemedView>
        <ThemedView style={[{ paddingBottom: bottom - shiftContentUp, bottom: shiftContentUp }, contentStyle]}>
          {children}
        </ThemedView>
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
    left: largeSpacing,
  },
  closeButton: {
    backgroundColor: Colors.black + "D2",
    borderRadius: borderRadius * borderRadius,
    padding: mediumSpacing,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
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
