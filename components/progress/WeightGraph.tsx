import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useProgress } from "../../contexts/ProgressContext";

export const WeightGraph: React.FC = () => {
  const { getFilteredWeightData, getCurrentWeight, getWeightTrend } =
    useProgress();

  // Responsive dimensions
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  // Calculate responsive chart dimensions
  const getChartWidth = () => {
    const padding = 48; // Total horizontal padding (24px on each side)
    const minWidth = 280; // Minimum chart width for readability
    const maxWidth = 400; // Maximum chart width to prevent oversizing
    const availableWidth = screenData.width - padding;

    return Math.min(maxWidth, Math.max(minWidth, availableWidth));
  };

  const getChartHeight = () => {
    // Responsive height based on screen size
    if (screenData.width < 375) return 180; // Small phones
    if (screenData.width < 414) return 200; // Medium phones
    return 220; // Large phones and tablets
  };

  const weightData = getFilteredWeightData();
  const currentWeight = getCurrentWeight();
  const trend = getWeightTrend();

  // Prepare data for chart
  const chartData = {
    labels: weightData.slice(-7).map((_, index) => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days[index] || "";
    }),
    datasets: [
      {
        data: weightData.slice(-7).map((point) => point.value),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3B82F6",
      fill: "#ffffff",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#E5E7EB",
      strokeWidth: 1,
    },
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "down":
        return "📉";
      case "up":
        return "📈";
      default:
        return "➡️";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "down":
        return "text-green-600"; // Good for weight loss
      case "up":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <View className="bg-white rounded-lg shadow-sm mx-6 mb-4 p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">Weight</Text>
        <View className="flex-row items-center">
          <Text className={`text-sm mr-1 ${getTrendColor()}`}>
            {getTrendIcon()}
          </Text>
          <Text className="text-blue-600 font-bold text-xl">
            {currentWeight} lbs
          </Text>
        </View>
      </View>

      {weightData.length > 0 ? (
        <View className="items-center">
          <LineChart
            data={chartData}
            width={getChartWidth()}
            height={getChartHeight()}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
          />
        </View>
      ) : (
        <View
          className="items-center justify-center"
          style={{ height: getChartHeight() }}
        >
          <Text className="text-gray-500">No weight data available</Text>
        </View>
      )}
    </View>
  );
};
