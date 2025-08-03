import React, { createContext, useCallback, useContext, useState } from 'react';
import { useGoals } from './GoalsContext';
import { useUserData } from './UserDataContext';

interface DailyAction {
  id: string;
  title: string;
  type: 'weight' | 'workout' | 'calories' | 'custom';
  completed: boolean;
  value?: string | number;
  target?: string | number;
  icon: string;
}

interface WeeklyProgress {
  week: number;
  completedActions: number;
  totalActions: number;
  completionRate: number;
}

interface DashboardContextType {
  // Progress tracking
  currentWeek: number;
  totalWeeks: number;
  completionPercentage: number;
  todayDate: string;
  
  // Daily actions
  dailyActions: DailyAction[];
  toggleAction: (actionId: string) => void;
  updateActionValue: (actionId: string, value: string | number) => void;
  
  // Status tracking
  status: 'on-track' | 'behind' | 'ahead';
  statusMessage: string;
  
  // Weekly progress
  weeklyProgress: WeeklyProgress[];
  getWeekProgress: (week: number) => WeeklyProgress | undefined;
  
  // Prediction
  predictionMessage: string;
  predictionDate: string;
  
  // Analytics
  streakCount: number;
  totalCompletedActions: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // Calculate current week and total weeks
  const currentWeek = 3; // Mock data - would be calculated from start date
  const totalWeeks = goalsData.timelineWeeks || 12;
  
  // Today's date formatting
  const today = new Date();
  const todayDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Daily actions state
  const [dailyActions, setDailyActions] = useState<DailyAction[]>([
    {
      id: '1',
      title: 'Log weight: 167 lbs',
      type: 'weight',
      completed: true,
      value: 167,
      target: 167,
      icon: '⚖️'
    },
    {
      id: '2',
      title: 'Complete workout: Strength training',
      type: 'workout',
      completed: false,
      icon: '💪'
    },
    {
      id: '3',
      title: 'Stay within calorie target: 1,850 cals',
      type: 'calories',
      completed: false,
      target: 1850,
      icon: '🍎'
    }
  ]);

  // Calculate completion percentage
  const completedCount = dailyActions.filter(action => action.completed).length;
  const completionPercentage = Math.round((completedCount / dailyActions.length) * 100);

  // Determine status
  const getStatus = useCallback(() => {
    if (completionPercentage >= 80) return 'on-track';
    if (completionPercentage >= 60) return 'behind';
    return 'ahead';
  }, [completionPercentage]);

  const status = getStatus();
  const statusMessage = `You're meeting ${completionPercentage}% of your targets`;

  // Mock weekly progress data
  const weeklyProgress: WeeklyProgress[] = [
    { week: 1, completedActions: 18, totalActions: 21, completionRate: 86 },
    { week: 2, completedActions: 19, totalActions: 21, completionRate: 90 },
    { week: 3, completedActions: 15, totalActions: 21, completionRate: 71 },
  ];

  // Prediction message
  const targetBodyFat = goalsData.targetBodyFat || 21;
  const predictionDate = 'August 7th';
  const predictionMessage = `Still on track for ${targetBodyFat}% body fat by ${predictionDate}`;

  // Toggle action completion
  const toggleAction = useCallback((actionId: string) => {
    setDailyActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      )
    );
  }, []);

  // Update action value
  const updateActionValue = useCallback((actionId: string, value: string | number) => {
    setDailyActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, value }
          : action
      )
    );
  }, []);

  // Get specific week progress
  const getWeekProgress = useCallback((week: number) => {
    return weeklyProgress.find(wp => wp.week === week);
  }, [weeklyProgress]);

  // Calculate analytics
  const streakCount = 5; // Mock streak count
  const totalCompletedActions = weeklyProgress.reduce((sum, week) => sum + week.completedActions, 0);

  const value: DashboardContextType = {
    currentWeek,
    totalWeeks,
    completionPercentage,
    todayDate,
    dailyActions,
    toggleAction,
    updateActionValue,
    status,
    statusMessage,
    weeklyProgress,
    getWeekProgress,
    predictionMessage,
    predictionDate,
    streakCount,
    totalCompletedActions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
