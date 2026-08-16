package com.farmconnect.automation.utils;

import io.appium.java_client.android.AndroidDriver;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ScreenshotUtils - Captures and manages screenshots.
 */
public class ScreenshotUtils {

    private static final String SCREENSHOT_DIR = "test-output/screenshots";
    private static final LogUtils log = LogUtils.getInstance();

    static {
        new File(SCREENSHOT_DIR).mkdirs();
    }

    public static String captureScreenshot(AndroidDriver driver, String testName) {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = sanitize(testName) + "_" + timestamp + ".png";
            String filePath = SCREENSHOT_DIR + "/" + fileName;

            File srcFile = driver.getScreenshotAs(OutputType.FILE);
            File destFile = new File(filePath);
            FileUtils.copyFile(srcFile, destFile);

            log.info("Screenshot captured: " + filePath);
            return filePath;
        } catch (Exception e) {
            log.error("Failed to capture screenshot: " + e.getMessage());
            return null;
        }
    }

    public static String captureScreenshotAsBase64(AndroidDriver driver) {
        try {
            return driver.getScreenshotAs(OutputType.BASE64);
        } catch (Exception e) {
            log.error("Failed to capture Base64 screenshot: " + e.getMessage());
            return null;
        }
    }

    private static String sanitize(String name) {
        return name.replaceAll("[^a-zA-Z0-9_-]", "_");
    }
}
