package com.farmconnect.automation.tests.auth;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.data.TestData;
import com.farmconnect.automation.pages.LoginPage;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/**
 * LoginTests - 25 test cases for core login functionality.
 */
public class LoginTests extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setupLoginPage() {
        loginPage = new LoginPage(driver);
        clearAppState();
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify auth screen displays on app launch")
    public void TC_AUTH_001_verifyAuthScreenDisplayed() {
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "Auth screen should be displayed");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify login form is displayed by default")
    public void TC_AUTH_002_verifyLoginFormDisplayed() {
        Assert.assertTrue(loginPage.isLoginFormDisplayed(), "Login form should be visible");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify phone field is present")
    public void TC_AUTH_003_verifyPhoneFieldPresent() {
        Assert.assertTrue(loginPage.isPhoneFieldPresent(), "Phone input should exist");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify password field is present")
    public void TC_AUTH_004_verifyPasswordFieldPresent() {
        Assert.assertTrue(loginPage.isPasswordFieldPresent(), "Password input should exist");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify login button is present")
    public void TC_AUTH_005_verifyLoginButtonPresent() {
        Assert.assertTrue(loginPage.isLoginButtonEnabled(), "Login button should be present and enabled");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Valid login with admin credentials")
    public void TC_AUTH_006_validAdminLogin() {
        loginPage.login(TestData.ADMIN_PHONE, TestData.ADMIN_PASSWORD);
        Assert.assertTrue(isAppDisplayed(), "App should display after valid admin login");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Valid login with test user")
    public void TC_AUTH_007_validTestUserLogin() {
        loginAsTestUser();
        Assert.assertTrue(isAppDisplayed(), "App should display after valid user login");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with empty phone number")
    public void TC_AUTH_008_loginEmptyPhone() {
        loginPage.login("", TestData.TEST_USER_PASSWORD);
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for empty phone");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with empty password")
    public void TC_AUTH_009_loginEmptyPassword() {
        loginPage.login(TestData.TEST_USER_PHONE, "");
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for empty password");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with both fields empty")
    public void TC_AUTH_010_loginBothFieldsEmpty() {
        loginPage.login("", "");
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for both fields empty");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with unregistered phone number")
    public void TC_AUTH_011_loginUnregisteredPhone() {
        loginPage.login(TestData.UNREGISTERED_PHONE, "password123");
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for unregistered phone");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with wrong password")
    public void TC_AUTH_012_loginWrongPassword() {
        loginPage.login(TestData.ADMIN_PHONE, TestData.WRONG_PASSWORD);
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for wrong password");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with short phone number")
    public void TC_AUTH_013_loginShortPhone() {
        loginPage.login(TestData.INVALID_PHONE_SHORT, TestData.TEST_USER_PASSWORD);
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should display for short phone");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify phone field max length is 10")
    public void TC_AUTH_014_verifyPhoneMaxLength() {
        Assert.assertEquals(loginPage.getPhoneMaxLength(), 10, "Phone max length should be 10");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify phone input type is tel")
    public void TC_AUTH_015_verifyPhoneInputType() {
        Assert.assertEquals(loginPage.getPhoneInputType(), "tel", "Phone input type should be 'tel'");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify password input type is password")
    public void TC_AUTH_016_verifyPasswordInputType() {
        Assert.assertEquals(loginPage.getPasswordInputType(), "password", "Password input type should be 'password'");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify phone prefix +91 is displayed")
    public void TC_AUTH_017_verifyPhonePrefix() {
        String prefix = loginPage.getPhonePrefix();
        Assert.assertTrue(prefix.contains("+91"), "Phone prefix should show +91");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Verify register link is present")
    public void TC_AUTH_018_verifyRegisterLinkPresent() {
        Assert.assertTrue(loginPage.isRegisterLinkPresent(), "Register link should be present");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Verify forgot password link is present")
    public void TC_AUTH_019_verifyForgotPasswordPresent() {
        Assert.assertTrue(loginPage.isForgotPasswordLinkPresent(), "Forgot password link should be present");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify form title text")
    public void TC_AUTH_020_verifyFormTitle() {
        String title = loginPage.getFormTitle();
        Assert.assertTrue(title.contains("Welcome"), "Form title should contain 'Welcome'");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify login button text")
    public void TC_AUTH_021_verifyLoginButtonText() {
        String text = loginPage.getLoginButtonText();
        Assert.assertTrue(text.contains("Login"), "Login button should contain 'Login'");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify phone placeholder text")
    public void TC_AUTH_022_verifyPhonePlaceholder() {
        String placeholder = loginPage.getPhonePlaceholder();
        Assert.assertNotNull(placeholder, "Phone placeholder should not be null");
        Assert.assertFalse(placeholder.isEmpty(), "Phone placeholder should not be empty");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with SQL injection in phone")
    public void TC_AUTH_023_loginSQLInjection() {
        loginPage.login(TestData.SQL_INJECTION, TestData.TEST_USER_PASSWORD);
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "App should not crash on SQL injection");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with XSS payload in password")
    public void TC_AUTH_024_loginXSSPayload() {
        loginPage.login(TestData.TEST_USER_PHONE, TestData.XSS_PAYLOAD);
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "App should not be vulnerable to XSS");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify error message disappears after correction")
    public void TC_AUTH_025_verifyErrorClearsOnRetry() {
        loginPage.login("", "");
        Assert.assertTrue(loginPage.isErrorDisplayed(), "Error should be displayed initially");
        loginPage.login(TestData.ADMIN_PHONE, TestData.ADMIN_PASSWORD);
        // After successful login, auth screen should be gone
        Assert.assertTrue(isAppDisplayed(), "App should display after retry");
    }
}
