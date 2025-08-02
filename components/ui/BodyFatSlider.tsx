import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface BodyFatSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  onNotSurePress: () => void;
  min: number;
  max: number;
  className?: string;
}

export const BodyFatSlider: React.FC<BodyFatSliderProps> = ({
  value,
  onValueChange,
  onNotSurePress,
  min,
  max,
  className = ''
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Label and Not Sure Link */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Estimated Body Fat %
        </Text>
        <TouchableOpacity onPress={onNotSurePress} activeOpacity={0.7}>
          <Text className="text-blue-600 font-medium">Not sure?</Text>
        </TouchableOpacity>
      </View>
      
      {/* Current Value Display */}
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-blue-600">
          {Math.round(value)}%
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
        
        {/* Min/Max Labels */}
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-500">{min}%</Text>
          <Text className="text-sm text-gray-500">{max}%</Text>
        </View>
      </View>
    </View>
  );
};
