import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface UserData {
  // About Yourself data
  weight: number;
  heightFeet: number;
  heightInches: number;
  bodyFatPercentage: number;
  activityLevel: string;

  // Goals data
  goal?: string;
  timelineWeeks?: number;
  targetBodyFat?: number;

  // Additional profile data
  age?: number;
  gender?: string;
  name?: string;
}

export interface ValidationErrors {
  weight?: string;
  heightFeet?: string;
  heightInches?: string;
  bodyFatPercentage?: string;
  activityLevel?: string;
  goal?: string;
  timelineWeeks?: string;
  targetBodyFat?: string;
  age?: string;
  gender?: string;
  name?: string;
}

interface UserDataContextType {
  userData: UserData;
  validationErrors: ValidationErrors;
  updateUserData: ((field: keyof UserData, value: number | string) => void) & ((updates: Partial<UserData>) => void);
  validateField: (field: keyof UserData, value: number | string) => string | null;
  validateAllFields: () => boolean;
  resetValidationErrors: () => void;
  isFieldValid: (field: keyof UserData) => boolean;
  resetUserData: () => void;
  isLoaded: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface UserDataProviderProps {
  children: ReactNode;
}

// Storage key for user data
const USER_DATA_STORAGE_KEY = '@userData';

// Storage helper functions
const saveUserDataToStorage = async (data: UserData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data to storage:', error);
  }
};

const loadUserDataFromStorage = async (): Promise<UserData | null> => {
  try {
    const stored = await AsyncStorage.getItem(USER_DATA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading user data from storage:', error);
    return null;
  }
};

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    weight: 150,
    heightFeet: 5,
    heightInches: 8,
    bodyFatPercentage: 20,
    activityLevel: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await loadUserDataFromStorage();
        if (storedData) {
          // Clean up any improperly rounded body fat percentage
          const cleanedData = {
            ...storedData,
            bodyFatPercentage: Math.round(storedData.bodyFatPercentage * 10) / 10
          };
          setUserData(cleanedData);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading stored user data:', error);
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, []);

  // Save user data to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveUserDataToStorage(userData);
    }
  }, [userData, isLoaded]);

  const validateField = (field: keyof UserData, value: number | string): string | null => {
    switch (field) {
      case 'weight':
        const weight = Number(value);
        if (weight < 80) return 'Weight must be at least 80 lbs';
        if (weight > 200) return 'Weight must be less than 200 lbs';
        return null;
        
      case 'heightFeet':
        const feet = Number(value);
        if (feet < 4) return 'Height must be at least 4 feet';
        if (feet > 7) return 'Height must be less than 8 feet';
        return null;
        
      case 'heightInches':
        const inches = Number(value);
        if (inches < 0) return 'Inches cannot be negative';
        if (inches > 11) return 'Inches must be less than 12';
        return null;
        
      case 'bodyFatPercentage':
        const bodyFat = Number(value);
        if (bodyFat < 5) return 'Body fat must be at least 5%';
        if (bodyFat > 50) return 'Body fat must be less than 50%';
        return null;
        
      case 'activityLevel':
        if (!value || value === '') return 'Please select an activity level';
        return null;
        
      default:
        return null;
    }
  };

  const updateUserData = (fieldOrUpdates: keyof UserData | Partial<UserData>, value?: number | string) => {
    if (typeof fieldOrUpdates === 'string' && value !== undefined) {
      // Single field update
      const field = fieldOrUpdates;

      // Round body fat percentage to 1 decimal place
      const processedValue = field === 'bodyFatPercentage' && typeof value === 'number'
        ? Math.round(value * 10) / 10
        : value;

      setUserData(prev => ({
        ...prev,
        [field]: processedValue
      }));

      // Validate the field and update errors
      const error = validateField(field, processedValue);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }));
    } else if (typeof fieldOrUpdates === 'object') {
      // Bulk update
      const updates = fieldOrUpdates;

      // Round body fat percentage if it's being updated
      const processedUpdates = { ...updates };
      if ('bodyFatPercentage' in processedUpdates && typeof processedUpdates.bodyFatPercentage === 'number') {
        processedUpdates.bodyFatPercentage = Math.round(processedUpdates.bodyFatPercentage * 10) / 10;
      }
      if ('targetBodyFat' in processedUpdates && typeof processedUpdates.targetBodyFat === 'number') {
        processedUpdates.targetBodyFat = Math.round(processedUpdates.targetBodyFat * 10) / 10;
      }

      setUserData(prev => ({
        ...prev,
        ...processedUpdates
      }));

      // Validate all updated fields
      const newErrors: Partial<ValidationErrors> = {};
      Object.entries(processedUpdates).forEach(([field, val]) => {
        if (val !== undefined) {
          const error = validateField(field as keyof UserData, val as number | string);
          newErrors[field as keyof ValidationErrors] = error || undefined;
        }
      });

      setValidationErrors(prev => ({
        ...prev,
        ...newErrors
      }));
    }
  };

  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validate all required fields
    const fieldsToValidate: (keyof UserData)[] = [
      'weight', 'heightFeet', 'heightInches', 'bodyFatPercentage', 'activityLevel'
    ];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, userData[field] as number | string);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const resetValidationErrors = () => {
    setValidationErrors({});
  };

  const isFieldValid = (field: keyof UserData): boolean => {
    return !validationErrors[field] && userData[field] !== undefined && userData[field] !== '';
  };

  const resetUserData = async () => {
    const defaultData: UserData = {
      weight: 150,
      heightFeet: 5,
      heightInches: 8,
      bodyFatPercentage: 20,
      activityLevel: ''
    };

    setUserData(defaultData);
    setValidationErrors({});

    try {
      await AsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user data from storage:', error);
    }
  };

  const value: UserDataContextType = {
    userData,
    validationErrors,
    updateUserData,
    validateField,
    validateAllFields,
    resetValidationErrors,
    isFieldValid,
    resetUserData,
    isLoaded
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
