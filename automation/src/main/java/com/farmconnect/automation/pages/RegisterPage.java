package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * RegisterPage - Page Object for the Registration screen.
 */
public class RegisterPage extends BasePage {

    private static final String REGISTER_FORM = "#registerForm";
    private static final String REG_NAME = "regName";
    private static final String REG_PHONE = "regPhone";
    private static final String REG_PASSWORD = "regPassword";
    private static final String REG_ROLE = "regRole";
    private static final String REG_LOCATION = "regLocation";
    private static final String REGISTER_BTN = "registerBtn";
    private static final String REG_ERROR = "regError";
    private static final String SHOW_LOGIN = "showLogin";

    public RegisterPage(AndroidDriver driver) {
        super(driver);
    }

    public void enterName(String name) { clearInput(REG_NAME); setValue(REG_NAME, name); }
    public void enterPhone(String phone) { clearInput(REG_PHONE); setValue(REG_PHONE, phone); }
    public void enterPassword(String password) { clearInput(REG_PASSWORD); setValue(REG_PASSWORD, password); }
    public void selectRole(String role) { selectByValue(REG_ROLE, role); }
    public void enterLocation(String location) { clearInput(REG_LOCATION); setValue(REG_LOCATION, location); }

    public void clickRegister() {
        clickById(REGISTER_BTN);
        pause(2000);
    }

    public void register(String name, String phone, String password, String role, String location) {
        enterName(name);
        enterPhone(phone);
        enterPassword(password);
        selectRole(role);
        enterLocation(location);
        clickRegister();
    }

    public void clickShowLogin() { clickById(SHOW_LOGIN); pause(500); }

    public boolean isRegisterFormDisplayed() { return isVisible(REGISTER_FORM); }
    public boolean isErrorDisplayed() { return isVisible("#" + REG_ERROR); }
    public String getErrorMessage() { return getText("#" + REG_ERROR); }
    public String getNameValue() { return getValue(REG_NAME); }
    public String getPhoneValue() { return getValue(REG_PHONE); }
    public String getRoleValue() { return getValue(REG_ROLE); }
    public String getLocationValue() { return getValue(REG_LOCATION); }
    public String getFormTitle() { return getText("#registerForm h3"); }
    public boolean isLoginLinkPresent() { return elementExists("#" + SHOW_LOGIN); }
    public String getRegisterButtonText() { return getText("#" + REGISTER_BTN); }
    public boolean isNameFieldPresent() { return elementExists("#" + REG_NAME); }
    public boolean isPhoneFieldPresent() { return elementExists("#" + REG_PHONE); }
    public boolean isPasswordFieldPresent() { return elementExists("#" + REG_PASSWORD); }
    public boolean isRoleFieldPresent() { return elementExists("#" + REG_ROLE); }
    public boolean isLocationFieldPresent() { return elementExists("#" + REG_LOCATION); }

    public int getRoleOptionCount() {
        return getElementCount("#" + REG_ROLE + " option");
    }

    public String getPhoneMaxLength() {
        return getAttribute("#" + REG_PHONE, "maxlength");
    }
}
