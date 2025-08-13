import React from "react";
import { Text, View } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className = "",
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Step Counter */}
      <Text className="text-sm text-gray-500 text-right mb-3">
        Step {currentStep} of {totalSteps}
      </Text>

      {/* Progress Steps - 5 equal parts */}
      <View className="flex-row space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;

          return (
            <View
              key={stepNumber}
              className={`flex-1 h-2 rounded-full ${
                isCompleted ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          );
        })}
      </View>
    </View>
  );
};
