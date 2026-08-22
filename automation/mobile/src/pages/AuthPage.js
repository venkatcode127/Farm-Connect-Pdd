const BasePage = require('./BasePage');
const { find } = require('../utils/ReactNativeFinder');

class AuthPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locators using React Native ValueKey, Text, and Accessibility ID
    this.locators = {
      emailInput: { valueKey: 'input_email' },
      passwordInput: { valueKey: 'input_password' },
      loginButton: { valueKey: 'btn_login' },
      registerLink: { text: 'Register / Sign Up' },
      logoutButton: { valueKey: 'btn_logout' },
      rememberMeCheckbox: { valueKey: 'checkbox_remember_me' },
      errorMessage: { valueKey: 'txt_error_message' },
      emailValidationError: { valueKey: 'txt_email_error' },
      passwordValidationError: { valueKey: 'txt_password_error' },
      dashboardGreeting: { valueKey: 'txt_user_greeting' }
    };
  }

  async login(email, password, rememberMe = false) {
    if (email !== null) {
      await this.type(this.locators.emailInput, email);
    }
    if (password !== null) {
      await this.type(this.locators.passwordInput, password);
    }
    if (rememberMe) {
      await this.tap(this.locators.rememberMeCheckbox);
    }
    await this.tap(this.locators.loginButton);
  }

  async getErrorMessage() {
    return await this.getText(this.locators.errorMessage);
  }

  async getEmailValidationError() {
    return await this.getText(this.locators.emailValidationError);
  }

  async getPasswordValidationError() {
    return await this.getText(this.locators.passwordValidationError);
  }

  async isDashboardDisplayed() {
    return await this.isDisplayed(this.locators.dashboardGreeting);
  }

  async logout() {
    await this.tap(this.locators.logoutButton);
  }
}

module.exports = AuthPage;
