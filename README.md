# Vitra Horizon

## Overview:
AI-powered body composition prediction prototype for Vitra, an AI powered personal health platform.

### Key Innovations:
- Instead of tracking what happened yesterday, Vitra Horizon predicts what will happen tomorrow.
- Forecasts how factors suchh as diet and exercise changes will affect your body over a specific time span.
- Users can test "what-if" scenarios before making lifestyle changes to see how their body composition will change over time.

## Auidences:
- Primary Auidence: Busy professionals who want to maximize their limited workout time
- Secondary Auidence: Fitness enthusiasts who are stuck at plateaus and need data-driven insights to progress
- Tetiary Auidence: People maintaining fitness during life changes like travel or schedule disruptions

## Project Structure (basic for now):

```

## Data Management

### Clearing All User Data

For development and testing purposes, you can completely reset the app to a fresh state:

#### Method 1: Using the App (Recommended)
1. Open the app and navigate to the **Profile** tab
2. Scroll down to the "Development Tools" section
3. Tap the **"🗑️ Reset All Data (DEV)"** button
4. Confirm the reset when prompted

#### Method 2: Using npm script
```bash
npm run clear-data
```

#### Method 3: Manual clearing
The app stores data in AsyncStorage with these keys:
- `@userData` - User profile information
- `@goalsData` - Goals and targets
- `@scenarios` - All scenarios
- `@activePlanId` - Active plan ID
- `@viewMode` - View mode preference

### What Gets Cleared
- ✅ All user profile data (weight, height, body fat, etc.)
- ✅ All goals and targets
- ✅ All scenarios (except the default onboarding scenario)
- ✅ All preferences and settings
- ✅ All progress data

After clearing data, the app will return to the onboarding flow on next launch.

## Links:
- **[Figma Mockups](https://www.figma.com/design/m75ytxkGcBzSDBOngFZ0uC/Vitra-Horizon?node-id=1-4&t=9V0KiCRKbNrztMy4-1)**
- **[Techinical Report](https://docs.google.com/document/d/1gc_whwEjgLRRhWGw94-B7K5gxQ05bhFJIEZ8JGbwvCs/edit?usp=sharing)** PRIVATE FOR NOW

## Tech Stack:
- **Frontend:** React Native

the below are outlined in the techincal report
- **Backend:** Node.js, Express
- **Database:** PostgresSQL
- **API:** Apple HealthKit, 
- **ML:** TensorFlow.js, regression models