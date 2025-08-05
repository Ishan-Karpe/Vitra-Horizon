# 🚀 Complete Step-by-Step Instructions to Run Vitra-Morph with AI Backend

## 📋 Prerequisites

### Required Software
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Git** (for cloning if needed)
4. **Expo CLI** (will be installed automatically)

### Optional for Mobile Testing
- **Expo Go app** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Android Studio** (for Android emulator)
- **Xcode** (for iOS simulator - Mac only)

## 🎯 AI Configuration (Gemini Primary + Claude Backup)

The app is now configured to use **Gemini Pro as primary** with **Claude 3.5 Sonnet as backup**:

### AI Strategy Priority:
1. **🥇 Gemini Pro** (Primary) - For predictions and chat
2. **🥈 Claude 3.5 Sonnet** (Backup) - If Gemini fails
3. **🥉 Mock AI** (Fallback) - If both APIs fail

### API Keys (Already Configured)
The `.env` file already contains your API keys:


## 🛠️ Step-by-Step Setup

### Step 1: Navigate to Project Directory
```bash
cd /home/ishan/Vitra-Morph
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the AI Backend Server (Port 8087)
```bash
# Open a new terminal window/tab
node ai-backend-server.js
```

**Expected Output:**
```
🚀 Vitra-Morph AI Backend Server running on http://localhost:8087
📊 Health check: http://localhost:8087/api/health
🤖 AI Predictions: POST http://localhost:8087/api/predictions
💬 AI Chat: POST http://localhost:8087/api/chat
🎯 Scenario Generation: POST http://localhost:8087/api/scenarios/generate
🔄 Server is running and waiting for connections...
🧠 AI Strategy: Gemini Pro (Primary) → Claude 3.5 Sonnet (Backup) → Mock AI (Fallback)
💓 Server heartbeat - [timestamp]
```

### Step 4: Start the Frontend Server (Port 8088)
```bash
# Open another new terminal window/tab
npx expo start --port 8088
```

**Expected Output:**
```
Starting project at /home/ishan/Vitra-Morph
Starting Metro Bundler

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▀▀ ████  █ ▄▄▄▄▄ █
█ █   █ █▄▀██▀█▄  █ █   █ █
█ █▄▄▄█ █ ▄ █  █ ██ █▄▄▄█ █
█▄▄▄▄▄▄▄█ █ ▀▄█ █▄█▄▄▄▄▄▄▄█

› Metro waiting on exp://192.168.x.x:8088
› Web is waiting on http://localhost:8088
```

### Step 5: Verify Both Servers Are Running
```bash
# Test backend health (in a third terminal)
curl http://localhost:8087/api/health

# Expected response:
{
  "status": "healthy",
  "aiStrategy": "gemini-primary-claude-backup",
  "services": {
    "gemini-pro": "configured",
    "claude-3.5-sonnet": "configured",
    "mock-ai": "available"
  },
  "priority": ["gemini-pro", "claude-3.5-sonnet", "mock-ai"]
}
```

## 🌐 Access the Application

### Option 1: Web Browser (Recommended for Testing)
1. Open your browser
2. Go to: **http://localhost:8088**
3. The app will load in your browser

### Option 2: Mobile Device (Expo Go)
1. Install Expo Go app on your phone
2. Scan the QR code displayed in the terminal
3. The app will open in Expo Go

### Option 3: Emulator/Simulator
```bash
# For Android emulator
npx expo start --android

# For iOS simulator (Mac only)
npx expo start --ios
```

## 🧪 Testing AI Features

### 1. Access AI Demo Interface
1. Open the app (web or mobile)
2. Navigate to **Dashboard** tab
3. Look for **"🤖 AI Backend Demo"** card
4. Click/tap to access the full AI testing interface

### 2. Test AI Predictions
- Click **"Test Prediction API"** button
- Observe enhanced predictions with:
  - Confidence intervals
  - Success probability
  - Plateau predictions
  - Metabolic adaptation info

### 3. Test AI Chat
- Type questions like:
  - "What if I can only workout 3 times per week?"
  - "How can I avoid plateaus?"
  - "I'm not seeing results, what should I change?"
- Observe intelligent responses from Gemini/Claude

### 4. Test AI Mode Switching
- Switch between modes:
  - **AI-Enhanced**: Uses Gemini → Claude → Mock fallback
  - **AI-Only**: Only uses AI (fails if APIs unavailable)
  - **Offline**: Uses simple math calculations

## 🔍 Monitoring & Debugging

### Check Server Status
```bash
# Backend health check
curl http://localhost:8087/api/health

# Cache statistics
curl http://localhost:8087/api/cache/stats

# Clear cache if needed
curl -X DELETE http://localhost:8087/api/cache/clear
```

### View Server Logs
- **Backend logs**: Check the terminal running `node ai-backend-server.js`
- **Frontend logs**: Check the terminal running `npx expo start`
- **Browser console**: Open DevTools in your browser (F12)

### Common Issues & Solutions

#### Backend Not Starting
```bash
# Check if port 8087 is in use
lsof -i :8087

# Kill any process using the port
kill -9 <PID>

# Restart backend
node ai-backend-server.js
```

#### Frontend Not Starting
```bash
# Check if port 8088 is in use
lsof -i :8088

# Use different port
npx expo start --port 8089
```

#### AI Not Responding
1. Check API keys in `.env` file
2. Verify internet connection
3. Check server logs for error messages
4. Test with offline mode

## 📱 App Navigation Guide

### Main Flow
1. **Welcome Screen** → **About Yourself** → **Goals** → **Scenario** → **Prediction** → **Dashboard**

### Main App Tabs
- **Dashboard**: Daily plan, progress circle, AI demo access
- **Progress**: Weight/body fat graphs, measurements, time filtering
- **Scenarios**: Create, edit, compare scenarios with AI predictions
- **Profile**: User settings, data management, logout

### AI-Enhanced Features
- **Smart Predictions**: Enhanced accuracy with confidence intervals
- **Conversational Help**: Ask questions and get personalized advice
- **Scenario Optimization**: AI-generated optimal workout/diet plans
- **Progress Analysis**: Intelligent insights and plateau predictions

## 🎯 Key Features to Test

### 1. Enhanced Predictions
- Create scenarios and observe AI-enhanced predictions
- Compare simple vs AI predictions
- Test different parameter combinations

### 2. Conversational AI
- Ask fitness questions in natural language
- Test context awareness
- Try troubleshooting scenarios

### 3. Offline Capability
- Disconnect internet/stop backend
- Verify app continues working with cached data
- Test graceful fallback to simple calculations

### 4. Real-time Status
- Observe connection status indicators
- Test automatic reconnection when backend restarts
- Monitor cache hit/miss behavior

## 🔄 Stopping the Application

### Stop Servers
1. **Backend**: Press `Ctrl+C` in the backend terminal
2. **Frontend**: Press `Ctrl+C` in the frontend terminal

### Clean Shutdown
```bash
# Kill all Expo processes
npx expo stop

# Kill backend if needed
pkill -f "node ai-backend-server.js"
```

## 🎉 Success Indicators

✅ **Backend running** on http://localhost:8087  
✅ **Frontend running** on http://localhost:8088  
✅ **AI health check** returns "healthy" status  
✅ **Gemini-first strategy** active  
✅ **Web interface** loads successfully  
✅ **AI demo** accessible from dashboard  
✅ **Predictions** show enhanced data  
✅ **Chat** responds intelligently  

**You're now ready to explore the AI-enhanced Vitra-Morph app! 🚀**
