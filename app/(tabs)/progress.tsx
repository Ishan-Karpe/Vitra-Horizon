import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { BodyFatGraph } from '../../components/progress/BodyFatGraph';
import { GoalProgressSection } from '../../components/progress/GoalProgressSection';
import { MeasurementsSection } from '../../components/progress/MeasurementsSection';
import { ProgressHeader } from '../../components/progress/ProgressHeader';
import { TimePeriodSelector } from '../../components/progress/TimePeriodSelector';
import { WeightGraph } from '../../components/progress/WeightGraph';
import { ProgressProvider } from '../../contexts/ProgressContext';

const ProgressContent: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ProgressHeader />
        <TimePeriodSelector />
        <WeightGraph />
        <BodyFatGraph />
        <MeasurementsSection />
        <GoalProgressSection />

        {/* Bottom spacing for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ProgressScreen() {
  return (
    <ProgressProvider>
      <ProgressContent />
    </ProgressProvider>
  );
}
