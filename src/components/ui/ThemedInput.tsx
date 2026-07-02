import { baseStyle, fontSize } from "@/constants";
import { useThemeColor } from "@/hooks";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Pressable, TextInput, TextInputProps } from "react-native";
import { CardView } from "./CardView";
import { Icon, IconSymbols } from "./Icon";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedInputProps = TextInputProps & {
  icon?: keyof IconSymbols;
  label?: string;
  cardContainer?: boolean;
};

export function ThemedInput({ icon, label, cardContainer = false, style, ...otherProps }: ThemedInputProps) {
  const placeholderColor = useThemeColor("placeholder");
  const captionColor = useThemeColor("caption");
  const textColor = useThemeColor("text");
  const inputRef = useRef<TextInput>(null);

  const themedInput = (
    <Pressable onPress={() => inputRef.current?.focus()} style={baseStyle.inlineSectionGap}>
      {icon && <Icon name={icon} color={captionColor} />}
      <ThemedView style={{ flex: 1 }}>
        {label && <ThemedText type={TextType.Caption}>{label}</ThemedText>}
        <BottomSheetTextInput
          ref={inputRef as never}
          placeholderTextColor={placeholderColor}
          style={[style, { color: textColor, fontSize: fontSize.medium }]}
          {...otherProps}
        />
      </ThemedView>
    </Pressable>
  );

  if (cardContainer) {
    return <CardView>{themedInput}</CardView>;
  } else {
    return themedInput;
  }
}
