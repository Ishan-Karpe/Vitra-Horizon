import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ActivityLevelOption {
  value: string;
  label: string;
  description?: string;
}

interface ActivityLevelSelectorProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  className?: string;
}

const activityLevels: ActivityLevelOption[] = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
  },
  {
    value: "extremely_active",
    label: "Extremely Active",
    description: "Very hard exercise, physical job",
  },
];

export const ActivityLevelSelector: React.FC<ActivityLevelSelectorProps> = ({
  selectedLevel,
  onLevelChange,
  className = "",
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Label */}
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Activity Level
      </Text>

      {/* Options */}
      <View className="space-y-3">
        {activityLevels.map((level) => {
          const isSelected = selectedLevel === level.value;

          return (
            <TouchableOpacity
              key={level.value}
              onPress={() => onLevelChange(level.value)}
              activeOpacity={0.7}
              className={`w-full p-4 rounded-lg border-2 ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center">
                {/* Radio Button */}
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <View className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </View>

                {/* Label and Description */}
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      isSelected ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {level.label}
                  </Text>
                  {level.description && (
                    <Text
                      className={`text-sm mt-1 ${
                        isSelected ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {level.description}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
