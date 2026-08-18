# Synchronize Android App with Web Dashboard

This plan aims to implement all features visible in the web dashboard screenshot into the Android application.

## User Review Required

> [!IMPORTANT]
> The current Android app is a skeleton. We will be adding multiple new screens and a complex Dashboard. This will significantly increase the app's complexity.
> We will use a **Bottom Navigation Bar** or a **Navigation Drawer** to accommodate the many sections (AI Prediction, Market Prices, Weather, etc.).

## Proposed Changes

### UI & Navigation
- **[MODIFY] [activity_main.xml](file:///C:/farm app/android-app/app/src/main/res/layout/activity_main.xml)**: Redesign to be a "Dashboard" with a Hero section, status cards, and a summary price table.
- **[NEW] [fragment_dashboard.xml](file:///C:/farm app/android-app/app/src/main/res/layout/fragment_dashboard.xml)**: Detailed dashboard layout.
- **[NEW] [fragment_ai_prediction.xml](file:///C:/farm app/android-app/app/src/main/res/layout/fragment_ai_prediction.xml)**: UI for AI price predictions.
- **[NEW] [fragment_market_prices.xml](file:///C:/farm app/android-app/app/src/main/res/layout/fragment_market_prices.xml)**: Detailed market price tables.
- **[MODIFY] [MainActivity.kt](file:///C:/farm app/android-app/app/src/main/java/com/farmconnect/ai/ui/main/MainActivity.kt)**: Update to handle Fragment navigation and Dashboard logic.

### Components
- **Hero Section**: Large green banner with "Smart Farming Starts Here".
- **Status Cards**: Horizontal scroll or grid for "Top Gainer", "Price Alerts", etc.
- **Price Overview Table**: RecyclerView-based table for quick price checks.
- **Bottom Navigation**: Tabs for Dashboard, AI, Market, and Profile.

## Verification Plan

### Automated Tests
- Build the project using `gradlew assembleDebug` to ensure all new resources are linked correctly.

### Manual Verification
- Deploy to emulator and verify the Dashboard layout matches the visual style of the web dashboard.
- Test navigation between different sections.
