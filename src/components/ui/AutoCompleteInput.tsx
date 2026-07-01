import { fontSize, radius, spacing } from "@/constants";
import { getRadiusFromRegion } from "@/helpers";
import { useDebounce, useThemeColor } from "@/hooks";
import { AutoComplete } from "@/models";
import { MapService } from "@/services";
import { useRef, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Region } from "react-native-maps";
import { HorizontalDivider } from "./HorizontalDivider";
import { PressableView } from "./PressableView";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const debounceTime = 500;

type AutoCompleteInputProps = {
  mapRegion?: Region;
  placeholder?: string;
  onSelect: (item: AutoComplete) => void;
};

export const AutoCompleteInput = ({ mapRegion, placeholder, onSelect }: AutoCompleteInputProps) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AutoComplete[]>([]);
  const abortRef = useRef<AbortController>(null);

  const background = useThemeColor("background");
  const border = useThemeColor("border");
  const text = useThemeColor("text");
  const placeholder_color = useThemeColor("placeholder");

  const fetchSuggestions = useDebounce(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || !mapRegion) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const radius = getRadiusFromRegion(mapRegion);
      const data = await MapService.getAutoComplete(
        trimmedQuery,
        mapRegion.latitude,
        mapRegion.longitude,
        radius,
        abortRef.current.signal,
      );
      setResults(data);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setResults([]);
      console.error(e);
    }
  }, debounceTime);

  const handleChangeText = (value: string) => {
    setInput(value);
    fetchSuggestions(value);
  };

  const handleSelect = (item: AutoComplete) => {
    Keyboard.dismiss();
    setInput(item.mainText ?? "");
    setResults([]);
    onSelect(item);
  };

  const renderHighlighted = (item: AutoComplete) => {
    const { mainText = "", mainTextMatchedSubstrings: match } = item;
    if (!match || match.length === 0) {
      return <ThemedText type={TextType.Body}>{mainText}</ThemedText>;
    }
    const before = mainText.slice(0, match.offset);
    const highlighted = mainText.slice(match.offset, match.offset + match.length);
    const after = mainText.slice(match.offset + match.length);
    return (
      <ThemedText type={TextType.Body}>
        {before}
        <ThemedText type={TextType.Headline}>{highlighted}</ThemedText>
        {after}
      </ThemedText>
    );
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={input}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholder_color}
        style={[styles.input, { backgroundColor: background, borderColor: border, color: text }]}
        clearButtonMode="always"
        autoComplete="off"
      />
      {results.length > 0 && (
        <ScrollView style={[styles.list, { backgroundColor: background }]} keyboardShouldPersistTaps={"always"}>
          {results.map((item, index) => (
            <ThemedView key={item.placeId}>
              <PressableView
                onPress={() => handleSelect(item)}
                style={[
                  styles.option,
                  index < results.length - 1 && { borderBottomColor: border, borderBottomWidth: 1 },
                ]}
              >
                {renderHighlighted(item)}
                {item.secondaryText && <ThemedText type={TextType.Footnote}>{item.secondaryText}</ThemedText>}
              </PressableView>
              {index !== results.length - 1 && <HorizontalDivider />}
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
    gap: spacing.small,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.small,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    fontSize: fontSize.medium,
  },
  list: {
    borderWidth: 1,
    borderRadius: radius.small,
    maxHeight: 225,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small,
  },
});
