package com.farmconnect.automation.base;

import com.farmconnect.automation.constants.AppConstants;
import com.farmconnect.automation.utils.LogUtils;
import com.farmconnect.automation.utils.ScreenshotUtils;
import com.farmconnect.automation.utils.WaitUtils;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.*;
import org.testng.ITestResult;

import java.io.FileInputStream;
import java.time.Duration;
import java.util.Properties;
import java.util.Set;

/**
 * BaseTest - Foundation class for all test classes.
 * Handles driver initialization, WebView context switching,
 * test setup/teardown, and common test utilities.
 */
public abstract class BaseTest {

    protected AndroidDriver driver;
    protected Properties config;
    protected WaitUtils waitUtils;
    protected static final LogUtils log = LogUtils.getInstance();

    @BeforeSuite(alwaysRun = true)
    public void suiteSetup() {
        log.info("========================================");
        log.info("FarmConnect AI - E2E Automation Suite");
        log.info("Starting test suite execution...");
        log.info("========================================");
        loadConfig();
    }

    @BeforeClass(alwaysRun = true)
    public void classSetup() {
        log.info("Setting up test class: " + this.getClass().getSimpleName());
    }

    @BeforeMethod(alwaysRun = true)
    public void methodSetup(java.lang.reflect.Method method) {
        log.info("---------------------------------------");
        log.info("Starting test: " + method.getName());
        log.info("---------------------------------------");

        try {
            // Initialize or reuse driver
            driver = DriverManager.getDriver();
            waitUtils = new WaitUtils(driver);

            // Switch to WebView context for web element interactions
            switchToWebViewContext();

        } catch (Exception e) {
            log.error("Failed to setup test method: " + e.getMessage());
            throw new RuntimeException("Test setup failed", e);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void methodTeardown(ITestResult result) {
        try {
            if (result.getStatus() == ITestResult.FAILURE) {
                log.error("TEST FAILED: " + result.getName());
                log.error("Failure reason: " + (result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown"));

                // Capture screenshot on failure
                if (driver != null) {
                    ScreenshotUtils.captureScreenshot(driver, result.getName());
                }
            } else if (result.getStatus() == ITestResult.SUCCESS) {
                log.info("TEST PASSED: " + result.getName());
            } else if (result.getStatus() == ITestResult.SKIP) {
                log.warn("TEST SKIPPED: " + result.getName());
            }
        } catch (Exception e) {
            log.error("Error in teardown: " + e.getMessage());
        }
    }

    @AfterSuite(alwaysRun = true)
    public void suiteTeardown() {
        log.info("========================================");
        log.info("Test suite execution completed.");
        log.info("Quitting AndroidDriver session...");
        log.info("========================================");
        try {
            DriverManager.quitDriver();
        } catch (Exception e) {
            log.warn("Error quitting driver in suite teardown: " + e.getMessage());
        }
    }

    /**
     * Switch to WebView context to interact with web elements.
     */
    protected void switchToWebViewContext() {
        try {
            String current = driver.getContext();
            if (current != null && current.contains("WEBVIEW")) {
                return;
            }

            long endTime = System.currentTimeMillis() + 15000;
            while (System.currentTimeMillis() < endTime) {
                Set<String> contexts = driver.getContextHandles();
                log.info("Available contexts: " + contexts);

                for (String context : contexts) {
                    if (context.contains("WEBVIEW")) {
                        driver.context(context);
                        log.info("Switched to WebView context: " + context);
                        return;
                    }
                }
                Thread.sleep(1000);
            }
            log.warn("No WebView context found after 15s. Staying in " + current);
        } catch (Exception e) {
            log.warn("Could not switch to WebView context: " + e.getMessage());
        }
    }

    /**
     * Switch to Native app context.
     */
    protected void switchToNativeContext() {
        try {
            driver.context("NATIVE_APP");
            log.info("Switched to NATIVE_APP context");
        } catch (Exception e) {
            log.warn("Could not switch to Native context: " + e.getMessage());
        }
    }

    /**
     * Load test configuration properties.
     */
    private void loadConfig() {
        config = new Properties();
        try {
            String configPath = System.getProperty("config.path",
                    "config/test-config.properties");
            config.load(new FileInputStream(configPath));
            log.info("Configuration loaded from: " + configPath);
        } catch (Exception e) {
            log.warn("Could not load config file, using defaults: " + e.getMessage());
        }
    }

    /**
     * Execute JavaScript in WebView context.
     */
    protected Object executeScript(String script) {
        try {
            return driver.executeScript(script);
        } catch (Exception e) {
            log.error("Script execution failed: " + e.getMessage());
            return null;
        }
    }

    /**
     * Clear localStorage in WebView (useful for resetting app state).
     */
    protected void clearAppState() {
        try {
            executeScript("localStorage.clear();");
            driver.navigate().refresh();
            Thread.sleep(2000);
            log.info("App state cleared (localStorage)");
        } catch (Exception e) {
            log.warn("Could not clear app state: " + e.getMessage());
        }
    }

    /**
     * Perform login with given credentials via JavaScript injection.
     */
    protected void performLogin(String phone, String password) {
        try {
            executeScript(String.format(
                "document.getElementById('loginPhone').value = '%s';" +
                "document.getElementById('loginPassword').value = '%s';" +
                "document.getElementById('loginBtn').click();",
                phone, password
            ));
            Thread.sleep(2000);
            log.info("Login performed for phone: " + phone);
        } catch (Exception e) {
            log.error("Login failed: " + e.getMessage());
        }
    }

    /**
     * Perform login with default test user credentials.
     */
    protected void loginAsTestUser() {
        clearAppState();
        // First register the test user
        executeScript(
            "var users = JSON.parse(localStorage.getItem('fc_users') || '[]');" +
            "if (!users.find(u => u.phone === '9876543210')) {" +
            "  users.push({name:'Test Farmer',phone:'9876543210',password:'test1234'," +
            "    role:'farmer',location:'Hyderabad, Telangana',registered:new Date().toISOString()});" +
            "  localStorage.setItem('fc_users', JSON.stringify(users));" +
            "}" +
            "location.reload();"
        );
        try { Thread.sleep(2000); } catch(Exception e) {}
        performLogin("9876543210", "test1234");
    }

    /**
     * Login as admin user.
     */
    protected void loginAsAdmin() {
        clearAppState();
        try { Thread.sleep(1000); } catch(Exception e) {}
        performLogin("9347815378", "FARMERuse9347@");
    }

    /**
     * Navigate to a specific section of the app.
     */
    protected void navigateToSection(String sectionId) {
        try {
            executeScript(String.format(
                "document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));" +
                "document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));" +
                "var link = document.querySelector('[data-section=\"%s\"]');" +
                "if(link) { link.classList.add('active'); }" +
                "var section = document.getElementById('%s');" +
                "if(section) { section.classList.add('active'); }",
                sectionId, sectionId
            ));
            Thread.sleep(1500);
            log.info("Navigated to section: " + sectionId);
        } catch (Exception e) {
            log.error("Navigation failed: " + e.getMessage());
        }
    }

    /**
     * Check if an element is visible by CSS selector.
     */
    protected boolean isElementVisible(String cssSelector) {
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
     * Get text content of element by CSS selector.
     */
    protected String getElementText(String cssSelector) {
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
     * Get value of an input element by ID.
     */
    protected String getInputValue(String elementId) {
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
     * Set value of input element by ID.
     */
    protected void setInputValue(String elementId, String value) {
        executeScript(String.format(
            "var el = document.getElementById('%s');" +
            "if(el) { el.value = '%s'; el.dispatchEvent(new Event('input')); }",
            elementId, value.replace("'", "\\'")
        ));
    }

    /**
     * Click element by ID.
     */
    protected void clickElementById(String elementId) {
        executeScript(String.format(
            "var el = document.getElementById('%s'); if(el) el.click();",
            elementId
        ));
    }

    /**
     * Click element by CSS selector.
     */
    protected void clickElement(String cssSelector) {
        executeScript(String.format(
            "var el = document.querySelector('%s'); if(el) el.click();",
            cssSelector.replace("'", "\\'")
        ));
    }

    /**
     * Check if the auth screen is displayed.
     */
    protected boolean isAuthScreenDisplayed() {
        return isElementVisible("#authScreen");
    }

    /**
     * Check if the main app (navbar) is displayed (i.e., user is logged in).
     */
    protected boolean isAppDisplayed() {
        return isElementVisible("#navbar");
    }

    /**
     * Get the current section that is active.
     */
    protected String getActiveSection() {
        try {
            Object result = executeScript(
                "var active = document.querySelector('.section.active');" +
                "return active ? active.id : '';"
            );
            return result != null ? result.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }
}
