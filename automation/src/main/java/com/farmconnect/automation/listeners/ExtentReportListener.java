package com.farmconnect.automation.listeners;

import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.farmconnect.automation.utils.LogUtils;
import org.testng.*;

import java.util.HashMap;
import java.util.Map;

/**
 * ExtentReportListener - Integrates with ExtentReports for detailed HTML reporting.
 */
public class ExtentReportListener implements ITestListener, ISuiteListener {

    private static ExtentReports extent;
    private static final Map<String, ExtentTest> testMap = new HashMap<>();
    private static final LogUtils log = LogUtils.getInstance();

    @Override
    public void onStart(ISuite suite) {
        try {
            ExtentSparkReporter spark = new ExtentSparkReporter("test-output/reports/HTML/extent-report.html");
            spark.config().setDocumentTitle("FarmConnect AI - E2E Automation Report");
            spark.config().setReportName("FarmConnect AI Test Execution");
            spark.config().setTheme(Theme.DARK);
            spark.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");

            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Application", "FarmConnect AI");
            extent.setSystemInfo("Platform", "Android");
            extent.setSystemInfo("Android Version", "14 (API 34)");
            extent.setSystemInfo("Automation Framework", "Appium + TestNG");
            extent.setSystemInfo("App Version", "1.0.0");
            extent.setSystemInfo("Device", "Android Emulator");

            log.info("ExtentReports initialized");
        } catch (Exception e) {
            log.error("Failed to initialize ExtentReports: " + e.getMessage());
        }
    }

    @Override
    public void onTestStart(ITestResult result) {
        if (extent != null) {
            ExtentTest test = extent.createTest(result.getMethod().getMethodName(),
                result.getMethod().getDescription() != null ? result.getMethod().getDescription() : "");
            testMap.put(result.getMethod().getMethodName(), test);
        }
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        ExtentTest test = testMap.get(result.getMethod().getMethodName());
        if (test != null) {
            test.pass("Test passed successfully");
        }
    }

    @Override
    public void onTestFailure(ITestResult result) {
        ExtentTest test = testMap.get(result.getMethod().getMethodName());
        if (test != null) {
            test.fail(result.getThrowable());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        ExtentTest test = testMap.get(result.getMethod().getMethodName());
        if (test != null) {
            test.skip("Test skipped: " + (result.getThrowable() != null ? result.getThrowable().getMessage() : "No reason"));
        }
    }

    @Override
    public void onFinish(ISuite suite) {
        if (extent != null) {
            extent.flush();
            log.info("ExtentReports flushed");
        }
    }
}
