import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { useProgress, TimePeriod } from "../../contexts/ProgressContext";

const periods: TimePeriod[] = ["Week", "Month", "3M", "6M"];

export const TimePeriodSelector: React.FC = () => {
  const { selectedPeriod, setSelectedPeriod } = useProgress();

  const handlePeriodSelect = async (period: TimePeriod) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);
  };

  return (
    <View className="bg-gray-100 rounded-lg p-1 mx-6 mb-6">
      <View className="flex-row">
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            className={`flex-1 py-2 px-4 rounded-md ${
              selectedPeriod === period ? "bg-blue-500" : "bg-transparent"
            }`}
            onPress={() => handlePeriodSelect(period)}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-medium ${
                selectedPeriod === period ? "text-white" : "text-gray-600"
              }`}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
