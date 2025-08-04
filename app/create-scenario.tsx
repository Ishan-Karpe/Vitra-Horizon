import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CalorieDeficitSlider, ExerciseFrequencySlider, ProteinIntakeSelector } from '../components/scenarios';
import { ScenarioParameters, useScenarios } from '../contexts/ScenariosContext';

export default function CreateScenarioScreen() {
  const { addScenario, calculatePrediction, generateDescriptiveName } = useScenarios();
  
  const [scenarioName, setScenarioName] = useState('');
  const [parameters, setParameters] = useState<ScenarioParameters>({
    exerciseFrequency: 3,
    calorieDeficit: 250,
    proteinIntake: 'Medium',
  });

  const [isCreating, setIsCreating] = useState(false);

  const prediction = calculatePrediction(parameters);

  const handleCreateScenario = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!scenarioName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your scenario.');
      return;
    }

    setIsCreating(true);

    try {
      const scenarioData = {
        name: scenarioName.trim(),
        parameters,
        prediction,
        isFromOnboarding: false,
        isFavorite: false,
      };

      addScenario(scenarioData);
      
      Alert.alert(
        'Success!', 
        'Your new scenario has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create scenario. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleAutoName = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const autoName = generateDescriptiveName(parameters);
    setScenarioName(autoName);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Create New Scenario
          </Text>
          <Text className="text-lg text-gray-600">
            Design a custom fitness plan with your preferred parameters
          </Text>
        </View>

        {/* Scenario Name */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Scenario Name</Text>
          <View className="flex-row gap-3">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter scenario name..."
              value={scenarioName}
              onChangeText={setScenarioName}
              maxLength={50}
            />
            <TouchableOpacity
              className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-3"
              onPress={handleAutoName}
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 font-medium">Auto</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 mt-1">
            Tip: Use descriptive names like "High Intensity Plan" or "Beginner Routine"
          </Text>
        </View>

        {/* Parameters */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-6">Plan Parameters</Text>
          
          <ExerciseFrequencySlider
            value={parameters.exerciseFrequency}
            onValueChange={(value) => setParameters(prev => ({ ...prev, exerciseFrequency: value }))}
            className="mb-6"
          />
          
          <CalorieDeficitSlider
            value={parameters.calorieDeficit}
            onValueChange={(value) => setParameters(prev => ({ ...prev, calorieDeficit: value }))}
            className="mb-6"
          />
          
          <ProteinIntakeSelector
            value={parameters.proteinIntake}
            onValueChange={(value) => setParameters(prev => ({ ...prev, proteinIntake: value }))}
            className="mb-6"
          />
        </View>

        {/* Prediction Preview */}
        <View className="bg-blue-50 rounded-lg p-6 mb-8">
          <Text className="text-lg font-semibold text-blue-900 mb-4">Predicted Results</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-blue-700">Target Body Fat:</Text>
              <Text className="text-blue-900 font-semibold">{Number(prediction.targetBodyFat).toFixed(1)}%</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-blue-700">Expected Fat Loss:</Text>
              <Text className="text-blue-900 font-semibold">{Number(prediction.fatLoss).toFixed(1)} lbs</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-blue-700">Expected Muscle Gain:</Text>
              <Text className="text-blue-900 font-semibold">{Number(prediction.muscleGain).toFixed(1)} lbs</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-blue-700">Timeline:</Text>
              <Text className="text-blue-900 font-semibold">{prediction.timeline} weeks</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-blue-700">Confidence Score:</Text>
              <Text className={`font-semibold ${
                prediction.confidence >= 80 ? 'text-green-600' : 
                prediction.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Number(prediction.confidence).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity
            className="flex-1 border border-gray-300 rounded-lg py-4"
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-center font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 rounded-lg py-4 ${
              isCreating ? 'bg-gray-400' : 'bg-blue-600'
            }`}
            onPress={handleCreateScenario}
            activeOpacity={0.7}
            disabled={isCreating || !scenarioName.trim()}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isCreating ? 'Creating...' : 'Create Scenario'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
