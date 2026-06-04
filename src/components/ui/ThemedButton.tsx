import { Colors } from "@/constants/theme";
import { getThemeProperty, useThemeColor } from "@/hooks";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Icon, IconSymbols } from "./Icon";
import { PressableView } from "./PressableView";
import { TextType, ThemedText } from "./ThemedText";

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Delete = "delete",
}

interface BaseButtonProps {
  onPress: () => void;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
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
}: TitleButtonProps | IconButtonProps) => {
  const backgroundAccent = useThemeColor("backgroundAccent");

  let backgroundColor;
  let textColor;
  switch (type) {
    case ButtonType.Secondary:
      backgroundColor = backgroundAccent;
      textColor = Colors.white;
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

  return (
    <PressableView onPress={onPress} style={[style, styles.buttonContainer, { backgroundColor }]}>
      {iconName && <Icon size={20} color={textColor} name={iconName} />}
      {image && <Image source={image} style={{ height: 20, width: 20 }} />}
      {title && (
        <ThemedText type={TextType.Headline} style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </ThemedText>
      )}
    </PressableView>
  );
};

const mediumSpacing = getThemeProperty("mediumSpacing");
const smallSpacing = getThemeProperty("smallSpacing");
const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: mediumSpacing,
    padding: mediumSpacing,
    gap: smallSpacing,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {},
});
