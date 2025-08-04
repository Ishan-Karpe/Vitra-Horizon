import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface WeightSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}

export const WeightSlider: React.FC<WeightSliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  className = ''
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Label */}
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Current Weight
      </Text>
      
      {/* Current Value Display */}
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-blue-600">
          {Math.round(value)} lbs
        </Text>
      </View>
      
      {/* Slider */}
      <View className="px-4">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#2563eb"
        />
        
        {/* Min/Max Labels */}
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-500">{min} lbs</Text>
          <Text className="text-sm text-gray-500">{max} lbs</Text>
        </View>
      </View>
    </View>
  );
};
