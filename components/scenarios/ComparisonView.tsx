import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAIEnhancedScenarios } from "../../contexts/AIEnhancedScenariosContext";

export const ComparisonView: React.FC = () => {
  const {
    scenarios,
    selectedScenariosForComparison,
    toggleScenarioForComparison,
    clearComparison,
  } = useAIEnhancedScenarios();

  const handleScenarioToggle = async (scenarioId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleScenarioForComparison(scenarioId);
  };

  const handleClearComparison = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearComparison();
  };

  const selectedScenarios = scenarios.filter((s) =>
    selectedScenariosForComparison.includes(s.id),
  );

  return (
    <View className="px-6">
      {/* Selection Instructions */}
      <View className="bg-blue-50 rounded-lg p-4 mb-6">
        <Text className="text-blue-800 font-medium mb-2">
          Select scenarios to compare (up to 3)
        </Text>
        <Text className="text-blue-600 text-sm">
          {selectedScenariosForComparison.length}/3 scenarios selected
        </Text>
        {selectedScenariosForComparison.length > 0 && (
          <TouchableOpacity
            className="mt-2"
            onPress={handleClearComparison}
            activeOpacity={0.7}
          >
            <Text className="text-blue-600 text-sm font-medium">
              Clear Selection
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scenario Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Available Scenarios
        </Text>
        {scenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            className={`bg-white rounded-lg p-4 mb-3 border-2 ${
              selectedScenariosForComparison.includes(scenario.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
            onPress={() => handleScenarioToggle(scenario.id)}
            activeOpacity={0.7}
            disabled={
              !selectedScenariosForComparison.includes(scenario.id) &&
              selectedScenariosForComparison.length >= 3
            }
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-medium">{scenario.name}</Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-500 mr-2">
                  {scenario.prediction.targetBodyFat}% target
                </Text>
                {selectedScenariosForComparison.includes(scenario.id) && (
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comparison Results */}
      {selectedScenarios.length >= 2 && (
        <View className="bg-white rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Comparison Results
          </Text>

          {/* Recommendation */}
          {selectedScenarios.length > 0 && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <Text className="text-green-800 font-semibold mb-2">
                🏆 Recommended Scenario
              </Text>
              {(() => {
                // Find the best scenario based on multiple factors
                const bestScenario = selectedScenarios.reduce(
                  (best, current) => {
                    const bestScore =
                      best.prediction.confidence * 0.4 +
                      (100 - best.prediction.timeline) * 0.3 +
                      best.prediction.fatLoss * 0.3;
                    const currentScore =
                      current.prediction.confidence * 0.4 +
                      (100 - current.prediction.timeline) * 0.3 +
                      current.prediction.fatLoss * 0.3;
                    return currentScore > bestScore ? current : best;
                  },
                );

                const getReason = (scenario: typeof bestScenario) => {
                  if (scenario.prediction.confidence >= 85)
                    return "Highest confidence score with proven results";
                  if (scenario.prediction.timeline <= 8)
                    return "Fastest timeline to reach your goals";
                  if (scenario.prediction.fatLoss >= 10)
                    return "Maximum fat loss potential";
                  return "Best balance of timeline, confidence, and results";
                };

                return (
                  <View>
                    <Text className="text-green-700 font-medium">
                      {bestScenario.name}
                    </Text>
                    <Text className="text-green-600 text-sm mt-1">
                      {getReason(bestScenario)}
                    </Text>
                  </View>
                );
              })()}
            </View>
          )}

          {/* Enhanced Comparison Table */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row bg-gray-50 rounded-lg p-4">
              {selectedScenarios.map((scenario, index) => {
                // Check if this is the recommended scenario
                const bestScenario = selectedScenarios.reduce(
                  (best, current) => {
                    const bestScore =
                      best.prediction.confidence * 0.4 +
                      (100 - best.prediction.timeline) * 0.3 +
                      best.prediction.fatLoss * 0.3;
                    const currentScore =
                      current.prediction.confidence * 0.4 +
                      (100 - current.prediction.timeline) * 0.3 +
                      current.prediction.fatLoss * 0.3;
                    return currentScore > bestScore ? current : best;
                  },
                );
                const isRecommended = scenario.id === bestScenario.id;

                return (
                  <View
                    key={scenario.id}
                    className={`mr-6 min-w-[220px] p-4 rounded-lg ${
                      isRecommended
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text
                        className={`font-semibold ${isRecommended ? "text-green-800" : "text-gray-900"}`}
                      >
                        {scenario.name}
                      </Text>
                      {isRecommended && (
                        <View className="bg-green-500 rounded-full px-2 py-1">
                          <Text className="text-white text-xs font-bold">
                            BEST
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="space-y-3">
                      {/* Key Results Section */}
                      <View className="border-b border-gray-200 pb-2">
                        <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Results
                        </Text>
                        <View className="space-y-1">
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Body Fat Goal:
                            </Text>
                            <Text className="text-sm font-semibold text-blue-600">
                              {Number(
                                scenario.prediction.targetBodyFat,
                              ).toFixed(1)}
                              %
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Fat Loss:
                            </Text>
                            <Text className="text-sm font-semibold text-red-600">
                              {Number(scenario.prediction.fatLoss).toFixed(1)}{" "}
                              lbs
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Muscle Gain:
                            </Text>
                            <Text className="text-sm font-semibold text-green-600">
                              {Number(scenario.prediction.muscleGain).toFixed(
                                1,
                              )}{" "}
                              lbs
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Timeline & Confidence Section */}
                      <View className="border-b border-gray-200 pb-2">
                        <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Timeline
                        </Text>
                        <View className="space-y-1">
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Duration:
                            </Text>
                            <Text className="text-sm font-semibold text-purple-600">
                              {scenario.prediction.timeline} weeks
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Confidence:
                            </Text>
                            <Text
                              className={`text-sm font-semibold ${
                                scenario.prediction.confidence >= 80
                                  ? "text-green-600"
                                  : scenario.prediction.confidence >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {Number(scenario.prediction.confidence).toFixed(
                                1,
                              )}
                              %
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Parameters Section */}
                      <View>
                        <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Plan Details
                        </Text>
                        <View className="space-y-1">
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Exercise:
                            </Text>
                            <Text className="text-sm font-medium">
                              {scenario.parameters.exerciseFrequency}x/week
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Calorie Deficit:
                            </Text>
                            <Text className="text-sm font-medium">
                              {scenario.parameters.calorieDeficit} cal
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">
                              Protein:
                            </Text>
                            <Text className="text-sm font-medium">
                              {scenario.parameters.proteinIntake}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
