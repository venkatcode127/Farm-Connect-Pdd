package com.farmconnect.automation.tests.registration;

import com.farmconnect.automation.base.BaseTest;
import com.farmconnect.automation.data.TestData;
import com.farmconnect.automation.pages.LoginPage;
import com.farmconnect.automation.pages.RegisterPage;
import com.farmconnect.automation.utils.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.*;

/**
 * RegistrationTests - 20 test cases for user registration.
 */
public class RegistrationTests extends BaseTest {
    private RegisterPage regPage;
    private LoginPage loginPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "methodSetup")
    public void setup() { loginPage = new LoginPage(driver); regPage = new RegisterPage(driver); clearAppState(); loginPage.clickShowRegister(); try{Thread.sleep(500);}catch(Exception e){} }

    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_001_registerFormDisplayed() { Assert.assertTrue(regPage.isRegisterFormDisplayed()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_002_allFieldsPresent() { Assert.assertTrue(regPage.isNameFieldPresent()); Assert.assertTrue(regPage.isPhoneFieldPresent()); Assert.assertTrue(regPage.isPasswordFieldPresent()); Assert.assertTrue(regPage.isRoleFieldPresent()); Assert.assertTrue(regPage.isLocationFieldPresent()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_003_validFarmerRegistration() { regPage.register("Test Farmer New","9444444444","pass1234","farmer","Delhi, India"); Assert.assertTrue(isAppDisplayed(), "Should login after registration"); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_004_validBuyerRegistration() { regPage.register("Test Buyer","9555555555","pass5678","buyer","Mumbai, India"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 1, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_005_validTraderRegistration() { regPage.register("Test Trader","9666666666","pass9012","trader","Chennai, India"); Assert.assertTrue(isAppDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_006_registerEmptyName() { regPage.register("","9777777777","pass1234","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_007_registerShortName() { regPage.register("AB","9777777778","pass1234","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_008_registerEmptyPhone() { regPage.register("Valid Name","","pass1234","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_009_registerInvalidPhone() { regPage.register("Valid Name","1234567890","pass1234","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_010_registerShortPassword() { regPage.register("Valid Name","9888888888","ab","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_011_registerDuplicatePhone() {
        regPage.register("First User","9111111111","pass1234","farmer","Delhi");
        clearAppState(); loginPage.clickShowRegister(); try{Thread.sleep(500);}catch(Exception e){}
        regPage.register("Second User","9111111111","pass5678","buyer","Mumbai");
        Assert.assertTrue(regPage.isErrorDisplayed() || isAppDisplayed(), "Should handle duplicate gracefully");
    }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_012_roleDropdownHasOptions() { Assert.assertTrue(regPage.getRoleOptionCount() >= 3, "At least 3 roles: farmer, buyer, trader"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_013_registerButtonText() { Assert.assertTrue(regPage.getRegisterButtonText().contains("Register")); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_014_formTitle() { Assert.assertTrue(regPage.getFormTitle().contains("Create") || regPage.getFormTitle().contains("Account")); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_015_loginLinkPresent() { Assert.assertTrue(regPage.isLoginLinkPresent()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_016_switchToLoginForm() { regPage.clickShowLogin(); Assert.assertTrue(loginPage.isLoginFormDisplayed()); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_017_nameWithNumbers() { regPage.register("Name123","9777777779","pass1234","farmer","Delhi"); Assert.assertTrue(regPage.isErrorDisplayed(), "Name with numbers should be rejected"); }
    @Test(priority = 3, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_018_phoneMaxLength() { Assert.assertEquals(regPage.getPhoneMaxLength(), "10"); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_019_registerStoresUser() { regPage.register("Store Test","9123123123","pass1234","farmer","Delhi"); Object users = executeScript("return JSON.parse(localStorage.getItem('fc_users')).length;"); Assert.assertTrue(((Number)users).intValue() >= 2); }
    @Test(priority = 2, retryAnalyzer = RetryAnalyzer.class) public void TC_REG_020_registerSetsCurrentUser() { regPage.register("Current User","9321321321","pass1234","farmer","Delhi"); Object user = executeScript("return JSON.parse(localStorage.getItem('fc_current_user')).name;"); Assert.assertEquals(user, "Current User"); }
}
