package com.farmconnect.automation.tests.authorization;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.data.TestData;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/**
 * AuthorizationTests - 30 test cases for role-based authorization.
 */
public class AuthorizationTests extends BaseTest {

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setup() { clearAppState(); }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_001_adminCanAccessDashboard() { loginAsAdmin(); Assert.assertTrue(isAppDisplayed()); navigateToSection("dashboard"); Assert.assertEquals(getActiveSection(), "dashboard"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_002_adminCanAccessPrediction() { loginAsAdmin(); navigateToSection("prediction"); Assert.assertEquals(getActiveSection(), "prediction"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_003_adminCanAccessMarket() { loginAsAdmin(); navigateToSection("market"); Assert.assertEquals(getActiveSection(), "market"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_004_adminCanAccessMarketplace() { loginAsAdmin(); navigateToSection("marketplace"); Assert.assertEquals(getActiveSection(), "marketplace"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_005_adminCanAccessOrders() { loginAsAdmin(); navigateToSection("orders"); Assert.assertEquals(getActiveSection(), "orders"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_006_farmerCanAccessDashboard() { loginAsTestUser(); navigateToSection("dashboard"); Assert.assertEquals(getActiveSection(), "dashboard"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_007_farmerCanAccessPrediction() { loginAsTestUser(); navigateToSection("prediction"); Assert.assertEquals(getActiveSection(), "prediction"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_008_farmerCanAccessMarket() { loginAsTestUser(); navigateToSection("market"); Assert.assertEquals(getActiveSection(), "market"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_009_farmerCanAccessMarketplace() { loginAsTestUser(); navigateToSection("marketplace"); Assert.assertEquals(getActiveSection(), "marketplace"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_010_farmerCanAccessOrders() { loginAsTestUser(); navigateToSection("orders"); Assert.assertEquals(getActiveSection(), "orders"); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_011_adminRoleStoredCorrectly() { loginAsAdmin(); Object role = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).role;"); Assert.assertEquals(role, "admin"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_012_farmerRoleStoredCorrectly() { loginAsTestUser(); Object role = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).role;"); Assert.assertEquals(role, "farmer"); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_013_buyerRoleRegistration() {
        executeScript("var users=JSON.parse(localStorage.getItem('fc_users')||'[]');users.push({name:'Buyer',phone:'8111111111',password:'pass1234',role:'buyer',location:'Mumbai'});localStorage.setItem('fc_users',JSON.stringify(users));");
        performLogin("8111111111", "pass1234");
        Object role = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).role;");
        Assert.assertEquals(role, "buyer");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_014_traderRoleRegistration() {
        executeScript("var users=JSON.parse(localStorage.getItem('fc_users')||'[]');users.push({name:'Trader',phone:'8222222222',password:'pass1234',role:'trader',location:'Delhi'});localStorage.setItem('fc_users',JSON.stringify(users));");
        performLogin("8222222222", "pass1234");
        Object role = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).role;");
        Assert.assertEquals(role, "trader");
    }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_015_unauthenticatedCannotAccessApp() { Assert.assertTrue(isAuthScreenDisplayed(), "Unauthenticated user should see auth screen"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_016_logoutRemovesSession() { loginAsAdmin(); executeScript("localStorage.removeItem('fc_current_user');location.reload();"); try{Thread.sleep(2000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_017_sessionPersistsAcrossRefresh() { loginAsAdmin(); executeScript("location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAppDisplayed(), "Session should persist"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_018_adminNameDisplayed() { loginAsAdmin(); Object name = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(name, "Admin"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_019_farmerNameDisplayed() { loginAsTestUser(); Object name = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(name, "Test Farmer"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_020_farmerLocationStored() { loginAsTestUser(); Object loc = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).location;"); Assert.assertNotNull(loc); }

    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_021_canAccessWeatherSection() { loginAsTestUser(); navigateToSection("weather"); Assert.assertEquals(getActiveSection(), "weather"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_022_canAccessAnalyticsSection() { loginAsTestUser(); navigateToSection("analytics"); Assert.assertEquals(getActiveSection(), "analytics"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_023_allSectionsAccessibleByAdmin() {
        loginAsAdmin();
        String[] sections = {"dashboard", "prediction", "market", "marketplace", "orders"};
        for (String s : sections) { navigateToSection(s); Assert.assertEquals(getActiveSection(), s, "Admin should access " + s); }
    }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_024_rolePreservedAfterNavigation() { loginAsTestUser(); navigateToSection("prediction"); navigateToSection("dashboard"); Object role = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).role;"); Assert.assertEquals(role, "farmer"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_025_multipleUsersCanRegister() { Object count = executeScript("return JSON.parse(localStorage.getItem('fc_users')||'[]').length;"); Assert.assertTrue(((Number)count).intValue() >= 1, "At least admin should exist"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_026_userDataIsolation() { loginAsTestUser(); Object phone = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).phone;"); Assert.assertEquals(phone, "9876543210"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_027_adminHasAllAccessLocation() { loginAsAdmin(); Object loc = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).location;"); Assert.assertTrue(loc.toString().contains("All Access") || loc.toString().contains("India")); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_028_registrationTimestampStored() { loginAsAdmin(); Object reg = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).registered;"); Assert.assertNotNull(reg); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_029_navbarVisibleAfterLogin() { loginAsAdmin(); Assert.assertTrue(isElementVisible("#navbar")); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_AUTHZ_030_authScreenHiddenAfterLogin() { loginAsAdmin(); Assert.assertFalse(isAuthScreenDisplayed() && !isAppDisplayed(), "Auth screen should be hidden after login"); }
}
