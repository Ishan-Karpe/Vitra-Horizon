import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface BodyFatChartProps {
  currentBodyFat: number;
  targetBodyFat: number;
  timelineWeeks: number;
  className?: string;
}

export const BodyFatChart: React.FC<BodyFatChartProps> = ({
  currentBodyFat,
  targetBodyFat,
  timelineWeeks,
  className = '',
}) => {
  const screenWidth = Dimensions.get('window').width;

  // Generate data points for react-native-chart-kit
  const generateChartData = () => {
    const dataPoints = [];
    const labels = [];
    const totalChange = targetBodyFat - currentBodyFat; // Can be positive (gain) or negative (loss)
    const numberOfPoints = Math.min(timelineWeeks, 8); // Limit to 8 points for readability
    const weeksInterval = timelineWeeks / numberOfPoints;

    for (let i = 0; i <= numberOfPoints; i++) {
      const week = i * weeksInterval;
      const progress = week / timelineWeeks;
      
      // For muscle building (positive change), use slower start, gradual progression
      // For fat loss (negative change), keep original faster-start approach
      let adjustedProgress;
      if (totalChange >= 0) {
        // Gradual upward progression for muscle building
        adjustedProgress = Math.pow(progress, 0.7); // Slower than linear but steady
      } else {
        // Non-linear progress for fat loss (faster at start, slower at end)
        adjustedProgress = 1 - Math.pow(1 - progress, 1.5);
      }
      
      const bodyFat = currentBodyFat + (totalChange * adjustedProgress);

      // Ensure we don't go below reasonable minimums or exceed the target
      let finalBodyFat;
      if (totalChange >= 0) {
        // For upward trend, don't exceed target
        finalBodyFat = Math.min(targetBodyFat, Math.round(bodyFat * 10) / 10);
      } else {
        // For downward trend, don't go below target
        finalBodyFat = Math.max(targetBodyFat, Math.round(bodyFat * 10) / 10);
      }
      
      dataPoints.push(finalBodyFat);

      if (i === 0) {
        labels.push('Start');
      } else if (i === numberOfPoints) {
        labels.push(`${timelineWeeks}w`);
      } else {
        labels.push(`${Math.round(week)}w`);
      }
    }

    return {
      labels,
      datasets: [
        {
          data: dataPoints,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue color
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartData = generateChartData();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2563eb',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e5e7eb',
      strokeWidth: 1,
    },
  };

  return (
    <View className={`bg-gray-50 p-6 rounded-xl ${className}`}>
      <Text className="text-center text-gray-600 text-sm mb-4">Body Fat Percentage over Time</Text>

      {/* Enhanced Chart Container */}
      <View className="bg-white rounded-lg p-4 mb-4">
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={200}
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
          fromZero={false}
        />
      </View>

      {/* Chart Legend */}
      <View className="flex-row justify-center items-center space-x-4">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-blue-600 rounded-full mr-2" />
          <Text className="text-xs text-gray-600">Body Fat %</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1 bg-blue-300 mr-2" />
          <Text className="text-xs text-gray-600">Projection Area</Text>
        </View>
      </View>

      <Text className="text-center text-gray-400 text-xs mt-2">Timeline (weeks)</Text>
    </View>
  );
};
