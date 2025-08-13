import Slider from "@react-native-community/slider";
import React from "react";
import { Platform, Text, View } from "react-native";

interface RangeSliderProps {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
  validationMessage?: string;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  minimumValue,
  maximumValue,
  step = 1,
  unit = "",
  onValueChange,
  validationMessage,
  className = "",
}) => {
  const handleValueChange = (newValue: number) => {
    // Round to 1 decimal place for body fat percentages, otherwise use step
    const roundedValue =
      unit === "%"
        ? Math.round(newValue * 10) / 10
        : Math.round(newValue / step) * step;
    onValueChange(roundedValue);
  };

  return (
    <View className={`mb-8 ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">{label}</Text>
      <View className="bg-gray-50 p-4 rounded-xl">
        {/* Range Labels */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-blue-600 font-medium">
            {unit === "%" ? Number(minimumValue).toFixed(1) : minimumValue}
            {unit}
          </Text>
          <Text className="text-blue-600 font-medium">
            {unit === "%" ? Number(maximumValue).toFixed(1) : maximumValue}
            {unit}
          </Text>
        </View>

        {/* Slider */}
        <View className="px-2">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            value={value}
            step={step}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#e5e7eb"
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
        </View>

        {/* Current Value Display */}
        <Text className="text-center text-gray-700 font-semibold mt-2">
          {unit === "%" ? Number(value).toFixed(1) : value}
          {unit}
        </Text>

        {/* Validation Message */}
        {validationMessage && (
          <Text className="text-red-500 text-sm text-center mt-2">
            {validationMessage}
          </Text>
        )}
      </View>
    </View>
  );
};
