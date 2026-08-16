package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * OrdersPage - Page Object for the Orders section.
 */
public class OrdersPage extends BasePage {

    public OrdersPage(AndroidDriver driver) { super(driver); }

    public boolean isOrdersSectionVisible() { return isVisible("#orders"); }
    public int getOrderCount() { return getElementCount(".order-card, .order-item, .order-row"); }
    public boolean isOrderTabsPresent() { return elementExists(".order-tabs, .tab-bar, .order-filter"); }

    public void clickTab(String tabName) {
        clickByCss("[data-tab='" + tabName + "'], [onclick*='" + tabName + "']");
        pause(500);
    }

    public void clickAllOrders() { clickTab("all"); }
    public void clickActiveOrders() { clickTab("active"); }
    public void clickCompletedOrders() { clickTab("completed"); }
    public void clickCancelledOrders() { clickTab("cancelled"); }

    public String getOrdersTitle() { return getText("#orders h2, #orders h3"); }
    public boolean isEmptyStateVisible() { return isVisible(".empty-state, .no-orders, .empty-orders"); }
    public int getActiveOrderCount() { return getElementCount(".order-card.active, .order-active"); }
    public int getCompletedOrderCount() { return getElementCount(".order-card.completed, .order-completed"); }

    public String getOrderStatus(int index) {
        try {
            Object result = executeScript("var cards = document.querySelectorAll('.order-card, .order-item');" +
                "return cards[" + index + "] ? cards[" + index + "].querySelector('.status, .order-status').textContent : '';");
            return result != null ? result.toString().trim() : "";
        } catch (Exception e) { return ""; }
    }
}
