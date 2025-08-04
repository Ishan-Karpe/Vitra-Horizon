/**
 * Data clearing script
 * Run this to clear all user data and reset the app to a fresh state
 */

import { clearAllAppData, verifyDataCleared, logAllStorageContents } from '../utils/clearAllData';

const runDataClear = async () => {
  try {
    console.log('🔄 BEFORE CLEARING:');
    await logAllStorageContents();
    
    console.log('\n🧹 CLEARING ALL DATA...');
    await clearAllAppData();
    
    console.log('\n✅ VERIFYING DATA CLEARED...');
    const isCleared = await verifyDataCleared();
    
    if (isCleared) {
      console.log('🎉 SUCCESS: All data has been cleared!');
    } else {
      console.log('⚠️ WARNING: Some data may still remain');
    }
    
    console.log('\n🔄 AFTER CLEARING:');
    await logAllStorageContents();
    
  } catch (error) {
    console.error('💥 FAILED to clear data:', error);
  }
};

// Execute if run directly
if (require.main === module) {
  runDataClear();
}

export { runDataClear };
