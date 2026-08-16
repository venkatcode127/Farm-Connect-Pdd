package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * MarketPage - Page Object for Market Prices section.
 */
public class MarketPage extends BasePage {

    public MarketPage(AndroidDriver driver) { super(driver); }

    public boolean isMarketSectionVisible() { return isVisible("#market"); }
    public boolean isPriceTableVisible() { return elementExists(".market-table, .price-table, #priceTable"); }
    public boolean isSearchFieldPresent() { return elementExists("#marketSearch, .market-search"); }

    public void searchMarket(String query) {
        executeScript("var el = document.querySelector('#marketSearch, .market-search input');" +
            "if(el){el.value='" + query.replace("'", "\\'") + "';el.dispatchEvent(new Event('input',{bubbles:true}));}");
        pause(1000);
    }

    public int getMarketRowCount() { return getElementCount(".market-table tr, .price-row, .market-item"); }
    public String getMarketTitle() { return getText("#market h2, #market h3"); }
    public boolean isRefreshButtonPresent() { return elementExists(".refresh-btn, #refreshMarket, [onclick*='refresh']"); }

    public void clickRefresh() {
        clickByCss(".refresh-btn, #refreshMarket, [onclick*='refresh']");
        pause(2000);
    }

    public boolean isLoadingIndicatorVisible() { return isVisible(".loading, .spinner, .loader"); }
    public int getCommodityCount() { return getElementCount(".commodity-row, .market-item, .price-card"); }
}
