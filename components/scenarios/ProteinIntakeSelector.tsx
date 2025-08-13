import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProteinIntakeSelectorProps {
  value: "Low" | "Medium" | "High";
  onValueChange: (value: "Low" | "Medium" | "High") => void;
  isCalculating?: boolean;
}

export const ProteinIntakeSelector: React.FC<ProteinIntakeSelectorProps> = ({
  value,
  onValueChange,
  isCalculating = false,
}) => {
  const options = [
    {
      value: "Low" as const,
      label: "Low",
      description: "0.6-0.8g per lb",
      color: "bg-orange-100 border-orange-300 text-orange-700",
      selectedColor: "bg-orange-500 border-orange-500 text-white",
    },
    {
      value: "Medium" as const,
      label: "Medium",
      description: "0.8-1.0g per lb",
      color: "bg-blue-100 border-blue-300 text-blue-700",
      selectedColor: "bg-blue-500 border-blue-500 text-white",
    },
    {
      value: "High" as const,
      label: "High",
      description: "1.0-1.2g per lb",
      color: "bg-green-100 border-green-300 text-green-700",
      selectedColor: "bg-green-500 border-green-500 text-white",
    },
  ];

  return (
    <View className="space-y-4">
      {/* Label */}
      <Text className="text-lg font-medium text-gray-700">Protein intake</Text>

      {/* Options */}
      <View className="flex-row space-x-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const colorClasses = isSelected ? option.selectedColor : option.color;

          return (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 p-4 rounded-xl border-2 ${colorClasses} ${
                isCalculating ? "opacity-70" : ""
              }`}
              onPress={() => onValueChange(option.value)}
              disabled={isCalculating}
              activeOpacity={0.7}
            >
              <View className="items-center space-y-1">
                <Text
                  className={`font-semibold text-base ${
                    isSelected ? "text-white" : "text-current"
                  }`}
                >
                  {option.label}
                </Text>
                <Text
                  className={`text-xs text-center ${
                    isSelected
                      ? "text-white opacity-90"
                      : "text-current opacity-70"
                  }`}
                >
                  {option.description}
                </Text>
              </View>

              {/* Selection Indicator */}
              {isSelected && (
                <View className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full items-center justify-center">
                  <Text className="text-xs">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Additional Info */}
      <View className="bg-gray-50 p-3 rounded-lg">
        <Text className="text-sm text-gray-600 text-center">
          {value === "Low" && "Suitable for general health and light activity"}
          {value === "Medium" &&
            "Recommended for regular exercise and muscle maintenance"}
          {value === "High" &&
            "Optimal for muscle building and intense training"}
        </Text>
      </View>

      {/* Calculating Indicator */}
      {isCalculating && (
        <View className="items-center">
          <Text className="text-xs text-blue-500 animate-pulse">
            Updating prediction...
          </Text>
        </View>
      )}
    </View>
  );
};
