import { baseStyle, spacing } from "@/constants";
import { useThemeColor } from "@/hooks";
import { Host, Picker, PickerItemProps } from "@expo/ui";
import { Fragment } from "react";
import { ViewStyle } from "react-native";
import { CardView } from "./CardView";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export { PickerItemProps } from "@expo/ui";

export type ThemedPickerProps = {
  options: PickerItemProps[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  icon?: keyof IconSymbols;
  cardContainer?: boolean;
  containerStyle?: ViewStyle;
};

export const ThemedPicker = ({
  options,
  value,
  onValueChange,
  label,
  icon,
  containerStyle,
  cardContainer = false,
}: ThemedPickerProps) => {
  const captionColor = useThemeColor("caption");

  const themedPicker = (
    <Fragment>
      {icon && <Icon name={icon} color={captionColor} />}
      <ThemedView>
        {label && <ThemedText type={TextType.Caption}>{label}</ThemedText>}
        <Host
          matchContents
          style={{
            width: "100%",
            alignSelf: "flex-start",
            marginHorizontal: -spacing.medium,
            marginVertical: -spacing.small,
            flexWrap: "wrap",
          }}
        >
          <Picker selectedValue={value} onValueChange={onValueChange} appearance="menu">
            {options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </Host>
      </ThemedView>
    </Fragment>
  );

  if (cardContainer) {
    return <CardView style={[containerStyle, baseStyle.inlineSectionGap]}>{themedPicker}</CardView>;
  } else {
    return <ThemedView style={[containerStyle, baseStyle.inlineSectionGap]}>{themedPicker}</ThemedView>;
  }
};
