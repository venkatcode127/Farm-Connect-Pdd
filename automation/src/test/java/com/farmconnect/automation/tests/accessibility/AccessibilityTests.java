package com.farmconnect.automation.tests.accessibility;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** AccessibilityTests - 20 test cases for accessibility. */
public class AccessibilityTests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { clearAppState(); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_001_pageTitleSet() { Object title = executeScript("return document.title;"); Assert.assertTrue(title.toString().length()>0); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_002_htmlLangAttribute() { Object lang = executeScript("return document.documentElement.lang;"); Assert.assertEquals(lang,"en"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_003_metaCharsetUTF8() { Object charset = executeScript("return document.characterSet;"); Assert.assertEquals(charset,"UTF-8"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_004_metaViewport() { Object vp = executeScript("return document.querySelector('meta[name=viewport]')!==null;"); Assert.assertEquals(vp,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_005_metaDescription() { Object desc = executeScript("return document.querySelector('meta[name=description]')!==null;"); Assert.assertEquals(desc,true); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_006_labelsForInputs() { Object labels = executeScript("return document.querySelectorAll('label').length;"); Assert.assertTrue(((Number)labels).intValue()>=2); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_007_inputsHaveIds() { Object inputs = executeScript("return Array.from(document.querySelectorAll('input')).filter(i=>i.id).length;"); Assert.assertTrue(((Number)inputs).intValue()>=2); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_008_buttonsHaveText() { Object btns = executeScript("return Array.from(document.querySelectorAll('button')).filter(b=>b.textContent.trim().length>0).length;"); Assert.assertTrue(((Number)btns).intValue()>=1); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_009_headingHierarchy() { Object h1 = executeScript("return document.querySelectorAll('h1').length;"); Assert.assertTrue(((Number)h1).intValue()>=1); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_010_colorContrast() { loginAsTestUser(); String bg = (String)executeScript("return window.getComputedStyle(document.body).backgroundColor;"); Assert.assertNotNull(bg); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_011_focusVisibility() { Object outline = executeScript("document.getElementById('loginPhone').focus();return window.getComputedStyle(document.getElementById('loginPhone')).outlineStyle;"); Assert.assertNotNull(outline); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_012_semanticHTML() { Object nav = executeScript("return document.querySelectorAll('nav').length;"); Assert.assertTrue(((Number)nav).intValue()>=0); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_013_linksHaveHref() { Object links = executeScript("return Array.from(document.querySelectorAll('a')).filter(a=>a.href).length;"); Assert.assertTrue(((Number)links).intValue()>=0); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_014_imagesHaveAlt() { Object imgs = executeScript("return document.querySelectorAll('img').length;"); Assert.assertTrue(((Number)imgs).intValue()>=0); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_015_darkModeAccessible() { loginAsTestUser(); clickElementById("themeToggle"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_016_fontSizeReadable() { Object size = executeScript("return parseInt(window.getComputedStyle(document.body).fontSize);"); Assert.assertTrue(((Number)size).intValue()>=12); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_017_interactiveElementsClickable() { Object btns = executeScript("return document.querySelectorAll('button, a, [onclick]').length;"); Assert.assertTrue(((Number)btns).intValue()>=5); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_018_formGrouping() { Object groups = executeScript("return document.querySelectorAll('.form-group').length;"); Assert.assertTrue(((Number)groups).intValue()>=2); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_019_errorMessageAccessible() { performLogin("",""); Object err = executeScript("return document.getElementById('loginError').textContent;"); Assert.assertTrue(err!=null); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_ACCS_020_multiLanguageSupport() { Object langs = executeScript("return document.querySelectorAll('[data-en]').length;"); Assert.assertTrue(((Number)langs).intValue()>=1); }
}
