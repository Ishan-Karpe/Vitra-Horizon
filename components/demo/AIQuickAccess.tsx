// Quick access button for AI Demo
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAIEnhancedScenarios } from '../../contexts/AIEnhancedScenariosContext';

export const AIQuickAccess: React.FC = () => {
  const router = useRouter();
  const { isConnectedToBackend, isAIAvailable } = useAIEnhancedScenarios();

  const handlePress = () => {
    router.push('/ai-demo');
  };

  const getStatusColor = () => {
    if (isConnectedToBackend) return '#10B981'; // Green
    if (isAIAvailable) return '#F59E0B'; // Yellow  
    return '#EF4444'; // Red
  };

  const getStatusText = () => {
    if (isConnectedToBackend) return 'AI Connected';
    if (isAIAvailable) return 'AI Cached';
    return 'AI Offline';
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg p-4 mx-6 mb-4 shadow-sm border border-gray-200"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            🤖 AI Backend Demo
          </Text>
          <Text className="text-sm text-gray-600">
            Test AI predictions and chat features
          </Text>
        </View>
        
        <View className="items-end">
          <View className="flex-row items-center mb-1">
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: getStatusColor() }}
            />
            <Text className="text-xs font-medium text-gray-700">
              {getStatusText()}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">
            Port 8087 → 8088
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
