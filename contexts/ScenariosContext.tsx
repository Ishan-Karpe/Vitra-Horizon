import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUserData } from './UserDataContext';
import { useGoals } from './GoalsContext';

interface ScenarioParameters {
  exerciseFrequency: number; // 1-7 times per week
  calorieDeficit: number; // 0-300 calories
  proteinIntake: 'Low' | 'Medium' | 'High';
}

interface PredictionResult {
  bodyFatPercentage: number;
  fatLoss: number; // in lbs
  muscleGain: number; // in lbs
  timeline: number; // in weeks
  confidenceScore: number; // percentage
}

interface ScenariosContextType {
  // Current scenario parameters
  currentParameters: ScenarioParameters;
  setCurrentParameters: (params: Partial<ScenarioParameters>) => void;
  
  // Predictions
  currentPlanPrediction: PredictionResult;
  newPlanPrediction: PredictionResult;
  
  // UI state
  isCalculating: boolean;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  
  // Actions
  resetParameters: () => void;
  saveScenario: () => void;
  generateRandomScenario: () => void;
}

const ScenariosContext = createContext<ScenariosContextType | undefined>(undefined);

export const useScenariosContext = () => {
  const context = useContext(ScenariosContext);
  if (!context) {
    throw new Error('useScenariosContext must be used within a ScenariosProvider');
  }
  return context;
};

export const ScenariosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // Default parameters based on user's current plan
  const getDefaultParameters = useCallback((): ScenarioParameters => ({
    exerciseFrequency: 3, // Default to 3 times per week
    calorieDeficit: 150, // Default to moderate deficit
    proteinIntake: 'Medium',
  }), []);

  const [currentParameters, setCurrentParametersState] = useState<ScenarioParameters>(getDefaultParameters());
  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  // Mock prediction calculation function
  const calculatePrediction = useCallback((params: ScenarioParameters): PredictionResult => {
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;
    
    // Mock calculation based on parameters
    const exerciseMultiplier = params.exerciseFrequency / 7; // 0.14 to 1.0
    const calorieMultiplier = params.calorieDeficit / 300; // 0 to 1.0
    const proteinMultiplier = params.proteinIntake === 'High' ? 1.2 : params.proteinIntake === 'Medium' ? 1.0 : 0.8;
    
    // Calculate body fat reduction
    const baseReduction = currentBodyFat - targetBodyFat;
    const adjustedReduction = baseReduction * exerciseMultiplier * calorieMultiplier * proteinMultiplier;
    const newBodyFat = Math.max(10, currentBodyFat - adjustedReduction);
    
    // Calculate fat loss and muscle gain
    const fatLoss = Math.round(adjustedReduction * 2.5 + params.calorieDeficit / 50);
    const muscleGain = Math.round(params.exerciseFrequency * 0.5 * proteinMultiplier);
    
    // Calculate confidence score
    const confidenceScore = Math.min(95, Math.max(65, 
      85 - Math.abs(adjustedReduction - baseReduction) * 10
    ));

    return {
      bodyFatPercentage: Math.round(newBodyFat * 10) / 10,
      fatLoss: Math.max(0, fatLoss),
      muscleGain: Math.max(0, muscleGain),
      timeline: timelineWeeks,
      confidenceScore: Math.round(confidenceScore),
    };
  }, [userData.bodyFatPercentage, goalsData.targetBodyFat, goalsData.timelineWeeks]);

  // Current plan prediction (based on goals)
  const currentPlanPrediction: PredictionResult = {
    bodyFatPercentage: goalsData.targetBodyFat || 21,
    fatLoss: 5,
    muscleGain: 2,
    timeline: goalsData.timelineWeeks || 12,
    confidenceScore: 78,
  };

  // New plan prediction (based on current parameters)
  const newPlanPrediction = calculatePrediction(currentParameters);

  const setCurrentParameters = useCallback((params: Partial<ScenarioParameters>) => {
    setIsCalculating(true);
    setCurrentParametersState(prev => ({ ...prev, ...params }));
    
    // Simulate calculation delay
    setTimeout(() => {
      setIsCalculating(false);
    }, 200);
  }, []);

  const resetParameters = useCallback(() => {
    setCurrentParametersState(getDefaultParameters());
  }, [getDefaultParameters]);

  const saveScenario = useCallback(() => {
    console.log('Saving scenario:', currentParameters, newPlanPrediction);
    // TODO: Implement actual saving logic
  }, [currentParameters, newPlanPrediction]);

  const generateRandomScenario = useCallback(() => {
    const randomParams: ScenarioParameters = {
      exerciseFrequency: Math.floor(Math.random() * 7) + 1,
      calorieDeficit: Math.floor(Math.random() * 301),
      proteinIntake: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
    };
    setCurrentParameters(randomParams);
  }, [setCurrentParameters]);

  const value: ScenariosContextType = {
    currentParameters,
    setCurrentParameters,
    currentPlanPrediction,
    newPlanPrediction,
    isCalculating,
    showComparison,
    setShowComparison,
    resetParameters,
    saveScenario,
    generateRandomScenario,
  };

  return (
    <ScenariosContext.Provider value={value}>
      {children}
    </ScenariosContext.Provider>
  );
};
