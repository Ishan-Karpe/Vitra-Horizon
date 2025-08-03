import React from 'react';
import { View, Text } from 'react-native';
import { useDashboardContext } from '../../contexts/DashboardContext';

interface PredictionCardProps {
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ className = '' }) => {
  const { predictionMessage, status } = useDashboardContext();

  const getPredictionConfig = (status: string) => {
    switch (status) {
      case 'on-track':
        return {
          icon: '🎯',
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500',
        };
      case 'behind':
        return {
          icon: '⚠️',
          borderColor: 'border-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-500',
        };
      default:
        return {
          icon: '🚀',
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-500',
        };
    }
  };

  const config = getPredictionConfig(status);

  return (
    <View className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg ${className}`}>
      <View className="flex-row items-center">
        {/* Prediction Icon */}
        <Text className={`${config.iconColor} text-2xl mr-3`}>
          {config.icon}
        </Text>

        {/* Prediction Text */}
        <Text className={`${config.textColor} text-sm flex-1 leading-5`}>
          {predictionMessage}
        </Text>
      </View>
    </View>
  );
};
