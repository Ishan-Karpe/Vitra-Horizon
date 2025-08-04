import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PredictionResult {
  bodyFatPercentage: number;
  fatLoss: number;
  muscleGain: number;
  timeline: number;
  confidenceScore: number;
}

interface ComparisonCardsProps {
  currentPlan: PredictionResult;
  newPlan: PredictionResult;
  isCalculating: boolean;
  showComparison: boolean;
  onToggleComparison: () => void;
}

export const ComparisonCards: React.FC<ComparisonCardsProps> = ({
  currentPlan,
  newPlan,
  isCalculating,
  showComparison,
  onToggleComparison,
}) => {
  const getImprovementIndicator = (current: number, new_: number, higherIsBetter: boolean = false) => {
    const diff = new_ - current;
    const isImprovement = higherIsBetter ? diff > 0 : diff < 0;
    
    if (Math.abs(diff) < 0.1) return { icon: '→', color: 'text-gray-500', text: 'Same' };
    if (isImprovement) return { icon: '↗️', color: 'text-green-500', text: 'Better' };
    return { icon: '↘️', color: 'text-red-500', text: 'Worse' };
  };

  const PlanCard: React.FC<{
    title: string;
    prediction: PredictionResult;
    isNew?: boolean;
  }> = ({ title, prediction, isNew = false }) => (
    <View className={`flex-1 p-4 rounded-xl ${isNew ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <Text className={`text-sm font-medium mb-3 ${isNew ? 'text-blue-600' : 'text-gray-600'}`}>
        {title}
      </Text>

      {/* Body Fat Percentage */}
      <View className="mb-4">
        <Text className={`text-3xl font-bold ${isNew ? 'text-blue-600' : 'text-gray-900'}`}>
          {Number(prediction.bodyFatPercentage).toFixed(1)}%
        </Text>
        <Text className={`text-sm ${isNew ? 'text-blue-500' : 'text-gray-500'}`}>
          body fat
        </Text>
      </View>

      {/* Metrics */}
      <View className="space-y-2">
        {/* Fat Loss */}
        <View className="flex-row items-center">
          <View className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
            isNew ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Text className="text-xs">📉</Text>
          </View>
          <Text className="text-sm text-gray-700 flex-1">
            Fat loss: {Number(prediction.fatLoss).toFixed(2)} lbs
          </Text>
          {isNew && showComparison && (
            <View className="flex-row items-center">
              <Text className={`text-xs ${getImprovementIndicator(currentPlan.fatLoss, prediction.fatLoss, true).color}`}>
                {getImprovementIndicator(currentPlan.fatLoss, prediction.fatLoss, true).icon}
              </Text>
            </View>
          )}
        </View>

        {/* Muscle Gain */}
        <View className="flex-row items-center">
          <View className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
            isNew ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Text className="text-xs">💪</Text>
          </View>
          <Text className="text-sm text-gray-700 flex-1">
            Muscle: {Number(prediction.muscleGain).toFixed(2)} lbs
          </Text>
          {isNew && showComparison && (
            <View className="flex-row items-center">
              <Text className={`text-xs ${getImprovementIndicator(currentPlan.muscleGain, prediction.muscleGain, true).color}`}>
                {getImprovementIndicator(currentPlan.muscleGain, prediction.muscleGain, true).icon}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Calculating Overlay */}
      {isCalculating && isNew && (
        <View className="absolute inset-0 bg-white bg-opacity-70 rounded-xl items-center justify-center">
          <Text className="text-blue-500 text-sm animate-pulse">Calculating...</Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="space-y-4">
      {/* Toggle Button */}
      <TouchableOpacity
        className="self-center px-4 py-2 bg-gray-100 rounded-full"
        onPress={onToggleComparison}
      >
        <Text className="text-gray-600 text-sm">
          {showComparison ? '👁️ Hide Comparison' : '👁️ Show Comparison'}
        </Text>
      </TouchableOpacity>

      {/* Comparison Cards */}
      <View className="flex-row space-x-4">
        <PlanCard title="Current Plan" prediction={currentPlan} />
        <PlanCard title="New Plan" prediction={newPlan} isNew />
      </View>

      {/* Improvement Summary */}
      {showComparison && (
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Changes with new plan:
          </Text>
          
          <View className="space-y-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Body fat reduction:</Text>
              <Text className={`text-sm font-medium ${
                newPlan.bodyFatPercentage < currentPlan.bodyFatPercentage ? 'text-green-600' : 'text-red-600'
              }`}>
                {newPlan.bodyFatPercentage < currentPlan.bodyFatPercentage ? '+' : ''}
                {(newPlan.bodyFatPercentage - currentPlan.bodyFatPercentage).toFixed(1)}%
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Additional fat loss:</Text>
              <Text className={`text-sm font-medium ${
                newPlan.fatLoss > currentPlan.fatLoss ? 'text-green-600' : 'text-red-600'
              }`}>
                {newPlan.fatLoss > currentPlan.fatLoss ? '+' : ''}
                {Math.round((newPlan.fatLoss - currentPlan.fatLoss) * 10) / 10} lbs
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Additional muscle:</Text>
              <Text className={`text-sm font-medium ${
                newPlan.muscleGain > currentPlan.muscleGain ? 'text-green-600' : 'text-red-600'
              }`}>
                {newPlan.muscleGain > currentPlan.muscleGain ? '+' : ''}
                {Number(newPlan.muscleGain - currentPlan.muscleGain).toFixed(2)} lbs
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
