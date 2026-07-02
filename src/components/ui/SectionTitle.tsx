import { radius, spacing } from "@/constants";
import { StyleSheet, ViewStyle } from "react-native";
import { IconSymbols } from "./Icon";
import { IconCaptionText } from "./IconCaptionText";
import { ButtonType, ThemedButton } from "./ThemedButton";
import { TextType } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface SectionTitleProps {
  icon?: keyof IconSymbols;
  value: string;
  valueType?: TextType;
  containerStyle?: ViewStyle;
  onAddPress?: () => void;
}

export const SectionTitle = ({
  icon,
  value,
  valueType = TextType.Title,
  containerStyle,
  onAddPress,
}: SectionTitleProps) => {
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <IconCaptionText icon={icon} text={value} textType={valueType} />
      {onAddPress && (
        <ThemedButton title="Add" icon="plus" type={ButtonType.Secondary} onPress={onAddPress} style={styles.button} />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.smallExtra,
  },
});
