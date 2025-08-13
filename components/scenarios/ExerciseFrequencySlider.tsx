import Slider from "@react-native-community/slider";
import React from "react";
import { Platform, Text, View } from "react-native";

interface ExerciseFrequencySliderProps {
  value: number;
  onValueChange: (value: number) => void;
  isCalculating?: boolean;
}

export const ExerciseFrequencySlider: React.FC<
  ExerciseFrequencySliderProps
> = ({ value, onValueChange, isCalculating = false }) => {
  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    onValueChange(roundedValue);
  };

  return (
    <View className="space-y-4">
      {/* Label */}
      <Text className="text-lg font-medium text-gray-700">
        Exercise frequency
      </Text>

      {/* Current Value Display - Bold Blue Text */}
      <View className="items-center mb-2">
        <Text className="text-3xl font-bold text-blue-600">
          {Number(value).toFixed(0)} {value === 1 ? "time" : "times"}/week
        </Text>
      </View>

      {/* Slider Container */}
      <View className="relative">
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={1}
          maximumValue={7}
          value={value}
          onValueChange={handleValueChange}
          step={1}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#2563eb"
          // Web-specific props to prevent DOM errors
          {...(Platform.OS === "web" && {
            onStartShouldSetResponder: undefined,
            onResponderTerminationRequest: undefined,
            onResponderGrant: undefined,
            onResponderMove: undefined,
            onResponderRelease: undefined,
            onResponderTerminate: undefined,
          })}
        />

        {/* Value Labels */}
        <View className="flex-row justify-between mt-2 px-1">
          <Text className="text-sm text-blue-500">1 times/week</Text>
          <Text className="text-sm text-blue-500">7 times/week</Text>
        </View>

        {/* Calculating Indicator */}
        {isCalculating && (
          <View className="absolute -bottom-8 left-0 right-0 items-center">
            <Text className="text-lg font-bold text-blue-600 animate-pulse">
              Updating prediction...
            </Text>
          </View>
        )}
      </View>

      {/* Tick Marks */}
      <View className="flex-row justify-between px-1">
        {[1, 2, 3, 4, 5, 6, 7].map((tick) => (
          <View
            key={tick}
            className={`w-1 h-1 rounded-full ${
              tick <= value ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
