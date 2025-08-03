import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useScenarios, Scenario } from '../../contexts/ScenariosContext';

interface ScenarioCardProps {
  scenario: Scenario;
}

const screenWidth = Dimensions.get('window').width;

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const { setActivePlan, activePlanId } = useScenarios();
  const router = useRouter();

  const handleEditScenario = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/edit-scenario',
      params: { scenarioId: scenario.id }
    });
  };

  const handleSetAsPlan = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActivePlan(scenario.id);
  };

  // Generate chart data for 12-week progression
  const generateChartData = () => {
    const weeks = 12;
    const startBodyFat = scenario.prediction.currentBodyFat;
    const endBodyFat = scenario.prediction.targetBodyFat;
    const data = [];
    
    for (let i = 0; i <= weeks; i++) {
      const progress = i / weeks;
      const bodyFat = startBodyFat - (startBodyFat - endBodyFat) * progress;
      data.push(bodyFat);
    }
    
    return data;
  };

  const chartData = {
    labels: ['', '', '', '', '', '', ''], // Empty labels for cleaner look
    datasets: [
      {
        data: generateChartData().slice(0, 7), // Show 7 data points
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#F9FAFB',
    backgroundGradientFrom: '#F9FAFB',
    backgroundGradientTo: '#F9FAFB',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: '#3B82F6',
      fill: '#3B82F6',
    },
    fillShadowGradient: '#3B82F6',
    fillShadowGradientOpacity: 0.3,
  };

  return (
    <View className="bg-white rounded-xl shadow-sm mb-4 p-6 border border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">{scenario.name}</Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500 mr-3">Created {scenario.createdDate}</Text>
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-sm font-medium">
              {scenario.prediction.confidence}% confident
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
            {scenario.prediction.currentBodyFat} %
          </Text>
          <Text className="text-sm text-gray-500">body fat</Text>
        </View>
        <View className="flex-1 text-center">
          <Text className="text-sm text-gray-500 mb-1">After {scenario.prediction.timeline} weeks</Text>
          <Text className="text-3xl font-bold text-blue-600">
            {scenario.prediction.targetBodyFat} %
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
            📉 Fat loss: {scenario.prediction.fatLoss} lbs
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            💪 Muscle gain: {scenario.prediction.muscleGain} lbs
          </Text>
        </View>
      </View>
      
      <View className="mb-6">
        <Text className="text-sm text-gray-600">
          ⏱️ Timeline: {scenario.prediction.timeline} weeks
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 border border-blue-500 rounded-lg py-3"
          onPress={handleEditScenario}
          activeOpacity={0.7}
        >
          <Text className="text-blue-500 text-center font-medium">Edit Scenario</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-1 rounded-lg py-3 ${
            activePlanId === scenario.id ? 'bg-gray-400' : 'bg-green-500'
          }`}
          onPress={handleSetAsPlan}
          activeOpacity={0.7}
          disabled={activePlanId === scenario.id}
        >
          <Text className="text-white text-center font-medium">
            {activePlanId === scenario.id ? 'Active Plan' : 'Set as Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
