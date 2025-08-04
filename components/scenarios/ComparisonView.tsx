import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useScenarios } from '../../contexts/ScenariosContext';

export const ComparisonView: React.FC = () => {
  const { 
    scenarios, 
    selectedScenariosForComparison, 
    toggleScenarioForComparison,
    clearComparison 
  } = useScenarios();

  const handleScenarioToggle = async (scenarioId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleScenarioForComparison(scenarioId);
  };

  const handleClearComparison = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearComparison();
  };

  const selectedScenarios = scenarios.filter(s => 
    selectedScenariosForComparison.includes(s.id)
  );

  return (
    <View className="px-6">
      {/* Selection Instructions */}
      <View className="bg-blue-50 rounded-lg p-4 mb-6">
        <Text className="text-blue-800 font-medium mb-2">
          Select scenarios to compare (up to 3)
        </Text>
        <Text className="text-blue-600 text-sm">
          {selectedScenariosForComparison.length}/3 scenarios selected
        </Text>
        {selectedScenariosForComparison.length > 0 && (
          <TouchableOpacity
            className="mt-2"
            onPress={handleClearComparison}
            activeOpacity={0.7}
          >
            <Text className="text-blue-600 text-sm font-medium">Clear Selection</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scenario Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Available Scenarios</Text>
        {scenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            className={`bg-white rounded-lg p-4 mb-3 border-2 ${
              selectedScenariosForComparison.includes(scenario.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onPress={() => handleScenarioToggle(scenario.id)}
            activeOpacity={0.7}
            disabled={
              !selectedScenariosForComparison.includes(scenario.id) && 
              selectedScenariosForComparison.length >= 3
            }
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-medium">{scenario.name}</Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-500 mr-2">
                  {scenario.prediction.targetBodyFat}% target
                </Text>
                {selectedScenariosForComparison.includes(scenario.id) && (
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comparison Results */}
      {selectedScenarios.length >= 2 && (
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Comparison Results</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {selectedScenarios.map((scenario, index) => (
                <View key={scenario.id} className="mr-6 min-w-[200px]">
                  <Text className="font-medium text-gray-900 mb-3">{scenario.name}</Text>
                  
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Target Body Fat:</Text>
                      <Text className="text-sm font-medium">{scenario.prediction.targetBodyFat}%</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Fat Loss:</Text>
                      <Text className="text-sm font-medium">{Math.round(scenario.prediction.fatLoss * 10) / 10} lbs</Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Muscle Gain:</Text>
                      <Text className="text-sm font-medium">{Math.round(scenario.prediction.muscleGain * 10) / 10} lbs</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Timeline:</Text>
                      <Text className="text-sm font-medium">{scenario.prediction.timeline} weeks</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Confidence:</Text>
                      <Text className="text-sm font-medium">{scenario.prediction.confidence}%</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Exercise:</Text>
                      <Text className="text-sm font-medium">{scenario.parameters.exerciseFrequency}x/week</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Calorie Deficit:</Text>
                      <Text className="text-sm font-medium">{scenario.parameters.calorieDeficit} cal</Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Protein:</Text>
                      <Text className="text-sm font-medium">{scenario.parameters.proteinIntake}</Text>
                    </View>
                  </View>
                  
                  {index < selectedScenarios.length - 1 && (
                    <View className="absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
          
          {/* Best Recommendation */}
          <View className="mt-6 p-4 bg-green-50 rounded-lg">
            <Text className="text-green-800 font-medium mb-2">💡 Recommendation</Text>
            <Text className="text-green-700 text-sm">
              {selectedScenarios.reduce((best, current) => 
                current.prediction.confidence > best.prediction.confidence ? current : best
              ).name} has the highest confidence score and may be your best option.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
