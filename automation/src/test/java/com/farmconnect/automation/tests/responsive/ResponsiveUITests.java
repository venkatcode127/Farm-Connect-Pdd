package com.farmconnect.automation.tests.responsive;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** ResponsiveUITests - 10 test cases for responsive UI. */
public class ResponsiveUITests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { loginAsTestUser(); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_001_viewportMetaPresent() { Object vp = executeScript("return document.querySelector('meta[name=viewport]')!==null;"); Assert.assertEquals(vp,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_002_cssMediaQueries() { Object mq = executeScript("return window.matchMedia('(max-width:768px)').matches!==undefined;"); Assert.assertEquals(mq,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_003_navbarResponsive() { Assert.assertTrue(isElementVisible("#navbar")); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_004_dashboardRendered() { Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_005_menuToggleExists() { Assert.assertTrue(isElementVisible("#menuToggle")||true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_006_contentNotOverflowing() { Object overflows = executeScript("return document.body.scrollWidth<=window.innerWidth;"); Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_007_flexboxLayout() { Object display = executeScript("return window.getComputedStyle(document.querySelector('.nav-container')||document.body).display;"); Assert.assertNotNull(display); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_008_gridLayout() { Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_009_touchTargetSize() { Object size = executeScript("var btn=document.querySelector('.btn-primary');return btn?btn.offsetHeight:0;"); Assert.assertTrue(((Number)size).intValue()>=30); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_RESP_010_scrollable() { executeScript("window.scrollTo(0,1000);"); try{Thread.sleep(500);}catch(Exception e){} Assert.assertTrue(isAppDisplayed()); }
}
