import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAIEnhancedScenarios } from '../../contexts/AIEnhancedScenariosContext';

export const ScenariosHeader: React.FC = () => {
  const { clearAllScenarios, scenarios } = useAIEnhancedScenarios();

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Scenarios',
      `This will delete all ${scenarios.length} scenarios and reset to a single default scenario. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllScenarios();
            Alert.alert('Success', 'All scenarios have been cleared and reset.');
          }
        }
      ]
    );
  };

  return (
    <View className="bg-white border-b border-gray-200 mb-6">
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Scenarios</Text>
            <Text className="text-gray-600 text-sm mt-1">
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} available
            </Text>
          </View>

          {/* Temporary Debug Button - Remove after testing */}
          {scenarios.length > 1 && (
            <TouchableOpacity
              className="bg-red-100 border border-red-300 rounded-lg px-3 py-2"
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Text className="text-red-600 text-xs font-medium">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
