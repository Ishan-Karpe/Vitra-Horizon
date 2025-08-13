import * as Haptics from "expo-haptics";
import { ComponentProps } from "react";
import { Pressable } from "react-native";

type TabBarButtonProps = ComponentProps<typeof Pressable>;

export function HapticTab(props: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
