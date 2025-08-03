import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressCircleProps {
  currentWeek: number;
  totalWeeks: number;
  className?: string;
  onPress?: () => void;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  currentWeek,
  totalWeeks,
  className = '',
  onPress,
}) => {
  const progress = (currentWeek / totalWeeks) * 100;
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const CircleContent = () => (
    <View className={`items-center justify-center ${className}`}>
      <View className="relative items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Progress Circle */}
        <Svg width={size} height={size} className="absolute">
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Center Content */}
        <View className="absolute items-center justify-center">
          <Text className="text-blue-600 font-bold text-lg">Week {currentWeek}</Text>
        </View>
      </View>
      
      {/* Bottom Text */}
      <Text className="text-gray-500 text-sm mt-2">of {totalWeeks}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CircleContent />
      </TouchableOpacity>
    );
  }

  return <CircleContent />;
};
