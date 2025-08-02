import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserData {
  // About Yourself data
  weight: number;
  heightFeet: number;
  heightInches: number;
  bodyFatPercentage: number;
  activityLevel: string;
  
  // Goals data (for future screens)
  goalType?: string;
  targetWeight?: number;
  timeframe?: string;
  
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
}

interface UserDataContextType {
  userData: UserData;
  validationErrors: ValidationErrors;
  updateUserData: (field: keyof UserData, value: number | string) => void;
  validateField: (field: keyof UserData, value: number | string) => string | null;
  validateAllFields: () => boolean;
  resetValidationErrors: () => void;
  isFieldValid: (field: keyof UserData) => boolean;
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

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    weight: 150,
    heightFeet: 5,
    heightInches: 8,
    bodyFatPercentage: 20,
    activityLevel: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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

  const updateUserData = (field: keyof UserData, value: number | string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate the field and update errors
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
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

  const value: UserDataContextType = {
    userData,
    validationErrors,
    updateUserData,
    validateField,
    validateAllFields,
    resetValidationErrors,
    isFieldValid
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
