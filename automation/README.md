# Enterprise Multi-Track QA Automation & CI/CD Framework

This framework provides an enterprise-grade automated testing architecture supporting **4 comprehensive testing workflows** in GitHub Actions with 300 test results generated in multi-sheet Excel reports and HTML artifacts.

---

## 🚀 4 Enterprise Testing Workflows

| # | Track | Technology Stack | Scope | Excel Report Generated | GitHub Actions Workflow |
|---|-------|------------------|-------|------------------------|-------------------------|
| **1** | **React Native Mobile E2E** | Appium 2.x, UiAutomator2, Mocha, Chai, Mochawesome, ExcelJS, Winston | 300 Test Cases across Auth, Forms, Widgets, Gestures, Navigation, AI Explorer | `ReactNative_E2E_Report.xlsx` | [react-native-appium.yml](file:///.github/workflows/react-native-appium.yml) |
| **2** | **React JS Web E2E** | Selenium WebDriver 4.x, Headless Chrome, Mocha, Chai, ExcelJS | 300 Test Cases across Navbar, Marketplace CRUD, Mandi Prices, Predictions, Chat | `React_JS_Web_E2E_Report.xlsx` | [react-js-selenium.yml](file:///.github/workflows/react-js-selenium.yml) |
| **3** | **Load & Stress Testing** | k6 Distributed Engine, Artillery, Node.js | 300 Scenarios (Concurrency, RPS, P95 SLA, Latency, Error Rates) | `Load_Performance_Report.xlsx` | [load-test.yml](file:///.github/workflows/load-test.yml) |
| **4** | **Security & Vulnerability** | SAST, DAST Fuzzing, Bandit, OWASP Top 10, CWE/SANS 25 | 300 Test Vectors (IDOR, SQLi, XSS, Headers, Auth Token Integrity) | `Vulnerability_Security_Report.xlsx` | [vulnerability-test.yml](file:///.github/workflows/vulnerability-test.yml) |

---

## 📱 1. React Native Android Appium 2.x Framework

### Directory Structure
```
automation/mobile/
├── .mocharc.json                   # Mocha & Mochawesome configuration
├── package.json                    # Dependencies (Appium, WebdriverIO, ExcelJS, Winston)
├── src/
│   ├── ai/
│   │   └── AITestExplorer.js       # Smart AI Screen hierarchy analyzer & autonomous test generator
│   ├── config/
│   │   └── config.js               # Capabilities, timeouts, APK paths & environment variables
│   ├── drivers/
│   │   └── DriverFactory.js        # Appium 2.x session initialization, caps & lifecycle teardown
│   ├── pages/
│   │   ├── BasePage.js             # Base Page Object with locator wrappers, waits, failures & logging
│   │   ├── AuthPage.js             # Login, registration, session persistence, validations
│   │   ├── FormPage.js             # Form inputs, email/phone format, pickers, dropdowns, checkboxes
│   │   ├── UIComponentsPage.js     # ElevatedButton, TextButton, Switch, Dialog, BottomSheet, TabBar
│   │   └── NavigationPage.js       # Bottom tabs, drawer, deep links, back button, restart
│   ├── tests/
│   │   ├── auth.spec.js            # Authentication test suite
│   │   ├── forms.spec.js           # Form validation test suite
│   │   ├── uiComponents.spec.js    # UI widget test suite
│   │   ├── gestures.spec.js        # W3C Touch gestures (Scroll, Swipe, Pinch, Zoom, Drag & Drop)
│   │   ├── navigation.spec.js      # Navigation & Deep linking suite
│   │   ├── aiExplorer.spec.js      # AI autonomous exploratory testing suite
│   │   └── e2eRegression300.spec.js# 300-case regression runner
│   └── utils/
│       ├── ExcelReportGenerator.js # 4-sheet Excel report builder (Summary, Test Cases, Failures, Logs)
│       ├── GestureUtils.js         # Tap, Double Tap, Long Press, Scroll, Swipe, Pinch, Zoom
│       ├── Logger.js               # Winston logger with structured file & console transports
│       ├── ReactNativeFinder.js    # React Native locator helpers (byValueKey, byText, bySemanticsLabel)
│       └── generateFull300Report.js# Standalone CLI report generator
└── reports/                        # Output artifacts directory
    ├── ReactNative_E2E_Report.xlsx # 4-sheet Excel report
    ├── mochawesome-report/         # HTML report with charts
    ├── failures/                   # Failure screenshots & XML hierarchy dumps
    ├── screenshots/                # Step screenshots
    └── logs/                       # Appium execution logs
```

### 📊 Excel Report Architecture (4 Mandatory Sheets)
1. **Summary Sheet**: Execution Date, Device Name, Android Version, Total Tests (300), Passed, Failed, Skipped, Pass Percentage, Total Duration.
2. **Test Cases Sheet**: Test ID (`RN-AUTH-001`), Module, Scenario, Status (PASS/FAIL/SKIP badges), Device, Duration.
3. **Failed Tests Sheet**: Test Name, Failure Reason, Screenshot Path, Device, Android Version.
4. **Execution Logs Sheet**: Timestamp, Test Name, Step, Result, Remarks.

---

## 🤖 Smart AI Testing Capability
The framework includes an autonomous **`AITestExplorer`** engine that:
- Introspects the runtime XML / React Native widget tree.
- Identifies clickable, scrollable, and input fields without hardcoded locators.
- Injects edge-case fuzzing payloads (SQLi, Unicode, boundary values, empty whitespace).
- Auto-generates navigation paths and expands test coverage dynamically.

---

## ⚙️ GitHub Actions CI/CD Integration

All 4 workflows trigger on `push`, `pull_request`, and `workflow_dispatch`.

- **`.github/workflows/react-native-appium.yml`**: Boots Android Emulator (`pixel_5`, API 30), installs APK, starts Appium 2.x server, executes Mocha tests, outputs Mochawesome HTML & 4-sheet Excel report, and uploads all reports as GitHub Artifacts.
- **`.github/workflows/react-js-selenium.yml`**: Runs Headless Chrome Selenium web tests against the React frontend and generates `React_JS_Web_E2E_Report.xlsx`.
- **`.github/workflows/load-test.yml`**: Executes distributed k6 load testing against backend endpoints and publishes `Load_Performance_Report.xlsx`.
- **`.github/workflows/vulnerability-test.yml`**: Conducts DAST/SAST AppSec audits and generates `Vulnerability_Security_Report.xlsx`.
- **`.github/workflows/all-tests.yml`**: Unified 4-in-1 test suite orchestrating all 4 testing tracks.
