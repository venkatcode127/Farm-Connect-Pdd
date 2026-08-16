package com.farmconnect.automation.utils;

import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.By;
import java.time.Duration;

/**
 * WaitUtils - Explicit wait utilities.
 */
public class WaitUtils {

    private final AndroidDriver driver;
    private final WebDriverWait wait;
    private static final int DEFAULT_TIMEOUT = 30;

    public WaitUtils(AndroidDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
    }

    public WaitUtils(AndroidDriver driver, int timeoutSeconds) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    public void waitForElementVisible(By locator) { wait.until(ExpectedConditions.visibilityOfElementLocated(locator)); }
    public void waitForElementClickable(By locator) { wait.until(ExpectedConditions.elementToBeClickable(locator)); }
    public void waitForElementPresent(By locator) { wait.until(ExpectedConditions.presenceOfElementLocated(locator)); }
    public void waitForElementInvisible(By locator) { wait.until(ExpectedConditions.invisibilityOfElementLocated(locator)); }

    public void waitForSeconds(int seconds) {
        try { Thread.sleep(seconds * 1000L); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    public boolean isElementPresent(By locator) {
        try { driver.findElement(locator); return true; } catch (Exception e) { return false; }
    }

    public void waitForPageLoad() {
        try {
            wait.until(d -> ((io.appium.java_client.android.AndroidDriver) d)
                .executeScript("return document.readyState").equals("complete"));
        } catch (Exception e) { /* Page may already be loaded */ }
    }
}
