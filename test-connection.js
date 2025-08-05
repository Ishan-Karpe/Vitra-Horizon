// Quick test to verify backend connection
const fetch = require('node-fetch');

async function testBackendConnection() {
  try {
    console.log('🧪 Testing AI Backend Connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8087/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    
    // Test prediction endpoint
    const predictionResponse = await fetch('http://localhost:8087/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameters: {
          exerciseFrequency: 4,
          calorieDeficit: 300,
          proteinIntake: 'High'
        },
        userData: {
          bodyFatPercentage: 25,
          weight: 165,
          age: 30
        },
        goalsData: {
          targetBodyFat: 21,
          timelineWeeks: 12
        }
      })
    });
    
    const predictionData = await predictionResponse.json();
    console.log('✅ AI Prediction Test:', {
      bodyFat: `${predictionData.currentBodyFat}% → ${predictionData.targetBodyFat}%`,
      muscleGain: `${predictionData.muscleGain} lbs`,
      confidence: `${predictionData.confidence}%`,
      cached: predictionData.cached
    });
    
    // Test chat endpoint
    const chatResponse = await fetch('http://localhost:8087/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What if I can only workout 3 times per week?',
        context: {}
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('✅ AI Chat Test:', chatData.response);
    
    console.log('\n🎉 All tests passed! Backend is ready for frontend connection.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testBackendConnection();
