package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * PredictionPage - Page Object for AI Prediction section.
 */
public class PredictionPage extends BasePage {

    public PredictionPage(AndroidDriver driver) { super(driver); }

    public boolean isPredictionSectionVisible() { return isVisible("#prediction"); }
    public boolean isCropSelectorPresent() { return elementExists("#cropSelect, #predCrop, .crop-select"); }
    public boolean isMarketSelectorPresent() { return elementExists("#marketSelect, #predMarket, .market-select"); }
    public boolean isForecastButtonPresent() { return elementExists("#forecastBtn, #generateForecast, .forecast-btn"); }

    public void selectCrop(String cropValue) {
        executeScript("var selectors = ['#cropSelect','#predCrop','.crop-select'];" +
            "for(var s of selectors){ var el=document.querySelector(s); if(el){el.value='" + cropValue + "';el.dispatchEvent(new Event('change'));break;}}");
        pause(500);
    }

    public void selectMarket(String marketValue) {
        executeScript("var selectors = ['#marketSelect','#predMarket','.market-select'];" +
            "for(var s of selectors){ var el=document.querySelector(s); if(el){el.value='" + marketValue + "';el.dispatchEvent(new Event('change'));break;}}");
        pause(500);
    }

    public void clickGenerateForecast() {
        clickByCss("#forecastBtn, #generateForecast, .forecast-btn, [onclick*='forecast'], [onclick*='predict']");
        pause(3000);
    }

    public boolean isChartDisplayed() { return elementExists("canvas, .chart-container, .forecast-chart"); }
    public boolean isConfidenceGaugeDisplayed() { return elementExists(".confidence-gauge, .confidence, .gauge"); }
    public String getPredictionTitle() { return getText("#prediction h2, #prediction h3, .prediction-title"); }
    public boolean isPredictionResultVisible() { return isVisible(".prediction-result, .forecast-result, .pred-result"); }
    public int getCropOptionCount() { return getElementCount("#cropSelect option, #predCrop option"); }
    public int getMarketOptionCount() { return getElementCount("#marketSelect option, #predMarket option"); }
}
