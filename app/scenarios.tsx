import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import {
  CalorieDeficitSlider,
  ComparisonCards,
  ExerciseFrequencySlider,
  ProteinIntakeSelector
} from '../components/scenarios';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { ScenarioParameters, ScenarioPrediction, useScenarios } from '../contexts/ScenariosContext';

export default function ScenariosScreen() {
  const { addScenario, calculatePrediction, scenarios, generateScenarioName } = useScenarios();

  // Local state for current parameters being edited
  const [currentParameters, setCurrentParameters] = useState<ScenarioParameters>({
    exerciseFrequency: 4,
    calorieDeficit: 300,
    proteinIntake: 'High',
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  // Get the onboarding scenario as the current plan
  const currentPlanScenario = scenarios.find(s => s.isFromOnboarding);
  const currentPlanPrediction = currentPlanScenario?.prediction;

  // Calculate new prediction based on current parameters
  const [newPlanPrediction, setNewPlanPrediction] = useState<ScenarioPrediction | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    // Simulate calculation delay
    const timer = setTimeout(() => {
      const prediction = calculatePrediction(currentParameters);
      setNewPlanPrediction(prediction);
      setIsCalculating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentParameters, calculatePrediction]);

  const handleParameterChange = (updates: Partial<ScenarioParameters>) => {
    setCurrentParameters(prev => ({ ...prev, ...updates }));
  };

  const saveScenario = () => {
    if (newPlanPrediction) {
      addScenario({
        name: generateScenarioName(),
        parameters: currentParameters,
        prediction: newPlanPrediction,
        isFromOnboarding: false,
        isFavorite: false,
      });
    }
  };

  const handleSaveScenario = () => {
    saveScenario();
    console.log('Scenario saved, navigating to scenarios tab');
    router.push('/(tabs)/scenarios');
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
            onValueChange={(value) => handleParameterChange({ exerciseFrequency: value })}
            isCalculating={isCalculating}
          />

          {/* Daily Calorie Deficit Slider */}
          <CalorieDeficitSlider
            value={currentParameters.calorieDeficit}
            onValueChange={(value: number) => handleParameterChange({ calorieDeficit: value })}
            isCalculating={isCalculating}
          />

          {/* Protein Intake Selector */}
          <ProteinIntakeSelector
            value={currentParameters.proteinIntake}
            onValueChange={(value: 'Low' | 'Medium' | 'High') => handleParameterChange({ proteinIntake: value })}
            isCalculating={isCalculating}
          />
        </View>

        {/* Comparison Cards */}
        {currentPlanPrediction && newPlanPrediction && (
          <ComparisonCards
            currentPlan={{
              bodyFatPercentage: currentPlanPrediction.targetBodyFat,
              fatLoss: currentPlanPrediction.fatLoss,
              muscleGain: currentPlanPrediction.muscleGain,
              timeline: currentPlanPrediction.timeline,
              confidenceScore: currentPlanPrediction.confidence,
            }}
            newPlan={{
              bodyFatPercentage: newPlanPrediction.targetBodyFat,
              fatLoss: newPlanPrediction.fatLoss,
              muscleGain: newPlanPrediction.muscleGain,
              timeline: newPlanPrediction.timeline,
              confidenceScore: newPlanPrediction.confidence,
            }}
            isCalculating={isCalculating}
            showComparison={showComparison}
            onToggleComparison={() => setShowComparison(!showComparison)}
          />
        )}

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
