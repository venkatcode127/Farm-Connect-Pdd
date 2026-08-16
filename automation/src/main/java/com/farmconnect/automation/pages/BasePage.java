package com.farmconnect.automation.pages;

import com.farmconnect.automation.utils.LogUtils;
import com.farmconnect.automation.utils.WaitUtils;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * BasePage - Base class for all Page Objects.
 * Provides common methods for interacting with WebView-based elements.
 */
public abstract class BasePage {

    protected AndroidDriver driver;
    protected WaitUtils waitUtils;
    protected static final LogUtils log = LogUtils.getInstance();

    public BasePage(AndroidDriver driver) {
        this.driver = driver;
        this.waitUtils = new WaitUtils(driver);
    }

    /**
     * Execute JavaScript in the WebView.
     */
    protected Object executeScript(String script) {
        try {
            return ((JavascriptExecutor) driver).executeScript(script);
        } catch (Exception e) {
            log.error("Script execution failed: " + e.getMessage());
            return null;
        }
    }

    /**
     * Find element by CSS selector using JavaScript.
     */
    protected WebElement findByCss(String cssSelector) {
        return driver.findElement(By.cssSelector(cssSelector));
    }

    /**
     * Find element by ID.
     */
    protected WebElement findById(String id) {
        return driver.findElement(By.id(id));
    }

    /**
     * Find elements by CSS selector.
     */
    protected List<WebElement> findAllByCss(String cssSelector) {
        return driver.findElements(By.cssSelector(cssSelector));
    }

    /**
     * Check if an element exists and is visible.
     */
    protected boolean isVisible(String cssSelector) {
        try {
            Object result = executeScript(String.format(
                "var el = document.querySelector('%s');" +
                "return el && el.offsetParent !== null && " +
                "window.getComputedStyle(el).display !== 'none' && " +
                "window.getComputedStyle(el).visibility !== 'hidden';",
                cssSelector.replace("'", "\\'")
            ));
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if element exists in DOM.
     */
    protected boolean elementExists(String cssSelector) {
        try {
            Object result = executeScript(String.format(
                "return document.querySelector('%s') !== null;",
                cssSelector.replace("'", "\\'")
            ));
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get text content of an element.
     */
    protected String getText(String cssSelector) {
        try {
            Object result = executeScript(String.format(
                "var el = document.querySelector('%s'); return el ? el.textContent.trim() : '';",
                cssSelector.replace("'", "\\'")
            ));
            return result != null ? result.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Get input value.
     */
    protected String getValue(String elementId) {
        try {
            Object result = executeScript(String.format(
                "var el = document.getElementById('%s'); return el ? el.value : '';",
                elementId
            ));
            return result != null ? result.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Set input value by ID.
     */
    protected void setValue(String elementId, String value) {
        executeScript(String.format(
            "var el = document.getElementById('%s');" +
            "if(el) { el.value = '%s'; el.dispatchEvent(new Event('input', {bubbles:true})); " +
            "el.dispatchEvent(new Event('change', {bubbles:true})); }",
            elementId, value.replace("'", "\\'")
        ));
    }

    /**
     * Clear input by ID.
     */
    protected void clearInput(String elementId) {
        executeScript(String.format(
            "var el = document.getElementById('%s');" +
            "if(el) { el.value = ''; el.dispatchEvent(new Event('input', {bubbles:true})); }",
            elementId
        ));
    }

    /**
     * Click element by ID.
     */
    protected void clickById(String elementId) {
        executeScript(String.format(
            "var el = document.getElementById('%s'); if(el) el.click();",
            elementId
        ));
    }

    /**
     * Click element by CSS selector.
     */
    protected void clickByCss(String cssSelector) {
        executeScript(String.format(
            "var el = document.querySelector('%s'); if(el) el.click();",
            cssSelector.replace("'", "\\'")
        ));
    }

    /**
     * Get attribute of element.
     */
    protected String getAttribute(String cssSelector, String attribute) {
        try {
            Object result = executeScript(String.format(
                "var el = document.querySelector('%s'); return el ? el.getAttribute('%s') : '';",
                cssSelector.replace("'", "\\'"), attribute
            ));
            return result != null ? result.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Get CSS property of element.
     */
    protected String getCssProperty(String cssSelector, String property) {
        try {
            Object result = executeScript(String.format(
                "var el = document.querySelector('%s'); return el ? window.getComputedStyle(el).%s : '';",
                cssSelector.replace("'", "\\'"), property
            ));
            return result != null ? result.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Get count of elements matching selector.
     */
    protected int getElementCount(String cssSelector) {
        try {
            Object result = executeScript(String.format(
                "return document.querySelectorAll('%s').length;",
                cssSelector.replace("'", "\\'")
            ));
            return result != null ? ((Number) result).intValue() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Wait for specified milliseconds.
     */
    protected void pause(long millis) {
        try { Thread.sleep(millis); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    /**
     * Scroll to element by CSS selector.
     */
    protected void scrollToElement(String cssSelector) {
        executeScript(String.format(
            "var el = document.querySelector('%s');" +
            "if(el) el.scrollIntoView({behavior:'smooth', block:'center'});",
            cssSelector.replace("'", "\\'")
        ));
        pause(500);
    }

    /**
     * Select dropdown option by value.
     */
    protected void selectByValue(String selectId, String value) {
        executeScript(String.format(
            "var el = document.getElementById('%s');" +
            "if(el) { el.value = '%s'; el.dispatchEvent(new Event('change', {bubbles:true})); }",
            selectId, value.replace("'", "\\'")
        ));
    }

    /**
     * Check if element has a specific CSS class.
     */
    protected boolean hasClass(String cssSelector, String className) {
        try {
            Object result = executeScript(String.format(
                "var el = document.querySelector('%s');" +
                "return el ? el.classList.contains('%s') : false;",
                cssSelector.replace("'", "\\'"), className
            ));
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the page title.
     */
    public String getPageTitle() {
        return driver.getTitle();
    }

    /**
     * Get current URL.
     */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
