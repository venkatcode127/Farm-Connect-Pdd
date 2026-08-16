package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/**
 * LoginPage - Page Object for the Login screen.
 * Encapsulates all interactions with the login form of FarmConnect AI.
 */
public class LoginPage extends BasePage {

    // Element IDs
    private static final String AUTH_SCREEN = "#authScreen";
    private static final String LOGIN_FORM = "#loginForm";
    private static final String LOGIN_PHONE = "loginPhone";
    private static final String LOGIN_PASSWORD = "loginPassword";
    private static final String LOGIN_BTN = "loginBtn";
    private static final String LOGIN_ERROR = "loginError";
    private static final String SHOW_REGISTER = "showRegister";
    private static final String SHOW_FORGOT = "showForgot";
    private static final String PHONE_PREFIX = ".phone-prefix";

    public LoginPage(AndroidDriver driver) {
        super(driver);
    }

    // --- Actions ---

    public void enterPhone(String phone) {
        clearInput(LOGIN_PHONE);
        setValue(LOGIN_PHONE, phone);
        log.info("Entered phone: " + phone);
    }

    public void enterPassword(String password) {
        clearInput(LOGIN_PASSWORD);
        setValue(LOGIN_PASSWORD, password);
        log.info("Entered password");
    }

    public void clickLogin() {
        clickById(LOGIN_BTN);
        pause(2000);
        log.info("Clicked Login button");
    }

    public void login(String phone, String password) {
        enterPhone(phone);
        enterPassword(password);
        clickLogin();
    }

    public void clickShowRegister() {
        clickById(SHOW_REGISTER);
        pause(500);
        log.info("Clicked Show Register link");
    }

    public void clickForgotPassword() {
        clickById(SHOW_FORGOT);
        pause(500);
        log.info("Clicked Forgot Password link");
    }

    public void clearPhoneField() {
        clearInput(LOGIN_PHONE);
    }

    public void clearPasswordField() {
        clearInput(LOGIN_PASSWORD);
    }

    // --- Assertions / State Checks ---

    public boolean isLoginFormDisplayed() {
        return isVisible(LOGIN_FORM);
    }

    public boolean isAuthScreenDisplayed() {
        return isVisible(AUTH_SCREEN);
    }

    public boolean isErrorDisplayed() {
        return isVisible("#" + LOGIN_ERROR);
    }

    public String getErrorMessage() {
        return getText("#" + LOGIN_ERROR);
    }

    public String getPhoneValue() {
        return getValue(LOGIN_PHONE);
    }

    public String getPasswordValue() {
        return getValue(LOGIN_PASSWORD);
    }

    public boolean isLoginButtonEnabled() {
        try {
            Object result = executeScript(
                "var el = document.getElementById('loginBtn'); return el && !el.disabled;"
            );
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    public String getPhonePrefix() {
        return getText(PHONE_PREFIX);
    }

    public boolean isPhoneFieldPresent() {
        return elementExists("#" + LOGIN_PHONE);
    }

    public boolean isPasswordFieldPresent() {
        return elementExists("#" + LOGIN_PASSWORD);
    }

    public String getLoginButtonText() {
        return getText("#" + LOGIN_BTN);
    }

    public String getFormTitle() {
        return getText("#loginForm h3");
    }

    public String getFormDescription() {
        return getText("#loginForm .auth-form-desc");
    }

    public boolean isRegisterLinkPresent() {
        return elementExists("#" + SHOW_REGISTER);
    }

    public boolean isForgotPasswordLinkPresent() {
        return elementExists("#" + SHOW_FORGOT);
    }

    public String getPhonePlaceholder() {
        return getAttribute("#" + LOGIN_PHONE, "placeholder");
    }

    public String getPasswordPlaceholder() {
        return getAttribute("#" + LOGIN_PASSWORD, "placeholder");
    }

    public int getPhoneMaxLength() {
        try {
            String val = getAttribute("#" + LOGIN_PHONE, "maxlength");
            return Integer.parseInt(val);
        } catch (Exception e) {
            return -1;
        }
    }

    public String getPhoneInputType() {
        return getAttribute("#" + LOGIN_PHONE, "type");
    }

    public String getPasswordInputType() {
        return getAttribute("#" + LOGIN_PASSWORD, "type");
    }
}
