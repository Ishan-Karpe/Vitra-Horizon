import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { FloatingActionButton } from '@/components/scenarios/FloatingActionButton';
import { ScenariosHeader } from '@/components/scenarios/ScenariosHeader';
import { ScenariosList } from '@/components/scenarios/ScenariosList';
import { ViewModeToggle } from '@/components/scenarios/ViewModeToggle';

export default function ScenariosTabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ScenariosHeader />
        <ViewModeToggle />
        <ScenariosList />

        {/* Bottom spacing for tab bar */}
        <View className="h-20" />
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
}
