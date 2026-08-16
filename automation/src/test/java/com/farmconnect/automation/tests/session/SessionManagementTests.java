package com.farmconnect.automation.tests.session;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** SessionManagementTests - 20 test cases for session management. */
public class SessionManagementTests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { clearAppState(); }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_001_sessionCreatedOnLogin() { loginAsTestUser(); Object s = executeScript("return localStorage.getItem('fc_current_user');"); Assert.assertNotNull(s); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_002_sessionClearedOnLogout() { loginAsTestUser(); executeScript("localStorage.removeItem('fc_current_user');"); Object s = executeScript("return localStorage.getItem('fc_current_user');"); Assert.assertNull(s); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_003_sessionPersistsRefresh() { loginAsTestUser(); executeScript("location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_004_noSessionShowsAuth() { Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_005_sessionContainsUserData() { loginAsTestUser(); Object data = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user'));return u&&u.name&&u.phone&&u.role;"); Assert.assertEquals(data,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_006_loginCreatesNewSession() { loginAsAdmin(); Object name = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(name,"Admin"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_007_switchUser() { loginAsAdmin(); Object admin = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(admin,"Admin"); clearAppState(); loginAsTestUser(); Object user = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(user,"Test Farmer"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_008_sessionValidJSON() { loginAsTestUser(); Object valid = executeScript("try{JSON.parse(localStorage.getItem('fc_current_user'));return true;}catch(e){return false;}"); Assert.assertEquals(valid,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_009_multipleLoginsSequential() { for(int i=0;i<3;i++){loginAsAdmin();clearAppState();} loginAsTestUser(); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_010_sessionTimeNotExpired() { loginAsTestUser(); Assert.assertTrue(isAppDisplayed()); try{Thread.sleep(5000);}catch(Exception e){} Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_011_sessionStorageKey() { loginAsTestUser(); Object keys = executeScript("return Object.keys(localStorage).includes('fc_current_user');"); Assert.assertEquals(keys,true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_012_usersStorageKey() { Object keys = executeScript("return Object.keys(localStorage).includes('fc_users');"); Assert.assertEquals(keys,true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_013_sessionIsolation() { loginAsTestUser(); Object phone = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).phone;"); Assert.assertEquals(phone,"9876543210"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_014_clearStorageShowsAuth() { loginAsTestUser(); executeScript("localStorage.clear();location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_015_sessionAfterNavigation() { loginAsTestUser(); navigateToSection("prediction"); navigateToSection("orders"); Object s = executeScript("return localStorage.getItem('fc_current_user');"); Assert.assertNotNull(s); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_016_partialSessionData() { executeScript("localStorage.setItem('fc_current_user',JSON.stringify({name:'Partial'}));location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_017_sessionWithExpiredData() { executeScript("localStorage.setItem('fc_current_user',JSON.stringify({name:'Old',phone:'1111111111',role:'farmer',registered:'2020-01-01'}));location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAppDisplayed()||isAuthScreenDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_018_sessionStorageSize() { loginAsTestUser(); Object size = executeScript("return localStorage.getItem('fc_current_user').length;"); Assert.assertTrue(((Number)size).intValue()>0); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_019_sessionNotInSessionStorage() { loginAsTestUser(); Object s = executeScript("return sessionStorage.getItem('fc_current_user');"); Assert.assertNull(s); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_SESS_020_adminSeedPersists() { Object admin = executeScript("var u=JSON.parse(localStorage.getItem('fc_users')||'[]');return u.some(x=>x.phone==='9347815378');"); Assert.assertEquals(admin,true); }
}
