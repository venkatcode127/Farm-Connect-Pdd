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
        options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');

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
    // ─────────────────────────────────────────────────────────────────────────
    it('should successfully login with valid credentials', async function() {
        this.timeout(30000);

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
            const filtered = users.filter(u => u.phone !== TEST_USER.phone);
            filtered.push(TEST_USER);
            localStorage.setItem('fc_users', JSON.stringify(filtered));

            document.getElementById('loginPhone').value = '9876543210';
            document.getElementById('loginPassword').value = 'password123';
            document.getElementById('loginBtn').onclick();
        `);

        await printBrowserLogs(driver, 'Test 1 - valid login');

        await driver.wait(async () => {
            return await driver.executeScript(
                `return document.getElementById('userProfile').style.display === 'block';`
            );
        }, 10000, '#userProfile never became display:block — loginSuccess() did not complete');

        const isSuccess = await driver.executeScript(`
            const profile = document.getElementById('userProfile');
            const currentUser = JSON.parse(localStorage.getItem('fc_current_user') || 'null');
            return profile && profile.style.display === 'block' && currentUser && currentUser.phone === '9876543210';
        `);
        assert.ok(isSuccess, '#userProfile should be display:block and fc_current_user set');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 2: invalid credentials
    // ─────────────────────────────────────────────────────────────────────────
    it('should fail login with invalid credentials', async function() {
        this.timeout(20000);

        await driver.executeScript(`
            document.getElementById('loginPhone').value = '9999999999';
            document.getElementById('loginPassword').value = 'wrongpass';
            document.getElementById('loginBtn').onclick();
        `);

        await printBrowserLogs(driver, 'Test 2 - invalid credentials');

        await driver.wait(async () => {
            return await driver.executeScript(`
                const err = document.getElementById('loginError');
                return err && err.style.display === 'block';
            `);
        }, 10000, '#loginError never became visible after invalid login attempt');

        const text = await driver.executeScript(`return document.getElementById('loginError').textContent;`);
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

        await driver.executeScript(`
            document.getElementById('loginPhone').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginBtn').onclick();
        `);

        await printBrowserLogs(driver, 'Test 3 - empty fields');

        await driver.wait(async () => {
            return await driver.executeScript(`
                const err = document.getElementById('loginError');
                return err && err.style.display === 'block';
            `);
        }, 10000, '#loginError never became visible after empty-field submission');

        const isDisplayed = await driver.executeScript(`
            const err = document.getElementById('loginError');
            return err && err.style.display === 'block';
        `);
        assert.ok(isDisplayed, '#loginError should be displayed for empty fields');
    });
});
