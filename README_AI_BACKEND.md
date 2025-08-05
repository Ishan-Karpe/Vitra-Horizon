# Vitra-Morph AI Backend Setup & Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
# Copy the backend package.json
cp backend-package.json package-backend.json

# Install backend dependencies
npm install express cors express-rate-limit node-cache dotenv
```

### 2. Start the AI Backend Server
```bash
# Start the server on localhost:8087
node ai-backend-server.js
```

You should see:
```
🚀 Vitra-Morph AI Backend Server running on http://localhost:8087
📊 Health check: http://localhost:8087/api/health
🤖 AI Predictions: POST http://localhost:8087/api/predictions
💬 AI Chat: POST http://localhost:8087/api/chat
🎯 Scenario Generation: POST http://localhost:8087/api/scenarios/generate
```

### 3. Test the API Endpoints

#### Health Check
```bash
curl http://localhost:8087/api/health
```

#### Test AI Prediction
```bash
curl -X POST http://localhost:8087/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "exerciseFrequency": 4,
      "calorieDeficit": 300,
      "proteinIntake": "High"
    },
    "userData": {
      "bodyFatPercentage": 25,
      "weight": 165,
      "age": 30
    },
    "goalsData": {
      "targetBodyFat": 21,
      "timelineWeeks": 12
    }
  }'
```

#### Test AI Chat
```bash
curl -X POST http://localhost:8087/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What if I can only workout 3 times per week?",
    "context": {
      "currentScenario": "4x/week strength training"
    }
  }'
```

#### Test Scenario Generation
```bash
curl -X POST http://localhost:8087/api/scenarios/generate \
  -H "Content-Type: application/json" \
  -d '{
    "goals": "Lose 15 pounds in 3 months while maintaining muscle",
    "constraints": {
      "timeAvailable": 45,
      "equipmentAccess": ["dumbbells", "bodyweight"]
    },
    "userData": {
      "bodyFatPercentage": 25,
      "weight": 165,
      "activityLevel": "Moderate"
    }
  }'
```

## Integration with React Native App

### 1. Update Environment Variables
Add to your `.env` file:
```
EXPO_PUBLIC_AI_API_URL=http://localhost:8087
EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_key_here
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

### 2. Install Additional Dependencies in React Native App
```bash
# In your main Vitra-Morph directory
npm install @react-native-async-storage/async-storage
```

### 3. Replace ScenariosContext
Replace the existing `contexts/ScenariosContext.tsx` with the AI-enhanced version from `AI_INTEGRATION_EXAMPLE.tsx`.

### 4. Test Integration
1. Start the backend server: `node ai-backend-server.js`
2. Start your React Native app: `npm start`
3. Navigate to the Scenarios tab
4. Create a new scenario and observe AI-enhanced predictions

## API Response Examples

### AI Prediction Response
```json
{
  "currentBodyFat": 25.0,
  "targetBodyFat": 21.2,
  "fatLoss": 6.27,
  "muscleGain": 3.45,
  "timeline": 12,
  "confidence": 82.5,
  "confidenceInterval": {
    "bodyFatLower": 19.7,
    "bodyFatUpper": 22.2,
    "muscleGainLower": 2.42,
    "muscleGainUpper": 4.49
  },
  "successProbability": 78.3,
  "riskFactors": [],
  "plateauPrediction": {
    "likelyWeek": 8,
    "severity": "low",
    "recommendations": [
      "Consider refeed days to reset metabolism",
      "Vary exercise routine to prevent adaptation",
      "Monitor sleep and stress levels"
    ]
  },
  "metabolicAdaptation": {
    "bmrChange": -3.5,
    "adaptationWeek": 6
  },
  "cached": false
}
```

### AI Chat Response
```json
{
  "response": "With 3x/week workouts, you'd reach about 22% body fat instead of 21%. To maintain better results, consider adding 15-20 minutes of daily walks or increasing protein intake to 1.2g per lb of body weight."
}
```

### Scenario Generation Response
```json
[
  {
    "scenario": {
      "id": "ai-generated-1703123456789-1",
      "name": "AI Optimized Plan A",
      "createdDate": "December 21",
      "parameters": {
        "exerciseFrequency": 4,
        "calorieDeficit": 300,
        "proteinIntake": "High"
      },
      "prediction": { /* full prediction object */ },
      "isFromOnboarding": false,
      "isFavorite": false
    },
    "rationale": "Balanced approach optimizing for both effectiveness and sustainability based on your profile.",
    "adherenceProbability": 78,
    "alternatives": [
      { "exerciseFrequency": 3, "calorieDeficit": 300, "proteinIntake": "High" },
      { "exerciseFrequency": 4, "calorieDeficit": 400, "proteinIntake": "High" }
    ]
  }
]
```

## Features Demonstrated

### ✅ Advanced Prediction Engine
- Non-linear calculations considering age, difficulty, and metabolic factors
- Confidence intervals and uncertainty quantification
- Plateau prediction and metabolic adaptation modeling
- Risk factor identification

### ✅ Intelligent Caching
- 1-hour TTL for predictions
- Cache hit/miss tracking
- Cache management endpoints

### ✅ Conversational AI
- Context-aware responses
- Fitness-specific knowledge base
- Motivational and educational content

### ✅ Scenario Optimization
- Multi-objective optimization simulation
- Alternative scenario generation
- Adherence probability scoring

### ✅ Performance Features
- Response time simulation (1-5 seconds)
- Rate limiting (100 requests per 15 minutes)
- Error handling and graceful degradation

## Next Steps

1. **Replace Mock AI with Real APIs**: Integrate actual Claude and Gemini API calls
2. **Add Database**: Implement PostgreSQL for user data and analytics
3. **Enhance Security**: Add proper authentication and API key management
4. **Deploy to Cloud**: Set up production deployment on AWS/Google Cloud
5. **Add Monitoring**: Implement logging, metrics, and error tracking
6. **Scale Testing**: Load test with multiple concurrent users

## Troubleshooting

### Server Won't Start
- Check if port 8087 is available: `lsof -i :8087`
- Install missing dependencies: `npm install`

### API Calls Failing
- Verify server is running: `curl http://localhost:8087/api/health`
- Check CORS settings if calling from browser
- Verify request format matches examples above

### Integration Issues
- Ensure environment variables are set correctly
- Check network connectivity between app and server
- Verify AsyncStorage permissions in React Native app

This backend demonstrates the full AI enhancement architecture and provides a working foundation for the sophisticated prediction system outlined in the main proposal.
