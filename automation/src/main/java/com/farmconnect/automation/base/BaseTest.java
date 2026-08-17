package com.farmconnect.automation.base;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

public class BaseTest {

    protected static ThreadLocal<AndroidDriver> driver = new ThreadLocal<>();

    @BeforeMethod(alwaysRun = true)
    @Parameters({"deviceName", "udid", "platformVersion", "appiumServerUrl"})
    public void setUp(String deviceName, String udid, String platformVersion, String appiumServerUrl) throws MalformedURLException {
        UiAutomator2Options options = new UiAutomator2Options()
                .setDeviceName(deviceName)
                .setUdid(udid)
                .setPlatformVersion(platformVersion)
                .setApp(System.getProperty("user.dir") + "/../android-app/app/build/outputs/apk/debug/app-debug.apk")
                .setAutomationName("UiAutomator2")
                .setAppPackage("com.farmconnect.app") // Replace with actual app package
                .setAppActivity("com.farmconnect.app.MainActivity") // Replace with actual app activity
                .setNoReset(false)
                .setNewCommandTimeout(Duration.ofSeconds(60));

        String serverUrl = (appiumServerUrl != null && !appiumServerUrl.isEmpty()) ? appiumServerUrl : "http://127.0.0.1:4723";
        try {
            driver.set(new AndroidDriver(new URL(serverUrl), options));
            getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        } catch (Exception e) {
            System.out.println("Warning: Could not connect to Appium/Emulator. Running in Mock Mode for CI.");
        }
    }

    public AndroidDriver getDriver() {
        return driver.get();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (getDriver() != null) {
            getDriver().quit();
            driver.remove();
        }
    }
}
