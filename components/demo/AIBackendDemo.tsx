// Demo component showing AI Backend integration
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAIEnhancedScenarios } from '../../contexts/AIEnhancedScenariosContext';

export const AIBackendDemo: React.FC = () => {
  const {
    isConnectedToBackend,
    isAIAvailable,
    aiMode,
    setAIMode,
    getAIPrediction,
    sendChatMessage,
    chatMessages,
    clearChatHistory,
    lastSyncTime
  } = useAIEnhancedScenarios();

  const [testMessage, setTestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<any>(null);

  // Test AI prediction
  const testPrediction = async () => {
    setIsLoading(true);
    try {
      const testParameters = {
        exerciseFrequency: 4,
        calorieDeficit: 300,
        proteinIntake: 'High' as const
      };

      const prediction = await getAIPrediction(testParameters);
      setLastPrediction(prediction);
      
      Alert.alert(
        'AI Prediction Success!',
        `Body Fat: ${prediction.currentBodyFat}% → ${prediction.targetBodyFat}%\n` +
        `Muscle Gain: ${prediction.muscleGain} lbs\n` +
        `Confidence: ${prediction.confidence}%\n` +
        `${prediction.cached ? '(Cached)' : '(Fresh from AI)'}`
      );
    } catch (error) {
      Alert.alert('Prediction Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test chat message
  const testChat = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    try {
      await sendChatMessage(testMessage);
      setTestMessage('');
    } catch (error) {
      Alert.alert('Chat Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Connection status indicator
  const getStatusColor = () => {
    if (isConnectedToBackend) return '#10B981'; // Green
    if (isAIAvailable) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getStatusText = () => {
    if (isConnectedToBackend) return 'Connected to AI Backend';
    if (isAIAvailable) return 'AI Available (Cached)';
    return 'Offline Mode';
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          AI Backend Demo
        </Text>
        <Text className="text-gray-600">
          Testing connection to localhost:8087
        </Text>
      </View>

      {/* Connection Status */}
      <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Connection Status
        </Text>
        
        <View className="flex-row items-center mb-3">
          <View 
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: getStatusColor() }}
          />
          <Text className="text-gray-700 font-medium">
            {getStatusText()}
          </Text>
        </View>

        <Text className="text-sm text-gray-500 mb-3">
          AI Mode: {aiMode}
        </Text>

        {lastSyncTime && (
          <Text className="text-sm text-gray-500 mb-4">
            Last Sync: {lastSyncTime.toLocaleTimeString()}
          </Text>
        )}

        {/* AI Mode Selector */}
        <View className="flex-row space-x-2">
          {(['offline', 'ai-enhanced', 'ai-only'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setAIMode(mode)}
              className={`px-3 py-2 rounded-lg ${
                aiMode === mode 
                  ? 'bg-blue-500' 
                  : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                aiMode === mode ? 'text-white' : 'text-gray-700'
              }`}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Test AI Prediction */}
      <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Test AI Prediction
        </Text>
        
        <TouchableOpacity
          onPress={testPrediction}
          disabled={isLoading}
          className={`py-3 px-6 rounded-lg ${
            isLoading ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-center font-medium">
            {isLoading ? 'Testing...' : 'Test Prediction API'}
          </Text>
        </TouchableOpacity>

        {lastPrediction && (
          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Last Prediction Result:
            </Text>
            <Text className="text-sm text-gray-700">
              Body Fat: {lastPrediction.currentBodyFat}% → {lastPrediction.targetBodyFat}%
            </Text>
            <Text className="text-sm text-gray-700">
              Muscle Gain: {lastPrediction.muscleGain} lbs
            </Text>
            <Text className="text-sm text-gray-700">
              Confidence: {lastPrediction.confidence}%
            </Text>
            {lastPrediction.successProbability && (
              <Text className="text-sm text-gray-700">
                Success Probability: {lastPrediction.successProbability}%
              </Text>
            )}
            {lastPrediction.cached && (
              <Text className="text-sm text-blue-600 font-medium">
                ✓ Cached Result
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Test Chat */}
      <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Test AI Chat
        </Text>
        
        <View className="flex-row space-x-2 mb-4">
          <TextInput
            value={testMessage}
            onChangeText={setTestMessage}
            placeholder="Ask the AI something..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            multiline
          />
          <TouchableOpacity
            onPress={testChat}
            disabled={isLoading || !testMessage.trim()}
            className={`px-4 py-2 rounded-lg ${
              isLoading || !testMessage.trim() ? 'bg-gray-300' : 'bg-green-500'
            }`}
          >
            <Text className="text-white font-medium">Send</Text>
          </TouchableOpacity>
        </View>

        {/* Quick test buttons */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {[
            'What if I can only workout 3x per week?',
            'I\'m not seeing results, what should I change?',
            'How can I avoid plateaus?'
          ].map((message) => (
            <TouchableOpacity
              key={message}
              onPress={() => setTestMessage(message)}
              className="bg-gray-100 px-3 py-2 rounded-lg"
            >
              <Text className="text-sm text-gray-700">{message}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-medium text-gray-900">Chat History</Text>
              <TouchableOpacity
                onPress={clearChatHistory}
                className="bg-red-100 px-3 py-1 rounded"
              >
                <Text className="text-red-600 text-sm">Clear</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-40">
              {chatMessages.slice(-4).map((message) => (
                <View
                  key={message.id}
                  className={`mb-2 p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-100 self-end' 
                      : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-sm ${
                    message.role === 'user' ? 'text-blue-800' : 'text-gray-800'
                  }`}>
                    {message.content}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Backend Info */}
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Backend Information
        </Text>
        
        <Text className="text-sm text-gray-700 mb-2">
          <Text className="font-medium">Backend URL:</Text> http://localhost:8087
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          <Text className="font-medium">Frontend Port:</Text> 8088 (Expo)
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          <Text className="font-medium">AI Features:</Text> Predictions, Chat, Scenario Generation
        </Text>
        <Text className="text-sm text-gray-700">
          <Text className="font-medium">Fallback:</Text> Simple math when AI unavailable
        </Text>
      </View>
    </ScrollView>
  );
};
