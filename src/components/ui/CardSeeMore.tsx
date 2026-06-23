import { spacing } from "@/constants";
import { useThemeColor } from "@/hooks";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CardView } from "./CardView";
import { IconSymbols } from "./Icon";
import { IconCaptionText } from "./IconCaptionText";
import { TextType, ThemedText } from "./ThemedText";

type Props = {
  content: string;
  header?: string;
  icon?: keyof IconSymbols;
  numberOfLines?: number;
};

export function CardSeeMore({ content, header, icon, numberOfLines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [exceedsLimit, setExceedsLimit] = useState(false);
  const linkColor = useThemeColor("link");

  return (
    <CardView style={styles.container}>
      {/* Invisible full render to count actual lines without truncation */}
      <ThemedText
        style={styles.hidden}
        onTextLayout={(e) => setExceedsLimit(e.nativeEvent.lines.length > numberOfLines)}
      >
        {content}
      </ThemedText>
      {header && <IconCaptionText icon={icon} text={header} textType={TextType.Title} />}
      <ThemedText numberOfLines={expanded ? undefined : numberOfLines}>{content}</ThemedText>
      {exceedsLimit && (
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <ThemedText type={TextType.Footnote} style={{ color: linkColor }}>
            {expanded ? "See Less" : "See More"}
          </ThemedText>
        </Pressable>
      )}
    </CardView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.smallExtra,
  },
  hidden: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
});
