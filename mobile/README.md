# FarmConnect AI - React Native Mobile Application 📱

A native React Native & Expo mobile application built for Indian farmers, buyers, and traders with 100% feature parity, sharing the same FastAPI backend and MongoDB database.

---

## 🌟 Key Features

1. **🌐 9 Indian Regional Languages**:
   - English, हिन्दी (Hindi), తెలుగు (Telugu), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), मराठी (Marathi), বাংলা (Bengali), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi).
   - Full translation of UI and agricultural commodity names.

2. **🤖 15-Day AI Price Prediction Engine**:
   - Historical APMC mandi trends, machine-learning projections, strategic advisory (BUY/HOLD/SELL), confidence meters, and price benchmarks.

3. **🌾 Farm-to-Fork Digital Marketplace**:
   - Direct produce listings with photos, quality grades, and verified farmer review scores.
   - **Direct Farmer Connect**: Immediate contact disclosure (+91 phone line) upon ordering with instant click-to-call.
   - **Self-Order Restriction**: Prevents farmers from purchasing their own listed harvest.

4. **📦 Order Management & Mutual Ratings**:
   - Order tracking with financial summary (active in-transit value & settled income).
   - Direct click-to-dial `📞 Call Farmer Directly` buttons (`tel:` deep links).
   - 5-Star mutual feedback with tags.

5. **🌤️ Agricultural Weather Intelligence**:
   - Hyperlocal live temperature, humidity, wind, rainfall risks, 7-day agronomic forecasts, and precision spray advisories.

6. **📊 Crop Analytics & State Intelligence**:
   - Farmer vs Buyer perspective toggle.
   - State-wise APMC price spread and disparity matrices across India.

---

## 🚀 How to Run the Mobile App

### 1. Ensure Backend is Running
Make sure the FastAPI backend is running on port 8000:
```bash
python -m uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000
```

### 2. Start the Mobile App with Expo
Navigate to the `mobile` directory and run:
```bash
cd "c:\farm app\mobile"
npx expo start
```

### 3. Open on Android Device / Emulator
- **Physical Phone**: Install the **Expo Go** app from Google Play Store or Apple App Store and scan the QR code displayed in the terminal.
- **Android Emulator**: Press `a` in the terminal to launch on the connected Android emulator.
- **Web Preview**: Press `w` to preview the mobile layout in the browser.

---

## 📂 Project Architecture

```
mobile/
├── package.json
├── app.json
├── App.js                   # Root Component, Navigation & Tab Bar
└── src/
    ├── api/
    │   └── client.js        # Axios API client (handles 10.0.2.2 & LAN IP)
    ├── context/
    │   ├── AuthContext.js   # User Login/Register & Role state
    │   └── LanguageContext.js # 9-Language i18n & Crop translation hook
    ├── i18n/
    │   └── translations.js  # Multilingual dictionary
    ├── data/
    │   └── commodities.js   # Crop and APMC Mandi database
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── DashboardScreen.js
    │   ├── PredictionScreen.js
    │   ├── MarketPricesScreen.js
    │   ├── MarketplaceScreen.js
    │   ├── OrdersScreen.js
    │   ├── WeatherScreen.js
    │   └── AnalyticsScreen.js
    ├── components/
    │   ├── Header.js
    │   ├── LanguageModal.js
    │   ├── Sparkline.js
    │   ├── RatingModal.js
    │   └── OrderDetailModal.js
    └── theme/
        └── colors.js
```
