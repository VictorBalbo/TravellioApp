import { PropsWithChildren, useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type PressableViewProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A touchable container that animates press interaction using scale and opacity.
 *
 * This component wraps its children in a `Pressable` and an animated view,
 * applying a subtle shrink and fade effect when pressed and restoring the
 * appearance on release.
 *
 * Props:
 * - `onPress`: callback fired when the user completes a press gesture.
 * - `style`: optional style overrides for the outer pressable container.
 */
export const PressableView = ({ onPress, style, children }: PressableViewProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95, // Scale down
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7, // Reduce opacity
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, // Return to normal size
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, // Restore opacity
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
