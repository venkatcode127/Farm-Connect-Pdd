package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * MarketplacePage - Page Object for Marketplace/E-Commerce section.
 */
public class MarketplacePage extends BasePage {

    public MarketplacePage(AndroidDriver driver) { super(driver); }

    public boolean isMarketplaceSectionVisible() { return isVisible("#marketplace"); }
    public boolean isSellButtonPresent() { return elementExists("#sellBtn, .sell-btn, [onclick*='sell']"); }

    public void clickSellProduce() {
        clickByCss("#sellBtn, .sell-btn, [onclick*='sell'], [onclick*='Sell']");
        pause(1000);
    }

    public boolean isSellFormVisible() { return isVisible(".sell-form, .sell-modal, .listing-form, #sellModal"); }
    public int getListingCount() { return getElementCount(".listing-card, .product-card, .marketplace-item"); }

    public void fillListingForm(String crop, String quantity, String price, String location) {
        executeScript(
            "var inputs = document.querySelectorAll('.sell-form input, .sell-modal input, .listing-form input');" +
            "if(inputs.length >= 1) inputs[0].value = '" + crop + "';" +
            "if(inputs.length >= 2) inputs[1].value = '" + quantity + "';" +
            "if(inputs.length >= 3) inputs[2].value = '" + price + "';" +
            "if(inputs.length >= 4) inputs[3].value = '" + location + "';"
        );
    }

    public boolean isContactSellerBtnPresent() { return elementExists("[onclick*='contact'], .contact-btn"); }
    public boolean isPlaceOrderBtnPresent() { return elementExists("[onclick*='order'], .order-btn, .place-order"); }
    public String getMarketplaceTitle() { return getText("#marketplace h2, #marketplace h3"); }
    public boolean isFilterPresent() { return elementExists(".marketplace-filter, .filter-section, #marketFilter"); }

    public void clickPlaceOrder() {
        clickByCss("[onclick*='order'], .order-btn, .place-order");
        pause(1500);
    }

    public boolean isOrderConfirmationVisible() { return isVisible(".order-confirm, .order-success, .confirmation"); }
    public int getProductCategoryCount() { return getElementCount(".category-tag, .category-btn, .filter-tag"); }
    public boolean isSearchPresent() { return elementExists("#marketplaceSearch, .marketplace-search"); }

    public void searchListing(String query) {
        executeScript("var el = document.querySelector('#marketplaceSearch, .marketplace-search input');" +
            "if(el){el.value='" + query.replace("'", "\\'") + "';el.dispatchEvent(new Event('input',{bubbles:true}));}");
        pause(1000);
    }
}
