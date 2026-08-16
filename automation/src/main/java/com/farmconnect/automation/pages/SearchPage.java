package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/** SearchPage - Page Object for search functionality. */
public class SearchPage extends BasePage {
    public SearchPage(AndroidDriver driver) { super(driver); }

    public boolean isSearchFieldPresent() { return elementExists("#searchInput, .search-input, [type='search']"); }
    public void enterSearchQuery(String query) {
        executeScript("var el=document.querySelector('#searchInput,.search-input,[type=search]');" +
            "if(el){el.value='" + query.replace("'", "\\'") + "';el.dispatchEvent(new Event('input',{bubbles:true}));}");
        pause(1000);
    }
    public void clearSearch() {
        executeScript("var el=document.querySelector('#searchInput,.search-input,[type=search]');if(el){el.value='';el.dispatchEvent(new Event('input',{bubbles:true}));}");
        pause(500);
    }
    public int getSearchResultCount() { return getElementCount(".search-result, .result-item, .listing-card:not([style*='none'])"); }
    public boolean isNoResultsMessageVisible() { return isVisible(".no-results, .empty-search"); }
    public String getSearchValue() {
        try {
            Object r = executeScript("var el=document.querySelector('#searchInput,.search-input,[type=search]');return el?el.value:'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }
}
