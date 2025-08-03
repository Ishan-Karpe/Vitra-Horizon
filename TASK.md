# Tasks

## To Do - Scenarios Screen Implementation (2025-08-02)
- [ ] Create scenarios screen structure with NativeWind (2025-08-02)
  - [ ] Update `app/(tabs)/scenarios.tsx` from placeholder to full implementation
  - [ ] Set up scenarios state management with context for saved scenarios
  - [ ] Create scenarios data structure for storing multiple scenarios
  - [ ] Implement scenario loading from onboarding and user-created scenarios
  - [ ] Add floating action button (FAB) for creating new scenarios
- [ ] Build scenarios header with NativeWind styling (2025-08-02)
  - [ ] Add "Scenario Testing" title using `text-2xl font-bold text-gray-900 px-6 py-4`
  - [ ] Create Single/Compare toggle with `bg-gray-100 rounded-full p-1 flex-row`
  - [ ] Style active toggle state with `bg-blue-500 text-white px-4 py-2 rounded-full`
  - [ ] Style inactive toggle state with `text-gray-600 px-4 py-2`
  - [ ] Add toggle animation with smooth transitions
- [ ] Create scenario card component with NativeWind (2025-08-02)
  - [ ] Build scenario container with `bg-white rounded-xl shadow-sm mx-6 mb-4 p-6 border border-gray-200`
  - [ ] Add scenario header with `flex-row justify-between items-center mb-4`
  - [ ] Style scenario title with `text-lg font-semibold text-gray-900`
  - [ ] Add creation date with `text-sm text-gray-500`
  - [ ] Include confidence badge with `bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium`
- [ ] Implement scenario parameters display (2025-08-02)
  - [ ] Create parameter row with `flex-row flex-wrap gap-3 mb-4`
  - [ ] Build exercise frequency tag with `bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm` (⚡ 4 x/week)
  - [ ] Add calorie deficit tag with `bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm` (🔥 300 cals/day)
  - [ ] Include protein tag with `bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm` (🥩 High protein)
  - [ ] Style parameter icons with proper emoji display
- [ ] Build current vs target comparison (2025-08-02)
  - [ ] Create comparison container with `flex-row justify-between mb-6`
  - [ ] Style "Current" section with `flex-1 text-center`
  - [ ] Add current body fat display with `text-3xl font-bold text-gray-600` (25%)
  - [ ] Style "After 12 weeks" section with `flex-1 text-center`
  - [ ] Add target body fat display with `text-3xl font-bold text-blue-600` (21%)
  - [ ] Include "body fat" labels with `text-sm text-gray-500`
- [ ] Create scenario progress graph (2025-08-02)
  - [ ] Build graph container with `bg-gray-50 rounded-lg p-4 mb-4 h-32`
  - [ ] Implement line graph showing body fat progression over 12 weeks
  - [ ] Use blue gradient fill under the curve
  - [ ] Add data points for key milestones
  - [ ] Include interactive touch gestures for detailed view
  - [ ] Style graph axes and grid lines appropriately
- [ ] Add scenario metrics display (2025-08-02)
  - [ ] Create metrics row with `flex-row justify-between mb-4`
  - [ ] Build fat loss metric with `flex-row items-center` (📉 Fat loss: 8 lbs)
  - [ ] Add muscle gain metric with `flex-row items-center` (💪 Muscle gain: 2 lbs)
  - [ ] Include timeline metric with `text-sm text-gray-600` (⏱️ Timeline: 12 weeks)
  - [ ] Style metrics with appropriate colors and spacing
- [ ] Implement scenario action buttons (2025-08-02)
  - [ ] Create button container with `flex-row gap-3 mt-6`
  - [ ] Build "Edit Scenario" button with `flex-1 border border-blue-500 rounded-lg py-3`
  - [ ] Style edit button text with `text-blue-500 text-center font-medium`
  - [ ] Add "Set as Plan" button with `flex-1 bg-green-500 rounded-lg py-3`
  - [ ] Style set plan button text with `text-white text-center font-medium`
  - [ ] Include button press animations and haptic feedback
- [ ] Create scenario data management (2025-08-02)
  - [ ] Build scenario storage system for onboarding scenarios
  - [ ] Implement scenario saving from What If Onboarding screen
  - [ ] Create user-generated scenario storage
  - [ ] Add scenario ID system for tracking and management
  - [ ] Implement scenario metadata (creation date, confidence, parameters)
  - [ ] Add scenario persistence across app sessions
- [ ] Build floating action button (FAB) for new scenarios (2025-08-02)
  - [ ] Create FAB with `absolute bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full`
  - [ ] Add plus icon with `text-white text-2xl text-center`
  - [ ] Include FAB shadow with `shadow-lg elevation-8`
  - [ ] Implement FAB press animation and haptic feedback
  - [ ] Add navigation to separate edit scenarios screen
- [ ] Create separate edit scenarios screen for main app (2025-08-02)
  - [ ] Add `app/edit-scenario.tsx` screen (different from onboarding)
  - [ ] Implement navigation from FAB to edit scenario screen
  - [ ] Build similar interface to onboarding What If screen but as standalone
  - [ ] Add back navigation to scenarios screen
  - [ ] Include scenario saving functionality to main scenarios list
  - [ ] Add scenario naming and tagging features
- [ ] Implement Single/Compare toggle functionality (2025-08-02)
  - [ ] Build single scenario view (default state)
  - [ ] Create compare mode showing multiple scenarios side-by-side
  - [ ] Add scenario selection for comparison
  - [ ] Implement comparison visualization with differences highlighted
  - [ ] Add smooth transitions between single and compare modes
  - [ ] Include comparison analytics and insights
- [ ] Build scenario card interactions (2025-08-02)
  - [ ] Add tap gesture for scenario details expansion
  - [ ] Implement swipe gestures for scenario management (delete, duplicate)
  - [ ] Create long press context menu for scenario options
  - [ ] Add scenario card animation on press
  - [ ] Include scenario favoriting/bookmarking system
- [ ] Create "Edit Scenario" functionality (2025-08-02)
  - [ ] Navigate to edit scenario screen with pre-filled data
  - [ ] Load existing scenario parameters into edit interface
  - [ ] Implement scenario update functionality
  - [ ] Add save confirmation and feedback
  - [ ] Handle scenario version tracking for changes
- [ ] Implement "Set as Plan" functionality (2025-08-02)
  - [ ] Apply selected scenario to user's active dashboard plan
  - [ ] Update dashboard with new scenario parameters
  - [ ] Show confirmation dialog with plan change summary
  - [ ] Add plan activation animation and feedback
  - [ ] Navigate back to dashboard with new active plan
  - [ ] Update progress tracking with new baseline
- [ ] Add scenario filtering and search (2025-08-02)
  - [ ] Create search bar for scenario filtering
  - [ ] Add filter options (by date, confidence, goal type)
  - [ ] Implement sorting options (newest, oldest, highest confidence)
  - [ ] Add scenario tagging system for organization
  - [ ] Create scenario categories (onboarding, user-created, favorites)
- [ ] Build scenario comparison view (2025-08-02)
  - [ ] Create side-by-side scenario comparison layout
  - [ ] Add difference highlighting between scenarios
  - [ ] Implement comparison metrics and analytics
  - [ ] Show relative performance predictions
  - [ ] Add comparison export and sharing functionality
- [ ] Create scenario management features (2025-08-02)
  - [ ] Add scenario deletion with confirmation
  - [ ] Implement scenario duplication functionality
  - [ ] Create scenario sharing capabilities
  - [ ] Add scenario export to different formats
  - [ ] Implement scenario backup and restore
- [ ] Add scenario analytics and insights (2025-08-02)
  - [ ] Calculate scenario confidence scores based on user data
  - [ ] Generate scenario recommendations
  - [ ] Add scenario performance predictions
  - [ ] Create scenario difficulty assessments
  - [ ] Implement scenario success probability calculations
- [ ] Implement responsive design with NativeWind (2025-08-02)
  - [ ] Ensure scenario cards work on different screen sizes
  - [ ] Test FAB positioning across devices with `bottom-20 md:bottom-24`
  - [ ] Add proper safe area handling with `pb-safe`
  - [ ] Implement landscape orientation support
  - [ ] Test scrolling performance with many scenarios
- [ ] Create reusable components with NativeWind (2025-08-02)
  - [ ] Scenario card component with all interactions
  - [ ] Scenario parameter tag component
  - [ ] Progress graph component for scenarios
  - [ ] Scenario comparison component
  - [ ] FAB component with navigation
  - [ ] Single/Compare toggle component
- [ ] Add accessibility features with NativeWind (2025-08-02)
  - [ ] Add screen reader descriptions for scenario cards
  - [ ] Implement proper button accessibility for all interactions
  - [ ] Add keyboard navigation support for scenario management
  - [ ] Test with VoiceOver and TalkBack
  - [ ] Include proper focus management for modals and navigation
- [ ] Implement performance optimizations (2025-08-02)
  - [ ] Add virtualization for large scenario lists
  - [ ] Optimize scenario loading and rendering
  - [ ] Implement efficient scenario data caching
  - [ ] Add lazy loading for scenario graphs
  - [ ] Test performance with many saved scenarios
- [ ] Add advanced scenario features (2025-08-02)
  - [ ] Implement scenario version history
  - [ ] Add scenario collaboration and sharing
  - [ ] Create scenario templates and presets
  - [ ] Add scenario goal tracking and outcomes
  - [ ] Implement machine learning for scenario recommendations

## In Progress
- [ ] Scenarios screen implementation (2025-08-02)

## Completed
- [x] Welcome screen implementation (2025-08-01)
- [x] About Yourself screen planning (2025-08-01)
- [x] Goals screen implementation (2025-08-01)
- [x] What If Scenarios screen implementation (2025-08-02)
- [x] Dashboard screen implementation (2025-08-02)
- [x] Progress screen implementation (2025-08-02)

## Discovered During Work

### Scenarios Screen Details (2025-08-02)
- Main app scenarios management with saved scenarios from onboarding
- Single/Compare toggle for viewing scenarios individually or side-by-side
- Detailed scenario cards with parameters, graphs, and action buttons
- FAB for creating new scenarios via separate edit screen
- Scenario management with edit, set as plan, and comparison features
- Consistent card format for all scenarios (onboarding + user-created)

### Screen Interactions Breakdown:
1. **Edit Scenario**: Tap to navigate to dedicated edit screen and modify parameters
2. **Graph**: Tap to show detailed weekly forecast and progression
3. **Set as Plan**: Tap to apply scenario to dashboard and activate as current plan
4. **Single/Compare Toggle**: Switch between individual and comparison views
5. **FAB**: Navigate to new edit scenarios screen for creating additional scenarios

### Scenario Card Format:
- **Header**: Scenario name, creation date, confidence badge
- **Parameters**: Exercise frequency, calorie deficit, protein intake tags
- **Comparison**: Current vs target body fat percentage
- **Graph**: 12-week progression visualization with gradient fill
- **Metrics**: Fat loss, muscle gain, timeline with icons
- **Actions**: Edit Scenario (outline) and Set as Plan (filled) buttons

### Navigation Structure:
- **Onboarding**: What If Scenarios → Dashboard (saves scenario to main app)
- **Main App**: Scenarios tab → FAB → Edit Scenario screen → Back to Scenarios
- **Scenario Actions**: Edit → Edit Scenario screen, Set as Plan → Dashboard activation

### Progress Screen Details (2025-08-02)
- Comprehensive progress tracking with interactive graphs
- Time period filtering (Week/Month/3M/6M) with smooth transitions
- Weight and body fat percentage trend visualization
- Detailed measurements tracking with change indicators
- Goal progress visualization with completion percentages
- Expandable graph views for detailed analysis

### Dashboard Screen Details (2025-08-02)
- Central hub showing daily plan progress and actions
- Interactive progress circle with detailed weekly view
- Checkboxes for action completion with real-time updates
- Bottom tab navigation for main app sections
- Dynamic status tracking and prediction updates
- NativeWind styling throughout for consistent design

### What If Scenarios Screen Details (2025-08-02)
- Real-time prediction updates with every parameter change
- Side-by-side comparison of current vs new plan
- Interactive sliders and selectors for plan adjustment
- Instant visual feedback on prediction changes
- Scenario saving and management functionality
- Parameter validation with realistic constraints

### App Flow Analysis (2025-08-01)

Based on the mockups in `assets/mockups/`, the Vitra-Morph app appears to be a body transformation prediction application with the following screens and user journey:

#### Screen Breakdown:
1. **Welcome.png** - Welcome/onboarding screen for first-time users
2. **AboutYourself.png** - User profile setup (height, weight, age, fitness level input)
3. **Goals.png** - Goal-setting screen for fitness objectives (weight loss, muscle gain, etc.)
4. **EditScenarios.png** - Interactive scenario planning and comparison (ONBOARDING)
5. **Dashboard.png** - Main dashboard/home screen with daily progress and actions
6. **Progress.png** - Comprehensive progress tracking with graphs and measurements
7. **Scenarios.png** - Main app scenario management and viewing (MAIN APP)
8. **Profile.png** - User profile management for viewing/editing personal information
9. **Prediction.png** - Detailed prediction results and analysis

#### User Journey Flow:
1. **Onboarding Flow**: Welcome → About Yourself → Goals → Edit Scenarios → Dashboard
2. **Main App**: Dashboard (home) ← → Progress ← → Scenarios ← → Profile
3. **Scenario Management**: Scenarios → FAB → Edit Scenario screen → Back to Scenarios
4. **Core Features**: 
   - Dashboard (daily tracking and progress)
   - Progress (achievement tracking and analytics with graphs)
   - Scenarios (saved scenario management, comparison, and editing)
   - Profile (account and preferences management)

#### App Purpose:
Comprehensive fitness app using predictive modeling to show users potential body changes based on different workout scenarios and personal data inputs, with detailed progress tracking, scenario management, and actionable insights.
