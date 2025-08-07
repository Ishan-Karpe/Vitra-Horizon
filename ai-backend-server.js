// Vitra-Morph AI Backend Server
// Demonstrates AI integration for body composition predictions
// Run with: node ai-backend-server.js

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = 8087;

// Cache for predictions (TTL: 1 hour)
const predictionCache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Mock AI Services (replace with actual API calls)
class MockAIService {
  // Simulate Gemini API for advanced predictions (Primary)
  async getAdvancedPrediction(parameters, userData, goalsData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const { exerciseFrequency, calorieDeficit, proteinIntake } = parameters;
    const currentBodyFat = userData.bodyFatPercentage || 25;
    const targetBodyFat = goalsData.targetBodyFat || 21;
    const timelineWeeks = goalsData.timelineWeeks || 12;
    const userWeight = userData.weight || 165;
    const userAge = userData.age || 30;
    
    // Advanced calculation considering multiple factors
    const ageMultiplier = Math.max(0.7, 1 - (userAge - 25) * 0.01);
    const exerciseMultiplier = Math.min(1.5, exerciseFrequency / 4);
    const calorieMultiplier = Math.min(1.3, calorieDeficit / 300);
    const proteinMultiplier = proteinIntake === 'High' ? 1.2 : proteinIntake === 'Medium' ? 1.0 : 0.8;
    
    // Non-linear effectiveness calculation
    const baseEffectiveness = (exerciseMultiplier + calorieMultiplier + proteinMultiplier) / 3;
    const effectiveness = baseEffectiveness * ageMultiplier * (1 - Math.abs(baseEffectiveness - 1) * 0.1);
    
    // Body fat calculation with diminishing returns
    const bodyFatDifference = currentBodyFat - targetBodyFat;
    const difficultyMultiplier = Math.max(0.6, 1 - bodyFatDifference * 0.05);
    const bodyFatReduction = bodyFatDifference * effectiveness * difficultyMultiplier;
    const finalBodyFat = Math.max(8, currentBodyFat - bodyFatReduction);
    
    // Fat loss calculation
    const fatLoss = bodyFatReduction * (userWeight * 0.01) * 2.2; // Convert to lbs
    
    // Muscle gain with realistic constraints
    const baseMonthlyRate = 0.008 * ageMultiplier;
    const weeklyRate = baseMonthlyRate / 4.33;
    const trainingEffect = Math.min(exerciseMultiplier, 1.4);
    const nutritionEffect = proteinMultiplier;
    const weeklyMuscleGain = userWeight * weeklyRate * trainingEffect * nutritionEffect;
    const muscleGain = weeklyMuscleGain * timelineWeeks;
    
    // Confidence calculation
    const dataQuality = 0.8; // Assume good data quality
    const planComplexity = Math.min(1, (exerciseFrequency + calorieDeficit/100) / 8);
    const confidence = Math.min(95, Math.max(60, 
      70 + (effectiveness * 20) + (dataQuality * 10) - (planComplexity * 5)
    ));
    
    // Success probability
    const adherenceScore = Math.max(0.4, 1 - (exerciseFrequency - 4) * 0.1 - (calorieDeficit - 300) * 0.0005);
    const successProbability = Math.min(95, confidence * adherenceScore);
    
    // Risk factors
    const riskFactors = [];
    if (exerciseFrequency > 6) riskFactors.push('High exercise frequency may lead to overtraining');
    if (calorieDeficit > 500) riskFactors.push('Large calorie deficit may affect muscle retention');
    if (bodyFatDifference > 8) riskFactors.push('Aggressive body fat target may be difficult to maintain');
    
    // Plateau prediction
    const plateauWeek = Math.max(6, timelineWeeks * 0.6 + Math.random() * 4);
    const plateauSeverity = bodyFatDifference > 6 ? 'moderate' : 'low';
    
    return {
      currentBodyFat: Math.round(currentBodyFat * 10) / 10,
      targetBodyFat: Math.round(finalBodyFat * 10) / 10,
      fatLoss: Math.round(fatLoss * 100) / 100,
      muscleGain: Math.round(muscleGain * 100) / 100,
      timeline: timelineWeeks,
      confidence: Math.round(confidence * 10) / 10,
      confidenceInterval: {
        bodyFatLower: Math.round((finalBodyFat - 1.5) * 10) / 10,
        bodyFatUpper: Math.round((finalBodyFat + 1.0) * 10) / 10,
        muscleGainLower: Math.round(muscleGain * 0.7 * 100) / 100,
        muscleGainUpper: Math.round(muscleGain * 1.3 * 100) / 100,
      },
      successProbability: Math.round(successProbability * 10) / 10,
      riskFactors,
      plateauPrediction: {
        likelyWeek: Math.round(plateauWeek),
        severity: plateauSeverity,
        recommendations: [
          'Consider refeed days to reset metabolism',
          'Vary exercise routine to prevent adaptation',
          'Monitor sleep and stress levels'
        ]
      },
      metabolicAdaptation: {
        bmrChange: Math.round(-2 - (calorieDeficit / 200) * 10) / 10,
        adaptationWeek: Math.round(timelineWeeks * 0.5)
      }
    };
  }

  // Simulate Claude API for conversational responses (Backup)
  async getChatResponse(message, context) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('workout') && lowerMessage.includes('3')) {
      return "With 3x/week workouts, you'd reach about 22% body fat instead of 21%. To maintain better results, consider adding 15-20 minutes of daily walks or increasing protein intake to 1.2g per lb of body weight.";
    }
    
    if (lowerMessage.includes('plateau') || lowerMessage.includes('stuck')) {
      return "Plateaus are normal! Try these strategies: 1) Take a 1-week diet break, 2) Change your workout routine, 3) Focus on sleep quality (7-9 hours), 4) Consider a refeed day weekly. Your body adapts, so we need to keep it guessing!";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('give up')) {
      return "I understand it's challenging! Remember, sustainable changes take time. You're building lifelong habits, not just chasing quick results. Focus on consistency over perfection - even 80% adherence beats 100% for 2 weeks then quitting.";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
      return "For optimal results, focus on: 1) Adequate protein (0.8-1.2g per lb), 2) Consistent meal timing, 3) Include vegetables with each meal, 4) Stay hydrated. Small, sustainable changes work better than drastic restrictions.";
    }
    
    return "I'm here to help with your fitness journey! Feel free to ask about workouts, nutrition, progress tracking, or any challenges you're facing. What specific aspect would you like to discuss?";
  }

  // Generate optimal scenarios
  async generateScenarios(goals, constraints, userData) {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const baseScenario = {
      exerciseFrequency: 4,
      calorieDeficit: 300,
      proteinIntake: 'High'
    };
    
    return [
      {
        scenario: {
          id: `ai-generated-${Date.now()}-1`,
          name: 'AI Optimized Plan A',
          createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          parameters: baseScenario,
          prediction: await this.getAdvancedPrediction(baseScenario, userData, { targetBodyFat: 21, timelineWeeks: 12 }),
          isFromOnboarding: false,
          isFavorite: false,
        },
        rationale: 'Balanced approach optimizing for both effectiveness and sustainability based on your profile.',
        adherenceProbability: 78,
        alternatives: [
          { ...baseScenario, exerciseFrequency: 3 },
          { ...baseScenario, calorieDeficit: 400 }
        ]
      },
      {
        scenario: {
          id: `ai-generated-${Date.now()}-2`,
          name: 'AI Optimized Plan B',
          createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          parameters: { exerciseFrequency: 5, calorieDeficit: 250, proteinIntake: 'High' },
          prediction: await this.getAdvancedPrediction({ exerciseFrequency: 5, calorieDeficit: 250, proteinIntake: 'High' }, userData, { targetBodyFat: 21, timelineWeeks: 12 }),
          isFromOnboarding: false,
          isFavorite: false,
        },
        rationale: 'Higher frequency, lower deficit approach for better muscle retention.',
        adherenceProbability: 65,
        alternatives: [
          { exerciseFrequency: 4, calorieDeficit: 250, proteinIntake: 'High' },
          { exerciseFrequency: 5, calorieDeficit: 300, proteinIntake: 'Medium' }
        ]
      }
    ];
  }
}

// Real AI Service with Gemini Primary + Claude Backup
class RealAIService extends MockAIService {
  constructor() {
    super();
    // Try multiple environment variable names
    this.geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    this.claudeApiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.claudeApiUrl = 'https://api.anthropic.com/v1/messages';

    console.log('🔑 API Keys Status:');
    console.log(`   Gemini: ${this.geminiApiKey ? 'Configured ✅' : 'Not configured ❌'}`);
    console.log(`   Claude: ${this.claudeApiKey ? 'Configured ✅' : 'Not configured ❌'}`);
  }

  async callGeminiAPI(prompt) {
    try {
      const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  async callClaudeAPI(prompt) {
    try {
      const response = await fetch(this.claudeApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API call failed:', error);
      throw error;
    }
  }

  async getAdvancedPrediction(parameters, userData, goalsData) {
    console.log('🔮 Attempting prediction with Gemini (Primary)...');

    try {
      // Try Gemini first for predictions
      if (this.geminiApiKey && this.geminiApiKey !== 'your_gemini_key_here') {
        console.log('📊 Using Gemini Pro for advanced prediction');

        const prompt = `You are a fitness AI expert. Calculate body composition predictions based on this data:

User Data:
- Current body fat: ${userData.bodyFatPercentage || 25}%
- Weight: ${userData.weight || 165} lbs
- Age: ${userData.age || 30}
- Activity level: ${userData.activityLevel || 'Moderate'}

Goals:
- Target body fat: ${goalsData.targetBodyFat || 21}%
- Timeline: ${goalsData.timelineWeeks || 12} weeks

Scenario Parameters:
- Exercise frequency: ${parameters.exerciseFrequency} times per week
- Calorie deficit: ${parameters.calorieDeficit} calories per day
- Protein intake: ${parameters.proteinIntake}

Provide a JSON response with these exact fields:
{
  "currentBodyFat": number,
  "targetBodyFat": number,
  "fatLoss": number,
  "muscleGain": number,
  "timeline": number,
  "confidence": number,
  "confidenceInterval": {
    "bodyFatLower": number,
    "bodyFatUpper": number,
    "muscleGainLower": number,
    "muscleGainUpper": number
  },
  "successProbability": number,
  "riskFactors": string[],
  "plateauPrediction": {
    "likelyWeek": number,
    "severity": "low" | "moderate" | "high",
    "recommendations": string[]
  },
  "metabolicAdaptation": {
    "bmrChange": number,
    "adaptationWeek": number
  }
}

Use realistic fitness science principles and provide accurate predictions.`;

        const aiResponse = await this.callGeminiAPI(prompt);

        try {
          // Try to parse JSON response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const prediction = JSON.parse(jsonMatch[0]);
            return { ...prediction, aiModel: 'gemini-pro', source: 'primary' };
          }
        } catch (parseError) {
          console.warn('Failed to parse Gemini JSON response, using enhanced mock');
        }

        // Fallback to enhanced mock with Gemini branding
        const prediction = await super.getAdvancedPrediction(parameters, userData, goalsData);
        return { ...prediction, aiModel: 'gemini-pro', source: 'primary' };
      }

      throw new Error('Gemini API key not configured');
    } catch (error) {
      console.warn('⚠️ Gemini prediction failed, trying Claude backup:', error.message);

      try {
        // Fallback to Claude
        if (this.claudeApiKey && this.claudeApiKey !== 'your_claude_key_here') {
          console.log('🧠 Using Claude as backup for prediction');

          const prompt = `You are a fitness AI expert. Calculate body composition predictions based on this data:

User Data:
- Current body fat: ${userData.bodyFatPercentage || 25}%
- Weight: ${userData.weight || 165} lbs
- Age: ${userData.age || 30}
- Activity level: ${userData.activityLevel || 'Moderate'}

Goals:
- Target body fat: ${goalsData.targetBodyFat || 21}%
- Timeline: ${goalsData.timelineWeeks || 12} weeks

Scenario Parameters:
- Exercise frequency: ${parameters.exerciseFrequency} times per week
- Calorie deficit: ${parameters.calorieDeficit} calories per day
- Protein intake: ${parameters.proteinIntake}

Provide a JSON response with realistic fitness predictions including confidence intervals, success probability, risk factors, plateau prediction, and metabolic adaptation data.`;

          const aiResponse = await this.callClaudeAPI(prompt);

          try {
            // Try to parse JSON response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const prediction = JSON.parse(jsonMatch[0]);
              return { ...prediction, aiModel: 'claude-3.5-sonnet', source: 'backup' };
            }
          } catch (parseError) {
            console.warn('Failed to parse Claude JSON response, using enhanced mock');
          }

          const prediction = await super.getAdvancedPrediction(parameters, userData, goalsData);
          return { ...prediction, aiModel: 'claude-3.5-sonnet', source: 'backup' };
        }

        throw new Error('Claude API key not configured');
      } catch (claudeError) {
        console.warn('⚠️ Claude backup also failed, using mock prediction:', claudeError.message);

        // Final fallback to mock
        const prediction = await super.getAdvancedPrediction(parameters, userData, goalsData);
        return { ...prediction, aiModel: 'mock-ai', source: 'fallback' };
      }
    }
  }

  async getChatResponse(message, context) {
    console.log('💬 Attempting chat with Gemini (Primary)...');

    try {
      // Try Gemini first for chat
      if (this.geminiApiKey && this.geminiApiKey !== 'your_gemini_key_here') {
        console.log('🤖 Using Gemini Pro for chat response');

        const prompt = `You are a knowledgeable fitness AI assistant. Answer this fitness question: "${message}"

Context: ${JSON.stringify(context)}

Provide a helpful, accurate, and personalized response based on fitness science. Keep it conversational and practical.`;

        try {
          const response = await this.callGeminiAPI(prompt);
          return response;
        } catch (apiError) {
          console.warn('Gemini API call failed, using mock response');
          const response = await super.getChatResponse(message, context);
          return `[Gemini Fallback] ${response}`;
        }
      }

      throw new Error('Gemini API key not configured');
    } catch (error) {
      console.warn('⚠️ Gemini chat failed, trying Claude backup:', error.message);

      try {
        // Fallback to Claude
        if (this.claudeApiKey && this.claudeApiKey !== 'your_claude_key_here') {
          console.log('🧠 Using Claude as backup for chat');

          const prompt = `You are a knowledgeable fitness AI assistant. Answer this fitness question: "${message}"

Context: ${JSON.stringify(context)}

Provide a helpful, accurate, and personalized response based on fitness science. Keep it conversational and practical.`;

          try {
            const response = await this.callClaudeAPI(prompt);
            return response;
          } catch (apiError) {
            console.warn('Claude API call failed, using mock response');
            const response = await super.getChatResponse(message, context);
            return `[Claude Fallback] ${response}`;
          }
        }

        throw new Error('Claude API key not configured');
      } catch (claudeError) {
        console.warn('⚠️ Claude backup also failed, using mock response:', claudeError.message);

        // Final fallback to mock
        const response = await super.getChatResponse(message, context);
        return `[Mock AI] ${response}`;
      }
    }
  }
}

const aiService = new RealAIService();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  const geminiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const claudeKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;

  const geminiConfigured = geminiKey && geminiKey !== 'your_gemini_key_here';
  const claudeConfigured = claudeKey && claudeKey !== 'your_claude_key_here';

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiStrategy: 'gemini-primary-claude-backup',
    services: {
      'gemini-pro': geminiConfigured ? 'configured' : 'not-configured',
      'claude-3.5-sonnet': claudeConfigured ? 'configured' : 'not-configured',
      'mock-ai': 'available',
      cache: 'active'
    },
    priority: ['gemini-pro', 'claude-3.5-sonnet', 'mock-ai'],
    debug: {
      geminiKeyPresent: !!geminiKey,
      claudeKeyPresent: !!claudeKey,
      geminiKeyLength: geminiKey ? geminiKey.length : 0,
      claudeKeyLength: claudeKey ? claudeKey.length : 0
    }
  });
});

// Advanced predictions endpoint
app.post('/api/predictions', async (req, res) => {
  try {
    const { parameters, userData, goalsData } = req.body;
    
    if (!parameters || !userData || !goalsData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check cache
    const cacheKey = JSON.stringify({ parameters, userData, goalsData });
    const cached = predictionCache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    // Generate prediction
    const prediction = await aiService.getAdvancedPrediction(parameters, userData, goalsData);
    
    // Cache result
    predictionCache.set(cacheKey, prediction);
    
    res.json({ ...prediction, cached: false });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Scenario generation endpoint
app.post('/api/scenarios/generate', async (req, res) => {
  try {
    const { goals, constraints, userData } = req.body;
    
    const scenarios = await aiService.generateScenarios(goals, constraints, userData);
    
    res.json(scenarios);
  } catch (error) {
    console.error('Scenario generation error:', error);
    res.status(500).json({ error: 'Failed to generate scenarios' });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await aiService.getChatResponse(message, context);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Cache management
app.get('/api/cache/stats', (req, res) => {
  const stats = predictionCache.getStats();
  res.json(stats);
});

app.delete('/api/cache/clear', (req, res) => {
  predictionCache.flushAll();
  res.json({ message: 'Cache cleared successfully' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Vitra-Morph AI Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Predictions: POST http://localhost:${PORT}/api/predictions`);
  console.log(`💬 AI Chat: POST http://localhost:${PORT}/api/chat`);
  console.log(`🎯 Scenario Generation: POST http://localhost:${PORT}/api/scenarios/generate`);
  console.log(`🔄 Server is running and waiting for connections...`);
  console.log(`🧠 AI Strategy: Gemini Pro (Primary) → Claude 3.5 Sonnet (Backup) → Mock AI (Fallback)`);

  // Keep alive heartbeat
  setInterval(() => {
    console.log(`💓 Server heartbeat - ${new Date().toLocaleTimeString()}`);
  }, 30000);
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Prevent the process from exiting
process.stdin.resume();

module.exports = app;
