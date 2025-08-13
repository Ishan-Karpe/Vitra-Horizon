import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGoals } from "./GoalsContext";
import { useUserData } from "./UserDataContext";

export interface ScenarioParameters {
  exerciseFrequency: number; // times per week
  calorieDeficit: number; // calories per day
  proteinIntake: "Low" | "Medium" | "High";
}

export interface ScenarioPrediction {
  currentBodyFat: number;
  targetBodyFat: number;
  fatLoss: number; // lbs
  muscleGain: number; // lbs
  timeline: number; // weeks
  confidence: number; // percentage
}

export interface Scenario {
  id: string;
  name: string;
  createdDate: string;
  parameters: ScenarioParameters;
  prediction: ScenarioPrediction;
  isFromOnboarding: boolean;
  isFavorite: boolean;
}

export type ViewMode = "single" | "compare";

// Storage keys
const STORAGE_KEYS = {
  SCENARIOS: "@scenarios",
  ACTIVE_PLAN_ID: "@activePlanId",
  VIEW_MODE: "@viewMode",
} as const;

interface ScenariosContextType {
  // Scenarios data
  scenarios: Scenario[];
  addScenario: (scenario: Omit<Scenario, "id" | "createdDate">) => Scenario;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string) => void;
  createOnboardingScenario: () => Scenario;
  clearAllScenarios: () => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Comparison
  selectedScenariosForComparison: string[];
  toggleScenarioForComparison: (id: string) => void;
  clearComparison: () => void;

  // Active plan
  activePlanId: string | null;
  setActivePlan: (id: string) => void;

  // Utilities
  getScenarioById: (id: string) => Scenario | undefined;
  calculatePrediction: (parameters: ScenarioParameters) => ScenarioPrediction;
  generateScenarioName: () => string;
  generateDescriptiveName: (parameters: ScenarioParameters) => string;
}

const ScenariosContext = createContext<ScenariosContextType | undefined>(
  undefined,
);

// Storage helper functions
const saveToStorage = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

const loadFromStorage = async (key: string, defaultValue: any = null) => {
  try {
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const useScenarios = () => {
  const context = useContext(ScenariosContext);
  if (!context) {
    throw new Error("useScenarios must be used within a ScenariosProvider");
  }
  return context;
};

export const ScenariosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // Create default onboarding scenario with calculated values
  const createDefaultScenario = useCallback((): Scenario => {
    const defaultParameters: ScenarioParameters = {
      exerciseFrequency: 4,
      calorieDeficit: 300,
      proteinIntake: "High",
    };

    // Calculate prediction based on actual user data
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;

    // Calculate based on parameters
    const exerciseMultiplier = defaultParameters.exerciseFrequency / 4;
    const calorieMultiplier = defaultParameters.calorieDeficit / 300;
    const proteinMultiplier =
      defaultParameters.proteinIntake === "High"
        ? 1.2
        : defaultParameters.proteinIntake === "Medium"
          ? 1.0
          : 0.8;

    const effectivenessScore =
      (exerciseMultiplier + calorieMultiplier + proteinMultiplier) / 3;

    // Calculate predictions
    const bodyFatReduction =
      (currentBodyFat - targetBodyFat) * effectivenessScore;
    const finalBodyFat = Math.max(10, currentBodyFat - bodyFatReduction);

    const fatLoss = bodyFatReduction * 2.5;

    // Calculate muscle gain
    const estimatedWeight = userData.weight || 165;
    const baseMonthlyRate = 0.008;
    const baseWeeklyRate = baseMonthlyRate / 4.33;
    const trainingEffectiveness = Math.min(exerciseMultiplier, 1.5);
    const nutritionEffectiveness = proteinMultiplier;
    const weeklyMuscleGain =
      estimatedWeight *
      baseWeeklyRate *
      trainingEffectiveness *
      nutritionEffectiveness;
    const muscleGain = weeklyMuscleGain * timelineWeeks;

    const confidence = Math.min(95, Math.max(50, 70 + effectivenessScore * 20));

    return {
      id: "onboarding-scenario",
      name: "Scenario #1",
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
      parameters: defaultParameters,
      prediction: {
        currentBodyFat: Math.round(currentBodyFat * 10) / 10,
        targetBodyFat: Math.round(finalBodyFat * 10) / 10,
        fatLoss: Math.round(fatLoss * 100) / 100,
        muscleGain: Math.round(muscleGain * 100) / 100,
        timeline: timelineWeeks,
        confidence: Math.round(confidence * 10) / 10,
      },
      isFromOnboarding: true,
      isFavorite: false,
    };
  }, [
    userData.bodyFatPercentage,
    userData.weight,
    goalsData.targetBodyFat,
    goalsData.timelineWeeks,
  ]);

  // State with default values
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [selectedScenariosForComparison, setSelectedScenariosForComparison] =
    useState<string[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(
    "onboarding-scenario",
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const defaultScenario = createDefaultScenario();

        const [storedScenarios, storedActivePlanId, storedViewMode] =
          await Promise.all([
            loadFromStorage(STORAGE_KEYS.SCENARIOS, [defaultScenario]),
            loadFromStorage(STORAGE_KEYS.ACTIVE_PLAN_ID, "onboarding-scenario"),
            loadFromStorage(STORAGE_KEYS.VIEW_MODE, "single"),
          ]);

        // Always update the default scenario with current user data
        const updatedScenarios = storedScenarios.map((scenario: Scenario) =>
          scenario.id === "onboarding-scenario" ? defaultScenario : scenario,
        );

        setScenarios(updatedScenarios);
        setActivePlanId(storedActivePlanId);
        setViewMode(storedViewMode);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading scenarios data:", error);
        const defaultScenario = createDefaultScenario();
        setScenarios([defaultScenario]);
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, [createDefaultScenario]);

  // Save scenarios to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.SCENARIOS, scenarios);
    }
  }, [scenarios, isLoaded]);

  // Save active plan ID to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.ACTIVE_PLAN_ID, activePlanId);
    }
  }, [activePlanId, isLoaded]);

  // Save view mode to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.VIEW_MODE, viewMode);
    }
  }, [viewMode, isLoaded]);

  const calculatePrediction = useCallback(
    (parameters: ScenarioParameters): ScenarioPrediction => {
      const currentBodyFat = userData.bodyFatPercentage || 25;
      const targetBodyFat = goalsData.targetBodyFat || 21;
      const timelineWeeks = goalsData.timelineWeeks || 12;

      // Calculate based on parameters
      const exerciseMultiplier = parameters.exerciseFrequency / 4; // Base on 4x/week
      const calorieMultiplier = parameters.calorieDeficit / 300; // Base on 300 cal deficit
      const proteinMultiplier =
        parameters.proteinIntake === "High"
          ? 1.2
          : parameters.proteinIntake === "Medium"
            ? 1.0
            : 0.8;

      const effectivenessScore =
        (exerciseMultiplier + calorieMultiplier + proteinMultiplier) / 3;

      // Calculate predictions
      const bodyFatReduction =
        (currentBodyFat - targetBodyFat) * effectivenessScore;
      const finalBodyFat = Math.max(10, currentBodyFat - bodyFatReduction);

      const fatLoss = bodyFatReduction * 2.5; // Rough conversion

      // Fixed muscle gain calculation - realistic rates based on research
      // Assume user weight of 150-180 lbs for calculation (can be improved with actual user weight)
      const estimatedWeight = userData.weight || 165;

      // Base monthly muscle gain rate (percentage of body weight)
      // Beginner: 1-1.5% for men, 0.5-0.75% for women (assuming beginner level)
      // Using conservative estimate of 0.8% per month as baseline
      const baseMonthlyRate = 0.008; // 0.8% of body weight per month

      // Calculate weekly rate
      const baseWeeklyRate = baseMonthlyRate / 4.33; // 4.33 weeks per month average

      // Apply multipliers based on training and nutrition
      const trainingEffectiveness = Math.min(exerciseMultiplier, 1.5); // Cap at 1.5x for very high frequency
      const nutritionEffectiveness = proteinMultiplier;

      // Calculate muscle gain for the timeline
      const weeklyMuscleGain =
        estimatedWeight *
        baseWeeklyRate *
        trainingEffectiveness *
        nutritionEffectiveness;
      const muscleGain = weeklyMuscleGain * timelineWeeks;

      const confidence = Math.min(
        95,
        Math.max(50, 70 + effectivenessScore * 20),
      );

      return {
        currentBodyFat: Math.round(currentBodyFat * 10) / 10,
        targetBodyFat: Math.round(finalBodyFat * 10) / 10,
        fatLoss: Math.round(fatLoss * 100) / 100,
        muscleGain: Math.round(muscleGain * 100) / 100,
        timeline: timelineWeeks,
        confidence: Math.round(confidence * 10) / 10,
      };
    },
    [
      userData.bodyFatPercentage,
      userData.weight,
      goalsData.targetBodyFat,
      goalsData.timelineWeeks,
    ],
  );

  // Update scenarios when user data changes significantly
  useEffect(() => {
    if (isLoaded && scenarios.length > 0) {
      const updatedScenarios = scenarios.map((scenario: Scenario) => {
        if (scenario.id === "onboarding-scenario") {
          // Always update the onboarding scenario with current user data
          return createDefaultScenario();
        } else {
          // Recalculate predictions for other scenarios with new user data
          const updatedPrediction = calculatePrediction(scenario.parameters);
          return {
            ...scenario,
            prediction: updatedPrediction,
          };
        }
      });

      // Only update if there are actual changes
      const hasChanges = updatedScenarios.some(
        (scenario, index) =>
          JSON.stringify(scenario.prediction) !==
          JSON.stringify(scenarios[index].prediction),
      );

      if (hasChanges) {
        setScenarios(updatedScenarios);
      }
    }
  }, [
    userData.bodyFatPercentage,
    userData.weight,
    goalsData.targetBodyFat,
    goalsData.timelineWeeks,
    isLoaded,
    createDefaultScenario,
    calculatePrediction,
    scenarios,
  ]);

  const generateScenarioName = useCallback((): string => {
    const scenarioNumbers = scenarios
      .map((s) => {
        const match = s.name.match(/^Scenario #(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0);

    const nextNumber =
      scenarioNumbers.length > 0 ? Math.max(...scenarioNumbers) + 1 : 1;
    return `Scenario #${nextNumber}`;
  }, [scenarios]);

  const generateDescriptiveName = useCallback(
    (parameters: ScenarioParameters): string => {
      const frequency = parameters.exerciseFrequency;
      const deficit = parameters.calorieDeficit;
      const protein = parameters.proteinIntake;

      return `${frequency}x/week, ${deficit} cal deficit, ${protein} protein`;
    },
    [],
  );

  const addScenario = useCallback(
    (scenarioData: Omit<Scenario, "id" | "createdDate">): Scenario => {
      const newScenario: Scenario = {
        ...scenarioData,
        id: `scenario-${Date.now()}`,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
      };

      setScenarios((prev) => {
        const updated = [...prev, newScenario];
        return updated;
      });

      return newScenario;
    },
    [],
  );

  const updateScenario = useCallback(
    (id: string, updates: Partial<Scenario>) => {
      setScenarios((prev) => {
        const updated = prev.map((scenario) =>
          scenario.id === id ? { ...scenario, ...updates } : scenario,
        );
        return updated;
      });
    },
    [],
  );

  const deleteScenario = useCallback(
    (id: string) => {
      console.log("Deleting scenario with ID:", id);

      setScenarios((prev) => {
        console.log(
          "Previous scenarios:",
          prev.map((s) => ({ id: s.id, name: s.name })),
        );
        const filtered = prev.filter((scenario) => scenario.id !== id);
        console.log(
          "Filtered scenarios:",
          filtered.map((s) => ({ id: s.id, name: s.name })),
        );

        // If this would result in no scenarios, create a default one
        if (filtered.length === 0) {
          console.log("No scenarios left, creating default scenario");
          const defaultScenario = createDefaultScenario();
          // Set the default scenario as active plan
          setActivePlanId(defaultScenario.id);
          return [defaultScenario];
        }

        // If the deleted scenario was the active plan, set the first remaining as active
        if (activePlanId === id && filtered.length > 0) {
          console.log(
            "Deleted scenario was active, setting new active plan:",
            filtered[0].id,
          );
          setActivePlanId(filtered[0].id);
        }

        return filtered;
      });

      // Clear from comparison if selected
      setSelectedScenariosForComparison((prev) =>
        prev.filter((scenarioId) => scenarioId !== id),
      );
      console.log("Scenario deletion completed");
    },
    [activePlanId, createDefaultScenario],
  );

  const duplicateScenario = useCallback(
    (id: string) => {
      const scenario = scenarios.find((s) => s.id === id);
      if (scenario) {
        const duplicatedScenario: Scenario = {
          ...scenario,
          id: `scenario-${Date.now()}`,
          name: `${scenario.name} (Copy)`,
          createdDate: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          }),
          isFromOnboarding: false,
        };

        setScenarios((prev) => [...prev, duplicatedScenario]);
      }
    },
    [scenarios],
  );

  const toggleScenarioForComparison = useCallback((id: string) => {
    setSelectedScenariosForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((scenarioId) => scenarioId !== id);
      } else if (prev.length < 3) {
        // Limit to 3 scenarios for comparison
        return [...prev, id];
      }
      return prev;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedScenariosForComparison([]);
  }, []);

  const setActivePlan = useCallback((id: string) => {
    setActivePlanId(id);
  }, []);

  const getScenarioById = useCallback(
    (id: string) => {
      return scenarios.find((scenario) => scenario.id === id);
    },
    [scenarios],
  );

  // Function to create onboarding scenario and replace all existing scenarios
  const createOnboardingScenario = useCallback(() => {
    const onboardingScenario = createDefaultScenario();
    // Clear all existing scenarios and create only the onboarding scenario as "Scenario #1"
    setScenarios([onboardingScenario]);
    setActivePlanId(onboardingScenario.id);
    // Clear any comparison selections
    setSelectedScenariosForComparison([]);
    return onboardingScenario;
  }, [createDefaultScenario]);

  // Function to clear all scenarios and storage (for debugging/reset)
  const clearAllScenarios = useCallback(async () => {
    try {
      console.log("Starting clearAllScenarios...");
      console.log("Current scenarios count:", scenarios.length);

      // Clear storage
      console.log("Clearing AsyncStorage...");
      await AsyncStorage.removeItem(STORAGE_KEYS.SCENARIOS);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.VIEW_MODE);
      console.log("AsyncStorage cleared");

      // Reset to default scenario
      const defaultScenario = createDefaultScenario();
      console.log("Created default scenario:", defaultScenario.name);

      // Force state reset
      setScenarios([defaultScenario]);
      setActivePlanId(defaultScenario.id);
      setViewMode("single");
      setSelectedScenariosForComparison([]);

      // Force save the new state to storage immediately
      await saveToStorage(STORAGE_KEYS.SCENARIOS, [defaultScenario]);
      await saveToStorage(STORAGE_KEYS.ACTIVE_PLAN_ID, defaultScenario.id);
      await saveToStorage(STORAGE_KEYS.VIEW_MODE, "single");

      console.log("All scenarios cleared and reset to default");
    } catch (error) {
      console.error("Error clearing scenarios:", error);
    }
  }, [createDefaultScenario, scenarios.length]);

  const value: ScenariosContextType = {
    scenarios,
    addScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
    createOnboardingScenario,
    clearAllScenarios,
    viewMode,
    setViewMode,
    selectedScenariosForComparison,
    toggleScenarioForComparison,
    clearComparison,
    activePlanId,
    setActivePlan,
    getScenarioById,
    calculatePrediction,
    generateScenarioName,
    generateDescriptiveName,
  };

  return (
    <ScenariosContext.Provider value={value}>
      {children}
    </ScenariosContext.Provider>
  );
};
