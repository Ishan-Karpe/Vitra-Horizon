import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAIEnhancedScenarios } from "../../contexts/AIEnhancedScenariosContext";

interface Scenario {
  id: string;
  name: string;
  parameters: {
    exerciseFrequency: number;
    calorieDeficit: number;
    proteinIntake: "Low" | "Medium" | "High";
  };
  prediction: {
    currentBodyFat: number;
    targetBodyFat: number;
    fatLoss: number;
    muscleGain: number;
    timeline: number;
    confidence: number;
  };
  createdDate: string;
  isFromOnboarding: boolean;
  isFavorite: boolean;
}

interface ScenarioCardProps {
  scenario: Scenario;
}

const screenWidth = Dimensions.get("window").width;

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const { setActivePlan, activePlanId, deleteScenario, scenarios } =
    useAIEnhancedScenarios();
  const router = useRouter();

  const handleEditScenario = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/edit-scenario",
      params: { scenarioId: scenario.id },
    });
  };

  const handleSetAsPlan = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActivePlan(scenario.id);
  };

  const handleDeleteScenario = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (activePlanId === scenario.id) {
      Alert.alert(
        "Cannot Delete Active Scenario",
        "You cannot delete the scenario that is currently set as your active plan.",
        [{ text: "OK", style: "cancel" }],
      );
      return;
    }

    // Direct deletion without confirmation
    deleteScenario(scenario.id);
  };

  // Generate chart data for 12-week progression
  const generateChartData = () => {
    const weeks = 12;
    const startBodyFat = scenario.prediction?.currentBodyFat || 25;
    const endBodyFat = scenario.prediction?.targetBodyFat || 21;
    const data = [];

    for (let i = 0; i <= weeks; i++) {
      const progress = i / weeks;
      const bodyFat = startBodyFat - (startBodyFat - endBodyFat) * progress;
      data.push(bodyFat);
    }

    return data;
  };

  const chartData = {
    labels: ["", "", "", "", "", "", ""], // Empty labels for cleaner look
    datasets: [
      {
        data: generateChartData().slice(0, 7), // Show 7 data points
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#F9FAFB",
    backgroundGradientFrom: "#F9FAFB",
    backgroundGradientTo: "#F9FAFB",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#3B82F6",
      fill: "#3B82F6",
    },
    fillShadowGradient: "#3B82F6",
    fillShadowGradientOpacity: 0.3,
  };

  return (
    <View className="bg-white rounded-xl shadow-sm mb-4 p-6 border border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          {scenario.name}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500 mr-3">
            Created {scenario.createdDate}
          </Text>
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-sm font-medium">
              {Number(scenario.prediction?.confidence || 75).toFixed(1)}%
              confident
            </Text>
          </View>
        </View>
      </View>

      {/* Parameters */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-700 text-sm">
            ⚡ {scenario.parameters.exerciseFrequency} x/week
          </Text>
        </View>
        <View className="bg-red-100 px-3 py-1 rounded-full">
          <Text className="text-red-700 text-sm">
            🔥 {scenario.parameters.calorieDeficit} cals/day
          </Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 text-sm">
            🥩 {scenario.parameters.proteinIntake} protein
          </Text>
        </View>
      </View>

      {/* Current vs Target */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 text-center">
          <Text className="text-sm text-gray-500 mb-1">Current</Text>
          <Text className="text-3xl font-bold text-gray-600">
            {Number(scenario.prediction?.currentBodyFat || 25).toFixed(1)}%
          </Text>
          <Text className="text-sm text-gray-500">body fat</Text>
        </View>
        <View className="flex-1 text-center">
          <Text className="text-sm text-gray-500 mb-1">
            After {scenario.prediction?.timeline || 12} weeks
          </Text>
          <Text className="text-3xl font-bold text-blue-600">
            {Number(scenario.prediction?.targetBodyFat || 21).toFixed(1)}%
          </Text>
          <Text className="text-sm text-gray-500">body fat</Text>
        </View>
      </View>

      {/* Progress Graph */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 h-32">
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={96}
          chartConfig={chartConfig}
          bezier
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withShadow={false}
          style={{
            marginVertical: 0,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Metrics */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            📉 Fat loss: {Number(scenario.prediction?.fatLoss || 10).toFixed(2)}{" "}
            lbs
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            💪 Muscle gain:{" "}
            {Number(scenario.prediction?.muscleGain || 3.2).toFixed(2)} lbs
          </Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-sm text-gray-600">
          ⏱️ Timeline: {scenario.prediction?.timeline || 12} weeks
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 border border-blue-500 rounded-lg py-3"
          onPress={handleEditScenario}
          activeOpacity={0.7}
        >
          <Text className="text-blue-500 text-center font-medium">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 rounded-lg py-3 ${
            activePlanId === scenario.id ? "bg-gray-400" : "bg-green-500"
          }`}
          onPress={handleSetAsPlan}
          activeOpacity={0.7}
          disabled={activePlanId === scenario.id}
        >
          <Text className="text-white text-center font-medium">
            {activePlanId === scenario.id ? "Active" : "Set as Plan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-red-500 rounded-lg py-3 px-4"
          onPress={handleDeleteScenario}
          activeOpacity={0.7}
        >
          <Text className="text-red-500 text-center font-medium">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
