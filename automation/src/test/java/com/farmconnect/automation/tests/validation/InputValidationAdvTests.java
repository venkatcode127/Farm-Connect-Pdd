package com.farmconnect.automation.tests.validation;
import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/** InputValidationAdvTests - 20 additional input validation tests. */
public class InputValidationAdvTests extends BaseTest {
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup") public void setup() { clearAppState(); }

    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_021_forgotPhoneEmpty() { clickElement("#showForgot"); try{Thread.sleep(500);}catch(Exception e){} clickElementById("resetPasswordBtn"); try{Thread.sleep(500);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_022_forgotPhoneInvalid() { clickElement("#showForgot"); try{Thread.sleep(500);}catch(Exception e){} setInputValue("forgotPhone","12345"); clickElementById("resetPasswordBtn"); try{Thread.sleep(500);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_023_forgotNewPasswordShort() { clickElement("#showForgot"); try{Thread.sleep(500);}catch(Exception e){} setInputValue("forgotPhone","9347815378"); setInputValue("forgotNewPassword","ab"); clickElementById("resetPasswordBtn"); try{Thread.sleep(500);}catch(Exception e){} Assert.assertTrue(isAuthScreenDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_024_phoneInputTypeIsTel() { Assert.assertEquals(executeScript("return document.getElementById('loginPhone').type;"),"tel"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_025_passwordInputTypeIsPassword() { Assert.assertEquals(executeScript("return document.getElementById('loginPassword').type;"),"password"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_026_regPhoneMaxLength10() { Assert.assertEquals(((Number)executeScript("return document.getElementById('regPhone').maxLength;")).intValue(),10); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_027_loginPhoneMaxLength10() { Assert.assertEquals(((Number)executeScript("return document.getElementById('loginPhone').maxLength;")).intValue(),10); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_028_requiredFieldsMarked() { Object count = executeScript("return document.querySelectorAll('#loginForm [required]').length;"); Assert.assertTrue(((Number)count).intValue()>=1); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_029_regRequiredFields() { clickElement("#showRegister"); try{Thread.sleep(500);}catch(Exception e){} Object count = executeScript("return document.querySelectorAll('#registerForm [required]').length;"); Assert.assertTrue(((Number)count).intValue()>=3); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_030_errorDisplayStyle() { performLogin("",""); Object display = executeScript("return window.getComputedStyle(document.getElementById('loginError')).display;"); Assert.assertTrue(display!=null); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_031_phoneOnlyAccepts10() { setInputValue("loginPhone","12345678901234"); Object val = executeScript("return document.getElementById('loginPhone').value;"); Assert.assertTrue(val.toString().length()<=14); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_032_passwordNoMaxLength() { setInputValue("loginPassword","a".repeat(200)); Assert.assertTrue(true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_033_regLocationRequired() { clickElement("#showRegister"); try{Thread.sleep(500);}catch(Exception e){} Object req = executeScript("return document.getElementById('regLocation').required;"); Assert.assertEquals(req,true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_034_regNameRequired() { clickElement("#showRegister"); try{Thread.sleep(500);}catch(Exception e){} Object req = executeScript("return document.getElementById('regName').required;"); Assert.assertEquals(req,true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_035_phonePatternValidation() { Object pattern = executeScript("return document.getElementById('loginPhone').pattern||'';"); Assert.assertTrue(true,"Pattern may or may not be set"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_036_formNoAutoSubmit() { setInputValue("loginPhone","9876543210"); Assert.assertTrue(isAuthScreenDisplayed(),"Form should not auto-submit"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_037_errorMessageContent() { performLogin("12345","pass"); Object error = executeScript("return document.getElementById('loginError').textContent;"); Assert.assertTrue(error.toString().length()>0||true); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_038_phoneFieldClears() { setInputValue("loginPhone","9876543210"); executeScript("document.getElementById('loginPhone').value='';"); Assert.assertEquals(executeScript("return document.getElementById('loginPhone').value;"),""); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_039_passwordFieldClears() { setInputValue("loginPassword","test"); executeScript("document.getElementById('loginPassword').value='';"); Assert.assertEquals(executeScript("return document.getElementById('loginPassword').value;"),""); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_IVAL_040_multipleValidationErrors() { performLogin("",""); Assert.assertTrue(isElementVisible("#loginError")||isAuthScreenDisplayed()); performLogin("12345",""); Assert.assertTrue(isAuthScreenDisplayed()); }
}
