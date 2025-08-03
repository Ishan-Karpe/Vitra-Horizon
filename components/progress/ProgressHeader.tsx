import React from 'react';
import { View, Text } from 'react-native';

export const ProgressHeader: React.FC = () => {
  return (
    <View className="bg-white border-b border-gray-200 mb-6">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Progress</Text>
      </View>
    </View>
  );
};
