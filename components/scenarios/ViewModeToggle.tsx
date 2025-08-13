import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAIEnhancedScenarios } from "../../contexts/AIEnhancedScenariosContext";
import { ViewMode } from "../../contexts/ScenariosContext";

export const ViewModeToggle: React.FC = () => {
  const { viewMode, setViewMode } = useAIEnhancedScenarios();

  const handleModeChange = async (mode: ViewMode) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  };

  return (
    <View className="px-6 mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Scenario Testing
      </Text>

      <View className="bg-gray-100 rounded-full p-1 flex-row">
        <TouchableOpacity
          className={`flex-1 py-2 px-4 rounded-full ${
            viewMode === "single" ? "bg-blue-500" : "bg-transparent"
          }`}
          onPress={() => handleModeChange("single")}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-medium ${
              viewMode === "single" ? "text-white" : "text-gray-600"
            }`}
          >
            Single
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2 px-4 rounded-full ${
            viewMode === "compare" ? "bg-blue-500" : "bg-transparent"
          }`}
          onPress={() => handleModeChange("compare")}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-medium ${
              viewMode === "compare" ? "text-white" : "text-gray-600"
            }`}
          >
            Compare
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
