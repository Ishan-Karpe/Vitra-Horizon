import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useGoals } from '../../contexts/GoalsContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useUserData } from '../../contexts/UserDataContext';

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
          {unit === 'lbs' ? (Math.round(current * 10) / 10) : Number(current).toFixed(1)} / {Number(target).toFixed(1)} {unit}
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
  const { goalProgress, getProgressInsights, getCurrentBodyFat, getCurrentWeight, measurements } = useProgress();
  const { userData } = useUserData();
  const { goalsData } = useGoals();
  const insights = getProgressInsights();

  // Recalculate goal progress based on current measurements
  const updatedGoalProgress = useMemo(() => {
    const currentBodyFat = getCurrentBodyFat();
    const currentWeight = getCurrentWeight();
    const initialBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const initialWeight = userData.weight || 150;

    // Calculate body fat progress
    const bodyFatProgress = Math.min(100, Math.max(0,
      ((initialBodyFat - currentBodyFat) / (initialBodyFat - targetBodyFat)) * 100
    ));

    // Calculate fat loss progress (estimated)
    const weightLoss = Math.max(0, initialWeight - currentWeight);
    const estimatedFatLoss = weightLoss * 0.7; // Assume 70% of weight loss is fat
    const targetFatLoss = (initialBodyFat - targetBodyFat) * 2.5; // Rough estimate
    const fatLossProgress = Math.min(100, (estimatedFatLoss / targetFatLoss) * 100);

    // Calculate muscle gain progress (estimated from measurements)
    const chestGain = measurements.chestChange || 0;
    const armsGain = measurements.armsChange || 0;
    const muscleIndicator = (chestGain + armsGain) / 2;
    const targetMuscleGain = 2; // lbs
    const muscleProgress = Math.min(100, Math.max(0, (muscleIndicator / targetMuscleGain) * 100));

    return {
      bodyFat: {
        current: currentBodyFat,
        target: targetBodyFat,
        progress: Math.round(bodyFatProgress)
      },
      fatLoss: {
        current: Math.round(estimatedFatLoss * 10) / 10,
        target: Math.round(targetFatLoss * 10) / 10,
        progress: Math.round(fatLossProgress)
      },
      muscleGain: {
        current: Math.round(muscleIndicator * 10) / 10,
        target: targetMuscleGain,
        progress: Math.round(muscleProgress)
      }
    };
  }, [getCurrentBodyFat, getCurrentWeight, userData, goalsData, measurements]);

  return (
    <View className="bg-white rounded-lg shadow-sm mx-6 mb-6 p-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</Text>
      
      <ProgressBar
        label="Body Fat"
        current={updatedGoalProgress.bodyFat.current}
        target={updatedGoalProgress.bodyFat.target}
        progress={updatedGoalProgress.bodyFat.progress}
        color="bg-blue-500"
        unit="%"
      />

      <ProgressBar
        label="Fat Loss"
        current={updatedGoalProgress.fatLoss.current}
        target={updatedGoalProgress.fatLoss.target}
        progress={updatedGoalProgress.fatLoss.progress}
        color="bg-green-500"
        unit="lbs"
      />

      <ProgressBar
        label="Muscle Gain"
        current={updatedGoalProgress.muscleGain.current}
        target={updatedGoalProgress.muscleGain.target}
        progress={updatedGoalProgress.muscleGain.progress}
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
