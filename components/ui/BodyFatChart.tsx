import React from 'react';
import { View, Text } from 'react-native';

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
  // Generate data points for the chart
  const generateDataPoints = () => {
    const points = [];
    const totalReduction = currentBodyFat - targetBodyFat;
    const weeksInterval = Math.max(1, Math.floor(timelineWeeks / 4));
    
    for (let week = 0; week <= timelineWeeks; week += weeksInterval) {
      const progress = week / timelineWeeks;
      // Non-linear progress (faster at start, slower at end)
      const adjustedProgress = 1 - Math.pow(1 - progress, 1.5);
      const bodyFat = currentBodyFat - (totalReduction * adjustedProgress);
      points.push({
        week,
        bodyFat: Math.max(targetBodyFat, bodyFat),
        x: (week / timelineWeeks) * 100,
        y: ((currentBodyFat - bodyFat) / (currentBodyFat - targetBodyFat)) * 100,
      });
    }
    
    // Ensure we have the final point
    if (points[points.length - 1].week !== timelineWeeks) {
      points.push({
        week: timelineWeeks,
        bodyFat: targetBodyFat,
        x: 100,
        y: 100,
      });
    }
    
    return points;
  };

  const dataPoints = generateDataPoints();
  const chartHeight = 120;
  const maxBodyFat = Math.max(currentBodyFat, 30);
  const minBodyFat = Math.min(targetBodyFat, 10);

  return (
    <View className={`bg-gray-50 p-6 rounded-xl ${className}`}>
      <Text className="text-center text-gray-600 text-sm mb-4">Body Fat Percentage over Time</Text>
      
      {/* Chart Container */}
      <View className="bg-white rounded-lg p-4 mb-4" style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <View className="absolute left-0 top-4 bottom-4 justify-between">
          <Text className="text-xs text-gray-400">{maxBodyFat}%</Text>
          <Text className="text-xs text-gray-400">{Math.round((maxBodyFat + minBodyFat) / 2)}%</Text>
          <Text className="text-xs text-gray-400">{minBodyFat}%</Text>
        </View>
        
        {/* Chart area */}
        <View className="ml-8 mr-4 relative" style={{ height: chartHeight }}>
          {/* Grid lines */}
          <View className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((percent) => (
              <View
                key={percent}
                className="absolute w-full h-px bg-gray-100"
                style={{ top: `${percent}%` }}
              />
            ))}
          </View>
          
          {/* Gradient fill area */}
          <View className="absolute inset-0">
            <View 
              className="absolute bottom-0 left-0 right-0 bg-blue-100 opacity-30"
              style={{ 
                height: `${100 - ((targetBodyFat - minBodyFat) / (maxBodyFat - minBodyFat)) * 100}%`
              }}
            />
          </View>
          
          {/* Data line and points */}
          <View className="absolute inset-0">
            {dataPoints.map((point, index) => {
              const yPosition = ((maxBodyFat - point.bodyFat) / (maxBodyFat - minBodyFat)) * 100;
              
              return (
                <View key={index}>
                  {/* Data point */}
                  <View
                    className="absolute w-2 h-2 bg-blue-600 rounded-full"
                    style={{
                      left: `${point.x}%`,
                      top: `${yPosition}%`,
                      transform: [{ translateX: -4 }, { translateY: -4 }],
                    }}
                  />
                  
                  {/* Line to next point */}
                  {index < dataPoints.length - 1 && (
                    <View
                      className="absolute h-px bg-blue-600"
                      style={{
                        left: `${point.x}%`,
                        top: `${yPosition}%`,
                        width: `${dataPoints[index + 1].x - point.x}%`,
                        transform: [
                          { 
                            rotate: `${Math.atan2(
                              ((maxBodyFat - dataPoints[index + 1].bodyFat) / (maxBodyFat - minBodyFat)) * 100 - yPosition,
                              dataPoints[index + 1].x - point.x
                            ) * 180 / Math.PI}deg`
                          }
                        ],
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
        
        {/* X-axis labels */}
        <View className="flex-row justify-between mt-2 px-8">
          <Text className="text-xs text-gray-400">0</Text>
          <Text className="text-xs text-gray-400">{Math.round(timelineWeeks / 4)}</Text>
          <Text className="text-xs text-gray-400">{Math.round(timelineWeeks / 2)}</Text>
          <Text className="text-xs text-gray-400">{Math.round(3 * timelineWeeks / 4)}</Text>
          <Text className="text-xs text-gray-400">{timelineWeeks}</Text>
        </View>
      </View>
      
      <Text className="text-center text-gray-400 text-xs">Weeks</Text>
    </View>
  );
};
