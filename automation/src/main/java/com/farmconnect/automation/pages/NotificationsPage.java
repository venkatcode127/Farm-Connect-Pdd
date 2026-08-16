package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/** NotificationsPage - Page Object for notifications. */
public class NotificationsPage extends BasePage {
    public NotificationsPage(AndroidDriver driver) { super(driver); }

    public boolean isNotificationBellPresent() { return elementExists(".notification-bell, #notifBell, .notif-icon"); }
    public void clickNotificationBell() { clickByCss(".notification-bell, #notifBell, .notif-icon"); pause(500); }
    public boolean isNotificationPanelOpen() { return isVisible(".notification-panel, .notif-dropdown, #notifPanel"); }
    public int getNotificationCount() { return getElementCount(".notification-item, .notif-item"); }
    public boolean isAlertBadgeVisible() { return isVisible(".notif-badge, .alert-badge, .badge"); }
    public String getNotificationText(int index) {
        try {
            Object r = executeScript("var items=document.querySelectorAll('.notification-item,.notif-item');" +
                "return items[" + index + "]?items[" + index + "].textContent.trim():'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }
    public void dismissNotification(int index) {
        executeScript("var items=document.querySelectorAll('.notification-item,.notif-item');" +
            "if(items[" + index + "]){var btn=items[" + index + "].querySelector('.dismiss,.close');if(btn)btn.click();}");
        pause(500);
    }
    public void closeNotificationPanel() { clickByCss(".notif-close, .close-notif"); pause(500); }
}
