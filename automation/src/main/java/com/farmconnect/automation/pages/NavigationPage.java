package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * NavigationPage - Page Object for navigation interactions.
 */
public class NavigationPage extends BasePage {

    public NavigationPage(AndroidDriver driver) { super(driver); }

    public void navigateTo(String sectionId) {
        executeScript(String.format(
            "document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));" +
            "document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));" +
            "var link = document.querySelector('[data-section=\"%s\"]');" +
            "if(link) { link.classList.add('active'); }" +
            "var section = document.getElementById('%s');" +
            "if(section) { section.classList.add('active'); }",
            sectionId, sectionId
        ));
        pause(1500);
    }

    public void clickNavLink(String sectionName) {
        clickByCss("[data-section='" + sectionName + "']");
        pause(1000);
    }

    public String getActiveNavLink() {
        return getText(".nav-link.active");
    }

    public String getActiveSection() {
        try {
            Object result = executeScript("var s = document.querySelector('.section.active'); return s ? s.id : '';");
            return result != null ? result.toString() : "";
        } catch (Exception e) { return ""; }
    }

    public boolean isSectionActive(String sectionId) {
        return hasClass("#" + sectionId, "active");
    }

    public int getNavLinkCount() { return getElementCount(".nav-link"); }
    public boolean isNavbarVisible() { return isVisible("#navbar"); }
    public boolean isMenuTogglePresent() { return elementExists("#menuToggle"); }

    public void clickMenuToggle() {
        clickById("menuToggle");
        pause(500);
    }

    public boolean isMenuOpen() {
        return hasClass("#navLinks", "open");
    }

    public void clickBrandLogo() {
        clickByCss(".nav-brand");
        pause(500);
    }

    public boolean isDashboardSection() { return isSectionActive("dashboard"); }
    public boolean isPredictionSection() { return isSectionActive("prediction"); }
    public boolean isMarketSection() { return isSectionActive("market"); }
    public boolean isMarketplaceSection() { return isSectionActive("marketplace"); }
    public boolean isOrdersSection() { return isSectionActive("orders"); }

    public void goToDashboard() { navigateTo("dashboard"); }
    public void goToPrediction() { navigateTo("prediction"); }
    public void goToMarket() { navigateTo("market"); }
    public void goToMarketplace() { navigateTo("marketplace"); }
    public void goToOrders() { navigateTo("orders"); }
    public void goToWeather() { navigateTo("weather"); }
    public void goToAnalytics() { navigateTo("analytics"); }
}
