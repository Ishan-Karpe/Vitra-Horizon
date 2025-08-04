import React from 'react';
import { Text, View } from 'react-native';

interface StatusCardProps {
  completionPercentage: number;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  completionPercentage,
  className = '',
}) => {
  const getStatusConfig = (percentage: number) => {
    if (percentage >= 80) {
      return {
        status: 'On track',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: '✓',
        emoji: '🎯',
        message: 'Great job! Keep it up!',
      };
    } else if (percentage >= 60) {
      return {
        status: 'Behind',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        icon: '⚠️',
        emoji: '⚡',
        message: 'You can catch up!',
      };
    } else {
      return {
        status: 'Needs attention',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: '!',
        emoji: '🔥',
        message: 'Time to focus!',
      };
    }
  };

  const statusConfig = getStatusConfig(completionPercentage);

  return (
    <View className={`${className}`}>
      {/* Status Badge */}
      <View className={`${statusConfig.bgColor} px-4 py-2 rounded-full flex-row items-center self-start mb-3`}>
        <Text className={`${statusConfig.textColor} text-sm font-semibold mr-2`}>
          {statusConfig.icon}
        </Text>
        <Text className={`${statusConfig.textColor} text-sm font-semibold`}>
          {statusConfig.status}
        </Text>
      </View>

      {/* Progress Message */}
      <Text className="text-gray-600 text-sm leading-5 mb-2">
        You&apos;re meeting {completionPercentage}% of your targets
      </Text>

      {/* Motivational Message */}
      <View className="flex-row items-center">
        <Text className="text-lg mr-2">{statusConfig.emoji}</Text>
        <Text className="text-gray-500 text-xs italic">
          {statusConfig.message}
        </Text>
      </View>
    </View>
  );
};
