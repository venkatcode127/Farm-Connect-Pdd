const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Helper: flush and print browser console logs with a test-specific label
async function printBrowserLogs(driver, label) {
    const logs = await driver.manage().logs().get('browser');
    console.log(`\n=== CONSOLE LOGS AFTER LOGIN CLICK (${label}) ===`);
    if (logs.length === 0) {
        console.log('  (no browser console output)');
    } else {
        logs.forEach(entry => console.log(`  [${entry.level.name}] ${entry.message}`));
    }
    console.log(`=== END (${label}) ===\n`);
}

describe('FarmConnect Web Frontend - Login E2E Tests', function() {
    let driver;

    before(async function() {
        this.timeout(30000);
        const chrome = require('selenium-webdriver/chrome');
        let options = new chrome.Options();
        // Enable browser log capture
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

        const logging = require('selenium-webdriver/lib/logging');
        const prefs = new logging.Preferences();
        prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setLoggingPrefs(prefs)
            .build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    beforeEach(async function() {
        // 1. Navigate to the page so we have a JS context
        await driver.get('http://127.0.0.1:3000');
        // 2. Clear any leftover state from the previous test
        await driver.executeScript('window.localStorage.clear();');
        // 3. Reload so auth.js re-initializes with empty storage
        await driver.get('http://127.0.0.1:3000');
        // 4. Drain any startup browser logs so they don't bleed into per-click captures
        await driver.manage().logs().get('browser');
        // 5. Wait for login form to be visible before any test interaction
        await driver.wait(until.elementIsVisible(
            await driver.findElement(By.id('loginForm'))
        ), 10000, 'Login form did not become visible in time');
    });

    it('should successfully login with valid credentials', async function() {
        this.timeout(30000);

        // Seed a normal (non-admin) user directly into localStorage
        const testUser = {
            name: 'Test Farmer',
            phone: '9876543210',
            password: 'password123',
            role: 'farmer',
            location: 'India',
            registered: new Date().toISOString()
        };
        await driver.executeScript(
            `window.localStorage.setItem('fc_users', JSON.stringify([arguments[0]]));`,
            testUser
        );

        // Reload so auth.js reads the newly seeded fc_users array
        await driver.get('http://127.0.0.1:3000');

        // Drain startup logs produced during this reload
        await driver.manage().logs().get('browser');

        // Wait for login form to be ready after reload
        await driver.wait(until.elementIsVisible(
            await driver.findElement(By.id('loginForm'))
        ), 10000, 'Login form not visible after seeding user');

        console.log('Navigated to:', await driver.getCurrentUrl());
        console.log('Page Title:', await driver.getTitle());

        // Enter seeded credentials
        await driver.findElement(By.id('loginPhone')).sendKeys('9876543210');
        await driver.findElement(By.id('loginPassword')).sendKeys('password123');

        // Click login
        await driver.findElement(By.id('loginBtn')).click();

        // --- Capture browser console output immediately after click ---
        await printBrowserLogs(driver, 'Test 1 - valid login');

        // Poll directly on the style.display property via JS — more reliable than
        // elementIsVisible in headless Chrome where layout may not reflow immediately
        await driver.wait(async () => {
            const display = await driver.executeScript(
                `return document.getElementById('userProfile').style.display;`
            );
            return display === 'block';
        }, 10000, '#userProfile style.display never became "block" after login');

        const profileElement = await driver.findElement(By.id('userProfile'));
        assert.ok(await profileElement.isDisplayed(), 'profileElement should be displayed');
    });

    it('should fail login with invalid credentials', async function() {
        this.timeout(20000);

        console.log('Navigated to:', await driver.getCurrentUrl());

        // Type an unrecognised phone number and wrong password
        await driver.findElement(By.id('loginPhone')).sendKeys('9999999999');
        await driver.findElement(By.id('loginPassword')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginBtn')).click();

        // --- Capture browser console output immediately after click ---
        await printBrowserLogs(driver, 'Test 2 - invalid credentials');

        // Wait until #loginError is visible (auth.js sets display:block on error)
        const errorMsg = await driver.findElement(By.id('loginError'));
        await driver.wait(until.elementIsVisible(errorMsg), 10000,
            '#loginError never became visible after invalid login attempt');

        const text = await errorMsg.getText();
        assert.ok(
            text.includes('No account found') || text.includes('Incorrect password'),
            `Unexpected error text: "${text}"`
        );
    });

    it('should fail login with empty fields', async function() {
        this.timeout(20000);

        console.log('Navigated to:', await driver.getCurrentUrl());

        // Click submit with empty fields
        await driver.findElement(By.id('loginBtn')).click();

        // --- Capture browser console output immediately after click ---
        await printBrowserLogs(driver, 'Test 3 - empty fields');

        // Wait until #loginError is visible
        const errorMsg = await driver.findElement(By.id('loginError'));
        await driver.wait(until.elementIsVisible(errorMsg), 10000,
            '#loginError never became visible after empty-field submission');

        assert.ok(await errorMsg.isDisplayed(), 'errorMsg should be displayed');
    });
});
