package com.farmconnect.automation.listeners;

import com.farmconnect.automation.utils.*;
import org.testng.*;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * TestListener - Core TestNG listener that tracks all test results
 * and triggers report generation after suite completion.
 */
public class TestListener implements ITestListener, ISuiteListener {

    private static final LogUtils log = LogUtils.getInstance();
    private static final List<Map<String, String>> testResults = new CopyOnWriteArrayList<>();
    private static long suiteStartTime;

    // Test ID counter per module
    private static final Map<String, Integer> moduleCounters = new HashMap<>();

    @Override
    public void onStart(ISuite suite) {
        suiteStartTime = System.currentTimeMillis();
        log.info("Suite started: " + suite.getName());
    }

    @Override
    public void onTestStart(ITestResult result) {
        log.info("▶ Starting: " + result.getMethod().getMethodName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log.info("✅ PASSED: " + result.getMethod().getMethodName());
        recordResult(result, "PASS", "");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        String reason = result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown failure";
        log.error("❌ FAILED: " + result.getMethod().getMethodName() + " | Reason: " + reason);
        recordResult(result, "FAIL", reason);
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        String reason = result.getThrowable() != null ? result.getThrowable().getMessage() : "Skipped";
        log.warn("⏭️ SKIPPED: " + result.getMethod().getMethodName());
        recordResult(result, "SKIP", reason);
    }

    @Override
    public void onFinish(ISuite suite) {
        long duration = System.currentTimeMillis() - suiteStartTime;
        log.info("Suite finished: " + suite.getName() + " | Duration: " + duration + "ms");

        // Generate all reports
        try {
            String excelDir = "test-output/reports/Excel";
            String htmlDir = "test-output/reports/HTML";
            String jsonDir = "test-output/reports/JSON";
            String summaryDir = "test-output/reports/Summary";

            ExcelReportGenerator.generateReports(testResults, excelDir);
            HtmlReportGenerator.generateReports(testResults, htmlDir);
            JsonReportGenerator.generateJsonReport(testResults, jsonDir + "/execution-results.json");
            JsonReportGenerator.generateMarkdownSummary(testResults, summaryDir + "/summary.md");

            log.info("All reports generated successfully");
        } catch (Exception e) {
            log.error("Failed to generate reports: " + e.getMessage());
        }
    }

    private void recordResult(ITestResult result, String status, String failureReason) {
        long executionTime = result.getEndMillis() - result.getStartMillis();
        String className = result.getTestClass().getRealClass().getSimpleName();
        String module = extractModule(className);
        String testId = generateTestId(module);

        Map<String, String> testData = new LinkedHashMap<>();
        testData.put("testId", testId);
        testData.put("module", module);
        testData.put("testName", result.getMethod().getMethodName());
        testData.put("className", className);
        testData.put("priority", String.valueOf(result.getMethod().getPriority()));
        testData.put("status", status);
        testData.put("executionTime", String.valueOf(executionTime));
        testData.put("failureReason", failureReason != null ? failureReason : "");

        testResults.add(testData);
    }

    private String extractModule(String className) {
        if (className.contains("Login")) return "Authentication";
        if (className.contains("Authorization")) return "Authorization";
        if (className.contains("Registration")) return "Registration";
        if (className.contains("Profile")) return "Profile Management";
        if (className.contains("Navigation")) return "Navigation";
        if (className.contains("Dashboard")) return "Dashboard";
        if (className.contains("Form")) return "Forms";
        if (className.contains("Crud")) return "CRUD Operations";
        if (className.contains("Search")) return "Search";
        if (className.contains("Filter")) return "Filters";
        if (className.contains("Validation") || className.contains("InputValidation")) return "Input Validation";
        if (className.contains("Error")) return "Error Handling";
        if (className.contains("Session")) return "Session Management";
        if (className.contains("Notification")) return "Notifications";
        if (className.contains("FileUpload") || className.contains("Upload")) return "File Upload";
        if (className.contains("Offline")) return "Offline Handling";
        if (className.contains("Accessibility")) return "Accessibility";
        if (className.contains("Responsive")) return "Responsive UI";
        if (className.contains("Performance")) return "Performance";
        if (className.contains("Regression")) return "Regression";
        return "General";
    }

    private String generateTestId(String module) {
        String prefix = getModulePrefix(module);
        int count = moduleCounters.getOrDefault(prefix, 0) + 1;
        moduleCounters.put(prefix, count);
        return prefix + "_" + String.format("%03d", count);
    }

    private String getModulePrefix(String module) {
        switch (module) {
            case "Authentication": return "TC_AUTH";
            case "Authorization": return "TC_AUTHZ";
            case "Registration": return "TC_REG";
            case "Profile Management": return "TC_PROF";
            case "Navigation": return "TC_NAV";
            case "Dashboard": return "TC_DASH";
            case "Forms": return "TC_FORM";
            case "CRUD Operations": return "TC_CRUD";
            case "Search": return "TC_SRCH";
            case "Filters": return "TC_FLTR";
            case "Input Validation": return "TC_IVAL";
            case "Error Handling": return "TC_ERRH";
            case "Session Management": return "TC_SESS";
            case "Notifications": return "TC_NOTF";
            case "File Upload": return "TC_FILE";
            case "Offline Handling": return "TC_OFFL";
            case "Accessibility": return "TC_ACCS";
            case "Responsive UI": return "TC_RESP";
            case "Performance": return "TC_PERF";
            case "Regression": return "TC_REGR";
            default: return "TC_GEN";
        }
    }

    public static List<Map<String, String>> getTestResults() {
        return Collections.unmodifiableList(testResults);
    }
}
