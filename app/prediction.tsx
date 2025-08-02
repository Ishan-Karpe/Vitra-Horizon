import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { BodyFatChart } from '../components/ui/BodyFatChart';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { useGoals } from '../contexts/GoalsContext';
import { useUserData } from '../contexts/UserDataContext';

export default function PredictionScreen() {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // Calculate prediction values based on user data and goals
  const currentBodyFat = userData.bodyFatPercentage || 25;
  const targetBodyFat = goalsData.targetBodyFat || 21;
  const timelineWeeks = goalsData.timelineWeeks || 12;
  const confidenceScore = Math.min(95, Math.max(65, 100 - Math.abs(currentBodyFat - targetBodyFat) * 3));

  // Calculate fat loss and muscle gain estimates
  const bodyFatReduction = currentBodyFat - targetBodyFat;
  const estimatedFatLoss = Math.round(bodyFatReduction * 2.5); // Rough estimate
  const estimatedMuscleGain = goalsData.selectedGoal === 'build-muscle' ? 3 : 2;

  const handleAcceptPlan = () => {
    console.log('Accept This Plan pressed');
    // Navigate to dashboard or next screen
    router.push('/dashboard');
  };

  const handleTestDifferent = () => {
    console.log('Test Different Approach pressed');
    // Navigate back to goals to modify
    router.push('/goals');
  };

  const handleBack = () => {
    router.back();
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
          
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-gray-900">
              Your Prediction
            </Text>
            <View className="bg-blue-500 px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-medium">{confidenceScore}% confident</Text>
            </View>
          </View>
        </View>

        {/* Current vs Future Comparison */}
        <View className="bg-gray-50 p-6 rounded-xl mb-6">
          <View className="flex-row justify-between items-center">
            {/* Current */}
            <View className="items-center flex-1">
              <Text className="text-gray-500 text-sm mb-2">Current</Text>
              <Text className="text-4xl font-bold text-gray-900 mb-1">{currentBodyFat}%</Text>
              <Text className="text-gray-500 text-sm">body fat</Text>
            </View>

            {/* Future */}
            <View className="items-center flex-1">
              <Text className="text-blue-500 text-sm mb-2">{timelineWeeks} weeks from now</Text>
              <Text className="text-4xl font-bold text-blue-500 mb-1">{targetBodyFat}%</Text>
              <Text className="text-blue-500 text-sm">body fat</Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <BodyFatChart
          currentBodyFat={currentBodyFat}
          targetBodyFat={targetBodyFat}
          timelineWeeks={timelineWeeks}
          className="mb-6"
        />

        {/* Prediction Details */}
        <View className="space-y-4 mb-8">
          {/* Fat Loss */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-blue-600 text-sm">📉</Text>
            </View>
            <Text className="text-gray-700 flex-1">Fat loss: {estimatedFatLoss} lbs</Text>
          </View>

          {/* Muscle Gain */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Text className="text-orange-600 text-sm">💪</Text>
            </View>
            <Text className="text-gray-700 flex-1">Muscle gain: {estimatedMuscleGain} lbs</Text>
          </View>

          {/* Timeline */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Text className="text-gray-600 text-sm">⏱️</Text>
            </View>
            <Text className="text-gray-700 flex-1">Timeline: {timelineWeeks} weeks</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity 
            className="bg-green-500 py-4 px-8 rounded-xl"
            onPress={handleAcceptPlan}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Accept This Plan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-transparent border-2 border-blue-500 py-4 px-8 rounded-xl"
            onPress={handleTestDifferent}
          >
            <Text className="text-blue-500 text-lg font-semibold text-center">
              Test Different Approach
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
