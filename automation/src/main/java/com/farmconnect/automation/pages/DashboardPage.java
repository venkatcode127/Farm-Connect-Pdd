package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * DashboardPage - Page Object for the Dashboard section.
 */
public class DashboardPage extends BasePage {

    public DashboardPage(AndroidDriver driver) { super(driver); }

    public boolean isDashboardDisplayed() { return isVisible("#dashboard"); }
    public boolean isHeroSectionVisible() { return isVisible(".hero-section") || isVisible(".dashboard-hero"); }
    public String getWelcomeText() { return getText(".hero-section h1, .dashboard-hero h1, .welcome-text"); }
    public boolean areStatCardsVisible() { return getElementCount(".stat-card") > 0; }
    public int getStatCardCount() { return getElementCount(".stat-card"); }
    public String getTopGainerText() { return getText("#topGainerName, .top-gainer"); }

    public void clickGetPrediction() {
        clickByCss(".hero-section .btn-primary, .dashboard-hero .btn-primary, [onclick*='prediction']");
        pause(1000);
    }

    public boolean isQuickPriceTableVisible() { return elementExists(".price-table, .quick-price, #quickPriceTable"); }
    public boolean isMarketSummaryVisible() { return elementExists(".market-summary, .market-overview"); }
    public boolean isAlertsSectionVisible() { return elementExists(".alerts-section, .price-alerts"); }

    public String getDashboardTitle() { return getText("#dashboard h1, #dashboard h2"); }
    public boolean isNavbarVisible() { return isVisible("#navbar"); }
    public String getBrandText() { return getText(".brand-text"); }
    public boolean isThemeTogglePresent() { return elementExists("#themeToggle"); }
    public boolean isLangTogglePresent() { return elementExists("#langToggle"); }

    public int getNavLinkCount() { return getElementCount(".nav-link"); }

    public void clickThemeToggle() {
        clickById("themeToggle");
        pause(500);
    }

    public String getCurrentTheme() {
        try {
            Object result = executeScript("return document.documentElement.dataset.theme;");
            return result != null ? result.toString() : "light";
        } catch (Exception e) {
            return "light";
        }
    }

    public void clickLangToggle() {
        clickById("langToggle");
        pause(500);
    }
}
