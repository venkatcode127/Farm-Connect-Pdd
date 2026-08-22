/**
 * React Native & Widget Finder Utility
 * Provides locator abstractions for React Native elements across Flutter/ReactNative finders and UiAutomator2 fallback.
 */

class ReactNativeFinder {
  /**
   * Find element by ValueKey / testID / resource-id
   * @param {string} key 
   * @returns {string} selector
   */
  static byValueKey(key) {
    return `~${key}`;
  }

  /**
   * Find element by visible text
   * @param {string} text 
   * @param {boolean} exact 
   * @returns {string} selector
   */
  static byText(text, exact = true) {
    if (exact) {
      return `android=new UiSelector().text("${text}")`;
    }
    return `android=new UiSelector().textContains("${text}")`;
  }

  /**
   * Find element by Semantics Label / Accessibility label
   * @param {string} label 
   * @returns {string} selector
   */
  static bySemanticsLabel(label) {
    return `android=new UiSelector().description("${label}")`;
  }

  /**
   * Find element by accessibility ID / testID
   * @param {string} id 
   * @returns {string} selector
   */
  static byAccessibilityId(id) {
    return `~${id}`;
  }

  /**
   * Find element by Android class name / widget type
   * @param {string} className 
   * @returns {string} selector
   */
  static byWidgetType(className) {
    return `android=new UiSelector().className("${className}")`;
  }

  /**
   * Find element by resource id
   * @param {string} resourceId 
   * @returns {string} selector
   */
  static byResourceId(resourceId) {
    return `android=new UiSelector().resourceId("${resourceId}")`;
  }
}

// Global find object mirroring React Native finder patterns
const find = {
  byValueKey: ReactNativeFinder.byValueKey,
  byText: ReactNativeFinder.byText,
  bySemanticsLabel: ReactNativeFinder.bySemanticsLabel,
  byAccessibilityId: ReactNativeFinder.byAccessibilityId,
  byWidgetType: ReactNativeFinder.byWidgetType,
  byResourceId: ReactNativeFinder.byResourceId
};

module.exports = { ReactNativeFinder, find };
