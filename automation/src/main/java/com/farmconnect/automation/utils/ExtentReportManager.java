package com.farmconnect.automation.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public class ExtentReportManager {

    private static ExtentReports extent;

    public static ExtentReports getInstance() {
        if (extent == null) {
            createInstance();
        }
        return extent;
    }

    private static void createInstance() {
        String reportPath = System.getProperty("user.dir") + "/reports/HTML/execution-report.html";
        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath);
        
        sparkReporter.config().setTheme(Theme.DARK);
        sparkReporter.config().setDocumentTitle("Android E2E Automation Report");
        sparkReporter.config().setReportName("Appium Execution Results");
        
        extent = new ExtentReports();
        extent.attachReporter(sparkReporter);
        extent.setSystemInfo("OS", System.getProperty("os.name"));
        extent.setSystemInfo("Java Version", System.getProperty("java.version"));
        extent.setSystemInfo("Appium Version", "9.2.2");
        extent.setSystemInfo("Environment", "CI/CD");
    }
}
