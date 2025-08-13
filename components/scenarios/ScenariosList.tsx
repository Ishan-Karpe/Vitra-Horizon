import React from "react";
import { View } from "react-native";
import { useAIEnhancedScenarios } from "../../contexts/AIEnhancedScenariosContext";
import { ComparisonView } from "./ComparisonView";
import { ScenarioCard } from "./ScenarioCard";

export const ScenariosList: React.FC = () => {
  const { scenarios, viewMode } = useAIEnhancedScenarios();

  if (viewMode === "compare") {
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
