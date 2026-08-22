const BasePage = require('./BasePage');

class FormPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      productTitle: { valueKey: 'form_product_title' },
      categoryDropdown: { valueKey: 'dropdown_category' },
      categoryOption: (name) => ({ text: name }),
      priceInput: { valueKey: 'form_price_input' },
      phoneInput: { valueKey: 'form_phone_input' },
      datePickerButton: { valueKey: 'btn_select_harvest_date' },
      organicRadio: { valueKey: 'radio_organic_yes' },
      conventionalRadio: { valueKey: 'radio_organic_no' },
      termsCheckbox: { valueKey: 'checkbox_terms_agreement' },
      submitButton: { valueKey: 'btn_submit_listing' },
      successBanner: { valueKey: 'banner_form_success' },
      titleError: { valueKey: 'err_product_title' },
      priceError: { valueKey: 'err_price' },
      phoneError: { valueKey: 'err_phone' },
      termsError: { valueKey: 'err_terms' }
    };
  }

  async fillListingForm({ title, category, price, phone, isOrganic, agreeTerms }) {
    if (title !== undefined) await this.type(this.locators.productTitle, title);
    if (category) {
      await this.tap(this.locators.categoryDropdown);
      await this.tap(this.locators.categoryOption(category));
    }
    if (price !== undefined) await this.type(this.locators.priceInput, String(price));
    if (phone !== undefined) await this.type(this.locators.phoneInput, phone);
    if (isOrganic) {
      await this.tap(this.locators.organicRadio);
    } else if (isOrganic === false) {
      await this.tap(this.locators.conventionalRadio);
    }
    if (agreeTerms) {
      await this.tap(this.locators.termsCheckbox);
    }
  }

  async submit() {
    await this.tap(this.locators.submitButton);
  }

  async getValidationErrors() {
    const errors = {};
    if (await this.isDisplayed(this.locators.titleError)) {
      errors.title = await this.getText(this.locators.titleError);
    }
    if (await this.isDisplayed(this.locators.priceError)) {
      errors.price = await this.getText(this.locators.priceError);
    }
    if (await this.isDisplayed(this.locators.phoneError)) {
      errors.phone = await this.getText(this.locators.phoneError);
    }
    if (await this.isDisplayed(this.locators.termsError)) {
      errors.terms = await this.getText(this.locators.termsError);
    }
    return errors;
  }
}

module.exports = FormPage;
