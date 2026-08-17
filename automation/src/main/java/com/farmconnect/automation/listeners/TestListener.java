package com.farmconnect.automation.listeners;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.farmconnect.automation.utils.ExcelReportUtils;
import com.farmconnect.automation.utils.ExtentReportManager;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {

    private static ExtentReports extent = ExtentReportManager.getInstance();
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    @Override
    public void onStart(ITestContext context) {
        ExcelReportUtils.initializeReport();
    }

    @Override
    public void onTestStart(ITestResult result) {
        Object[] params = result.getParameters();
        String testName = params.length > 2 ? (String) params[2] : result.getMethod().getMethodName();
        ExtentTest extentTest = extent.createTest(testName);
        test.set(extentTest);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        test.get().log(Status.PASS, "Test Passed");
        recordToExcel(result, "PASS", "");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        test.get().log(Status.FAIL, result.getThrowable());
        // Capture screenshot logic would go here
        test.get().addScreenCaptureFromPath("path/to/screenshot.png");
        recordToExcel(result, "FAIL", result.getThrowable().getMessage());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        test.get().log(Status.SKIP, "Test Skipped");
        recordToExcel(result, "SKIP", "Skipped");
    }

    @Override
    public void onFinish(ITestContext context) {
        extent.flush();
        ExcelReportUtils.saveReport();
    }

    private void recordToExcel(ITestResult result, String status, String reason) {
        Object[] params = result.getParameters();
        if (params != null && params.length >= 4) {
            String testId = (String) params[0];
            String module = (String) params[1];
            String testName = (String) params[2];
            String priority = (String) params[3];
            ExcelReportUtils.addResult(testId, module, testName, priority, status, reason);
        }
    }
}
