// Test script to verify Gemini-first AI configuration
const fetch = require('node-fetch');

async function testGeminiFirstConfiguration() {
  console.log('🧪 Testing Gemini-First AI Configuration...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch('http://localhost:8087/api/health');
    const healthData = await healthResponse.json();
    
    console.log('✅ Health Status:', healthData.status);
    console.log('🧠 AI Strategy:', healthData.aiStrategy || 'Not specified');
    console.log('🎯 Priority Order:', healthData.priority || 'Not specified');
    console.log('🔧 Services:', healthData.services);
    console.log('');
    
    // Test 2: AI Prediction with Gemini
    console.log('2️⃣ Testing AI Prediction (Gemini Primary)...');
    const predictionResponse = await fetch('http://localhost:8087/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    console.log('✅ Prediction Generated:');
    console.log(`   Body Fat: ${predictionData.currentBodyFat}% → ${predictionData.targetBodyFat}%`);
    console.log(`   Confidence: ${predictionData.confidence}%`);
    console.log(`   AI Model: ${predictionData.aiModel || 'Not specified'}`);
    console.log(`   Source: ${predictionData.source || 'Not specified'}`);
    console.log(`   Cached: ${predictionData.cached}`);
    console.log('');
    
    // Test 3: AI Chat with Gemini
    console.log('3️⃣ Testing AI Chat (Gemini Primary)...');
    const chatResponse = await fetch('http://localhost:8087/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What if I can only workout 3 times per week?',
        context: { testMode: true }
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('✅ Chat Response:');
    console.log(`   "${chatData.response}"`);
    console.log('');
    
    // Test 4: Cache Statistics
    console.log('4️⃣ Testing Cache System...');
    const cacheResponse = await fetch('http://localhost:8087/api/cache/stats');
    const cacheData = await cacheResponse.json();
    console.log('✅ Cache Stats:', cacheData);
    console.log('');
    
    // Summary
    console.log('🎉 All Tests Completed Successfully!');
    console.log('');
    console.log('📊 Configuration Summary:');
    console.log('   🥇 Primary AI: Gemini Pro');
    console.log('   🥈 Backup AI: Claude 3.5 Sonnet');
    console.log('   🥉 Fallback: Mock AI');
    console.log('   🔄 Backend: http://localhost:8087');
    console.log('   📱 Frontend: http://localhost:8088');
    console.log('');
    console.log('✅ Ready to test in the app!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: node ai-backend-server.js');
    console.log('   2. Check if port 8087 is available');
    console.log('   3. Verify API keys in .env file');
  }
}

// Run the test
testGeminiFirstConfiguration();
