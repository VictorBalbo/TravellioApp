import { getRadiusFromRegion } from "@/helpers";
import { getThemeProperty, useDebounce, useThemeColor } from "@/hooks";
import { AutoComplete } from "@/models";
import { MapService } from "@/services";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
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
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setInput(item.mainText ?? "");
    setResults([]);
    onSelect(item);
  };

  const handleBlur = () => {
    dismissTimer.current = setTimeout(() => setResults([]), 150);
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
    <View style={styles.wrapper} onBlur={handleBlur}>
      <TextInput
        value={input}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholder_color}
        style={[styles.input, { backgroundColor: background, borderColor: border, color: text }]}
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
const borderRadius = getThemeProperty("borderRadius");
const largeSpacing = getThemeProperty("largeSpacing");
const mediumSpacing = getThemeProperty("mediumSpacing");
const textSize = getThemeProperty("textSize");

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: borderRadius,
    paddingHorizontal: largeSpacing,
    fontSize: textSize,
  },
  list: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: borderRadius,
    maxHeight: 220,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: largeSpacing,
    paddingVertical: mediumSpacing,
  },
});
