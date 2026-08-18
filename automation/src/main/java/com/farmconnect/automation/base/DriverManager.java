package com.farmconnect.automation.base;

import com.farmconnect.automation.utils.LogUtils;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;

import java.io.FileReader;
import java.net.URL;
import java.time.Duration;

/**
 * DriverManager - Factory class for creating and managing Appium AndroidDriver instances.
 * Uses ThreadLocal for parallel execution support.
 */
public class DriverManager {

    private static final ThreadLocal<AndroidDriver> driverThreadLocal = new ThreadLocal<>();
    private static final LogUtils log = LogUtils.getInstance();
    private static JsonObject appiumConfig;

    static {
        loadConfig();
    }

    /**
     * Get or create an AndroidDriver instance for the current thread.
     */
    public static AndroidDriver getDriver() {
        AndroidDriver driver = driverThreadLocal.get();
        if (driver == null || driver.getSessionId() == null) {
            driver = createDriver();
            driverThreadLocal.set(driver);
        }
        return driver;
    }

    /**
     * Check if driver is currently active.
     */
    public static boolean hasDriver() {
        AndroidDriver driver = driverThreadLocal.get();
        return driver != null && driver.getSessionId() != null;
    }

    /**
     * Create a new AndroidDriver with configured capabilities.
     */
    private static AndroidDriver createDriver() {
        try {
            JsonObject caps = appiumConfig.getAsJsonObject("capabilities");
            JsonObject server = appiumConfig.getAsJsonObject("appium");
            JsonObject timeouts = appiumConfig.getAsJsonObject("timeouts");

            UiAutomator2Options options = new UiAutomator2Options();

            // Platform capabilities
            options.setPlatformName(getStringOrDefault(caps, "platformName", "Android"));
            options.setAutomationName(getStringOrDefault(caps, "automationName", "UiAutomator2"));
            options.setDeviceName(getStringOrDefault(caps, "deviceName", "emulator-5554"));

            // App configuration
            String apkPath = System.getProperty("apk.path",
                    getStringOrDefault(caps, "app", "../android-app/app/build/outputs/apk/debug/app-debug.apk"));
            options.setApp(apkPath);
            options.setAppPackage(getStringOrDefault(caps, "appPackage", "com.farmconnect.ai.debug"));
            options.setAppActivity(getStringOrDefault(caps, "appActivity", "com.farmconnect.ai.MainActivity"));

            // Automation settings
            options.setAutoGrantPermissions(true);
            options.setNoReset(getBoolOrDefault(caps, "noReset", false));
            options.setFullReset(getBoolOrDefault(caps, "fullReset", false));
            options.setNewCommandTimeout(Duration.ofSeconds(getLongOrDefault(caps, "newCommandTimeout", 300)));

            // Chrome/WebView settings
            options.setCapability("chromedriverAutodownload", true);
            options.setCapability("nativeWebScreenshot", true);
            options.setCapability("ensureWebviewsHavePages", true);
            options.setCapability("webviewConnectTimeout",
                    getLongOrDefault(caps, "webviewConnectTimeout", 30000));

            // Timeouts
            int implicitWait = getIntOrDefault(timeouts, "implicitWait", 15);

            options.setCapability("uiautomator2ServerLaunchTimeout", getLongOrDefault(caps, "uiautomator2ServerLaunchTimeout", 120000));
            options.setCapability("uiautomator2ServerInstallTimeout", getLongOrDefault(caps, "uiautomator2ServerInstallTimeout", 120000));
            options.setCapability("androidInstallTimeout", getLongOrDefault(caps, "androidInstallTimeout", 120000));
            options.setCapability("adbExecTimeout", getLongOrDefault(caps, "adbExecTimeout", 120000));

            // Build server URL
            String serverUrl = System.getProperty("appium.url",
                    getStringOrDefault(server, "serverUrl", "http://127.0.0.1:4723"));

            log.info("Creating AndroidDriver...");
            log.info("Server URL: " + serverUrl);
            log.info("APK Path: " + apkPath);

            AndroidDriver driver = new AndroidDriver(new URL(serverUrl), options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));

            log.info("AndroidDriver created successfully");
            return driver;

        } catch (Exception e) {
            log.error("Failed to create AndroidDriver: " + e.getMessage());
            throw new RuntimeException("Driver creation failed", e);
        }
    }

    /**
     * Quit the driver for the current thread.
     */
    public static void quitDriver() {
        AndroidDriver driver = driverThreadLocal.get();
        if (driver != null) {
            try {
                driver.quit();
                log.info("AndroidDriver quit successfully");
            } catch (Exception e) {
                log.warn("Error quitting driver: " + e.getMessage());
            } finally {
                driverThreadLocal.remove();
            }
        }
    }

    /**
     * Load Appium configuration from JSON file.
     */
    private static void loadConfig() {
        try {
            String configPath = System.getProperty("appium.config",
                    "config/appium-config.json");
            appiumConfig = JsonParser.parseReader(new FileReader(configPath)).getAsJsonObject();
            log.info("Appium config loaded from: " + configPath);
        } catch (Exception e) {
            log.warn("Could not load appium config, using defaults: " + e.getMessage());
            appiumConfig = JsonParser.parseString("{"
                + "\"appium\":{\"serverUrl\":\"http://127.0.0.1:4723\"},"
                + "\"capabilities\":{\"platformName\":\"Android\",\"automationName\":\"UiAutomator2\","
                + "\"deviceName\":\"emulator-5554\","
                + "\"appPackage\":\"com.farmconnect.ai.debug\","
                + "\"appActivity\":\"com.farmconnect.ai.MainActivity\"},"
                + "\"timeouts\":{\"implicitWait\":15,\"explicitWait\":30}"
                + "}").getAsJsonObject();
        }
    }

    // Helper methods for safe JSON value extraction
    private static String getStringOrDefault(JsonObject obj, String key, String defaultVal) {
        return obj != null && obj.has(key) ? obj.get(key).getAsString() : defaultVal;
    }

    private static boolean getBoolOrDefault(JsonObject obj, String key, boolean defaultVal) {
        return obj != null && obj.has(key) ? obj.get(key).getAsBoolean() : defaultVal;
    }

    private static int getIntOrDefault(JsonObject obj, String key, int defaultVal) {
        return obj != null && obj.has(key) ? obj.get(key).getAsInt() : defaultVal;
    }

    private static long getLongOrDefault(JsonObject obj, String key, long defaultVal) {
        return obj != null && obj.has(key) ? obj.get(key).getAsLong() : defaultVal;
    }
}
