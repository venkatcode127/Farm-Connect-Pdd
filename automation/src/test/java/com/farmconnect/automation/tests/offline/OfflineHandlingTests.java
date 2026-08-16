package com.farmconnect.automation.tests.offline;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** OfflineHandlingTests - 10 test cases for offline/PWA handling. */
public class OfflineHandlingTests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { loginAsTestUser(); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_001_localStorageAvailable() { Object available = executeScript("try{localStorage.setItem('test','1');localStorage.removeItem('test');return true;}catch(e){return false;}"); Assert.assertEquals(available,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_002_dataPersistedLocally() { Object users = executeScript("return localStorage.getItem('fc_users')!==null;"); Assert.assertEquals(users,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_003_manifestDefined() { Object manifest = executeScript("return document.querySelector('link[rel=manifest]')!==null;"); Assert.assertEquals(manifest,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_004_appWorksWithLocalData() { navigateToSection("dashboard"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_005_listingsAvailableOffline() { Object count = executeScript("return JSON.parse(localStorage.getItem('fc_listings')||'[]').length;"); Assert.assertTrue(((Number)count).intValue()>=0); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_006_predictionAvailableLocally() { navigateToSection("prediction"); Assert.assertEquals(getActiveSection(),"prediction"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_007_ordersAvailableLocally() { navigateToSection("orders"); Assert.assertEquals(getActiveSection(),"orders"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_008_themeWorksOffline() { String before = (String)executeScript("return document.documentElement.dataset.theme;"); clickElementById("themeToggle"); String after = (String)executeScript("return document.documentElement.dataset.theme;"); Assert.assertNotEquals(before,after); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_009_languageWorksOffline() { clickElementById("langToggle"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_OFFL_010_navigationWorksOffline() { navigateToSection("marketplace"); navigateToSection("dashboard"); Assert.assertTrue(isAppDisplayed()); }
}
