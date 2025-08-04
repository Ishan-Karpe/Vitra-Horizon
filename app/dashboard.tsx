import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useGoals } from '../contexts/GoalsContext';
import { useUserData } from '../contexts/UserDataContext';

export default function DashboardScreen() {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Your Prediction
          </Text>
          <Text className="text-gray-600">
            Based on your goals and profile
          </Text>
        </View>

        {/* User Summary */}
        <View className="bg-blue-50 p-6 rounded-xl mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">Height: {userData.heightFeet}'{userData.heightInches}"</Text>
            <Text className="text-gray-700">Weight: {Math.round(userData.weight)} lbs</Text>
            <Text className="text-gray-700">Body Fat: {Number(userData.bodyFatPercentage).toFixed(1)}%</Text>
            <Text className="text-gray-700">Activity Level: {userData.activityLevel}</Text>
          </View>
        </View>

        {/* Goals Summary */}
        <View className="bg-green-50 p-6 rounded-xl mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Your Goals</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">Goal: {goalsData.selectedGoal?.replace('-', ' ')}</Text>
            <Text className="text-gray-700">Timeline: {goalsData.timelineWeeks} weeks</Text>
            <Text className="text-gray-700">Target Body Fat: {goalsData.targetBodyFat}%</Text>
          </View>
        </View>

        {/* Mock Prediction Results */}
        <View className="bg-orange-50 p-6 rounded-xl mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Prediction Results</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Expected Weight Loss:</Text>
              <Text className="font-semibold text-gray-900">8-12 lbs</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Muscle Gain Potential:</Text>
              <Text className="font-semibold text-gray-900">2-4 lbs</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Body Fat Reduction:</Text>
              <Text className="font-semibold text-gray-900">3-5%</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Success Probability:</Text>
              <Text className="font-semibold text-green-600">87%</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View className="bg-gray-50 p-6 rounded-xl mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recommendations</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">• Aim for 3-4 strength training sessions per week</Text>
            <Text className="text-gray-700">• Include 2-3 cardio sessions for fat loss</Text>
            <Text className="text-gray-700">• Maintain a moderate caloric deficit of 300-500 calories</Text>
            <Text className="text-gray-700">• Focus on protein intake: 1.2-1.6g per kg body weight</Text>
            <Text className="text-gray-700">• Get 7-9 hours of quality sleep nightly</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity className="bg-blue-600 py-4 px-8 rounded-xl">
            <Text className="text-white text-lg font-semibold text-center">
              View Detailed Plan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-200 py-4 px-8 rounded-xl"
            onPress={handleBack}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              Modify Goals
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
