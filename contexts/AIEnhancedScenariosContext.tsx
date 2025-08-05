// AI-Enhanced ScenariosContext that connects to the backend on port 8087
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useGoals } from './GoalsContext';
import { Scenario, ScenarioParameters, ScenarioPrediction, ViewMode } from './ScenariosContext';
import { useUserData } from './UserDataContext';

// Storage keys
const STORAGE_KEYS = {
  SCENARIOS: '@scenarios',
  ACTIVE_PLAN_ID: '@activePlanId',
  VIEW_MODE: '@viewMode',
} as const;

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

// Enhanced interfaces for AI integration
export interface AIPrediction extends ScenarioPrediction {
  confidenceInterval?: {
    bodyFatLower: number;
    bodyFatUpper: number;
    muscleGainLower: number;
    muscleGainUpper: number;
  };
  successProbability?: number;
  riskFactors?: string[];
  plateauPrediction?: {
    likelyWeek: number;
    severity: 'low' | 'moderate' | 'high';
    recommendations: string[];
  };
  metabolicAdaptation?: {
    bmrChange: number;
    adaptationWeek: number;
  };
  cached?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIEnhancedScenariosContextType {
  // Original context methods
  scenarios: Scenario[];
  addScenario: (scenario: Omit<Scenario, 'id' | 'createdDate'>) => Scenario;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string) => void;
  createOnboardingScenario: () => Scenario;
  clearAllScenarios: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Comparison
  selectedScenariosForComparison: string[];
  toggleScenarioForComparison: (id: string) => void;
  clearComparison: () => void;

  activePlanId: string | null;
  setActivePlan: (id: string) => void;
  getScenarioById: (id: string) => Scenario | undefined;
  calculatePrediction: (parameters: ScenarioParameters) => Promise<ScenarioPrediction>;
  generateScenarioName: () => string;
  generateDescriptiveName: (parameters: ScenarioParameters) => string;
  
  // AI enhancements
  getAIPrediction: (parameters: ScenarioParameters) => Promise<AIPrediction>;
  isAIAvailable: boolean;
  aiMode: 'offline' | 'ai-enhanced' | 'ai-only';
  setAIMode: (mode: 'offline' | 'ai-enhanced' | 'ai-only') => void;
  
  // Chat functionality
  chatMessages: ChatMessage[];
  sendChatMessage: (message: string) => Promise<ChatMessage>;
  clearChatHistory: () => void;
  
  // Status
  lastSyncTime: Date | null;
  isConnectedToBackend: boolean;
}

const AIEnhancedScenariosContext = createContext<AIEnhancedScenariosContextType | undefined>(undefined);

// AI Service for backend communication
class AIBackendService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_AI_API_URL || 'http://localhost:8087';
    this.timeout = parseInt(process.env.EXPO_PUBLIC_AI_TIMEOUT || '5000');
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch (error) {
      console.warn('AI Backend health check failed:', error);
      return false;
    }
  }

  async getPrediction(parameters: ScenarioParameters, userData: any, goalsData: any): Promise<AIPrediction> {
    try {
      const response = await fetch(`${this.baseUrl}/api/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters,
          userData,
          goalsData
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`AI prediction failed: ${response.status}`);
      }

      const prediction = await response.json();
      console.log('✅ AI Prediction received:', prediction);
      return prediction;
    } catch (error) {
      console.error('❌ AI prediction error:', error);
      throw error;
    }
  }

  async sendChatMessage(message: string, context: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('❌ Chat error:', error);
      throw error;
    }
  }
}

export const useAIEnhancedScenarios = () => {
  const context = useContext(AIEnhancedScenariosContext);
  if (!context) {
    throw new Error('useAIEnhancedScenarios must be used within an AIEnhancedScenariosProvider');
  }
  return context;
};

export const AIEnhancedScenariosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUserData();
  const { goalsData } = useGoals();

  // State
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [selectedScenariosForComparison, setSelectedScenariosForComparison] = useState<string[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>('onboarding-scenario');
  const [aiMode, setAIMode] = useState<'offline' | 'ai-enhanced' | 'ai-only'>('ai-enhanced');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [predictionCache, setPredictionCache] = useState<Map<string, AIPrediction>>(new Map());

  const aiService = useMemo(() => new AIBackendService(), []);

  // Create default onboarding scenario
  const createDefaultScenario = useCallback((): Scenario => {
    const defaultParameters: ScenarioParameters = {
      exerciseFrequency: 4,
      calorieDeficit: 300,
      proteinIntake: 'High',
    };

    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;

    return {
      id: 'onboarding-scenario',
      name: 'Scenario #1',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      parameters: defaultParameters,
      prediction: {
        currentBodyFat: Math.round(currentBodyFat * 10) / 10,
        targetBodyFat: Math.round(targetBodyFat * 10) / 10,
        fatLoss: 8.0,
        muscleGain: 3.2,
        timeline: timelineWeeks,
        confidence: 75.0,
      },
      isFromOnboarding: true,
      isFavorite: false,
    };
  }, [userData.bodyFatPercentage, goalsData.targetBodyFat, goalsData.timelineWeeks]);

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const defaultScenario = createDefaultScenario();
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

  // Check backend connectivity on mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const isHealthy = await aiService.checkHealth();
        setIsAIAvailable(isHealthy);
        setIsConnectedToBackend(isHealthy);
        if (isHealthy) {
          console.log('✅ Connected to AI Backend on port 8087');
          setLastSyncTime(new Date());
        } else {
          console.log('⚠️ AI Backend not available, using offline mode');
        }
      } catch (error) {
        console.log('⚠️ Failed to connect to AI Backend:', error);
        setIsAIAvailable(false);
        setIsConnectedToBackend(false);
      }
    };

    checkBackendConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, [aiService]);

  // Simple prediction fallback (original algorithm)
  const calculateSimplePrediction = useCallback((parameters: ScenarioParameters): ScenarioPrediction => {
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;

    const exerciseMultiplier = parameters.exerciseFrequency / 4;
    const calorieMultiplier = parameters.calorieDeficit / 300;
    const proteinMultiplier = parameters.proteinIntake === 'High' ? 1.2 :
                             parameters.proteinIntake === 'Medium' ? 1.0 : 0.8;

    const effectivenessScore = (exerciseMultiplier + calorieMultiplier + proteinMultiplier) / 3;
    const bodyFatReduction = (currentBodyFat - targetBodyFat) * effectivenessScore;
    const finalBodyFat = Math.max(10, currentBodyFat - bodyFatReduction);
    const fatLoss = bodyFatReduction * 2.5;

    const estimatedWeight = userData.weight || 165;
    const baseMonthlyRate = 0.008;
    const baseWeeklyRate = baseMonthlyRate / 4.33;
    const trainingEffectiveness = Math.min(exerciseMultiplier, 1.5);
    const nutritionEffectiveness = proteinMultiplier;
    const weeklyMuscleGain = estimatedWeight * baseWeeklyRate * trainingEffectiveness * nutritionEffectiveness;
    const muscleGain = weeklyMuscleGain * timelineWeeks;

    const confidence = Math.min(95, Math.max(50, 70 + (effectivenessScore * 20)));

    return {
      currentBodyFat: Math.round(currentBodyFat * 10) / 10,
      targetBodyFat: Math.round(finalBodyFat * 10) / 10,
      fatLoss: Math.round(fatLoss * 100) / 100,
      muscleGain: Math.round(muscleGain * 100) / 100,
      timeline: timelineWeeks,
      confidence: Math.round(confidence * 10) / 10,
    };
  }, [userData, goalsData]);

  // AI-enhanced prediction
  const getAIPrediction = useCallback(async (parameters: ScenarioParameters): Promise<AIPrediction> => {
    const cacheKey = JSON.stringify({ parameters, userData, goalsData });
    
    // Check cache first
    if (predictionCache.has(cacheKey)) {
      const cached = predictionCache.get(cacheKey)!;
      console.log('📦 Using cached AI prediction');
      return { ...cached, cached: true };
    }

    // Try AI prediction if available
    if (isAIAvailable && aiMode !== 'offline') {
      try {
        const aiPrediction = await aiService.getPrediction(parameters, userData, goalsData);
        
        // Cache the result
        setPredictionCache(prev => new Map(prev.set(cacheKey, aiPrediction)));
        
        return { ...aiPrediction, cached: false };
      } catch (error) {
        console.warn('AI prediction failed, falling back to simple calculation:', error);
        
        if (aiMode === 'ai-only') {
          throw error;
        }
      }
    }

    // Fallback to simple prediction with AI-like enhancements
    const simplePrediction = calculateSimplePrediction(parameters);
    const enhancedPrediction: AIPrediction = {
      ...simplePrediction,
      confidenceInterval: {
        bodyFatLower: simplePrediction.targetBodyFat - 1.5,
        bodyFatUpper: simplePrediction.targetBodyFat + 1.0,
        muscleGainLower: simplePrediction.muscleGain * 0.8,
        muscleGainUpper: simplePrediction.muscleGain * 1.2,
      },
      successProbability: Math.min(95, simplePrediction.confidence + 5),
      riskFactors: parameters.exerciseFrequency > 6 ? ['High exercise frequency may lead to overtraining'] : [],
      cached: false
    };

    return enhancedPrediction;
  }, [userData, goalsData, isAIAvailable, aiMode, aiService, predictionCache, calculateSimplePrediction]);

  // Hybrid prediction function (backward compatible)
  const calculatePrediction = useCallback(async (parameters: ScenarioParameters): Promise<ScenarioPrediction> => {
    try {
      const aiPrediction = await getAIPrediction(parameters);
      // Return basic prediction format for backward compatibility
      return {
        currentBodyFat: aiPrediction.currentBodyFat,
        targetBodyFat: aiPrediction.targetBodyFat,
        fatLoss: aiPrediction.fatLoss,
        muscleGain: aiPrediction.muscleGain,
        timeline: aiPrediction.timeline,
        confidence: aiPrediction.confidence,
      };
    } catch (error) {
      console.warn('Falling back to simple prediction:', error);
      return calculateSimplePrediction(parameters);
    }
  }, [getAIPrediction, calculateSimplePrediction]);

  // Chat functionality
  const sendChatMessage = useCallback(async (message: string): Promise<ChatMessage> => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);

    try {
      if (!isAIAvailable) {
        throw new Error('AI not available');
      }

      const aiResponse = await aiService.sendChatMessage(message, {
        userData,
        goalsData,
        currentScenarios: scenarios,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting to the AI backend right now. Please try again later.',
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    }
  }, [aiService, isAIAvailable, userData, goalsData, scenarios]);

  // Placeholder implementations for other methods
  const addScenario = useCallback((scenario: Omit<Scenario, 'id' | 'createdDate'>): Scenario => {
    const newScenario: Scenario = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    };
    setScenarios(prev => [...prev, newScenario]);
    return newScenario;
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<Scenario>) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, ...updates } : scenario
    ));
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setScenarios(prev => {
      const newScenarios = prev.filter(scenario => scenario.id !== id);

      if (id === activePlanId) {
        if (newScenarios.length > 0) {
          setActivePlanId(newScenarios[0].id);
        } else {
          const defaultScenario = createDefaultScenario();
          setActivePlanId(defaultScenario.id);
          return [defaultScenario];
        }
      }

      if (newScenarios.length === 0) {
        const defaultScenario = createDefaultScenario();
        setActivePlanId(defaultScenario.id);
        return [defaultScenario];
      }
      
      return newScenarios;
    });
  }, [activePlanId, createDefaultScenario]);

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

  const createOnboardingScenario = useCallback(() => {
    const onboardingScenario = createDefaultScenario();
    setScenarios([onboardingScenario]);
    setActivePlanId(onboardingScenario.id);
    setSelectedScenariosForComparison([]);
    return onboardingScenario;
  }, [createDefaultScenario]);

  const clearAllScenarios = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SCENARIOS);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.VIEW_MODE);

      const defaultScenario = createDefaultScenario();
      setScenarios([defaultScenario]);
      setActivePlanId(defaultScenario.id);
      setViewMode('single');
      setSelectedScenariosForComparison([]);
    } catch (error) {
      console.error('Error clearing scenarios:', error);
    }
  }, [createDefaultScenario]);

  const setActivePlan = useCallback((id: string) => {
    setActivePlanId(id);
  }, []);

  const getScenarioById = useCallback((id: string) => {
    return scenarios.find(scenario => scenario.id === id);
  }, [scenarios]);

  const clearChatHistory = useCallback(() => {
    setChatMessages([]);
  }, []);

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

  const value: AIEnhancedScenariosContextType = {
    // Original methods
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

    // AI enhancements
    getAIPrediction,
    isAIAvailable,
    aiMode,
    setAIMode,
    chatMessages,
    sendChatMessage,
    clearChatHistory,
    lastSyncTime,
    isConnectedToBackend,
  };

  return (
    <AIEnhancedScenariosContext.Provider value={value}>
      {children}
    </AIEnhancedScenariosContext.Provider>
  );
};
