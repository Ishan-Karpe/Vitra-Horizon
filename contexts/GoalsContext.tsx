import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface GoalsData {
  selectedGoal: string;
  timelineWeeks: number;
  targetBodyFat: number;
  isGenerating: boolean;
}

export interface GoalsValidation {
  isGoalSelected: boolean;
  isTimelineValid: boolean;
  isTargetBodyFatValid: boolean;
  isFormValid: boolean;
  validationMessages: {
    goal?: string;
    timeline?: string;
    targetBodyFat?: string;
  };
}

interface GoalsContextType {
  goalsData: GoalsData;
  validation: GoalsValidation;
  updateGoal: (goal: string, currentBodyFat?: number) => void;
  updateTimeline: (weeks: number) => void;
  updateTargetBodyFat: (percentage: number, currentBodyFat?: number, goalOverride?: string) => void;
  setGenerating: (generating: boolean) => void;
  validateGoals: (currentBodyFat?: number) => boolean;
  getRecommendedTimeline: (goal: string) => { min: number; max: number; recommended: number };
  getRecommendedBodyFat: (goal: string, currentBodyFat: number) => { min: number; max: number; recommended: number };
  resetGoals: () => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

interface GoalsProviderProps {
  children: ReactNode;
}

// Storage key for goals data
const GOALS_DATA_STORAGE_KEY = '@goalsData';

// Storage helper functions
const saveGoalsDataToStorage = async (data: GoalsData) => {
  try {
    await AsyncStorage.setItem(GOALS_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving goals data to storage:', error);
  }
};

const loadGoalsDataFromStorage = async (): Promise<GoalsData | null> => {
  try {
    const stored = await AsyncStorage.getItem(GOALS_DATA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading goals data from storage:', error);
    return null;
  }
};

export const GoalsProvider: React.FC<GoalsProviderProps> = ({ children }) => {
  const [goalsData, setGoalsData] = useState<GoalsData>({
    selectedGoal: '',
    timelineWeeks: 8,
    targetBodyFat: 15,
    isGenerating: false,
  });

  const [validationMessages, setValidationMessages] = useState<{
    goal?: string;
    timeline?: string;
    targetBodyFat?: string;
  }>({});

  const [isLoaded, setIsLoaded] = useState(false);

  // Load goals data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await loadGoalsDataFromStorage();
        if (storedData) {
          setGoalsData(storedData);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading stored goals data:', error);
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, []);

  // Save goals data to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveGoalsDataToStorage(goalsData);
    }
  }, [goalsData, isLoaded]);

  const getRecommendedTimeline = (goal: string) => {
    switch (goal) {
      case 'lose-fat':
        return { min: 4, max: 12, recommended: 8 };
      case 'build-muscle':
        return { min: 8, max: 16, recommended: 12 };
      case 'body-recomposition':
        return { min: 8, max: 16, recommended: 12 };
      default:
        return { min: 4, max: 12, recommended: 8 };
    }
  };

  const getRecommendedBodyFat = (goal: string, currentBodyFat: number) => {
    switch (goal) {
      case 'lose-fat':
        return {
          min: 5,
          max: Math.min(Math.max(currentBodyFat - 2, 8), 30), // Cap at 30% for lose fat goals
          recommended: Math.max(currentBodyFat - 5, 10),
        };
      case 'build-muscle':
        // For muscle building (bulking), expect some fat gain along with muscle growth
        // This is normal and expected when eating in a caloric surplus for muscle building
        const minMuscle = Math.max(currentBodyFat - 1, 8); // Allow slight reduction for very lean gains, but not below 8%
        const maxMuscle = Math.max(currentBodyFat + 5, 30); // Allow up to 5% increase for aggressive bulking, cap at 30%

        return {
          min: minMuscle,
          max: maxMuscle,
          recommended: Math.min(currentBodyFat + 3, 25), // 3% increase for effective bulking, cap at 25%
        };
      case 'body-recomposition':
        // For body recomposition, allow maintaining current body fat or modest changes
        const minRecomp = Math.max(currentBodyFat - 8, 8); // Allow up to 8% reduction, but not below 8%
        const maxRecomp = Math.max(currentBodyFat + 3, 30); // Allow up to 3% increase, minimum 30%

        return {
          min: minRecomp,
          max: maxRecomp,
          recommended: Math.max(Math.min(currentBodyFat - 2, 25), 10), // 2% reduction, more realistic cap
        };
      default:
        return { min: 5, max: 30, recommended: 15 };
    }
  };

  const validateGoal = (goal: string): string | undefined => {
    if (!goal) return 'Please select a goal';
    return undefined;
  };

  const validateTimeline = (weeks: number, goal: string): string | undefined => {
    const recommendations = getRecommendedTimeline(goal);
    if (weeks < 4) return 'Timeline must be at least 4 weeks';
    if (weeks > 16) return 'Timeline cannot exceed 16 weeks';
    if (weeks < recommendations.min) {
      return `For ${goal.replace('-', ' ')}, we recommend at least ${recommendations.min} weeks`;
    }
    return undefined;
  };

  const validateTargetBodyFat = (percentage: number, goal: string, currentBodyFat: number): string | undefined => {
    if (percentage < 5) return 'Target body fat cannot be below 5%';

    if (!goal) {
      // General validation when no goal is selected
      if (percentage > 30) return 'Target body fat cannot exceed 30%';
      return undefined;
    }

    const recommendations = getRecommendedBodyFat(goal, currentBodyFat);

    // Goal-specific validations
    if (goal === 'lose-fat' && percentage >= currentBodyFat) {
      return `Target should be lower than your current ${currentBodyFat}% for fat loss`;
    }

    if (goal === 'build-muscle' && percentage < currentBodyFat - 1) {
      return `For muscle building (bulking), target should be at or above current body fat (${currentBodyFat}%) to support muscle growth`;
    }

    // Use goal-specific ranges for all goals
    if (percentage < recommendations.min) {
      const goalName = goal === 'body-recomposition' ? 'body recomposition' : goal.replace('-', ' ');
      return `Target too low for ${goalName} goals (min: ${recommendations.min}%)`;
    }

    if (percentage > recommendations.max) {
      const goalName = goal === 'body-recomposition' ? 'body recomposition' : goal.replace('-', ' ');
      return `Target too high for ${goalName} goals (max: ${recommendations.max}%)`;
    }

    return undefined;
  };

  const updateGoal = (goal: string, currentBodyFat: number = 20) => {
    setGoalsData(prev => ({ ...prev, selectedGoal: goal }));

    // Update validation
    const goalError = validateGoal(goal);
    const timelineError = validateTimeline(goalsData.timelineWeeks, goal);
    const bodyFatError = validateTargetBodyFat(goalsData.targetBodyFat, goal, currentBodyFat);

    setValidationMessages({
      goal: goalError,
      timeline: timelineError,
      targetBodyFat: bodyFatError,
    });
  };

  const updateTimeline = (weeks: number) => {
    setGoalsData(prev => ({ ...prev, timelineWeeks: weeks }));
    
    const timelineError = validateTimeline(weeks, goalsData.selectedGoal);
    setValidationMessages(prev => ({ ...prev, timeline: timelineError }));
  };

  const updateTargetBodyFat = (percentage: number, currentBodyFat: number = 20, goalOverride?: string) => {
    // Round to 1 decimal place
    const roundedPercentage = Math.round(percentage * 10) / 10;
    setGoalsData(prev => ({ ...prev, targetBodyFat: roundedPercentage }));

    // Use goalOverride if provided, otherwise use current selected goal
    const goalToValidate = goalOverride || goalsData.selectedGoal;
    const bodyFatError = validateTargetBodyFat(roundedPercentage, goalToValidate, currentBodyFat);
    setValidationMessages(prev => ({ ...prev, targetBodyFat: bodyFatError }));
  };

  const setGenerating = (generating: boolean) => {
    setGoalsData(prev => ({ ...prev, isGenerating: generating }));
  };

  const validateGoals = (currentBodyFat: number = 20): boolean => {
    const goalError = validateGoal(goalsData.selectedGoal);
    const timelineError = validateTimeline(goalsData.timelineWeeks, goalsData.selectedGoal);
    const bodyFatError = validateTargetBodyFat(goalsData.targetBodyFat, goalsData.selectedGoal, currentBodyFat);

    setValidationMessages({
      goal: goalError,
      timeline: timelineError,
      targetBodyFat: bodyFatError,
    });

    return !goalError && !timelineError && !bodyFatError;
  };

  const resetGoals = async () => {
    const defaultData: GoalsData = {
      selectedGoal: '',
      timelineWeeks: 8,
      targetBodyFat: 15,
      isGenerating: false,
    };

    setGoalsData(defaultData);
    setValidationMessages({});

    try {
      await AsyncStorage.removeItem(GOALS_DATA_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing goals data from storage:', error);
    }
  };

  const validation: GoalsValidation = {
    isGoalSelected: !!goalsData.selectedGoal,
    isTimelineValid: !validationMessages.timeline,
    isTargetBodyFatValid: !validationMessages.targetBodyFat,
    isFormValid: !!goalsData.selectedGoal && !validationMessages.timeline && !validationMessages.targetBodyFat,
    validationMessages,
  };

  const value: GoalsContextType = {
    goalsData,
    validation,
    updateGoal,
    updateTimeline,
    updateTargetBodyFat,
    setGenerating,
    validateGoals,
    getRecommendedTimeline,
    getRecommendedBodyFat,
    resetGoals,
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};
