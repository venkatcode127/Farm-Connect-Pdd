const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Helper: flush and print browser console logs with a test-specific label
async function printBrowserLogs(driver, label) {
    const logs = await driver.manage().logs().get('browser');
    console.log(`\n=== CONSOLE LOGS (${label}) ===`);
    if (logs.length === 0) {
        console.log('  (no browser console output)');
    } else {
        logs.forEach(entry => console.log(`  [${entry.level.name}] ${entry.message}`));
    }
    console.log(`=== END (${label}) ===\n`);
}

// Helper: wait until loginBtn onclick is attached (auth.js DOMContentLoaded fired)
async function waitForAuthReady(driver) {
    await driver.wait(async () => {
        return await driver.executeScript(
            `return document.readyState === 'complete' && !!document.getElementById('loginBtn').onclick;`
        );
    }, 10000, 'auth.js DOMContentLoaded handler never attached to loginBtn');
}

describe('FarmConnect Web Frontend - Login E2E Tests', function() {
    let driver;

    before(async function() {
        this.timeout(30000);
        const chrome = require('selenium-webdriver/chrome');
        const logging = require('selenium-webdriver/lib/logging');

        const prefs = new logging.Preferences();
        prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);

        let options = new chrome.Options();
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setLoggingPrefs(prefs)
            .build();
    });

    after(async function() {
        if (driver) await driver.quit();
    });

    beforeEach(async function() {
        this.timeout(20000);
        // Load the page fresh and clear all state
        await driver.get('http://127.0.0.1:3000');
        await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
        // Reload so auth.js re-initialises with empty storage
        await driver.get('http://127.0.0.1:3000');
        // Drain startup logs
        await driver.manage().logs().get('browser');
        // Wait until auth.js DOMContentLoaded has fired and loginBtn handler is attached
        await waitForAuthReady(driver);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 1: valid credentials
    // Strategy: seed the test user into localStorage on the ALREADY-LOADED page
    // (no extra reload), set input values via executeScript, then click.
    // This avoids the seedAdmin() race that occurs on every page reload.
    // ─────────────────────────────────────────────────────────────────────────
    it('should successfully login with valid credentials', async function() {
        this.timeout(30000);

        // Seed test user into localStorage of the current page instance.
        // We push onto the existing array so we don't clobber the admin
        // that seedAdmin() already wrote during the beforeEach reload.
        await driver.executeScript(`
            const TEST_USER = {
                name: 'Test Farmer',
                phone: '9876543210',
                password: 'password123',
                role: 'farmer',
                location: 'India',
                registered: '2024-01-01T00:00:00.000Z'
            };
            const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
            // Remove any stale entry for this phone before pushing
            const filtered = users.filter(u => u.phone !== TEST_USER.phone);
            filtered.push(TEST_USER);
            localStorage.setItem('fc_users', JSON.stringify(filtered));
        `);

        // Verify the seed worked — log what fc_users looks like right now
        const seededUsers = await driver.executeScript(
            `return JSON.parse(localStorage.getItem('fc_users') || '[]').map(u => u.phone);`
        );
        console.log('fc_users phones after seeding:', seededUsers);

        // Set input values directly via JS — removes all sendKeys timing uncertainty
        await driver.executeScript(`
            document.getElementById('loginPhone').value = '9876543210';
            document.getElementById('loginPassword').value = 'password123';
        `);

        // Verify values are set as expected
        const phoneVal = await driver.executeScript(`return document.getElementById('loginPhone').value;`);
        const passVal  = await driver.executeScript(`return document.getElementById('loginPassword').value;`);
        console.log('loginPhone value:', phoneVal, '| loginPassword value:', passVal ? '(set)' : '(empty)');

        // Fire the onclick handler directly — bypasses any Selenium click event quirks
        await driver.executeScript(`document.getElementById('loginBtn').onclick();`);

        // Capture any browser errors immediately after the click
        await printBrowserLogs(driver, 'Test 1 - valid login');

        // Poll for #userProfile.style.display === 'block' (set by loginSuccess())
        await driver.wait(async () => {
            return await driver.executeScript(
                `return document.getElementById('userProfile').style.display === 'block';`
            );
        }, 10000, '#userProfile never became display:block — loginSuccess() did not complete');

        const profileElement = await driver.findElement(By.id('userProfile'));
        assert.ok(await profileElement.isDisplayed(), '#userProfile should be displayed after login');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 2: invalid credentials
    // ─────────────────────────────────────────────────────────────────────────
    it('should fail login with invalid credentials', async function() {
        this.timeout(20000);

        await driver.findElement(By.id('loginPhone')).sendKeys('9999999999');
        await driver.findElement(By.id('loginPassword')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginBtn')).click();

        await printBrowserLogs(driver, 'Test 2 - invalid credentials');

        const errorMsg = await driver.findElement(By.id('loginError'));
        await driver.wait(until.elementIsVisible(errorMsg), 10000,
            '#loginError never became visible after invalid login attempt');

        const text = await errorMsg.getText();
        assert.ok(
            text.includes('No account found') || text.includes('Incorrect password'),
            `Unexpected error text: "${text}"`
        );
    });

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 3: empty fields
    // ─────────────────────────────────────────────────────────────────────────
    it('should fail login with empty fields', async function() {
        this.timeout(20000);

        await driver.findElement(By.id('loginBtn')).click();

        await printBrowserLogs(driver, 'Test 3 - empty fields');

        const errorMsg = await driver.findElement(By.id('loginError'));
        await driver.wait(until.elementIsVisible(errorMsg), 10000,
            '#loginError never became visible after empty-field submission');

        assert.ok(await errorMsg.isDisplayed(), '#loginError should be displayed for empty fields');
    });
});
