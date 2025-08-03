import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function ScenariosTabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Scenario Management</Text>
        <Text className="text-gray-600 text-center">
          Coming Soon - Manage and compare your saved fitness scenarios and plans.
        </Text>
      </View>
    </SafeAreaView>
  );
}
