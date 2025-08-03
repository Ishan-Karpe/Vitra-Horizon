import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function ProgressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Progress Tracking</Text>
        <Text className="text-gray-600 text-center">
          Coming Soon - Track your fitness journey with detailed analytics and progress charts.
        </Text>
      </View>
    </SafeAreaView>
  );
}
