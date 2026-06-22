import { getThemeProperty, useThemeColor } from "@/hooks";
import { StyleSheet, ViewStyle } from "react-native";
import { Icon, IconSymbols } from "./Icon";
import { ButtonType, ThemedButton } from "./ThemedButton";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface SectionTitleProps {
  icon?: keyof IconSymbols;
  value: string;
  valueType?: TextType;
  containerStyle?: ViewStyle;
}

export const SectionTitle = ({ icon, value, valueType = TextType.Title, containerStyle }: SectionTitleProps) => {
  const capitionColor = useThemeColor("caption");
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {icon && <Icon name={icon} color={capitionColor} />}
      <ThemedView style={[styles.titleValue]}>
        <ThemedText type={valueType} numberOfLines={1}>
          {value}
        </ThemedText>
      </ThemedView>
      <ThemedButton
        title="Add"
        icon="plus"
        type={ButtonType.Secondary}
        onPress={() => console.log("click")}
        style={styles.button}
      />
    </ThemedView>
  );
};

const mediumSpacing = getThemeProperty("mediumSpacing");
const largeSpacing = getThemeProperty("largeSpacing");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: mediumSpacing,
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  titleValue: {
    flexGrow: 1,
    flexDirection: "column",
  },
  button: {
    borderRadius: 50,
    paddingHorizontal: largeSpacing,
  },
});
