import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface CalorieDeficitSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  isCalculating?: boolean;
}

export const CalorieDeficitSlider: React.FC<CalorieDeficitSliderProps> = ({
  value,
  onValueChange,
  isCalculating = false,
}) => {
  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue / 10) * 10; // Round to nearest 10
    onValueChange(roundedValue);
  };

  const getDeficitLevel = (calories: number) => {
    if (calories === 0) return 'No deficit';
    if (calories <= 100) return 'Mild';
    if (calories <= 200) return 'Moderate';
    if (calories <= 250) return 'Aggressive';
    return 'Very aggressive';
  };

  const getDeficitColor = (calories: number) => {
    if (calories === 0) return 'text-gray-500';
    if (calories <= 100) return 'text-green-500';
    if (calories <= 200) return 'text-blue-500';
    if (calories <= 250) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <View className="space-y-4">
      {/* Label */}
      <Text className="text-lg font-medium text-gray-700">
        Daily calorie deficit
      </Text>

      {/* Slider Container */}
      <View className="relative">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={300}
          value={value}
          onValueChange={handleValueChange}
          step={10}
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
          <Text className="text-sm text-blue-500">0 calories</Text>
          <Text className="text-sm text-blue-500">300 calories</Text>
        </View>

        {/* Current Value Display */}
        <View className="absolute -top-8 left-0 right-0 items-center">
          <View 
            className="bg-gray-800 px-3 py-1 rounded-lg"
            style={{
              left: `${(value / 300) * 100}%`,
              transform: [{ translateX: -30 }],
            }}
          >
            <Text className="text-white text-sm font-medium">
              {value} calories
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

      {/* Deficit Level Indicator */}
      <View className="flex-row items-center justify-between">
        <Text className={`text-sm font-medium ${getDeficitColor(value)}`}>
          {getDeficitLevel(value)}
        </Text>
        
        {value > 250 && (
          <Text className="text-xs text-red-500">
            ⚠️ High deficit - ensure adequate nutrition
          </Text>
        )}
      </View>

      {/* Progress Indicators */}
      <View className="flex-row space-x-1">
        {[0, 75, 150, 225, 300].map((threshold, index) => (
          <View
            key={threshold}
            className={`flex-1 h-1 rounded-full ${
              value >= threshold ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </View>
    </View>
  );
};
