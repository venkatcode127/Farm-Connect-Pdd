const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('FarmConnect Web Frontend - Login E2E Tests', function() {
    let driver;

    before(async function() {
        this.timeout(30000); // Set timeout to 30 seconds
        const chrome = require('selenium-webdriver/chrome');
        let options = new chrome.Options();
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    beforeEach(async function() {
        // 1. Navigate to the page first so we have a JS context for localStorage
        await driver.get('http://127.0.0.1:3000');
        // 2. Clear any leftover state from the previous test
        await driver.executeScript('window.localStorage.clear();');
        // 3. Reload after clearing so auth.js starts fresh with empty storage
        await driver.get('http://127.0.0.1:3000');
        // 4. Wait explicitly for the login form to be visible before any test interaction
        await driver.wait(until.elementIsVisible(
            await driver.findElement(By.id('loginForm'))
        ), 10000, 'Login form did not become visible in time');
    });

    it('should successfully login with valid credentials', async function() {
        this.timeout(30000);

        // Seed a normal user into localStorage (do this BEFORE the page loads
        // the auth logic, by injecting and reloading)
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

        // Reload so auth.js picks up the newly seeded user in localStorage
        await driver.get('http://127.0.0.1:3000');

        // Wait for the login form to be ready after reload
        const loginForm = await driver.findElement(By.id('loginForm'));
        await driver.wait(until.elementIsVisible(loginForm), 10000,
            'Login form not visible after seeding user');

        console.log("Navigated to:", await driver.getCurrentUrl());
        console.log("Page Title:", await driver.getTitle());

        // Enter seeded credentials
        const usernameField = await driver.findElement(By.id('loginPhone'));
        await usernameField.sendKeys('9876543210');

        const passwordField = await driver.findElement(By.id('loginPassword'));
        await passwordField.sendKeys('password123');

        // Click login
        await driver.findElement(By.id('loginBtn')).click();

        // Wait explicitly until #userProfile is visible (auth.js sets display:block on success)
        const profileElement = await driver.findElement(By.id('userProfile'));
        await driver.wait(until.elementIsVisible(profileElement), 10000,
            '#userProfile never became visible after login');

        assert.ok(await profileElement.isDisplayed(), 'profileElement should be displayed');
    });

    it('should fail login with invalid credentials', async function() {
        this.timeout(20000);

        console.log("Navigated to:", await driver.getCurrentUrl());

        // Type an unrecognised phone number and wrong password
        await driver.findElement(By.id('loginPhone')).sendKeys('9999999999');
        await driver.findElement(By.id('loginPassword')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginBtn')).click();

        // Wait explicitly until the error element is visible (auth.js sets display:block on error)
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

        console.log("Navigated to:", await driver.getCurrentUrl());

        // Click submit with empty fields
        await driver.findElement(By.id('loginBtn')).click();

        // Wait explicitly until the error element is visible
        const errorMsg = await driver.findElement(By.id('loginError'));
        await driver.wait(until.elementIsVisible(errorMsg), 10000,
            '#loginError never became visible after empty-field submission');

        assert.ok(await errorMsg.isDisplayed(), 'errorMsg should be displayed');
    });
});
