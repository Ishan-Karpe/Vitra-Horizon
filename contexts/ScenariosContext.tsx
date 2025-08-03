import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useGoals } from './GoalsContext';
import { useUserData } from './UserDataContext';

export interface ScenarioParameters {
  exerciseFrequency: number; // times per week
  calorieDeficit: number; // calories per day
  proteinIntake: 'Low' | 'Medium' | 'High';
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

export type ViewMode = 'single' | 'compare';

// Storage keys
const STORAGE_KEYS = {
  SCENARIOS: '@scenarios',
  ACTIVE_PLAN_ID: '@activePlanId',
  VIEW_MODE: '@viewMode',
} as const;

interface ScenariosContextType {
  // Scenarios data
  scenarios: Scenario[];
  addScenario: (scenario: Omit<Scenario, 'id' | 'createdDate'>) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string) => void;

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

const ScenariosContext = createContext<ScenariosContextType | undefined>(undefined);

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
    throw new Error('useScenarios must be used within a ScenariosProvider');
  }
  return context;
};

export const ScenariosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // Default onboarding scenario
  const defaultScenario: Scenario = {
    id: 'onboarding-scenario',
    name: 'Scenario #1',
    createdDate: 'July 25',
    parameters: {
      exerciseFrequency: 4,
      calorieDeficit: 300,
      proteinIntake: 'High',
    },
    prediction: {
      currentBodyFat: 25,
      targetBodyFat: 21,
      fatLoss: 8,
      muscleGain: 2,
      timeline: 12,
      confidence: 78,
    },
    isFromOnboarding: true,
    isFavorite: false,
  };

  // State with default values
  const [scenarios, setScenarios] = useState<Scenario[]>([defaultScenario]);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [selectedScenariosForComparison, setSelectedScenariosForComparison] = useState<string[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>('onboarding-scenario');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [storedScenarios, storedActivePlanId, storedViewMode] = await Promise.all([
          loadFromStorage(STORAGE_KEYS.SCENARIOS, [defaultScenario]),
          loadFromStorage(STORAGE_KEYS.ACTIVE_PLAN_ID, 'onboarding-scenario'),
          loadFromStorage(STORAGE_KEYS.VIEW_MODE, 'single'),
        ]);

        setScenarios(storedScenarios);
        setActivePlanId(storedActivePlanId);
        setViewMode(storedViewMode);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading scenarios data:', error);
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, []);

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

  const calculatePrediction = useCallback((parameters: ScenarioParameters): ScenarioPrediction => {
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;

    // Calculate based on parameters
    const exerciseMultiplier = parameters.exerciseFrequency / 4; // Base on 4x/week
    const calorieMultiplier = parameters.calorieDeficit / 300; // Base on 300 cal deficit
    const proteinMultiplier = parameters.proteinIntake === 'High' ? 1.2 :
                             parameters.proteinIntake === 'Medium' ? 1.0 : 0.8;

    const effectivenessScore = (exerciseMultiplier + calorieMultiplier + proteinMultiplier) / 3;

    // Calculate predictions
    const bodyFatReduction = (currentBodyFat - targetBodyFat) * effectivenessScore;
    const finalBodyFat = Math.max(10, currentBodyFat - bodyFatReduction);

    const fatLoss = bodyFatReduction * 2.5; // Rough conversion
    const muscleGain = parameters.exerciseFrequency * 0.5 * proteinMultiplier;

    const confidence = Math.min(95, Math.max(50, 70 + (effectivenessScore * 20)));

    return {
      currentBodyFat,
      targetBodyFat: Math.round(finalBodyFat * 10) / 10,
      fatLoss: Math.round(fatLoss * 10) / 10,
      muscleGain: Math.round(muscleGain * 10) / 10,
      timeline: timelineWeeks,
      confidence: Math.round(confidence),
    };
  }, [userData.bodyFatPercentage, goalsData.targetBodyFat, goalsData.timelineWeeks]);

  const generateScenarioName = useCallback((): string => {
    const scenarioNumbers = scenarios
      .map(s => {
        const match = s.name.match(/^Scenario #(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    const nextNumber = scenarioNumbers.length > 0 ? Math.max(...scenarioNumbers) + 1 : 1;
    return `Scenario #${nextNumber}`;
  }, [scenarios]);

  const generateDescriptiveName = useCallback((parameters: ScenarioParameters): string => {
    const frequency = parameters.exerciseFrequency;
    const deficit = parameters.calorieDeficit;
    const protein = parameters.proteinIntake;

    return `${frequency}x/week, ${deficit} cal deficit, ${protein} protein`;
  }, []);

  const addScenario = useCallback((scenarioData: Omit<Scenario, 'id' | 'createdDate'>) => {
    const newScenario: Scenario = {
      ...scenarioData,
      id: `scenario-${Date.now()}`,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    };

    setScenarios(prev => {
      const updated = [...prev, newScenario];
      return updated;
    });
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<Scenario>) => {
    setScenarios(prev => {
      const updated = prev.map(scenario =>
        scenario.id === id ? { ...scenario, ...updates } : scenario
      );
      return updated;
    });
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));

    // Clear from comparison if selected
    setSelectedScenariosForComparison(prev => prev.filter(scenarioId => scenarioId !== id));

    // Clear active plan if deleted
    if (activePlanId === id) {
      setActivePlanId(null);
    }
  }, [activePlanId]);

  const duplicateScenario = useCallback((id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      const duplicatedScenario: Scenario = {
        ...scenario,
        id: `scenario-${Date.now()}`,
        name: `${scenario.name} (Copy)`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        isFromOnboarding: false,
      };

      setScenarios(prev => [...prev, duplicatedScenario]);
    }
  }, [scenarios]);

  const toggleScenarioForComparison = useCallback((id: string) => {
    setSelectedScenariosForComparison(prev => {
      if (prev.includes(id)) {
        return prev.filter(scenarioId => scenarioId !== id);
      } else if (prev.length < 3) { // Limit to 3 scenarios for comparison
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

  const getScenarioById = useCallback((id: string) => {
    return scenarios.find(scenario => scenario.id === id);
  }, [scenarios]);

  const value: ScenariosContextType = {
    scenarios,
    addScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
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
