import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface ExerciseFrequencySliderProps {
  value: number;
  onValueChange: (value: number) => void;
  isCalculating?: boolean;
}

export const ExerciseFrequencySlider: React.FC<ExerciseFrequencySliderProps> = ({
  value,
  onValueChange,
  isCalculating = false,
}) => {
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

      {/* Slider Container */}
      <View className="relative">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={7}
          value={value}
          onValueChange={handleValueChange}
          step={1}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#E5E7EB"
          thumbStyle={{
            backgroundColor: '#3B82F6',
            width: 24,
            height: 24,
          }}
          trackStyle={{
            height: 4,
            borderRadius: 2,
          }}
        />

        {/* Value Labels */}
        <View className="flex-row justify-between mt-2 px-1">
          <Text className="text-sm text-blue-500">1 times/week</Text>
          <Text className="text-sm text-blue-500">7 times/week</Text>
        </View>

        {/* Current Value Display */}
        <View className="absolute -top-8 left-0 right-0 items-center">
          <View 
            className="bg-gray-800 px-3 py-1 rounded-lg"
            style={{
              left: `${((value - 1) / 6) * 100}%`,
              transform: [{ translateX: -20 }],
            }}
          >
            <Text className="text-white text-sm font-medium">
              {value} {value === 1 ? 'time' : 'times'}/week
            </Text>
          </View>
        </View>

        {/* Calculating Indicator */}
        {isCalculating && (
          <View className="absolute -bottom-6 left-0 right-0 items-center">
            <Text className="text-xs text-blue-500 animate-pulse">
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
              tick <= value ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
};
