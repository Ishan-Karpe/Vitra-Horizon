import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDashboardContext } from '../../contexts/DashboardContext';
import { useScenarios } from '../../contexts/ScenariosContext';

interface PredictionCardProps {
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ className = '' }) => {
  const { predictionMessage, status } = useDashboardContext();
  const { activePlanId, getScenarioById } = useScenarios();
  const router = useRouter();

  const activeScenario = activePlanId ? getScenarioById(activePlanId) : null;

  const getPredictionConfig = (status: string) => {
    switch (status) {
      case 'on-track':
        return {
          icon: '●',
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500',
        };
      case 'behind':
        return {
          icon: '▲',
          borderColor: 'border-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-500',
        };
      default:
        return {
          icon: '↗',
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-500',
        };
    }
  };

  const config = getPredictionConfig(status);

  const handlePress = () => {
    router.push('/prediction');
  };

  return (
    <TouchableOpacity
      className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg ${className}`}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {/* Prediction Icon */}
          <Text className={`${config.iconColor} text-2xl mr-3`}>
            {config.icon}
          </Text>

          {/* Prediction Text */}
          <View className="flex-1">
            <Text className={`${config.textColor} text-sm leading-5`}>
              {predictionMessage}
            </Text>
            {activeScenario ? (
              <Text className={`${config.textColor} text-xs mt-1 opacity-75`}>
                Active Plan: {activeScenario.name}
              </Text>
            ) : (
              <Text className={`${config.textColor} text-xs mt-1 opacity-75`}>
                Tap to explore alternative scenarios and optimize your plan
              </Text>
            )}
          </View>
        </View>

        {/* Arrow indicator */}
        <Text className={`${config.textColor} text-lg ml-2`}>
          →
        </Text>
      </View>
    </TouchableOpacity>
  );
};
