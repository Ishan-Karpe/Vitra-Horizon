import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useAIEnhancedScenarios } from '../contexts/AIEnhancedScenariosContext';
import { ScenarioParameters } from '../contexts/ScenariosContext';

export default function EditScenarioScreen() {
  const router = useRouter();
  const { scenarioId } = useLocalSearchParams<{ scenarioId?: string }>();
  const {
    scenarios,
    addScenario,
    updateScenario,
    calculatePrediction,
    generateScenarioName,
    generateDescriptiveName
  } = useAIEnhancedScenarios();

  const existingScenario = scenarioId ? scenarios.find(s => s.id === scenarioId) : null;
  const isEditing = !!existingScenario;

  const [scenarioName, setScenarioName] = useState(
    existingScenario?.name || (isEditing ? '' : generateScenarioName())
  );
  const [parameters, setParameters] = useState<ScenarioParameters>(
    existingScenario?.parameters || {
      exerciseFrequency: 3,
      calorieDeficit: 150,
      proteinIntake: 'Medium',
    }
  );

  const [prediction, setPrediction] = useState(
    existingScenario?.prediction || {
      currentBodyFat: 25,
      targetBodyFat: 21,
      fatLoss: 8,
      muscleGain: 3.2,
      timeline: 12,
      confidence: 75
    }
  );

  // Update prediction when parameters change
  useEffect(() => {
    const updatePrediction = async () => {
      try {
        const newPrediction = await calculatePrediction(parameters);
        setPrediction(newPrediction);
      } catch (error) {
        console.warn('Failed to calculate prediction:', error);
      }
    };

    updatePrediction();
  }, [parameters, calculatePrediction]);

  const handleParameterChange = async (key: keyof ScenarioParameters, value: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!scenarioName.trim()) {
      Alert.alert('Error', 'Please enter a scenario name.');
      return;
    }

    if (isEditing && scenarioId) {
      // When editing, only update the fields that should change
      const updates = {
        name: scenarioName.trim(),
        parameters,
        prediction,
      };
      updateScenario(scenarioId, updates);
      Alert.alert('Success', 'Scenario updated successfully!');
    } else {
      // When creating new scenario
      const scenarioData = {
        name: scenarioName.trim(),
        parameters,
        prediction,
        isFromOnboarding: false,
        isFavorite: false,
      };
      addScenario(scenarioData);
      Alert.alert('Success', 'New scenario created successfully!');
    }

    router.back();
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-6 py-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
              <Text className="text-blue-500 text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Scenario' : 'New Scenario'}
            </Text>
            <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
              <Text className="text-blue-500 text-lg font-medium">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-6">
          {/* Scenario Name */}
          <View className="bg-white rounded-lg p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Scenario Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={scenarioName}
              onChangeText={setScenarioName}
              placeholder={isEditing ? "Enter scenario name" : generateDescriptiveName(parameters)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Adjust Your Plan */}
          <View className="bg-white rounded-lg p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-6">Adjust your plan:</Text>

            {/* Exercise Frequency */}
            <View className="mb-8">
              <Text className="text-gray-700 font-medium mb-4">Exercise frequency</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={7}
                step={1}
                value={parameters.exerciseFrequency}
                onValueChange={(value) => handleParameterChange('exerciseFrequency', value)}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#3b82f6"
                // Web-specific props to prevent DOM errors
                {...(Platform.OS === 'web' && {
                  onStartShouldSetResponder: undefined,
                  onResponderTerminationRequest: undefined,
                  onResponderGrant: undefined,
                  onResponderMove: undefined,
                  onResponderRelease: undefined,
                  onResponderTerminate: undefined,
                })}
              />
              <View className="flex-row justify-between mt-2">
                <Text className="text-blue-500 text-sm">1 times/week</Text>
                <Text className="text-blue-500 text-sm font-medium">
                  {parameters.exerciseFrequency} times/week
                </Text>
                <Text className="text-blue-500 text-sm">7 times/week</Text>
              </View>
            </View>

            {/* Daily Calorie Deficit */}
            <View className="mb-8">
              <Text className="text-gray-700 font-medium mb-4">Daily calorie deficit</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={500}
                step={25}
                value={parameters.calorieDeficit}
                onValueChange={(value) => handleParameterChange('calorieDeficit', value)}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#3b82f6"
                // Web-specific props to prevent DOM errors
                {...(Platform.OS === 'web' && {
                  onStartShouldSetResponder: undefined,
                  onResponderTerminationRequest: undefined,
                  onResponderGrant: undefined,
                  onResponderMove: undefined,
                  onResponderRelease: undefined,
                  onResponderTerminate: undefined,
                })}
              />
              <View className="flex-row justify-between mt-2">
                <Text className="text-blue-500 text-sm">0 calories</Text>
                <Text className="text-blue-500 text-sm font-medium">
                  {parameters.calorieDeficit} calories
                </Text>
                <Text className="text-blue-500 text-sm">500 calories</Text>
              </View>
            </View>

            {/* Protein Intake */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-4">Protein intake</Text>
              <View className="flex-row justify-between">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    className={`flex-1 py-3 mx-1 rounded-lg ${
                      parameters.proteinIntake === level
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    }`}
                    onPress={() => handleParameterChange('proteinIntake', level)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-center font-medium ${
                        parameters.proteinIntake === level
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Prediction Results */}
          <View className="bg-white rounded-lg p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-6">Prediction Results</Text>
            
            {/* Current vs Target */}
            <View className="flex-row justify-between mb-6">
              <View className="flex-1 text-center">
                <Text className="text-sm text-gray-500 mb-1">Current</Text>
                <Text className="text-3xl font-bold text-gray-600">
                  {prediction.currentBodyFat} %
                </Text>
                <Text className="text-sm text-gray-500">body fat</Text>
              </View>
              <View className="flex-1 text-center">
                <Text className="text-sm text-gray-500 mb-1">After {prediction.timeline} weeks</Text>
                <Text className="text-3xl font-bold text-blue-600">
                  {prediction.targetBodyFat} %
                </Text>
                <Text className="text-sm text-gray-500">body fat</Text>
              </View>
            </View>

            {/* Metrics */}
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">📉 Fat loss:</Text>
                <Text className="font-medium">{prediction.fatLoss} lbs</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">💪 Muscle gain:</Text>
                <Text className="font-medium">{prediction.muscleGain} lbs</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">⏱️ Timeline:</Text>
                <Text className="font-medium">{prediction.timeline} weeks</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">🎯 Confidence:</Text>
                <Text className="font-medium">{prediction.confidence}%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
