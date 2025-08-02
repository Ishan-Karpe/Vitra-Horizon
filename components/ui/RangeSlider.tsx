import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

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
  unit = '',
  onValueChange,
  validationMessage,
  className = '',
}) => {
  return (
    <View className={`mb-8 ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">{label}</Text>
      <View className="bg-gray-50 p-4 rounded-xl">
        {/* Range Labels */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-blue-600 font-medium">
            {minimumValue}{unit}
          </Text>
          <Text className="text-blue-600 font-medium">
            {maximumValue}{unit}
          </Text>
        </View>
        
        {/* Slider */}
        <View className="px-2">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            value={value}
            step={step}
            onValueChange={onValueChange}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#e5e7eb"
            thumbStyle={{
              backgroundColor: '#2563eb',
              width: 24,
              height: 24,
            }}
            trackStyle={{
              height: 6,
              borderRadius: 3,
            }}
          />
        </View>
        
        {/* Current Value Display */}
        <Text className="text-center text-gray-700 font-semibold mt-2">
          {value}{unit}
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
