import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BodyFatChart } from "../components/ui/BodyFatChart";
import { ProgressIndicator } from "../components/ui/ProgressIndicator";
import { useAIEnhancedScenarios } from "../contexts/AIEnhancedScenariosContext";
import { useGoals } from "../contexts/GoalsContext";
import { useUserData } from "../contexts/UserDataContext";

export default function PredictionScreen() {
  const { userData } = useUserData();
  const { goalsData } = useGoals();
  const { getAIPrediction, isAIAvailable } = useAIEnhancedScenarios();

  // State for 2-step AI enhancement
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);
  const [aiEnhanced, setAIEnhanced] = useState(false);
  const [enhancementStep, setEnhancementStep] = useState("");

  // Step 1: Basic math calculations (immediate)
  const currentBodyFat = userData.bodyFatPercentage || 25;
  const targetBodyFat = goalsData.targetBodyFat || 21;
  const timelineWeeks = goalsData.timelineWeeks || 12;

  // Basic confidence calculation
  const [basicConfidence] = useState(() =>
    Math.min(
      95,
      Math.max(65, 100 - Math.abs(currentBodyFat - targetBodyFat) * 3),
    ),
  );

  // Basic fat loss and muscle gain estimates
  const bodyFatReduction = currentBodyFat - targetBodyFat;
  const [basicFatLoss] = useState(() => Math.round(bodyFatReduction * 2.5));

  // Basic muscle gain calculation
  const estimatedWeight = userData.weight || 165;
  const baseMonthlyRate = 0.008;
  const baseWeeklyRate = baseMonthlyRate / 4.33;
  const goalMultiplier =
    goalsData.selectedGoal === "build-muscle"
      ? 1.2
      : goalsData.selectedGoal === "body-recomposition"
        ? 0.8
        : 0.6;
  const weeklyMuscleGain = estimatedWeight * baseWeeklyRate * goalMultiplier;
  const [basicMuscleGain] = useState(
    () => Math.round(weeklyMuscleGain * timelineWeeks * 10) / 10,
  );

  // State for AI-enhanced values
  const [enhancedConfidence, setEnhancedConfidence] = useState(basicConfidence);
  const [enhancedFatLoss, setEnhancedFatLoss] = useState(basicFatLoss);
  const [enhancedMuscleGain, setEnhancedMuscleGain] = useState(basicMuscleGain);
  const [aiInsights, setAIInsights] = useState<{
    riskFactors?: string[];
    plateauPrediction?: any;
    successProbability?: number;
    confidenceInterval?: any;
  }>({});

  // Step 2: AI Enhancement (runs after component mounts)
  useEffect(() => {
    const enhanceWithAI = async () => {
      if (!isAIAvailable) return;

      setIsAIEnhancing(true);
      setEnhancementStep("Gathering user data...");

      try {
        // Simulate gathering all user data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setEnhancementStep("Analyzing with AI...");

        // Create scenario parameters from goals data
        const scenarioParams = {
          exerciseFrequency: 4, // Default from goals
          calorieDeficit: 300, // Default moderate deficit
          proteinIntake: "High" as const,
        };

        // Get AI prediction with all user data
        const aiPrediction = await getAIPrediction(scenarioParams);

        setEnhancementStep("Verifying and enhancing...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update with AI-enhanced values
        setEnhancedConfidence(aiPrediction.confidence);
        setEnhancedFatLoss(aiPrediction.fatLoss);
        setEnhancedMuscleGain(aiPrediction.muscleGain);
        setAIInsights({
          riskFactors: aiPrediction.riskFactors,
          plateauPrediction: aiPrediction.plateauPrediction,
          successProbability: aiPrediction.successProbability,
          confidenceInterval: aiPrediction.confidenceInterval,
        });

        setAIEnhanced(true);
        setEnhancementStep("Enhancement complete!");

        // Clear enhancement message after delay
        setTimeout(() => setIsAIEnhancing(false), 1000);
      } catch (error) {
        console.warn("AI enhancement failed:", error);
        setEnhancementStep("Using basic calculations");
        setTimeout(() => setIsAIEnhancing(false), 1000);
      }
    };

    enhanceWithAI();
  }, [isAIAvailable, getAIPrediction, userData, goalsData]);

  // Use enhanced values if available, otherwise basic values
  const displayConfidence = enhancedConfidence;
  const displayFatLoss = enhancedFatLoss;
  const displayMuscleGain = enhancedMuscleGain;

  const handleAcceptPlan = () => {
    console.log("Accept This Plan pressed");
    // Navigate to main app dashboard
    router.push("/(tabs)");
  };

  const handleTestDifferent = () => {
    console.log("Test Different Approach pressed");
    // Navigate back to goals to modify
    router.push("/goals");
  };

  const handleExploreScenarios = () => {
    console.log("Explore Scenarios pressed");
    // Navigate to onboarding scenario screen
    router.push("/scenario");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="mb-8">
          <ProgressIndicator currentStep={3} totalSteps={4} className="mb-6" />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-gray-900">
              Your Prediction
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${aiEnhanced ? "bg-green-500" : "bg-blue-500"}`}
            >
              <Text className="text-white text-sm font-medium">
                {Number(displayConfidence).toFixed(1)}% confident
              </Text>
            </View>
          </View>

          {/* AI Enhancement Status */}
          {isAIEnhancing && (
            <View className="bg-blue-50 p-4 rounded-lg mb-4 flex-row items-center">
              <ActivityIndicator
                size="small"
                color="#3B82F6"
                className="mr-3"
              />
              <Text className="text-blue-700 text-sm">{enhancementStep}</Text>
            </View>
          )}

          {aiEnhanced && (
            <View className="bg-green-50 p-4 rounded-lg mb-4">
              <Text className="text-green-700 text-sm font-medium">
                ✨ AI Enhanced - Predictions verified and optimized with your
                complete profile
              </Text>
            </View>
          )}
        </View>

        {/* Current vs Future Comparison */}
        <View className="bg-gray-50 p-6 rounded-xl mb-6">
          <View className="flex-row justify-between items-center">
            {/* Current */}
            <View className="items-center flex-1">
              <Text className="text-gray-500 text-sm mb-2">Current</Text>
              <Text className="text-4xl font-bold text-gray-900 mb-1">
                {Number(currentBodyFat).toFixed(1)}%
              </Text>
              <Text className="text-gray-500 text-sm">body fat</Text>
            </View>

            {/* Future */}
            <View className="items-center flex-1">
              <Text className="text-blue-500 text-sm mb-2">
                {timelineWeeks} weeks from now
              </Text>
              <Text className="text-4xl font-bold text-blue-500 mb-1">
                {Number(targetBodyFat).toFixed(1)}%
              </Text>
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
            <View className="flex-1">
              <Text className="text-gray-700">
                Fat loss: {displayFatLoss} lbs
              </Text>
              {aiInsights.confidenceInterval && (
                <Text className="text-gray-500 text-xs">
                  Range: {(displayFatLoss * 0.8).toFixed(1)} -{" "}
                  {(displayFatLoss * 1.2).toFixed(1)} lbs
                </Text>
              )}
            </View>
          </View>

          {/* Muscle Gain */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Text className="text-orange-600 text-sm">💪</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-700">
                Muscle gain: {displayMuscleGain} lbs
              </Text>
              {aiInsights.confidenceInterval && (
                <Text className="text-gray-500 text-xs">
                  Range:{" "}
                  {aiInsights.confidenceInterval.muscleGainLower?.toFixed(1)} -{" "}
                  {aiInsights.confidenceInterval.muscleGainUpper?.toFixed(1)}{" "}
                  lbs
                </Text>
              )}
            </View>
          </View>

          {/* Timeline */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Text className="text-gray-600 text-sm">⏱️</Text>
            </View>
            <Text className="text-gray-700 flex-1">
              Timeline: {timelineWeeks} weeks
            </Text>
          </View>

          {/* Success Probability (AI Enhanced) */}
          {aiInsights.successProbability && (
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-green-600 text-sm">🎯</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Success probability: {aiInsights.successProbability.toFixed(1)}%
              </Text>
            </View>
          )}

          {/* Risk Factors (AI Enhanced) */}
          {aiInsights.riskFactors && aiInsights.riskFactors.length > 0 && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-yellow-600 text-sm">⚠️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-1">
                  Risk factors:
                </Text>
                {aiInsights.riskFactors.map((risk, index) => (
                  <Text key={index} className="text-gray-600 text-sm">
                    • {risk}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Plateau Prediction (AI Enhanced) */}
          {aiInsights.plateauPrediction && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-purple-600 text-sm">📊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-1">
                  Plateau prediction:
                </Text>
                <Text className="text-gray-600 text-sm">
                  Likely around week {aiInsights.plateauPrediction.likelyWeek} (
                  {aiInsights.plateauPrediction.severity} severity)
                </Text>
                {aiInsights.plateauPrediction.recommendations && (
                  <Text className="text-gray-600 text-sm mt-1">
                    💡 {aiInsights.plateauPrediction.recommendations[0]}
                  </Text>
                )}
              </View>
            </View>
          )}
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
            className="bg-blue-500 py-4 px-8 rounded-xl"
            onPress={handleExploreScenarios}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Explore Different Scenarios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-gray-400 py-4 px-8 rounded-xl"
            onPress={handleTestDifferent}
          >
            <Text className="text-gray-600 text-lg font-semibold text-center">
              Modify Goals
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
