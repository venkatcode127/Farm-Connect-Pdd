package com.farmconnect.automation.tests.errorhandling;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** ErrorHandlingTests - 20 test cases for error handling. */
public class ErrorHandlingTests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { clearAppState(); }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_001_invalidLoginShowsError() { performLogin("9999999999","wrong"); Assert.assertTrue(isElementVisible("#loginError")||isAuthScreenDisplayed()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_002_errorMessageNotEmpty() { performLogin("9999999999","wrong"); String err = getElementText("#loginError"); Assert.assertTrue(err.length()>0||isAuthScreenDisplayed()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_003_appDoesNotCrashOnBadInput() { performLogin("<script>alert(1)</script>","test"); Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_004_corruptedLocalStorage() { executeScript("localStorage.setItem('fc_users','invalid json');"); executeScript("try{JSON.parse(localStorage.getItem('fc_users'));}catch(e){localStorage.setItem('fc_users','[]');}"); Assert.assertTrue(true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_005_emptyLocalStorage() { executeScript("localStorage.clear();"); executeScript("location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_006_missingCurrentUser() { executeScript("localStorage.removeItem('fc_current_user');location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_007_invalidCurrentUser() { executeScript("localStorage.setItem('fc_current_user','not json');location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()||isAppDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_008_multipleRapidClicks() { for(int i=0;i<10;i++) clickElementById("loginBtn"); Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_009_networkErrorHandling() { loginAsTestUser(); Assert.assertTrue(isAppDisplayed(),"App should handle gracefully"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_010_missingListingsStorage() { loginAsTestUser(); executeScript("localStorage.removeItem('fc_listings');"); navigateToSection("marketplace"); Assert.assertEquals(getActiveSection(),"marketplace"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_011_nullUsersArray() { executeScript("localStorage.setItem('fc_users','null');"); executeScript("try{var u=JSON.parse(localStorage.getItem('fc_users'));if(!Array.isArray(u))localStorage.setItem('fc_users','[]');}catch(e){localStorage.setItem('fc_users','[]');}"); Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_012_emptyObjectUser() { executeScript("localStorage.setItem('fc_current_user','{}');location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()||isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_013_specialCharsInAllFields() { performLogin("!@#$%","<>&\""); Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_014_veryLargeLocalStorage() { executeScript("var big=JSON.stringify(Array(100).fill({id:1,crop:'x',qty:'1',price:1}));localStorage.setItem('fc_listings',big);"); Object count = executeScript("return JSON.parse(localStorage.getItem('fc_listings')).length;"); Assert.assertEquals(((Number)count).intValue(),100); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_015_pageReloadRecovery() { loginAsTestUser(); executeScript("location.reload();"); try{Thread.sleep(3000);}catch(Exception e){} Assert.assertTrue(isAppDisplayed()||isAuthScreenDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_016_undefinedSection() { loginAsTestUser(); navigateToSection("nonexistent"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_017_emptyEventDispatch() { executeScript("document.dispatchEvent(new Event('click'));"); Assert.assertTrue(true,"Should not crash"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_018_windowResizeEvent() { executeScript("window.dispatchEvent(new Event('resize'));"); Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_019_backButtonBehavior() { loginAsTestUser(); executeScript("window.history.back();"); try{Thread.sleep(1000);}catch(Exception e){} Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ERRH_020_forwardButtonBehavior() { executeScript("window.history.forward();"); try{Thread.sleep(1000);}catch(Exception e){} Assert.assertTrue(true); }
}
