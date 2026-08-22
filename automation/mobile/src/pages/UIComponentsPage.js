const BasePage = require('./BasePage');

class UIComponentsPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      elevatedButton: { valueKey: 'btn_elevated_action' },
      textButton: { valueKey: 'btn_text_details' },
      iconButton: { valueKey: 'btn_icon_favorite' },
      toggleSwitch: { valueKey: 'switch_push_notifications' },
      dialogTrigger: { valueKey: 'btn_trigger_alert_dialog' },
      dialogContainer: { valueKey: 'dialog_confirm_action' },
      dialogConfirmBtn: { text: 'Confirm' },
      dialogCancelBtn: { text: 'Cancel' },
      bottomSheetTrigger: { valueKey: 'btn_open_filter_sheet' },
      bottomSheetContainer: { valueKey: 'bottom_sheet_filters' },
      snackbarMessage: { valueKey: 'snackbar_toast_message' },
      listViewContainer: { valueKey: 'list_products_scrollable' },
      gridViewContainer: { valueKey: 'grid_marketplace_items' },
      productCard: (index = 0) => ({ valueKey: `card_product_item_${index}` }),
      tabMarketplace: { valueKey: 'tab_nav_marketplace' },
      tabPrices: { valueKey: 'tab_nav_prices' },
      tabChat: { valueKey: 'tab_nav_chat' },
      tabProfile: { valueKey: 'tab_nav_profile' },
      drawerToggle: { valueKey: 'btn_open_drawer_menu' },
      drawerContainer: { valueKey: 'navigation_drawer_content' }
    };
  }

  async triggerAndAcceptDialog() {
    await this.tap(this.locators.dialogTrigger);
    await this.waitForVisible(this.locators.dialogContainer);
    await this.tap(this.locators.dialogConfirmBtn);
  }

  async openBottomSheet() {
    await this.tap(this.locators.bottomSheetTrigger);
    await this.waitForVisible(this.locators.bottomSheetContainer);
  }

  async toggleSwitchControl() {
    await this.tap(this.locators.toggleSwitch);
  }

  async switchTab(tabKey) {
    if (this.locators[tabKey]) {
      await this.tap(this.locators[tabKey]);
    }
  }

  async openDrawer() {
    await this.tap(this.locators.drawerToggle);
    await this.waitForVisible(this.locators.drawerContainer);
  }
}

module.exports = UIComponentsPage;
