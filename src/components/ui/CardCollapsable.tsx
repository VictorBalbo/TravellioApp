import { getThemeProperty } from "@/hooks";
import { ReactNode, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { CardView } from "./CardView";
import HorizontalDivider from "./HorizontalDivider";
import { Icon } from "./Icon";

type CardCollapsableProps = {
  header: ReactNode;
  body: ReactNode;
};

export function CardCollapsable({ header, body }: CardCollapsableProps) {
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
    <CardView style={styles.card}>
      <Pressable onPress={toggle} style={styles.header}>
        {header}
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Icon name="chevronDown" size={20} />
        </Animated.View>
      </Pressable>

      {/* Outer wrapper grows via maxHeight */}
      <Animated.View
        style={[
          styles.body,
          {
            maxHeight: growAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
          },
        ]}
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
          <HorizontalDivider marginVertical={styles.divider.marginVertical} />
          {body}
        </Animated.View>
      </Animated.View>
    </CardView>
  );
}

const smallSpacing = getThemeProperty("smallSpacing");

const styles = StyleSheet.create({
  card: {
    padding: smallSpacing,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    marginVertical: smallSpacing,
  },
  body: {},
});
