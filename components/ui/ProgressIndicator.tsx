import React from 'react';
import { View, Text } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className = ''
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View className={`w-full ${className}`}>
      {/* Progress Bar */}
      <View className="w-full h-2 bg-gray-200 rounded-full mb-3">
        <View 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
      
      {/* Step Counter */}
      <Text className="text-sm text-gray-500 text-right">
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};
