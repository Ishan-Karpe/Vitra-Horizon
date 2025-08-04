import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Comprehensive data clearing utility
 * Removes all stored user data and resets the app to a fresh state
 */

// All storage keys used in the app
const STORAGE_KEYS = {
  USER_DATA: '@userData',
  GOALS_DATA: '@goalsData', 
  SCENARIOS: '@scenarios',
  ACTIVE_PLAN_ID: '@activePlanId',
  VIEW_MODE: '@viewMode',
} as const;

/**
 * Clear all AsyncStorage data
 */
export const clearAllAsyncStorage = async (): Promise<void> => {
  try {
    console.log('🧹 Starting comprehensive data clearing...');
    
    // Get all keys to see what's stored
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📋 Found storage keys:', allKeys);
    
    // Clear specific app keys
    const keysToRemove = Object.values(STORAGE_KEYS);
    console.log('🗑️ Removing keys:', keysToRemove);
    
    await AsyncStorage.multiRemove(keysToRemove);
    
    // Also clear any other keys that might be app-related (starting with @)
    const appKeys = allKeys.filter(key => key.startsWith('@'));
    if (appKeys.length > keysToRemove.length) {
      const additionalKeys = appKeys.filter(key => !keysToRemove.includes(key));
      if (additionalKeys.length > 0) {
        console.log('🗑️ Removing additional app keys:', additionalKeys);
        await AsyncStorage.multiRemove(additionalKeys);
      }
    }
    
    console.log('✅ All AsyncStorage data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing AsyncStorage:', error);
    throw error;
  }
};

/**
 * Clear all app data and reset to fresh state
 * This is the main function to call for a complete reset
 */
export const clearAllAppData = async (): Promise<void> => {
  try {
    console.log('🚀 Starting complete app data reset...');
    
    // Clear AsyncStorage
    await clearAllAsyncStorage();
    
    // Clear any other potential storage mechanisms
    // (Add more clearing functions here if needed in the future)
    
    console.log('🎉 App data reset complete! Fresh start ready.');
  } catch (error) {
    console.error('💥 Error during app data reset:', error);
    throw error;
  }
};

/**
 * Verify that all data has been cleared
 */
export const verifyDataCleared = async (): Promise<boolean> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const appKeys = allKeys.filter(key => key.startsWith('@'));
    
    console.log('🔍 Verification - Remaining storage keys:', allKeys);
    console.log('🔍 Verification - Remaining app keys:', appKeys);
    
    return appKeys.length === 0;
  } catch (error) {
    console.error('❌ Error verifying data cleared:', error);
    return false;
  }
};

/**
 * Development helper: Log all current storage contents
 */
export const logAllStorageContents = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📊 Current storage contents:');
    
    for (const key of allKeys) {
      try {
        const value = await AsyncStorage.getItem(key);
        console.log(`  ${key}:`, value ? JSON.parse(value) : null);
      } catch (parseError) {
        console.log(`  ${key}:`, value);
      }
    }
  } catch (error) {
    console.error('❌ Error logging storage contents:', error);
  }
};
