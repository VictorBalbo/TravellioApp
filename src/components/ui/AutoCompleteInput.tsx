import { getRadiusFromRegion } from "@/helpers";
import { getThemeProperty, useDebounce, useThemeColor } from "@/hooks";
import { AutoComplete } from "@/models";
import { MapService } from "@/services";
import { useState } from "react";
import { FlatList, Keyboard, StyleSheet, TextInput, View } from "react-native";
import { Region } from "react-native-maps";
import { PressableView } from "./PressableView";
import { TextType, ThemedText } from "./ThemedText";

const debounceTime = 500;

type AutoCompleteInputProps = {
  mapRegion?: Region;
  placeholder?: string;
  onSelect: (item: AutoComplete) => void;
};

export const AutoCompleteInput = ({ mapRegion, placeholder, onSelect }: AutoCompleteInputProps) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AutoComplete[]>([]);

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
    try {
      console.log("Fetching for", trimmedQuery);
      const radius = getRadiusFromRegion(mapRegion);
      const data = await MapService.getAutoComplete(trimmedQuery, mapRegion.latitude, mapRegion.longitude, radius);
      setResults(data);
    } catch (e) {
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
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.placeId ?? item.mainText ?? Math.random().toString()}
          style={[styles.list, { backgroundColor: background, borderColor: border }]}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <PressableView
              onPress={() => handleSelect(item)}
              style={[styles.option, index < results.length - 1 && { borderBottomColor: border, borderBottomWidth: 1 }]}
            >
              {renderHighlighted(item)}
              {item.secondaryText && <ThemedText type={TextType.Footnote}>{item.secondaryText}</ThemedText>}
            </PressableView>
          )}
        />
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
