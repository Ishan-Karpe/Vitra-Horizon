import React from 'react';
import { Text, View } from 'react-native';
import { useProgress } from '../../contexts/ProgressContext';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  progress: number;
  color: string;
  unit: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  target,
  progress,
  color,
  unit,
}) => {
  const progressWidth = Math.min(Math.max(progress, 0), 100);

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-700 font-medium">{label}</Text>
        <Text className="text-sm text-gray-600">
          {unit === 'lbs' ? (Math.round(current * 10) / 10) : current} / {target} {unit}
        </Text>
      </View>
      
      <View className="bg-gray-200 rounded-full h-3 mb-2">
        <View
          className={`${color} rounded-full h-3 transition-all duration-300`}
          style={{ width: `${progressWidth}%` }}
        />
      </View>
      
      <Text className="text-xs text-gray-500 text-right">
        {Math.round(progress)}% complete
      </Text>
    </View>
  );
};

export const GoalProgressSection: React.FC = () => {
  const { goalProgress, getProgressInsights } = useProgress();
  const insights = getProgressInsights();

  return (
    <View className="bg-white rounded-lg shadow-sm mx-6 mb-6 p-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</Text>
      
      <ProgressBar
        label="Body Fat"
        current={goalProgress.bodyFat.current}
        target={goalProgress.bodyFat.target}
        progress={goalProgress.bodyFat.progress}
        color="bg-blue-500"
        unit="%"
      />
      
      <ProgressBar
        label="Fat Loss"
        current={goalProgress.fatLoss.current}
        target={goalProgress.fatLoss.target}
        progress={goalProgress.fatLoss.progress}
        color="bg-green-500"
        unit="lbs"
      />
      
      <ProgressBar
        label="Muscle Gain"
        current={goalProgress.muscleGain.current}
        target={goalProgress.muscleGain.target}
        progress={goalProgress.muscleGain.progress}
        color="bg-orange-500"
        unit="lbs"
      />

      {insights.length > 0 && (
        <View className="mt-4 p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 font-medium mb-2">💡 Insights</Text>
          {insights.map((insight, index) => (
            <Text key={index} className="text-blue-700 text-sm mb-1">
              • {insight}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
