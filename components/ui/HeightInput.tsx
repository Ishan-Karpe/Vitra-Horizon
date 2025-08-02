import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface HeightInputProps {
  feet: number;
  inches: number;
  onFeetChange: (value: number) => void;
  onInchesChange: (value: number) => void;
  className?: string;
}

export const HeightInput: React.FC<HeightInputProps> = ({
  feet,
  inches,
  onFeetChange,
  onInchesChange,
  className = ''
}) => {
  const handleFeetChange = (text: string) => {
    const value = parseInt(text) || 0;
    if (value >= 4 && value <= 7) {
      onFeetChange(value);
    }
  };

  const handleInchesChange = (text: string) => {
    const value = parseInt(text) || 0;
    if (value >= 0 && value <= 11) {
      onInchesChange(value);
    }
  };

  return (
    <View className={`w-full ${className}`}>
      {/* Label */}
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Height
      </Text>
      
      {/* Input Fields */}
      <View className="flex-row items-center justify-center space-x-4">
        {/* Feet Input */}
        <View className="flex-1 max-w-20">
          <TextInput
            className="w-full h-12 px-4 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg"
            value={feet.toString()}
            onChangeText={handleFeetChange}
            keyboardType="numeric"
            maxLength={1}
            placeholder="5"
            placeholderTextColor="#9ca3af"
          />
          <Text className="text-sm text-gray-500 text-center mt-1">ft</Text>
        </View>
        
        {/* Separator */}
        <Text className="text-lg text-gray-400 font-semibold">:</Text>
        
        {/* Inches Input */}
        <View className="flex-1 max-w-20">
          <TextInput
            className="w-full h-12 px-4 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg"
            value={inches.toString()}
            onChangeText={handleInchesChange}
            keyboardType="numeric"
            maxLength={2}
            placeholder="8"
            placeholderTextColor="#9ca3af"
          />
          <Text className="text-sm text-gray-500 text-center mt-1">in</Text>
        </View>
      </View>
      
      {/* Height Display */}
      <View className="items-center mt-4">
        <Text className="text-sm text-gray-600">
          {feet}'{inches}" ({Math.round((feet * 12 + inches) * 2.54)} cm)
        </Text>
      </View>
    </View>
  );
};
