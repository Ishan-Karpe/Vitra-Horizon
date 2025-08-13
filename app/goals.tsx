import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GoalCard } from "../components/ui/GoalCard";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { ProgressIndicator } from "../components/ui/ProgressIndicator";
import { RangeSlider } from "../components/ui/RangeSlider";
import { useGoals } from "../contexts/GoalsContext";
import { useUserData } from "../contexts/UserDataContext";

export default function GoalsScreen() {
  const { userData, updateUserData } = useUserData();
  const {
    goalsData,
    validation,
    updateGoal,
    updateTimeline,
    updateTargetBodyFat,
    setGenerating,
    validateGoals,
    getRecommendedTimeline,
    getRecommendedBodyFat,
  } = useGoals();

  const [loadingProgress, setLoadingProgress] = React.useState(0);

  const handleGoalSelect = (goal: string) => {
    const currentBodyFat = userData.bodyFatPercentage || 20;
    updateGoal(goal, currentBodyFat);

    // Update default values based on goal and current body fat
    const recommendations = getRecommendedBodyFat(goal, currentBodyFat);
    const timelineRec = getRecommendedTimeline(goal);

    // Ensure target body fat is within the valid range for the selected goal
    const newTargetBodyFat = Math.max(
      Math.min(recommendations.recommended, recommendations.max),
      recommendations.min,
    );
    // Pass the goal explicitly to avoid stale state issues
    updateTargetBodyFat(newTargetBodyFat, currentBodyFat, goal);
    updateTimeline(timelineRec.recommended);
  };

  const handleTimelineChange = (weeks: number) => {
    updateTimeline(weeks);
  };

  const handleTargetBodyFatChange = (percentage: number) => {
    const currentBodyFat = userData.bodyFatPercentage || 20;
    updateTargetBodyFat(percentage, currentBodyFat);
  };

  // Calculate dynamic maximum value for body fat slider based on selected goal
  const getBodyFatSliderMaximum = () => {
    if (!goalsData.selectedGoal) return 30; // Default maximum

    const currentBodyFat = userData.bodyFatPercentage || 20;
    const recommendations = getRecommendedBodyFat(
      goalsData.selectedGoal,
      currentBodyFat,
    );
    return recommendations.max;
  };

  // Calculate dynamic minimum value for body fat slider based on selected goal
  const getBodyFatSliderMinimum = () => {
    if (!goalsData.selectedGoal) return 5; // Default minimum

    const currentBodyFat = userData.bodyFatPercentage || 20;
    const recommendations = getRecommendedBodyFat(
      goalsData.selectedGoal,
      currentBodyFat,
    );
    return recommendations.min;
  };

  const handleGeneratePrediction = async () => {
    const currentBodyFat = userData.bodyFatPercentage || 20;
    const isValid = validateGoals(currentBodyFat);

    if (!isValid) return;

    setGenerating(true);
    setLoadingProgress(0);

    // Save goals data to user context
    updateUserData({
      goal: goalsData.selectedGoal,
      timelineWeeks: goalsData.timelineWeeks,
      targetBodyFat: goalsData.targetBodyFat,
    });

    // Simulate API call with progress
    const progressSteps = [
      { progress: 20, message: "Analyzing your profile...", delay: 500 },
      { progress: 40, message: "Calculating body composition...", delay: 800 },
      { progress: 60, message: "Generating workout plan...", delay: 700 },
      {
        progress: 80,
        message: "Creating nutrition recommendations...",
        delay: 600,
      },
      { progress: 100, message: "Finalizing your prediction...", delay: 400 },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setLoadingProgress(step.progress);
    }

    // Final delay before navigation
    setTimeout(() => {
      setGenerating(false);
      setLoadingProgress(0);
      // Navigate to prediction screen
      router.push("/prediction");
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header Section */}
        <View className="mb-8">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={2} totalSteps={4} className="mb-6" />

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            What&apos;s your goal?
          </Text>
        </View>

        {/* Goal Selection Cards */}
        <View className="mb-8">
          <View className="flex-row justify-between gap-2 mb-4">
            <GoalCard
              id="lose-fat"
              title="Lose Fat"
              icon="🔥"
              color="orange"
              isSelected={goalsData.selectedGoal === "lose-fat"}
              onPress={handleGoalSelect}
            />

            <GoalCard
              id="build-muscle"
              title="Build Muscle"
              icon="💪"
              color="green"
              isSelected={goalsData.selectedGoal === "build-muscle"}
              onPress={handleGoalSelect}
            />

            <GoalCard
              id="body-recomposition"
              title="Body Recomposition"
              icon="⚖️"
              color="blue"
              isSelected={goalsData.selectedGoal === "body-recomposition"}
              onPress={handleGoalSelect}
            />
          </View>
        </View>

        {/* Timeline Slider Section */}
        {goalsData.selectedGoal && (
          <RangeSlider
            label="Achieve this in:"
            value={goalsData.timelineWeeks}
            minimumValue={4}
            maximumValue={16}
            step={1}
            unit=" weeks"
            onValueChange={handleTimelineChange}
            validationMessage={validation.validationMessages.timeline}
          />
        )}

        {/* Target Body Fat Slider Section */}
        {goalsData.selectedGoal && (
          <RangeSlider
            label="Target body fat:"
            value={goalsData.targetBodyFat}
            minimumValue={getBodyFatSliderMinimum()}
            maximumValue={getBodyFatSliderMaximum()}
            step={1}
            unit="%"
            onValueChange={handleTargetBodyFatChange}
            validationMessage={validation.validationMessages.targetBodyFat}
          />
        )}

        {/* Generate Prediction Button */}
        <TouchableOpacity
          className={`py-4 px-8 rounded-xl ${
            validation.isFormValid && !goalsData.isGenerating
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
          onPress={handleGeneratePrediction}
          disabled={!validation.isFormValid || goalsData.isGenerating}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {goalsData.isGenerating
              ? "Generating Prediction..."
              : "Generate Prediction"}
          </Text>
        </TouchableOpacity>

        {/* Validation Messages */}
        {validation.validationMessages.goal && (
          <Text className="text-red-500 text-sm text-center mt-4">
            {validation.validationMessages.goal}
          </Text>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={goalsData.isGenerating}
        message="Generating Your Prediction"
        progress={loadingProgress}
      />
    </SafeAreaView>
  );
}
