package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * ProfilePage - Page Object for user profile management.
 */
public class ProfilePage extends BasePage {

    public ProfilePage(AndroidDriver driver) { super(driver); }

    public boolean isProfileVisible() { return isVisible(".profile-section, #profile, .user-profile"); }

    public String getCurrentUserName() {
        try {
            Object r = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user')||'null');return u?u.name:'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }

    public String getCurrentUserPhone() {
        try {
            Object r = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user')||'null');return u?u.phone:'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }

    public String getCurrentUserRole() {
        try {
            Object r = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user')||'null');return u?u.role:'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }

    public String getCurrentUserLocation() {
        try {
            Object r = executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user')||'null');return u?u.location:'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }

    public boolean isLogoutButtonPresent() { return elementExists("#logoutBtn, .logout-btn, [onclick*='logout']"); }

    public void clickLogout() {
        clickByCss("#logoutBtn, .logout-btn, [onclick*='logout'], [onclick*='Logout']");
        pause(2000);
    }

    public boolean isAdminPanelVisible() { return isVisible(".admin-panel, #adminPanel, .admin-section"); }
    public int getRegisteredUserCount() {
        try {
            Object r = executeScript("return JSON.parse(localStorage.getItem('fc_users')||'[]').length;");
            return r != null ? ((Number) r).intValue() : 0;
        } catch (Exception e) { return 0; }
    }

    public void updateUserName(String newName) {
        executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user'));" +
            "if(u){u.name='" + newName.replace("'", "\\'") + "';localStorage.setItem('fc_current_user',JSON.stringify(u));" +
            "var users=JSON.parse(localStorage.getItem('fc_users')||'[]');" +
            "var idx=users.findIndex(x=>x.phone===u.phone);if(idx>=0){users[idx].name=u.name;localStorage.setItem('fc_users',JSON.stringify(users));}}");
    }

    public void updateUserLocation(String newLocation) {
        executeScript("var u=JSON.parse(localStorage.getItem('fc_current_user'));" +
            "if(u){u.location='" + newLocation.replace("'", "\\'") + "';localStorage.setItem('fc_current_user',JSON.stringify(u));}");
    }
}
