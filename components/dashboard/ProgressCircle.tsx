import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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
  const animatedValue = useRef(new Animated.Value(0)).current;
  const size = 80;
  const strokeWidth = 8; // Thicker stroke for better visibility
  const radius = (size - strokeWidth) / 2;

  // Animation for current week pulsing effect
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [animatedValue]);

  // Calculate segment angle for each week
  const segmentAngle = 360 / totalWeeks;
  const gapAngle = 3; // Tiny noticeable margin between segments

  // Generate path for each week segment
  const createSegmentPath = (weekIndex: number) => {
    const startAngle = (weekIndex * segmentAngle - 90) * (Math.PI / 180); // Start from top
    const endAngle = ((weekIndex + 1) * segmentAngle - gapAngle - 90) * (Math.PI / 180);

    const x1 = size / 2 + radius * Math.cos(startAngle);
    const y1 = size / 2 + radius * Math.sin(startAngle);
    const x2 = size / 2 + radius * Math.cos(endAngle);
    const y2 = size / 2 + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle - gapAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };



  const CircleContent = () => (
    <View className={`items-center justify-center ${className}`}>
      <View className="relative items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Progress Circle with Blue Weekly Segments */}
        <Svg width={size} height={size} className="absolute">
          {Array.from({ length: totalWeeks }, (_, index) => {
            const weekNumber = index + 1;
            const isCompleted = weekNumber < currentWeek;
            const isCurrent = weekNumber === currentWeek;
            const isFuture = weekNumber > currentWeek;

            return (
              <Path
                key={weekNumber}
                d={createSegmentPath(index)}
                stroke={
                  isFuture
                    ? "#E5E7EB" // Gray for future weeks
                    : "#3B82F6" // Blue for completed and current weeks
                }
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                opacity={isCurrent ? 0.7 : 1} // Slightly transparent for current week (will be animated)
              />
            );
          })}
        </Svg>

        {/* Animated Current Week Overlay */}
        {currentWeek <= totalWeeks && (
          <Animated.View
            className="absolute"
            style={{
              opacity: animatedValue,
            }}
          >
            <Svg width={size} height={size}>
              <Path
                d={createSegmentPath(currentWeek - 1)}
                stroke="#3B82F6"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>
        )}

        {/* Center Content */}
        <View className="absolute items-center justify-center">
          <Text className="text-blue-600 font-bold text-sm">Week</Text>
          <Text className="text-blue-600 font-bold text-lg">{currentWeek}</Text>
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
