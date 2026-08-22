const logger = require('./Logger');

class GestureUtils {
  /**
   * Perform single tap at element center or coordinates
   * @param {WebdriverIO.Browser} driver 
   * @param {WebdriverIO.Element|{x: number, y: number}} target 
   */
  static async tap(driver, target) {
    logger.info('Executing Gesture: Tap');
    if (target.getLocation && target.getSize) {
      await target.click();
    } else {
      await driver.action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ duration: 0, x: target.x, y: target.y })
        .down({ button: 0 })
        .pause(100)
        .up({ button: 0 })
        .perform();
    }
  }

  /**
   * Perform double tap
   * @param {WebdriverIO.Browser} driver 
   * @param {WebdriverIO.Element|{x: number, y: number}} target 
   */
  static async doubleTap(driver, target) {
    logger.info('Executing Gesture: Double Tap');
    let x, y;
    if (target.getLocation && target.getSize) {
      const loc = await target.getLocation();
      const size = await target.getSize();
      x = Math.round(loc.x + size.width / 2);
      y = Math.round(loc.y + size.height / 2);
    } else {
      x = target.x;
      y = target.y;
    }

    await driver.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x, y })
      .down({ button: 0 })
      .pause(50)
      .up({ button: 0 })
      .pause(100)
      .down({ button: 0 })
      .pause(50)
      .up({ button: 0 })
      .perform();
  }

  /**
   * Long press on target for specified duration
   * @param {WebdriverIO.Browser} driver 
   * @param {WebdriverIO.Element|{x: number, y: number}} target 
   * @param {number} durationMs 
   */
  static async longPress(driver, target, durationMs = 2000) {
    logger.info(`Executing Gesture: Long Press (${durationMs}ms)`);
    let x, y;
    if (target.getLocation && target.getSize) {
      const loc = await target.getLocation();
      const size = await target.getSize();
      x = Math.round(loc.x + size.width / 2);
      y = Math.round(loc.y + size.height / 2);
    } else {
      x = target.x;
      y = target.y;
    }

    await driver.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x, y })
      .down({ button: 0 })
      .pause(durationMs)
      .up({ button: 0 })
      .perform();
  }

  /**
   * Scroll vertical (down or up)
   * @param {WebdriverIO.Browser} driver 
   * @param {'down'|'up'} direction 
   * @param {number} distanceRatio 
   */
  static async scroll(driver, direction = 'down', distanceRatio = 0.5) {
    logger.info(`Executing Gesture: Scroll (${direction})`);
    const { width, height } = await driver.getWindowRect();
    const startX = Math.round(width / 2);
    const startY = direction === 'down' ? Math.round(height * 0.8) : Math.round(height * 0.2);
    const endY = direction === 'down' ? Math.round(startY - (height * distanceRatio)) : Math.round(startY + (height * distanceRatio));

    await driver.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x: startX, y: startY })
      .down({ button: 0 })
      .move({ duration: 600, x: startX, y: endY })
      .up({ button: 0 })
      .perform();
  }

  /**
   * Swipe horizontal or vertical
   * @param {WebdriverIO.Browser} driver 
   * @param {'left'|'right'|'up'|'down'} direction 
   */
  static async swipe(driver, direction = 'left') {
    logger.info(`Executing Gesture: Swipe (${direction})`);
    const { width, height } = await driver.getWindowRect();
    let startX, startY, endX, endY;

    if (direction === 'left') {
      startX = Math.round(width * 0.85);
      endX = Math.round(width * 0.15);
      startY = endY = Math.round(height / 2);
    } else if (direction === 'right') {
      startX = Math.round(width * 0.15);
      endX = Math.round(width * 0.85);
      startY = endY = Math.round(height / 2);
    } else if (direction === 'up') {
      startX = endX = Math.round(width / 2);
      startY = Math.round(height * 0.8);
      endY = Math.round(height * 0.2);
    } else { // down
      startX = endX = Math.round(width / 2);
      startY = Math.round(height * 0.2);
      endY = Math.round(height * 0.8);
    }

    await driver.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x: startX, y: startY })
      .down({ button: 0 })
      .move({ duration: 400, x: endX, y: endY })
      .up({ button: 0 })
      .perform();
  }

  /**
   * Drag and drop from source to destination
   * @param {WebdriverIO.Browser} driver 
   * @param {WebdriverIO.Element} source 
   * @param {WebdriverIO.Element} target 
   */
  static async dragAndDrop(driver, source, target) {
    logger.info('Executing Gesture: Drag and Drop');
    const srcLoc = await source.getLocation();
    const srcSize = await source.getSize();
    const srcX = Math.round(srcLoc.x + srcSize.width / 2);
    const srcY = Math.round(srcLoc.y + srcSize.height / 2);

    const tgtLoc = await target.getLocation();
    const tgtSize = await target.getSize();
    const tgtX = Math.round(tgtLoc.x + tgtSize.width / 2);
    const tgtY = Math.round(tgtLoc.y + tgtSize.height / 2);

    await driver.action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ duration: 0, x: srcX, y: srcY })
      .down({ button: 0 })
      .pause(600)
      .move({ duration: 800, x: tgtX, y: tgtY })
      .pause(200)
      .up({ button: 0 })
      .perform();
  }

  /**
   * Pinch gesture (zoom out)
   * @param {WebdriverIO.Browser} driver 
   */
  static async pinch(driver) {
    logger.info('Executing Gesture: Pinch (Zoom Out)');
    const { width, height } = await driver.getWindowRect();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 200, y: centerY - 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 500, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 200, y: centerY + 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 500, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Zoom in gesture
   * @param {WebdriverIO.Browser} driver 
   */
  static async zoom(driver) {
    logger.info('Executing Gesture: Zoom In');
    const { width, height } = await driver.getWindowRect();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 50, y: centerY - 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 500, x: centerX - 250, y: centerY - 250 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 50, y: centerY + 50 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 500, x: centerX + 250, y: centerY + 250 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = GestureUtils;
