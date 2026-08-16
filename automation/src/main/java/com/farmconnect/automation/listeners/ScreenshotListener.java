package com.farmconnect.automation.listeners;

import com.farmconnect.automation.base.DriverManager;
import com.farmconnect.automation.utils.LogUtils;
import com.farmconnect.automation.utils.ScreenshotUtils;
import io.appium.java_client.android.AndroidDriver;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * ScreenshotListener - Automatically captures screenshots on test failure.
 */
public class ScreenshotListener implements ITestListener {

    private static final LogUtils log = LogUtils.getInstance();

    @Override
    public void onTestFailure(ITestResult result) {
        try {
            AndroidDriver driver = DriverManager.getDriver();
            if (driver != null) {
                String path = ScreenshotUtils.captureScreenshot(driver, result.getMethod().getMethodName());
                log.info("Failure screenshot saved: " + path);
            }
        } catch (Exception e) {
            log.warn("Could not capture failure screenshot: " + e.getMessage());
        }
    }
}
