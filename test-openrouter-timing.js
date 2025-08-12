// Test script to diagnose OpenRouter GLM-4.5 API timing issues
const fetch = require('node-fetch');

async function testOpenRouterPrediction() {
  console.log('\n=== Starting OpenRouter GLM-4.5 Timing Test ===\n');
  
  const testData = {
    parameters: {
      exerciseFrequency: 4,
      calorieDeficit: 300,
      proteinIntake: 'High'
    },
    userData: {
      bodyFatPercentage: 25,
      weight: 165,
      age: 30,
      activityLevel: 'Moderate'
    },
    goalsData: {
      targetBodyFat: 21,
      timelineWeeks: 12
    }
  };

  try {
    console.log('📡 Sending request to backend...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:8087/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseTime = Date.now() - startTime;
    console.log(`\n📊 Response received in ${responseTime}ms`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const totalTime = Date.now() - startTime;
    
    console.log(`\n✅ Total request time: ${totalTime}ms`);
    console.log('\nPrediction result:', {
      aiModel: result.aiModel,
      source: result.source,
      cached: result.cached,
      responseTime: result.responseTime,
      confidence: result.confidence,
      targetBodyFat: result.targetBodyFat
    });
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testOpenRouterPrediction().then(() => {
  console.log('\n=== Test Complete ===\n');
  console.log('Check the backend server terminal for detailed timing logs!');
  process.exit(0);
});