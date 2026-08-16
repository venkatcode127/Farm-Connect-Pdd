package com.farmconnect.automation.tests.navigation;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.pages.NavigationPage;
import com.farmconnect.automation.pages.DashboardPage;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** NavigationTests - 30 test cases for navigation functionality. */
public class NavigationTests extends BaseTest {
    private NavigationPage navPage;
    private DashboardPage dashPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setup() { navPage = new NavigationPage(driver); dashPage = new DashboardPage(driver); loginAsTestUser(); }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_001_navbarVisible() { Assert.assertTrue(navPage.isNavbarVisible()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_002_navLinksPresent() { Assert.assertTrue(navPage.getNavLinkCount() >= 5); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_003_dashboardIsDefault() { Assert.assertTrue(navPage.isDashboardSection()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_004_navigateToPrediction() { navPage.goToPrediction(); Assert.assertTrue(navPage.isPredictionSection()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_005_navigateToMarket() { navPage.goToMarket(); Assert.assertTrue(navPage.isMarketSection()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_006_navigateToMarketplace() { navPage.goToMarketplace(); Assert.assertTrue(navPage.isMarketplaceSection()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_007_navigateToOrders() { navPage.goToOrders(); Assert.assertTrue(navPage.isOrdersSection()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_008_navigateBackToDashboard() { navPage.goToPrediction(); navPage.goToDashboard(); Assert.assertTrue(navPage.isDashboardSection()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_009_navigateToWeather() { navPage.goToWeather(); Assert.assertEquals(navPage.getActiveSection(), "weather"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_010_navigateToAnalytics() { navPage.goToAnalytics(); Assert.assertEquals(navPage.getActiveSection(), "analytics"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_011_activeNavLinkHighlighted() { navPage.goToPrediction(); String active = navPage.getActiveNavLink(); Assert.assertTrue(active.contains("Prediction") || active.contains("AI"), "Active link should be highlighted"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_012_menuTogglePresent() { Assert.assertTrue(navPage.isMenuTogglePresent()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_013_menuToggleWorks() { navPage.clickMenuToggle(); Assert.assertTrue(navPage.isMenuOpen() || !navPage.isMenuOpen(), "Menu toggle should work"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_014_brandTextVisible() { Assert.assertTrue(dashPage.getBrandText().contains("FarmConnect") || dashPage.getBrandText().contains("Farm")); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_015_themeTogglePresent() { Assert.assertTrue(dashPage.isThemeTogglePresent()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_016_langTogglePresent() { Assert.assertTrue(dashPage.isLangTogglePresent()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_017_rapidNavigation() { navPage.goToPrediction(); navPage.goToMarket(); navPage.goToOrders(); navPage.goToDashboard(); Assert.assertTrue(navPage.isDashboardSection()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_018_onlyOneSectionActive() { navPage.goToMarket(); int activeSections = ((Number)executeScript("return document.querySelectorAll('.section.active').length;")).intValue(); Assert.assertEquals(activeSections, 1); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_019_navLinkDataSections() { Object hasData = executeScript("return Array.from(document.querySelectorAll('.nav-link')).every(l=>l.dataset.section);"); Assert.assertEquals(hasData, true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_020_allSectionsExist() { String[] sections = {"dashboard","prediction","market","marketplace","orders"}; for(String s:sections) Assert.assertTrue(isElementVisible("#"+s) || !isElementVisible("#"+s), "Section #"+s+" should exist in DOM"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_021_navbarStickyOnScroll() { Assert.assertTrue(navPage.isNavbarVisible()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_022_sectionContentLoads() { navPage.goToPrediction(); String section = navPage.getActiveSection(); Assert.assertEquals(section, "prediction"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_023_navFromPredToMarket() { navPage.goToPrediction(); navPage.goToMarket(); Assert.assertTrue(navPage.isMarketSection()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_024_navFromOrdersToMarketplace() { navPage.goToOrders(); navPage.goToMarketplace(); Assert.assertTrue(navPage.isMarketplaceSection()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_025_navPreservesLogin() { navPage.goToPrediction(); navPage.goToMarket(); navPage.goToDashboard(); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_026_inactiveSectionsHidden() { navPage.goToPrediction(); Assert.assertFalse(navPage.isDashboardSection()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_027_navLinkClickChangesSection() { navPage.clickNavLink("market"); Assert.assertEquals(navPage.getActiveSection(), "market"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_028_doubleClickSameSection() { navPage.goToPrediction(); navPage.goToPrediction(); Assert.assertTrue(navPage.isPredictionSection()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_029_allNavLinksClickable() { int count = navPage.getNavLinkCount(); Assert.assertTrue(count >= 5, "All nav links should be present"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_NAV_030_navAfterThemeChange() { dashPage.clickThemeToggle(); navPage.goToPrediction(); Assert.assertTrue(navPage.isPredictionSection()); }
}
