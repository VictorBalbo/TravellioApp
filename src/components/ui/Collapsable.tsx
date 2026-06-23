import { baseStyle, spacing } from "@/constants";
import { useThemeColor } from "@/hooks";
import { ReactNode, useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
import { HorizontalDivider } from "./HorizontalDivider";
import { Icon } from "./Icon";
import { ThemedView } from "./ThemedView";

type CollapsableProps = {
  header: ReactNode;
  body: ReactNode;
};

export function Collapsable({ header, body }: CollapsableProps) {
  const captionColor = useThemeColor("caption");

  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const growAnim = useRef(new Animated.Value(0)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toExpanded = !expanded;
    setExpanded(toExpanded);

    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: toExpanded ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.spring(growAnim, {
        toValue: toExpanded ? 1 : 0,
        bounciness: 1,
        useNativeDriver: false,
      }),
      Animated.spring(enterAnim, {
        toValue: toExpanded ? 1 : 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <ThemedView>
      <Pressable onPress={toggle} style={baseStyle.inlineSectionSpaceBetween}>
        {header}
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Icon name="chevronDown" size={20} color={captionColor} />
        </Animated.View>
      </Pressable>

      {/* Outer wrapper grows via maxHeight */}
      <Animated.View
        style={{
          maxHeight: growAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 5000],
          }),
        }}
      >
        {/* Inner content fades and slides in from above */}
        <Animated.View
          style={{
            opacity: enterAnim,
            transform: [
              {
                translateY: enterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <HorizontalDivider marginVertical={spacing.small} />
          {body}
        </Animated.View>
      </Animated.View>
    </ThemedView>
  );
}
