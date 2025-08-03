# Scenario Persistence Testing Guide

## Test Cases to Verify

### 1. Scenario Creation from Onboarding
**Steps:**
1. Navigate to the onboarding scenarios page (`/scenarios`)
2. Adjust the parameters (exercise frequency, calorie deficit, protein intake)
3. Click "Save This Scenario"
4. Verify navigation to scenarios tab
5. Check that the new scenario appears in the scenarios list

**Expected Result:**
- New scenario should be created with proper name (e.g., "Scenario #2")
- Scenario should appear in the main scenarios tab
- Data should persist after app refresh

### 2. Scenario Editing
**Steps:**
1. Go to scenarios tab
2. Click "Edit Scenario" on any scenario card
3. Modify the scenario name and parameters
4. Click "Save"
5. Return to scenarios list
6. Verify changes are reflected

**Expected Result:**
- Scenario should be updated with new values
- Changes should persist after app refresh
- Original properties (isFromOnboarding, isFavorite) should be preserved

### 3. Data Persistence
**Steps:**
1. Create/edit scenarios
2. Refresh the browser/restart the app
3. Check if scenarios are still present

**Expected Result:**
- All scenarios should persist across app restarts
- Active plan should be maintained
- View mode should be preserved

## Fixed Issues

### ✅ Multiple ScenariosProvider Instances
- Removed duplicate providers from tabs
- All components now use the same context instance

### ✅ Data Persistence
- Added AsyncStorage for persistent storage
- Scenarios, active plan, and view mode are saved
- Data loads on app startup

### ✅ Scenario Creation Flow
- Fixed scenario name generation
- Proper navigation to scenarios tab after saving
- Scenarios marked correctly as non-onboarding

### ✅ Scenario Editing Flow
- Preserves original scenario properties during edits
- Only updates necessary fields
- Proper feedback to user

## Technical Implementation

### Storage Keys
- `@scenarios`: Array of all scenarios
- `@activePlanId`: ID of the currently active plan
- `@viewMode`: Current view mode (single/compare)

### Context Structure
- Single ScenariosProvider in root layout
- All tabs and pages use the same context
- Automatic persistence on state changes
