const BasePage = require('./BasePage');

class NavigationPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      navHome: { valueKey: 'nav_item_home' },
      navMarketplace: { valueKey: 'nav_item_marketplace' },
      navPrices: { valueKey: 'nav_item_prices' },
      navChat: { valueKey: 'nav_item_chat' },
      navProfile: { valueKey: 'nav_item_profile' },
      screenTitle: { valueKey: 'txt_screen_header_title' },
      drawerButton: { valueKey: 'btn_header_drawer' },
      drawerSettings: { text: 'Settings & Security' },
      drawerLogout: { text: 'Sign Out' }
    };
  }

  async navigateTo(screenName) {
    switch (screenName.toLowerCase()) {
      case 'marketplace':
        await this.tap(this.locators.navMarketplace);
        break;
      case 'prices':
        await this.tap(this.locators.navPrices);
        break;
      case 'chat':
        await this.tap(this.locators.navChat);
        break;
      case 'profile':
        await this.tap(this.locators.navProfile);
        break;
      default:
        await this.tap(this.locators.navHome);
        break;
    }
  }

  async openDeepLink(url) {
    // Android Deep Link via adb intent / driver url
    await this.driver.execute('mobile: deepLink', {
      url: url,
      package: 'com.farmconnect.app'
    });
  }

  async verifyScreenTitle(expected) {
    const title = await this.getText(this.locators.screenTitle);
    return title.includes(expected);
  }
}

module.exports = NavigationPage;
