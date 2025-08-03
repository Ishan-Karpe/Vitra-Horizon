import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useProgress } from '../../contexts/ProgressContext';

const screenWidth = Dimensions.get('window').width;

export const BodyFatGraph: React.FC = () => {
  const { getFilteredBodyFatData, getCurrentBodyFat, getBodyFatTrend } = useProgress();
  
  const bodyFatData = getFilteredBodyFatData();
  const currentBodyFat = getCurrentBodyFat();
  const trend = getBodyFatTrend();
  
  // Prepare data for chart
  const chartData = {
    labels: bodyFatData.slice(-7).map((_, index) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days[index] || '';
    }),
    datasets: [
      {
        data: bodyFatData.slice(-7).map(point => point.value),
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#22C55E',
      fill: '#ffffff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'down':
        return '📉';
      case 'up':
        return '📈';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'down':
        return 'text-green-600'; // Good for body fat reduction
      case 'up':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <View className="bg-white rounded-lg shadow-sm mx-6 mb-4 p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">Body Fat %</Text>
        <View className="flex-row items-center">
          <Text className={`text-sm mr-1 ${getTrendColor()}`}>
            {getTrendIcon()}
          </Text>
          <Text className="text-green-600 font-bold text-xl">
            {currentBodyFat}%
          </Text>
        </View>
      </View>

      {bodyFatData.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 80} // Account for padding
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
        />
      ) : (
        <View className="h-48 items-center justify-center">
          <Text className="text-gray-500">No body fat data available</Text>
        </View>
      )}
    </View>
  );
};
