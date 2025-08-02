import React, { createContext, ReactNode, useContext, useState } from 'react';

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
  updateTargetBodyFat: (percentage: number, currentBodyFat?: number) => void;
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
          max: Math.max(currentBodyFat - 2, 8),
          recommended: Math.max(currentBodyFat - 5, 10),
        };
      case 'build-muscle':
        return {
          min: Math.max(currentBodyFat - 2, 8),
          max: Math.min(currentBodyFat + 5, 25),
          recommended: Math.min(currentBodyFat + 2, 18),
        };
      case 'body-recomposition':
        return {
          min: Math.max(currentBodyFat - 5, 8),
          max: Math.min(currentBodyFat + 2, 20),
          recommended: currentBodyFat,
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
    if (percentage > 30) return 'Target body fat cannot exceed 30%';

    if (!goal) return undefined; // No validation if no goal selected

    const recommendations = getRecommendedBodyFat(goal, currentBodyFat);

    if (goal === 'lose-fat' && percentage >= currentBodyFat) {
      return `Target should be lower than your current ${currentBodyFat}% for fat loss`;
    }

    if (goal === 'build-muscle' && percentage < currentBodyFat - 2) {
      return 'Target body fat too low for muscle building goals';
    }

    if (percentage < recommendations.min) {
      return `Target too low for ${goal.replace('-', ' ')} goals (min: ${recommendations.min}%)`;
    }

    if (percentage > recommendations.max) {
      return `Target too high for ${goal.replace('-', ' ')} goals (max: ${recommendations.max}%)`;
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

  const updateTargetBodyFat = (percentage: number, currentBodyFat: number = 20) => {
    setGoalsData(prev => ({ ...prev, targetBodyFat: percentage }));

    const bodyFatError = validateTargetBodyFat(percentage, goalsData.selectedGoal, currentBodyFat);
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

  const resetGoals = () => {
    setGoalsData({
      selectedGoal: '',
      timelineWeeks: 8,
      targetBodyFat: 15,
      isGenerating: false,
    });
    setValidationMessages({});
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
