import { baseStyle } from "@/constants";
import { useThemeColor } from "@/hooks";
import { DatePicker, DatePickerProps, Host } from "@expo/ui/swift-ui";

import { environment } from "@expo/ui/swift-ui/modifiers";
import { getLocales } from "expo-localization";
import { useEffect, useState } from "react";
import { CardView } from "./CardView";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedDatePickerProps = DatePickerProps & {
  icon?: keyof IconSymbols;
  label?: string;
  cardContainer?: boolean;
};

/// TODO: Implement datetime picker for Android
export const ThemedDatePicker = ({
  icon,
  label,
  selection,
  onDateChange,
  cardContainer = false,
  ...otherProps
}: ThemedDatePickerProps) => {
  const captionColor = useThemeColor("caption");

  const locales = getLocales();
  const deviceLanguage = (locales[0].languageTag ?? "en-US").replace("-", "_");
  const [value, setValue] = useState<Date>();

  // Fix for datepicker not setting localling correctly on first render
  useEffect(() => {
    setTimeout(() => {
      if (selection) {
        setValue(selection);
      }
    }, 100);
  }, []);

  const dateChangeHandler = (selectedDate: Date) => {
    setValue(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  const themedInput = (
    <ThemedView style={baseStyle.inlineSectionGap}>
      {icon && <Icon name={icon} color={captionColor} />}
      <ThemedView>
        {label && <ThemedText type={TextType.Caption}>{label}</ThemedText>}
        <Host matchContents>
          <DatePicker
            modifiers={[environment("locale", deviceLanguage)]}
            displayedComponents={["date", "hourAndMinute"]}
            selection={value}
            onDateChange={dateChangeHandler}
            {...otherProps}
          />
        </Host>
      </ThemedView>
    </ThemedView>
  );

  if (cardContainer) {
    return <CardView>{themedInput}</CardView>;
  } else {
    return themedInput;
  }
};
