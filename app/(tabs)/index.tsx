import React from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { DailyActions } from '@/components/dashboard/DailyActions';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { ProgressCircle } from '@/components/dashboard/ProgressCircle';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DashboardProvider, useDashboardContext } from '@/contexts/DashboardContext';

const DashboardContent: React.FC = () => {
  const { currentWeek, totalWeeks, completionPercentage, todayDate, weeklyProgress } = useDashboardContext();

  const handleProgressCirclePress = () => {
    const currentWeekData = weeklyProgress.find(w => w.week === currentWeek);
    Alert.alert(
      `Week ${currentWeek} Progress`,
      `Completed: ${currentWeekData?.completedActions || 0}/${currentWeekData?.totalActions || 21} actions\nCompletion Rate: ${currentWeekData?.completionRate || 0}%`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="flex-row justify-between items-center px-6 py-4 mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Today&apos;s Plan</Text>
            <Text className="text-gray-500 text-sm mt-1">{todayDate}</Text>
          </View>
        </View>

        {/* Progress and Status Section */}
        <View className="flex-row items-center px-6 mb-6">
          <ProgressCircle
            currentWeek={currentWeek}
            totalWeeks={totalWeeks}
            className="mr-6"
            onPress={handleProgressCirclePress}
          />
          <StatusCard 
            completionPercentage={completionPercentage}
            className="flex-1"
          />
        </View>

        {/* Daily Actions Section */}
        <DailyActions className="mb-6" />

        {/* Prediction Card */}
        <PredictionCard className="mx-6 mb-6" />

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default function DashboardScreen() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
