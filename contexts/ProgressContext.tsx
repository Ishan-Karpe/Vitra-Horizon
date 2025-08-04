import React, { createContext, useCallback, useContext, useState } from 'react';
import { useGoals } from './GoalsContext';
import { useUserData } from './UserDataContext';

export type TimePeriod = 'Week' | 'Month' | '3M' | '6M';

export interface DataPoint {
  date: string;
  value: number;
}

export interface MeasurementData {
  weight?: number;
  bodyFatPercentage?: number;
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  weightChange?: number;
  bodyFatChange?: number;
  chestChange: number;
  waistChange: number;
  hipsChange: number;
  armsChange: number;
}

export interface GoalProgress {
  bodyFat: {
    current: number;
    target: number;
    progress: number; // percentage
  };
  fatLoss: {
    current: number;
    target: number;
    progress: number; // percentage
  };
  muscleGain: {
    current: number;
    target: number;
    progress: number; // percentage
  };
}

interface ProgressContextType {
  // Time period
  selectedPeriod: TimePeriod;
  setSelectedPeriod: (period: TimePeriod) => void;
  
  // Weight data
  weightData: DataPoint[];
  getCurrentWeight: () => number;
  
  // Body fat data
  bodyFatData: DataPoint[];
  getCurrentBodyFat: () => number;
  
  // Measurements
  measurements: MeasurementData;
  updateMeasurements: (measurements: Partial<MeasurementData>) => void;
  
  // Goal progress
  goalProgress: GoalProgress;
  
  // Data filtering
  getFilteredWeightData: () => DataPoint[];
  getFilteredBodyFatData: () => DataPoint[];
  
  // Analytics
  getWeightTrend: () => 'up' | 'down' | 'stable';
  getBodyFatTrend: () => 'up' | 'down' | 'stable';
  getProgressInsights: () => string[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, updateUserData } = useUserData();
  const { goalsData, updateTargetBodyFat } = useGoals();
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Week');
  
  // Generate mock weight data based on user's current weight and goals
  const generateWeightData = useCallback((): DataPoint[] => {
    const currentWeight = userData.weight || 150;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const timelineWeeks = goalsData.timelineWeeks || 12;
    
    // Calculate expected weight loss based on body fat reduction
    const bodyFatReduction = currentBodyFat - targetBodyFat;
    const expectedWeightLoss = bodyFatReduction * 2.5; // Rough estimate
    const weeklyWeightLoss = expectedWeightLoss / timelineWeeks;
    
    const data: DataPoint[] = [];
    const today = new Date();
    
    // Generate data for the last 30 days with realistic progression
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Calculate weight with some realistic variation
      const weeksProgress = (30 - i) / 7; // How many weeks into the program
      const baseWeight = currentWeight - (weeklyWeightLoss * weeksProgress);
      const variation = (Math.random() - 0.5) * 2; // ±1 lb variation
      const weight = Math.round((baseWeight + variation) * 10) / 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: weight
      });
    }
    
    return data;
  }, [userData.weight, goalsData.targetBodyFat, userData.bodyFatPercentage, goalsData.timelineWeeks]);

  // Generate mock body fat data
  const generateBodyFatData = useCallback((): DataPoint[] => {
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;
    
    const weeklyReduction = (currentBodyFat - targetBodyFat) / timelineWeeks;
    
    const data: DataPoint[] = [];
    const today = new Date();
    
    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const weeksProgress = (30 - i) / 7;
      const baseBodyFat = currentBodyFat - (weeklyReduction * weeksProgress);
      const variation = (Math.random() - 0.5) * 0.5; // ±0.25% variation
      const bodyFat = Math.round((baseBodyFat + variation) * 10) / 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(10, bodyFat) // Minimum 10% body fat
      });
    }
    
    return data;
  }, [userData.bodyFatPercentage, goalsData.targetBodyFat, goalsData.timelineWeeks]);

  const [weightData, setWeightData] = useState<DataPoint[]>(generateWeightData);
  const [bodyFatData, setBodyFatData] = useState<DataPoint[]>(generateBodyFatData);
  
  // Measurements with realistic changes
  const [measurements, setMeasurements] = useState<MeasurementData>({
    weight: userData.weight,
    bodyFatPercentage: userData.bodyFatPercentage,
    chest: 42,
    waist: 34,
    hips: 38,
    arms: 14,
    weightChange: 0,
    bodyFatChange: 0,
    chestChange: 1,
    waistChange: -2,
    hipsChange: -1,
    armsChange: 0.5,
  });

  const getCurrentWeight = useCallback(() => {
    return weightData.length > 0 ? weightData[weightData.length - 1].value : userData.weight || 150;
  }, [weightData, userData.weight]);

  const getCurrentBodyFat = useCallback(() => {
    return bodyFatData.length > 0 ? bodyFatData[bodyFatData.length - 1].value : userData.bodyFatPercentage || 25;
  }, [bodyFatData, userData.bodyFatPercentage]);

  // Calculate goal progress
  const goalProgress: GoalProgress = {
    bodyFat: {
      current: getCurrentBodyFat(),
      target: goalsData.targetBodyFat || 21,
      progress: Math.round(((userData.bodyFatPercentage || 25) - getCurrentBodyFat()) / ((userData.bodyFatPercentage || 25) - (goalsData.targetBodyFat || 21)) * 100)
    },
    fatLoss: {
      current: Math.round(4.7 * 10) / 10, // Round to 1 decimal place
      target: 8,
      progress: Math.round(58.75)
    },
    muscleGain: {
      current: Math.round(1.2 * 10) / 10, // Round to 1 decimal place
      target: 2,
      progress: 60
    }
  };

  const getFilteredData = useCallback((data: DataPoint[], period: TimePeriod): DataPoint[] => {
    const today = new Date();
    let daysBack = 7;
    
    switch (period) {
      case 'Week':
        daysBack = 7;
        break;
      case 'Month':
        daysBack = 30;
        break;
      case '3M':
        daysBack = 90;
        break;
      case '6M':
        daysBack = 180;
        break;
    }
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  }, []);

  const getFilteredWeightData = useCallback(() => {
    return getFilteredData(weightData, selectedPeriod);
  }, [weightData, selectedPeriod, getFilteredData]);

  const getFilteredBodyFatData = useCallback(() => {
    return getFilteredData(bodyFatData, selectedPeriod);
  }, [bodyFatData, selectedPeriod, getFilteredData]);

  const getTrend = useCallback((data: DataPoint[]): 'up' | 'down' | 'stable' => {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-7); // Last 7 data points
    const firstValue = recent[0].value;
    const lastValue = recent[recent.length - 1].value;
    const change = lastValue - firstValue;
    
    if (Math.abs(change) < 0.5) return 'stable';
    return change > 0 ? 'up' : 'down';
  }, []);

  const getWeightTrend = useCallback(() => getTrend(weightData), [weightData, getTrend]);
  const getBodyFatTrend = useCallback(() => getTrend(bodyFatData), [bodyFatData, getTrend]);

  const getProgressInsights = useCallback((): string[] => {
    const insights: string[] = [];
    const weightTrend = getWeightTrend();
    const bodyFatTrend = getBodyFatTrend();
    
    if (weightTrend === 'down' && bodyFatTrend === 'down') {
      insights.push("Great progress! You're losing both weight and body fat.");
    }
    
    if (goalProgress.bodyFat.progress > 80) {
      insights.push("You're very close to your body fat goal!");
    }
    
    if (measurements.waistChange < 0) {
      insights.push("Your waist measurements are improving!");
    }
    
    return insights;
  }, [getWeightTrend, getBodyFatTrend, goalProgress, measurements]);

  const updateMeasurements = useCallback((newMeasurements: Partial<MeasurementData>) => {
    setMeasurements(prev => ({ ...prev, ...newMeasurements }));

    // If weight is being updated, propagate to UserDataContext and update weight data
    if ('weight' in newMeasurements && typeof newMeasurements.weight === 'number') {
      updateUserData('weight', newMeasurements.weight);

      // Add new weight data point to update graphs
      const newWeightEntry = {
        date: new Date().toISOString().split('T')[0],
        value: newMeasurements.weight,
      };
      setWeightData(prev => [...prev, newWeightEntry]);
    }

    // If body fat percentage is being updated, propagate to UserDataContext and update body fat data
    if ('bodyFatPercentage' in newMeasurements && typeof newMeasurements.bodyFatPercentage === 'number') {
      updateUserData('bodyFatPercentage', newMeasurements.bodyFatPercentage);

      // Add new body fat data point to update graphs
      const newBodyFatEntry = {
        date: new Date().toISOString().split('T')[0],
        value: newMeasurements.bodyFatPercentage,
      };
      setBodyFatData(prev => [...prev, newBodyFatEntry]);
    }
  }, [updateUserData]);

  const value: ProgressContextType = {
    selectedPeriod,
    setSelectedPeriod,
    weightData,
    getCurrentWeight,
    bodyFatData,
    getCurrentBodyFat,
    measurements,
    updateMeasurements,
    goalProgress,
    getFilteredWeightData,
    getFilteredBodyFatData,
    getWeightTrend,
    getBodyFatTrend,
    getProgressInsights,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
