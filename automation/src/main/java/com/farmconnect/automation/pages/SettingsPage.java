package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/** SettingsPage - Page Object for app settings. */
public class SettingsPage extends BasePage {
    public SettingsPage(AndroidDriver driver) { super(driver); }

    public boolean isThemeTogglePresent() { return elementExists("#themeToggle"); }
    public boolean isLangTogglePresent() { return elementExists("#langToggle"); }

    public void toggleTheme() { clickById("themeToggle"); pause(500); }
    public void toggleLanguage() { clickById("langToggle"); pause(500); }

    public String getCurrentTheme() {
        try {
            Object r = executeScript("return document.documentElement.dataset.theme;");
            return r != null ? r.toString() : "light";
        } catch (Exception e) { return "light"; }
    }

    public String getCurrentLanguageLabel() { return getText("#langToggle, .lang-label"); }
    public boolean isDarkMode() { return "dark".equals(getCurrentTheme()); }
    public boolean isLightMode() { return "light".equals(getCurrentTheme()); }
}
