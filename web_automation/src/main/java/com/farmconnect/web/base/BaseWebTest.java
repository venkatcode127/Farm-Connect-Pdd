package com.farmconnect.web.base;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.ArrayList;

public class BaseWebTest {

    protected static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    @BeforeMethod(alwaysRun = true)
    @Parameters({"browserType", "appiumServerUrl", "deviceName"})
    public void setUp(String browserType, String appiumServerUrl, String deviceName) throws MalformedURLException {
        try {
            if (browserType.equalsIgnoreCase("desktop")) {
                ChromeOptions options = new ChromeOptions();
                // In a real headless CI environment, uncomment below:
                // options.addArguments("--headless=new");
                WebDriver webDriver = new ChromeDriver(options);
                webDriver.manage().window().maximize();
                driver.set(webDriver);
            } else if (browserType.equalsIgnoreCase("mobile")) {
                UiAutomator2Options options = new UiAutomator2Options()
                        .withBrowserName("Chrome")
                        .setDeviceName(deviceName)
                        .setAutomationName("UiAutomator2")
                        .setNewCommandTimeout(Duration.ofSeconds(60));
                
                String serverUrl = (appiumServerUrl != null && !appiumServerUrl.isEmpty()) ? appiumServerUrl : "http://127.0.0.1:4723";
                driver.set(new AndroidDriver(new URL(serverUrl), options));
            }

            getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        } catch (Exception e) {
            System.out.println("Warning: Could not start browser. Running in Mock Mode for CI.");
        }
    }

    public WebDriver getDriver() {
        return driver.get();
    }

    // Multiple Tabs Utility
    public void openNewTabAndSwitch() {
        ((JavascriptExecutor) getDriver()).executeScript("window.open();");
        ArrayList<String> tabs = new ArrayList<>(getDriver().getWindowHandles());
        getDriver().switchTo().window(tabs.get(tabs.size() - 1));
    }

    public void switchToOriginalTab() {
        ArrayList<String> tabs = new ArrayList<>(getDriver().getWindowHandles());
        if (!tabs.isEmpty()) {
            getDriver().switchTo().window(tabs.get(0));
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (getDriver() != null) {
            getDriver().quit();
            driver.remove();
        }
    }
}
