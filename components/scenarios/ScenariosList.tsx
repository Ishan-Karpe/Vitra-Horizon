import React from 'react';
import { View } from 'react-native';
import { useScenarios } from '../../contexts/ScenariosContext';
import { ScenarioCard } from './ScenarioCard';
import { ComparisonView } from './ComparisonView';

export const ScenariosList: React.FC = () => {
  const { scenarios, viewMode } = useScenarios();

  if (viewMode === 'compare') {
    return <ComparisonView />;
  }

  return (
    <View className="px-6">
      {scenarios.map((scenario) => (
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
    </View>
  );
};
