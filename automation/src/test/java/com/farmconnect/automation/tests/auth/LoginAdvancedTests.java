package com.farmconnect.automation.tests.auth;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.data.TestData;
import com.farmconnect.automation.pages.LoginPage;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/**
 * LoginAdvancedTests - 15 advanced login test cases.
 */
public class LoginAdvancedTests extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setup() { loginPage = new LoginPage(driver); clearAppState(); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with alphabetic phone number")
    public void TC_AUTH_026_loginAlphabeticPhone() {
        loginPage.login(TestData.INVALID_PHONE_LETTERS, "password");
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "Should remain on auth screen");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with special chars in phone")
    public void TC_AUTH_027_loginSpecialCharsPhone() {
        loginPage.login(TestData.INVALID_PHONE_SPECIAL, "password");
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "Should remain on auth screen");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify clicking register link shows register form")
    public void TC_AUTH_028_clickRegisterShowsForm() {
        loginPage.clickShowRegister();
        try { Thread.sleep(500); } catch(Exception e){}
        boolean regFormVisible = isElementVisible("#registerForm");
        Assert.assertTrue(regFormVisible, "Register form should be visible");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify clicking forgot password shows forgot form")
    public void TC_AUTH_029_clickForgotShowsForm() {
        loginPage.clickForgotPassword();
        try { Thread.sleep(500); } catch(Exception e){}
        boolean forgotVisible = isElementVisible("#forgotForm");
        Assert.assertTrue(forgotVisible, "Forgot password form should be visible");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Verify logout after login")
    public void TC_AUTH_030_verifyLogout() {
        loginAsAdmin();
        Assert.assertTrue(isAppDisplayed(), "Should be logged in");
        executeScript("localStorage.removeItem('fc_current_user'); location.reload();");
        try { Thread.sleep(2000); } catch(Exception e){}
        Assert.assertTrue(isAuthScreenDisplayed(), "Auth screen should display after logout");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login preserves session in localStorage")
    public void TC_AUTH_031_loginPreservesSession() {
        loginAsAdmin();
        Object user = executeScript("return localStorage.getItem('fc_current_user');");
        Assert.assertNotNull(user, "Current user should be in localStorage");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify form description text")
    public void TC_AUTH_032_verifyFormDescription() {
        String desc = loginPage.getFormDescription();
        Assert.assertNotNull(desc, "Form description should exist");
        Assert.assertFalse(desc.isEmpty(), "Form description should not be empty");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with phone containing spaces")
    public void TC_AUTH_033_loginPhoneWithSpaces() {
        loginPage.login(TestData.INVALID_PHONE_SPACE, "password");
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "Should remain on auth screen");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Verify admin account is seeded on first load")
    public void TC_AUTH_034_verifyAdminSeeded() {
        Object result = executeScript("var users=JSON.parse(localStorage.getItem('fc_users')||'[]');" +
            "return users.some(u=>u.phone==='9347815378');");
        Assert.assertEquals(result, true, "Admin user should be seeded");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify password is masked")
    public void TC_AUTH_035_verifyPasswordMasked() {
        Assert.assertEquals(loginPage.getPasswordInputType(), "password", "Password should be masked");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class, description = "Login with very long password")
    public void TC_AUTH_036_loginLongPassword() {
        loginPage.login(TestData.ADMIN_PHONE, TestData.LONG_STRING);
        Assert.assertTrue(loginPage.isAuthScreenDisplayed(), "Should handle long password gracefully");
    }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class, description = "Multiple failed logins do not lock account")
    public void TC_AUTH_037_multipleFailedLogins() {
        for (int i = 0; i < 5; i++) {
            loginPage.login(TestData.ADMIN_PHONE, "wrong" + i);
        }
        loginPage.login(TestData.ADMIN_PHONE, TestData.ADMIN_PASSWORD);
        Assert.assertTrue(isAppDisplayed(), "Account should not be locked after failed attempts");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify auth screen has brand logo")
    public void TC_AUTH_038_verifyBrandLogo() {
        boolean hasSvg = isElementVisible(".auth-hero-side svg") || isElementVisible(".auth-hero-content svg");
        Assert.assertTrue(hasSvg, "Brand logo should be visible");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify auth screen has feature highlights")
    public void TC_AUTH_039_verifyFeatureHighlights() {
        int featureCount = (int)(long)(Long)executeScript("return document.querySelectorAll('.auth-feature').length;");
        Assert.assertTrue(featureCount >= 3, "Should have at least 3 feature highlights");
    }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class, description = "Verify auth screen tagline text")
    public void TC_AUTH_040_verifyTagline() {
        String tagline = getElementText(".auth-tagline");
        Assert.assertFalse(tagline.isEmpty(), "Auth tagline should not be empty");
    }
}
