import { Icon, PressableView, ThemedView } from "@/components/ui";
import { Colors, radius, spacing } from "@/constants/theme";
import { useThemeColor } from "@/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Fragment, type PropsWithChildren } from "react";
import { Image, ImageSourcePropType, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  headerImageUrl?: string;
  headerImageAsset?: ImageSourcePropType;
  showHeaderImageGradient?: boolean;
  closeButtonCallback?: () => void;
  contentStyle?: ViewStyle;
  shiftContentUp?: number;
}>;

export const HeroView = ({
  children,
  headerImageUrl,
  headerImageAsset,
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
  const hasImage = !!headerImageUrl || !!headerImageAsset;

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
          {hasImage && (
            <Fragment>
              <Image source={headerImageUrl ? { uri: headerImageUrl } : headerImageAsset} style={styles.headerImage} />
              {showHeaderImageGradient && (
                <LinearGradient
                  colors={["transparent", background]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.headerGradient}
                />
              )}
            </Fragment>
          )}
          {!hasImage && <ThemedView style={styles.noImageHeader} />}
        </ThemedView>
        <ThemedView style={[{ paddingBottom: bottom - shiftContentUp, bottom: shiftContentUp }, contentStyle]}>
          {children}
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const HEADER_HEIGHT = 200;
const NO_IMAGE_HEADER_HEIGHT = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    zIndex: 1,
    top: spacing.largeExtra,
    left: spacing.large,
  },
  closeButton: {
    backgroundColor: Colors.black + "D2",
    borderRadius: radius.full,
    padding: spacing.small,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
  },
  headerImage: {
    height: HEADER_HEIGHT,
    width: "100%",
  },
  noImageHeader: {
    height: NO_IMAGE_HEADER_HEIGHT,
  },
  headerGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
