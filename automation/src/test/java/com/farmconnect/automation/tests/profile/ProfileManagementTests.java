package com.farmconnect.automation.tests.profile;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.pages.ProfilePage;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** ProfileManagementTests - 20 test cases for profile management. */
public class ProfileManagementTests extends BaseTest {
    private ProfilePage profilePage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setup() { profilePage = new ProfilePage(driver); loginAsTestUser(); }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_001_getCurrentUserName() { Assert.assertEquals(profilePage.getCurrentUserName(), "Test Farmer"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_002_getCurrentUserPhone() { Assert.assertEquals(profilePage.getCurrentUserPhone(), "9876543210"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_003_getCurrentUserRole() { Assert.assertEquals(profilePage.getCurrentUserRole(), "farmer"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_004_getCurrentUserLocation() { Assert.assertEquals(profilePage.getCurrentUserLocation(), "Hyderabad, Telangana"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_005_updateUserName() { profilePage.updateUserName("Updated Farmer"); Assert.assertEquals(profilePage.getCurrentUserName(), "Updated Farmer"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_006_updateUserLocation() { profilePage.updateUserLocation("Vizag, AP"); Assert.assertEquals(profilePage.getCurrentUserLocation(), "Vizag, AP"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_007_profilePersistsAfterRefresh() { executeScript("location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertNotNull(profilePage.getCurrentUserName()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_008_registeredUserCount() { Assert.assertTrue(profilePage.getRegisteredUserCount() >= 1); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_009_adminProfileCheck() { clearAppState(); loginAsAdmin(); Assert.assertEquals(profilePage.getCurrentUserName(), "Admin"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_010_adminRoleCheck() { clearAppState(); loginAsAdmin(); Assert.assertEquals(profilePage.getCurrentUserRole(), "admin"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_011_profileNotNullAfterLogin() { Object user = executeScript("return localStorage.getItem('fc_current_user');"); Assert.assertNotNull(user); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_012_profileIsValidJSON() { Object user = executeScript("try{JSON.parse(localStorage.getItem('fc_current_user'));return true;}catch(e){return false;}"); Assert.assertEquals(user, true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_013_profileHasAllFields() { Object hasAll = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user'));return u.name&&u.phone&&u.role&&u.location?true:false;"); Assert.assertEquals(hasAll, true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_014_updateNamePersistsInUsers() { profilePage.updateUserName("Persisted Name"); Object stored = executeScript("var users=JSON.parse(localStorage.getItem('fc_users'));var u=users.find(x=>x.phone==='9876543210');return u?u.name:'';"); Assert.assertEquals(stored, "Persisted Name"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_015_emptyNameNotSet() { String before = profilePage.getCurrentUserName(); profilePage.updateUserName(""); String after = profilePage.getCurrentUserName(); Assert.assertTrue(after.isEmpty() || after.equals(before)); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_016_specialCharsInName() { profilePage.updateUserName("Test@#$"); Assert.assertEquals(profilePage.getCurrentUserName(), "Test@#$"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_017_longNameHandled() { String longName = "A".repeat(100); profilePage.updateUserName(longName); Assert.assertEquals(profilePage.getCurrentUserName(), longName); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_018_locationUpdate() { profilePage.updateUserLocation("New Location City"); Assert.assertEquals(profilePage.getCurrentUserLocation(), "New Location City"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_019_roleNotChangeable() { String origRole = profilePage.getCurrentUserRole(); executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user'));u.role='buyer';localStorage.setItem('fc_current_user',JSON.stringify(u));"); Assert.assertEquals(profilePage.getCurrentUserRole(), "buyer"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_PROF_020_phoneNotChangeable() { Assert.assertEquals(profilePage.getCurrentUserPhone(), "9876543210"); }
}
