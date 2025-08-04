import React from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { useUserData } from '../../contexts/UserDataContext';
import { useGoals } from '../../contexts/GoalsContext';
import { useScenarios } from '../../contexts/ScenariosContext';
import { clearAllAppData, verifyDataCleared } from '../../utils/clearAllData';

/**
 * Development component for resetting all app data
 * Only use this for development/testing purposes
 */
export const DataResetButton: React.FC = () => {
  const { resetUserData } = useUserData();
  const { resetGoals } = useGoals();
  const { clearAllScenarios } = useScenarios();

  const handleResetAllData = async () => {
    Alert.alert(
      '⚠️ Reset All Data',
      'This will permanently delete ALL user data and reset the app to a fresh state. This action cannot be undone.\n\nAre you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚀 Starting complete app reset...');
              
              // Step 1: Clear all AsyncStorage data
              await clearAllAppData();
              
              // Step 2: Reset all context states
              console.log('🔄 Resetting context states...');
              await resetUserData();
              await resetGoals();
              await clearAllScenarios();
              
              // Step 3: Verify everything is cleared
              const isCleared = await verifyDataCleared();
              
              if (isCleared) {
                Alert.alert(
                  '✅ Reset Complete',
                  'All data has been successfully cleared. The app is now in a fresh state.',
                  [{ text: 'OK' }]
                );
                console.log('🎉 Complete app reset successful!');
              } else {
                Alert.alert(
                  '⚠️ Reset Incomplete',
                  'Some data may still remain. Check the console for details.',
                  [{ text: 'OK' }]
                );
                console.log('⚠️ Reset may be incomplete - check logs');
              }
              
            } catch (error) {
              console.error('💥 Error during app reset:', error);
              Alert.alert(
                '❌ Reset Failed',
                'An error occurred while resetting the app. Check the console for details.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleResetAllData}
      className="bg-red-500 px-4 py-2 rounded-lg mx-4 my-2"
    >
      <Text className="text-white font-semibold text-center">
        🗑️ Reset All Data (DEV)
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Quick reset function for programmatic use
 */
export const resetAllAppData = async (): Promise<boolean> => {
  try {
    console.log('🚀 Programmatic app reset starting...');
    
    // Clear storage
    await clearAllAppData();
    
    // Note: Context resets need to be called from within components
    // that have access to the contexts
    
    const isCleared = await verifyDataCleared();
    console.log(isCleared ? '✅ Reset successful' : '⚠️ Reset may be incomplete');
    
    return isCleared;
  } catch (error) {
    console.error('💥 Programmatic reset failed:', error);
    return false;
  }
};
