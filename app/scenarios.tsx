import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import {
  CalorieDeficitSlider,
  ComparisonCards,
  ExerciseFrequencySlider,
  ProteinIntakeSelector
} from '../components/scenarios';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { useScenariosContext } from '../contexts/ScenariosContext';

export default function ScenariosScreen() {
  const {
    currentParameters,
    setCurrentParameters,
    currentPlanPrediction,
    newPlanPrediction,
    isCalculating,
    showComparison,
    setShowComparison,
    saveScenario,
  } = useScenariosContext();

  const handleSaveScenario = () => {
    saveScenario();
    console.log('Scenario saved, navigating to main app dashboard');
    router.push('/(tabs)');
  };

  const handleTryAnother = () => {
    console.log('Try Another pressed, navigating back to goals');
    router.push('/goals');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-8">
          <ProgressIndicator 
            currentStep={4} 
            totalSteps={6} 
            className="mb-6"
          />
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            What if you...
          </Text>
          
          <Text className="text-lg text-gray-600 mb-6">
            Adjust your plan:
          </Text>
        </View>

        {/* Parameter Controls */}
        <View className="space-y-8 mb-8">
          {/* Exercise Frequency Slider */}
          <ExerciseFrequencySlider
            value={currentParameters.exerciseFrequency}
            onValueChange={(value) => setCurrentParameters({ exerciseFrequency: value })}
            isCalculating={isCalculating}
          />

          {/* Daily Calorie Deficit Slider */}
          <CalorieDeficitSlider
            value={currentParameters.calorieDeficit}
            onValueChange={(value: number) => setCurrentParameters({ calorieDeficit: value })}
            isCalculating={isCalculating}
          />

          {/* Protein Intake Selector */}
          <ProteinIntakeSelector
            value={currentParameters.proteinIntake}
            onValueChange={(value: 'Low' | 'Medium' | 'High') => setCurrentParameters({ proteinIntake: value })}
            isCalculating={isCalculating}
          />
        </View>

        {/* Comparison Cards */}
        <ComparisonCards
          currentPlan={currentPlanPrediction}
          newPlan={newPlanPrediction}
          isCalculating={isCalculating}
          showComparison={showComparison}
          onToggleComparison={() => setShowComparison(!showComparison)}
        />

        {/* Action Buttons */}
        <View className="space-y-4 mt-8">
          <TouchableOpacity 
            className="bg-green-500 py-4 px-8 rounded-xl"
            onPress={handleSaveScenario}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Save This Scenario
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-transparent border-2 border-blue-500 py-4 px-8 rounded-xl"
            onPress={handleTryAnother}
          >
            <Text className="text-blue-500 text-lg font-semibold text-center">
              Try Another
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
