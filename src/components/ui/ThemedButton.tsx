import { baseStyle } from "@/constants";
import { Colors, radius, spacing } from "@/constants/theme";
import { useThemeColor } from "@/hooks";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Icon, IconSymbols } from "./Icon";
import { PressableView } from "./PressableView";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Delete = "delete",
}

interface BaseButtonProps {
  onPress: () => void;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  round?: boolean;
}
interface TitleButtonProps extends BaseButtonProps {
  title: string;
  icon?: keyof IconSymbols | number;
}

interface IconButtonProps extends BaseButtonProps {
  title?: string;
  icon: keyof IconSymbols | number;
}

export const ThemedButton = ({
  onPress,
  title,
  icon,
  type = ButtonType.Primary,
  style,
  round = false,
}: TitleButtonProps | IconButtonProps) => {
  const backgroundAccent = useThemeColor("backgroundAccent");
  const activeTint = useThemeColor("link");

  let backgroundColor;
  let textColor;
  switch (type) {
    case ButtonType.Secondary:
      backgroundColor = backgroundAccent;
      textColor = activeTint;
      break;
    case ButtonType.Tertiary:
      textColor = activeTint;
      break;
    case ButtonType.Delete:
      backgroundColor = Colors.red;
      textColor = Colors.white;
      break;
    case ButtonType.Primary:
    default:
      backgroundColor = Colors.blue;
      textColor = Colors.white;
      break;
  }

  const iconName = icon && typeof icon === "string" ? (icon as keyof IconSymbols) : undefined;
  const image = icon && typeof icon === "number" && (icon as number);

  if (round) {
    return (
      <PressableView onPress={onPress} style={[baseStyle.columnSectionCentered, baseStyle.smallGap]}>
        <ThemedView style={[style, styles.buttonContainer, styles.round, { backgroundColor }]}>
          {iconName && <Icon size={24} color={textColor} name={iconName} />}
          {image && <Image source={image} style={{ height: 24, width: 24 }} />}
        </ThemedView>
        {title && (
          <ThemedText type={TextType.Caption} numberOfLines={1}>
            {title}
          </ThemedText>
        )}
      </PressableView>
    );
  }

  return (
    <PressableView
      onPress={onPress}
      style={[style, baseStyle.inlineSectionGap, styles.buttonContainer, { backgroundColor }]}
    >
      {iconName && <Icon size={20} color={textColor} name={iconName} />}
      {image && <Image source={image} style={{ height: 20, width: 20 }} />}
      {title && (
        <ThemedText type={TextType.Headline} style={{ color: textColor }} numberOfLines={1}>
          {title}
        </ThemedText>
      )}
    </PressableView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: radius.small,
    padding: spacing.small,
    gap: spacing.smallExtra,
  },
  round: {
    borderRadius: radius.full,
    padding: spacing.large,
  },
});
