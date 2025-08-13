import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export const FloatingActionButton: React.FC = () => {
  const router = useRouter();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/create-scenario");
  };

  return (
    <TouchableOpacity
      className="absolute bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-2xl font-light">+</Text>
    </TouchableOpacity>
  );
};
