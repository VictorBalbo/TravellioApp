import { baseStyle } from "@/constants";
import { useThemeColor } from "@/hooks";
import { Host, Picker, PickerItemProps } from "@expo/ui";
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
};

export const ThemedPicker = ({
  options,
  value,
  onValueChange,
  label,
  icon,
  cardContainer = false,
}: ThemedPickerProps) => {
  const captionColor = useThemeColor("caption");

  const themedPicker = (
    <ThemedView style={baseStyle.inlineSectionGap}>
      {icon && <Icon name={icon} color={captionColor} />}
      <ThemedView style={{ flex: 1 }}>
        {label && <ThemedText type={TextType.Caption}>{label}</ThemedText>}
        <Host
          style={{
            flexGrow: 1,
            width: "100%",
            height: 20,
            marginLeft: -15,
          }}
        >
          <Picker selectedValue={value} onValueChange={onValueChange} appearance="menu">
            {options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </Host>
      </ThemedView>
    </ThemedView>
  );

  if (cardContainer) {
    return <CardView>{themedPicker}</CardView>;
  } else {
    return themedPicker;
  }
};
